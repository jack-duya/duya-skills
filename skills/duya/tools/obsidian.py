"""Save an explicit reading bundle as linked Markdown notes, without Obsidian APIs.

No network, plugin installation, configuration edits, or automatic synchronization.
Python 3.10+, standard library only.
"""
from __future__ import annotations
import argparse
import hashlib
import json
import os
from pathlib import Path, PurePosixPath
import re
import stat
import sys
from urllib.parse import urlsplit

SCHEMA = 1
MAX_INPUT = 8 * 1024 * 1024
MAX_NOTES = 100
MAX_BODY = 300_000
INSTALL = Path(__file__).resolve().parents[1]
KINDS = {'source': '来源', 'concept': '概念', 'method': '方法', 'case': '案例',
         'application': '应用', 'question': '待确认问题'}
RESERVED = {'con', 'prn', 'aux', 'nul', *('com' + str(i) for i in range(1, 10)),
            *('lpt' + str(i) for i in range(1, 10))}


class ObsidianError(RuntimeError):
    def __init__(self, code, message, **details):
        super().__init__(message)
        self.code, self.details = code, details


def require(condition, code, message):
    if not condition:
        raise ObsidianError(code, message)


def sha256(data):
    return hashlib.sha256(data).hexdigest()


def text(value, field, *, multiline=False, maximum=2000):
    require(isinstance(value, str) and bool(value.strip()) and len(value) <= maximum,
            'invalid_bundle', field + ' must be a nonempty string within its length limit.')
    require(not any(ord(char) < 32 and (not multiline or char not in '\n\r\t') for char in value),
            'invalid_bundle', field + ' contains unsupported control characters.')
    return value


def is_link(path):
    try:
        data = path.lstat()
    except FileNotFoundError:
        return False
    return stat.S_ISLNK(data.st_mode) or bool(getattr(data, 'st_file_attributes', 0) & 0x400)


def no_link_chain(path):
    for current in (path, *path.parents):
        require(not is_link(current), 'unsafe_link', 'A selected path contains a symbolic link or reparse point.')


def safe_part(part):
    require(bool(part) and part not in ('.', '..') and not part.endswith((' ', '.'))
            and not re.search(r'[\x00-\x1f<>:"/\\|?*\[\]#^]', part)
            and part.split('.')[0].casefold() not in RESERVED,
            'invalid_path', 'A title/path contains an unsafe Windows or wikilink filename.')
    require(part.casefold() not in ('.git', '.obsidian'), 'protected_path',
            'Writing or linking inside .git and .obsidian is not supported.')
    require(len(part) <= 180, 'invalid_path', 'A filename/path component is too long.')


def safe_relative(value):
    text(value, 'relative path', maximum=1000)
    require('\\' not in value and not PurePosixPath(value).is_absolute(),
            'invalid_path', 'Use a vault-relative path with forward slashes.')
    for part in value.split('/'):
        safe_part(part)
    return PurePosixPath(value)


def title_filename(value):
    value = text(value, 'title', maximum=170)
    safe_part(value)
    require(not value.lower().endswith('.md'), 'invalid_title', 'Supply the note title without a .md suffix.')
    return value + '.md'


def selected_vault(value):
    vault = Path(value).expanduser().absolute()
    no_link_chain(vault)
    require(vault.is_dir(), 'missing_vault', '--vault must identify an existing directory.')
    vault = vault.resolve()
    require(not any(part.casefold() in ('.git', '.obsidian') for part in vault.parts),
            'protected_path', 'The selected directory is inside .git or .obsidian.')
    return vault


def vault_path(vault, relative, *, writing=False):
    rel = safe_relative(relative)
    result = vault.joinpath(*rel.parts)
    no_link_chain(result)
    require(vault in result.resolve().parents, 'path_escape', 'A note path escapes the selected vault.')
    if writing:
        require(result.resolve() != INSTALL and INSTALL not in result.resolve().parents,
                'protected_install', 'Notes cannot be written inside the current Duya installation.')
    # Detect case collisions even on case-sensitive systems, for portable vaults.
    current = vault
    for part in rel.parts:
        if current.is_dir():
            matches = [item.name for item in current.iterdir() if item.name.casefold() == part.casefold()]
            require(not matches or matches == [part], 'case_collision',
                    'A path collides with an existing filename with different casing.')
        current = current / part
    return result


def inline(value):
    return str(value).replace('\\', '\\\\').replace('[', '\\[').replace(']', '\\]').replace('\n', ' ')


def wiki(path, title):
    return '[[' + str(PurePosixPath(path).with_suffix('')) + '|' + title + ']]'


def valid_source(source):
    require(isinstance(source, dict) and not (set(source) - {'title', 'url', 'path', 'locator'}),
            'invalid_bundle', 'A source must contain title and optional url/path/locator only.')
    text(source.get('title'), 'source title')
    if 'url' in source:
        url = text(source['url'], 'source URL', maximum=8000)
        try:
            parsed = urlsplit(url)
            valid = parsed.scheme in ('https', 'http') and parsed.netloc and not parsed.username
        except ValueError:
            valid = False
        require(valid and not re.search(r'[\s<>"\\]', url), 'invalid_url', 'Source URL must be an HTTP(S) address without credentials.')
    for field in ('path', 'locator'):
        if field in source:
            text(source[field], 'source ' + field, maximum=8000)


def validate_bundle(bundle):
    require(isinstance(bundle, dict) and bundle.get('schema_version') == SCHEMA
            and not (set(bundle) - {'schema_version', 'index_title', 'notes'}),
            'invalid_bundle', 'Expected schema_version: 1, notes, and optional index_title.')
    notes = bundle.get('notes')
    require(isinstance(notes, list) and 1 <= len(notes) <= MAX_NOTES,
            'invalid_bundle', 'A bundle must contain 1 to 100 notes.')
    ids, names = {}, set()
    for note in notes:
        require(isinstance(note, dict) and not (set(note) - {'id', 'title', 'kind', 'body', 'sources',
                'boundaries', 'tags', 'links', 'existing_links'}), 'invalid_bundle', 'Note fields are unsupported.')
        ident = note.get('id')
        require(isinstance(ident, str) and bool(re.fullmatch(r'[a-z][a-z0-9-]{0,63}', ident))
                and ident not in ids, 'duplicate_id', 'Note IDs must be unique lowercase ASCII identifiers.')
        filename = title_filename(note.get('title'))
        require(filename.casefold() not in names, 'duplicate_title', 'Two note titles map to the same filename.')
        names.add(filename.casefold())
        require(note.get('kind') in KINDS, 'invalid_bundle', 'Unsupported note kind.')
        text(note.get('body'), 'body', multiline=True, maximum=MAX_BODY)
        sources = note.get('sources')
        require(isinstance(sources, list) and 1 <= len(sources) <= 100,
                'invalid_bundle', 'Each note needs at least one explicitly supplied source.')
        for source in sources:
            valid_source(source)
        for field in ('boundaries', 'tags', 'links', 'existing_links'):
            require(isinstance(note.get(field, []), list), 'invalid_bundle', field + ' must be an array.')
        for boundary in note.get('boundaries', []):
            text(boundary, 'boundary', multiline=True, maximum=8000)
        for tag in note.get('tags', []):
            require(isinstance(tag, str) and bool(re.fullmatch(r'[\w/-]{1,80}', tag))
                    and not tag.strip('/').isdigit() and not tag.startswith('/')
                    and not tag.endswith('/') and '//' not in tag,
                    'invalid_tag', 'Tags may use words, hyphens, underscores, and slash hierarchies.')
        ids[ident] = note
    for note in notes:
        seen = set()
        for link in note.get('links', []):
            require(isinstance(link, dict) and set(link) == {'target', 'reason'},
                    'invalid_link', 'Batch links need target and reason only.')
            require(link['target'] in ids and link['target'] not in seen, 'invalid_link',
                    'A batch link is missing its target or is duplicated.')
            text(link['reason'], 'link reason', multiline=True, maximum=8000)
            seen.add(link['target'])
        seen = set()
        for link in note.get('existing_links', []):
            require(isinstance(link, dict) and set(link) == {'path', 'reason'},
                    'invalid_link', 'Existing links need path and reason only.')
            safe_relative(link['path'])
            require(PurePosixPath(link['path']).suffix.lower() == '.md' and link['path'].casefold() not in seen,
                    'invalid_link', 'Existing links must refer to distinct vault-relative .md files.')
            text(link['reason'], 'link reason', multiline=True, maximum=8000)
            seen.add(link['path'].casefold())
    if 'index_title' in bundle:
        title_filename(bundle['index_title'])
    return ids


def note_markdown(note, paths):
    header = ['---', 'duya_note_id: ' + json.dumps(note['id'], ensure_ascii=False),
              'duya_kind: ' + json.dumps(note['kind']), 'duya_schema: 1',
              'tags: ' + json.dumps(note.get('tags', []), ensure_ascii=False), '---',
              '# ' + note['title'], '', note['body'], '', '## 来源', '']
    for source in note['sources']:
        label = inline(source['title'])
        value = '[' + label + '](<' + source['url'] + '>)' if source.get('url') else label
        if source.get('path'):
            value += '；资料位置：' + inline(source['path'])
        if source.get('locator'):
            value += '；定位：' + inline(source['locator'])
        header.append('- ' + value)
    header += ['', '## 适用边界', '']
    boundaries = note.get('boundaries', [])
    if boundaries:
        header += ['- ' + inline(item) for item in boundaries]
    else:
        header += ['未提供独立边界字段；请以正文和原始资料中已说明的范围为准。']
    links = []
    for link in note.get('links', []):
        target = paths[link['target']]
        links.append('- ' + wiki(target, PurePosixPath(target).stem) + '：' + inline(link['reason']))
    for link in note.get('existing_links', []):
        links.append('- ' + wiki(link['path'], PurePosixPath(link['path']).stem) + '：' + inline(link['reason']))
    if links:
        header += ['', '## 关联依据', '', *links]
    return '\n'.join(header) + '\n'


def check_body_wikilinks(body, vault, planned):
    # Code examples are text, not active links. Other supplied wikilinks must
    # point to a planned/existing root-relative note, without invented anchors.
    prose = re.sub(r'(?ms)^\s*(`{3,}|~{3,}).*?^\s*\1\s*$', '', body)
    prose = re.sub(r'`[^`\n]*`', '', prose)
    for match in re.finditer(r'(?<!\\)\[\[([^\]\n]+)\]\]', prose):
        destination = match.group(1).split('|', 1)[0]
        require('#' not in destination and '^' not in destination, 'invalid_link',
                'Body wikilinks with unverified heading/block anchors are unsupported.')
        destination = destination if destination.lower().endswith('.md') else destination + '.md'
        path = vault_path(vault, destination)
        require(destination in planned or path.is_file(), 'invalid_link',
                'An existing body wikilink does not resolve to a planned or existing note.')


def prepare(bundle, vault, folder):
    ids = validate_bundle(bundle)
    folder = str(safe_relative(folder))
    paths = {ident: folder + '/' + title_filename(note['title']) for ident, note in ids.items()}
    index_title = bundle.get('index_title', '量子阅读索引')
    index_name = title_filename(index_title)
    if 'index_title' not in bundle:
        suffix = sha256(json.dumps(bundle, ensure_ascii=False, sort_keys=True).encode('utf-8'))[:10]
        index_name = index_name[:-3] + '-' + suffix + '.md'
    index_relative = folder + '/' + index_name
    require(index_relative.casefold() not in {path.casefold() for path in paths.values()},
            'duplicate_title', 'Index title collides with a note title.')
    planned = set(paths.values()) | {index_relative}
    plans = []
    for ident, note in ids.items():
        for link in note.get('existing_links', []):
            existing = vault_path(vault, link['path'])
            require(existing.is_file(), 'missing_link', 'An existing_links target does not exist as a regular Markdown file.')
        check_body_wikilinks(note['body'], vault, planned)
        plans.append({'relative': paths[ident], 'title': note['title'], 'kind': note['kind'],
                      'bytes': note_markdown(note, paths).encode('utf-8')})
    index = ['---', 'duya_kind: "index"', 'duya_schema: 1', '---', '# ' + index_title, '',
             '本索引整理本批次提供的笔记；知识来源、适用边界和关联依据保存在各笔记中。', '']
    for ident, note in ids.items():
        index.append('- ' + wiki(paths[ident], note['title']) + ' · ' + KINDS[note['kind']])
    plans.append({'relative': index_relative, 'title': index_title, 'kind': 'index',
                  'bytes': ('\n'.join(index) + '\n').encode('utf-8')})
    for plan in plans:
        plan['path'] = vault_path(vault, plan['relative'], writing=True)
        plan['sha256'] = sha256(plan['bytes'])
        path = plan['path']
        if path.exists():
            require(path.is_file() and path.read_bytes() == plan['bytes'], 'content_conflict',
                    'A planned note already has different content; all existing notes were retained.')
            plan['action'] = 'unchanged'
        else:
            plan['action'] = 'created'
    return plans, index_relative


def _write_new(path, data):
    """Exclusive create; do not truncate a note that appeared concurrently."""
    descriptor = os.open(path, os.O_WRONLY | os.O_CREAT | os.O_EXCL, 0o666)
    try:
        with os.fdopen(descriptor, 'wb') as stream:
            stream.write(data)
            stream.flush()
            os.fsync(stream.fileno())
    except Exception:
        # This helper owns the newly created file; no pre-existing file was opened.
        path.unlink(missing_ok=True)
        raise


def save_bundle(bundle, vault, folder='渡鸦知识库'):
    vault = selected_vault(vault)
    plans, entry = prepare(bundle, vault, folder)
    created, made_dirs = [], []
    try:
        for plan in plans:
            if plan['action'] == 'unchanged':
                continue
            path = plan['path']
            missing, parent = [], path.parent
            while not parent.exists():
                missing.append(parent)
                parent = parent.parent
            for directory in reversed(missing):
                no_link_chain(directory)
                try:
                    directory.mkdir()
                    made_dirs.append(directory)
                except FileExistsError:
                    require(directory.is_dir() and not is_link(directory), 'unsafe_link',
                            'The target folder changed while preparing the save.')
            no_link_chain(path)
            _write_new(path, plan['bytes'])
            created.append(plan)
        for plan in plans:
            no_link_chain(plan['path'])
            require(plan['path'].read_bytes() == plan['bytes'], 'readback_failed',
                    'Saved note content did not match its prepared content.')
    except Exception as error:
        retained = []
        for plan in reversed(created):
            try:
                path = plan['path']
                if not is_link(path) and path.is_file() and path.read_bytes() == plan['bytes']:
                    path.unlink()
                elif path.exists() or is_link(path):
                    retained.append(str(path))
            except OSError:
                retained.append(str(plan['path']))
        for directory in reversed(made_dirs):
            try:
                directory.rmdir()  # Only an empty directory created by this call.
            except OSError:
                pass
        raise ObsidianError('save_failed' if not retained else 'rollback_incomplete',
                            'Save failed; files created by this call were rolled back.' if not retained else
                            'Save failed; some newly created files changed or could not be removed. Existing notes were not overwritten.',
                            retained=retained) from error
    confirmed = (vault / '.obsidian').is_dir() and not is_link(vault / '.obsidian')
    return {'status': 'saved' if created else 'unchanged', 'vault': str(vault),
            'confirmed_obsidian': confirmed, 'mode': 'obsidian-vault' if confirmed else 'markdown-export',
            'entry': str(vault / entry), 'entry_relative': entry,
            'created': len(created), 'unchanged': len(plans) - len(created), 'verified': True,
            'files': [{key: plan[key] for key in ('relative', 'title', 'kind', 'sha256', 'action')} for plan in plans]}


def registration_files():
    home = Path.home()
    if sys.platform == 'win32':
        return [Path(os.environ.get('APPDATA', str(home / 'AppData' / 'Roaming'))) / 'obsidian' / 'obsidian.json']
    if sys.platform == 'darwin':
        return [home / 'Library' / 'Application Support' / 'obsidian' / 'obsidian.json']
    paths = [Path(os.environ.get('XDG_CONFIG_HOME', str(home / '.config'))) / 'obsidian' / 'obsidian.json']
    fallback = home / '.config' / 'obsidian' / 'obsidian.json'
    return list(dict.fromkeys([*paths, fallback]))


def discover(config_paths=None):
    """Only inspect explicit registration metadata; never search the disk for notes."""
    candidates, warnings = [], []
    files = list(config_paths) if config_paths is not None else registration_files()
    for item in files:
        path = Path(item)
        if not path.is_file():
            continue
        try:
            require(not is_link(path) and path.stat().st_size <= MAX_INPUT,
                    'invalid_registry', 'Registration metadata is linked or too large.')
            payload = json.loads(path.read_text(encoding='utf-8-sig'))
            vaults = payload.get('vaults', {})
            require(isinstance(vaults, dict), 'invalid_registry', 'Unexpected Obsidian registration format.')
            for ident, record in vaults.items():
                if not isinstance(record, dict) or not isinstance(record.get('path'), str):
                    continue
                candidate = Path(record['path']).expanduser()
                if not candidate.is_absolute():
                    continue
                candidates.append({'id': str(ident), 'path': str(candidate), 'exists': candidate.is_dir(),
                                   'registered_in': str(path), 'candidate_only': True})
        except (OSError, ValueError, AttributeError, ObsidianError):
            warnings.append('Could not read registration metadata: ' + str(path))
    return {'status': 'discovered', 'candidates': candidates, 'warnings': warnings,
            'message': 'These are registered candidates, not a selected destination. Confirm --vault explicitly; no software or vault was created.'}


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    commands.add_parser('discover')
    save = commands.add_parser('save')
    save.add_argument('--vault', required=True)
    save.add_argument('--folder', default='渡鸦知识库')
    save.add_argument('--input', required=True)
    args = parser.parse_args(argv)
    try:
        if args.command == 'discover':
            result = discover()
        else:
            source = Path(args.input).expanduser()
            require(source.is_file() and source.stat().st_size <= MAX_INPUT,
                    'invalid_input', 'Input must be a bundle JSON file no larger than 8 MiB.')
            result = save_bundle(json.loads(source.read_text(encoding='utf-8-sig')), args.vault, args.folder)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0
    except ObsidianError as error:
        result = {'status': 'error', 'code': error.code, 'message': str(error), **error.details}
    except (OSError, ValueError, TypeError, KeyError):
        result = {'status': 'error', 'code': 'input_error', 'message': 'Could not parse the bundle or access the selected files.'}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 1


if __name__ == '__main__':
    sys.exit(main())
