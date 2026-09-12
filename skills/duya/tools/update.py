"""Update only the official Duya skill components, with backups and rollback.

Standard library only. Downloaded Python or shell scripts are never executed.
"""
from __future__ import annotations
import argparse
import datetime as dt
import hashlib
import io
import json
import os
from pathlib import Path, PurePosixPath
import re
import shutil
import stat
import subprocess
import sys
import tempfile
from urllib.error import HTTPError, URLError
from urllib.parse import urlsplit
from urllib.request import Request, urlopen
import zipfile

REPOSITORY = 'jack-duya/duya-skills'
BRANCH = 'main'
STATE = '.duya-update-state.json'
MAX_ZIP_BYTES = 32 * 1024 * 1024
MAX_UNPACKED_BYTES = 128 * 1024 * 1024
MAX_FILE_BYTES = 16 * 1024 * 1024
MAX_ENTRIES = 2000
NAME = re.compile(r'duya(?:-[a-z0-9]+(?:-[a-z0-9]+)*)?\Z')
SHA = re.compile(r'[a-f0-9]{40}\Z')


class UpdateError(RuntimeError):
    def __init__(self, code, message, **details):
        super().__init__(message)
        self.code, self.details = code, details


def require(condition, code, message):
    if not condition:
        raise UpdateError(code, message)


def digest(data):
    return hashlib.sha256(data).hexdigest()


def is_link(path):
    try:
        info = path.lstat()
    except FileNotFoundError:
        return False
    return stat.S_ISLNK(info.st_mode) or bool(getattr(info, 'st_file_attributes', 0) & 0x400)


def cache_path(path):
    parts = [part.lower() for part in path.parts]
    return any(parts[i:i + 2] == ['plugins', 'cache'] for i in range(len(parts) - 1))


def safe_relative(value):
    require(isinstance(value, str) and value and '\\' not in value and '\x00' not in value,
            'unsafe_path', 'Package/state contains an invalid relative path.')
    path = PurePosixPath(value)
    require(not path.is_absolute() and all(part not in ('', '.', '..') and ':' not in part
            and not part.endswith((' ', '.')) for part in value.split('/')),
            'unsafe_path', 'Package/state path escapes its component.')
    reserved = {'con', 'prn', 'aux', 'nul', *('com' + str(i) for i in range(1, 10)),
                *('lpt' + str(i) for i in range(1, 10))}
    require(all(part.split('.')[0].lower() not in reserved for part in path.parts),
            'unsafe_path', 'Package/state contains a reserved Windows filename.')
    return path


def frontmatter(text):
    match = re.match(r'\A\ufeff?---\s*\r?\n(.*?)\r?\n---(?:\s*\r?\n|\s*\Z)', text, re.S)
    require(bool(match), 'invalid_skill', 'A component has no valid SKILL.md frontmatter.')
    header = match.group(1)
    name = re.search(r'^name:\s*[\'\"]?([a-z0-9-]+)[\'\"]?\s*$', header, re.M)
    require(bool(name), 'invalid_skill', 'A component has no supported frontmatter name.')
    marker = False
    lines = header.splitlines()
    for index, line in enumerate(lines):
        if not re.match(r'^metadata\s*:', line):
            continue
        if re.search(r'\{\s*(?:[^{}]*,\s*)?duya_component\s*:\s*true\s*(?:,|\})', line):
            marker = True
        for nested in lines[index + 1:]:
            if nested and not nested[0].isspace():
                break
            if re.fullmatch(r'\s+duya_component\s*:\s*true\s*(?:#.*)?', nested):
                marker = True
    return name.group(1), marker


def validate_manifest(manifest):
    require(isinstance(manifest, dict) and manifest.get('schema_version') == 1,
            'invalid_package', 'Unsupported Duya package manifest.')
    require(manifest.get('repository') == REPOSITORY and manifest.get('branch') == BRANCH,
            'wrong_source', 'Package does not identify the official Duya repository and branch.')
    require(bool(re.fullmatch(r'\d+\.\d+\.\d+(?:[-+][a-zA-Z0-9.-]+)?', str(manifest.get('version', '')))),
            'invalid_package', 'Package version is invalid.')
    names = manifest.get('components')
    require(isinstance(names, list) and 2 <= len(names) <= 32
            and all(isinstance(name, str) and NAME.fullmatch(name) for name in names)
            and len(set(names)) == len(names) and {'duya', 'duya-update'} <= set(names),
            'invalid_package', 'Package component names are invalid or duplicated.')
    return manifest


def read_json(path):
    try:
        return json.loads(path.read_text(encoding='utf-8-sig'))
    except (OSError, ValueError) as error:
        raise UpdateError('invalid_metadata', 'Local/package metadata could not be read.') from error


def read_state(component, name):
    path = component / STATE
    if not path.exists():
        return {}
    require(not is_link(path), 'unsafe_install', 'Installation state must not be a link.')
    state = read_json(path)
    require(isinstance(state, dict) and state.get('schema_version') == 1 and state.get('repository') == REPOSITORY
            and state.get('component') == name and isinstance(state.get('owned_files'), list),
            'invalid_state', 'Existing component state is unsupported; nothing changed.')
    for owned in state['owned_files']:
        safe_relative(owned)
        require(owned != STATE, 'invalid_state', 'State cannot own itself.')
    return state


def target_info(target=None, *, allow_cache=False):
    logical = Path(target).expanduser().absolute() if target is not None else Path(__file__).absolute().parents[1]
    actual = logical.resolve()
    require(logical.name == 'duya' and actual.name == 'duya' and actual.is_dir(),
            'wrong_target', 'Target must be an existing duya skill directory.')
    in_cache = cache_path(logical) or cache_path(actual)
    require(allow_cache or not in_cache, 'plugin_cache',
            'This is a host-managed plugin cache. Use the host native plugin update; the cache was not changed.')
    require(not is_link(actual / 'SKILL.md') and not is_link(actual / 'package.json'),
            'unsafe_install', 'Skill entry and package manifest must not be links.')
    name, _ = frontmatter((actual / 'SKILL.md').read_text(encoding='utf-8-sig'))
    require(name == 'duya', 'wrong_target', 'Target SKILL.md must declare name: duya.')
    state = read_state(actual, 'duya')
    package = actual / 'package.json'
    local_package = read_json(package) if package.exists() else {}
    require(isinstance(local_package, dict), 'invalid_metadata', 'Local package metadata must be an object.')
    current = local_package.get('version', state.get('version'))
    return {'logical': logical, 'actual': actual, 'state': state, 'version': current, 'plugin_cache': in_cache}


def request_bytes(url, limit):
    request = Request(url, headers={'User-Agent': 'duya-skills-updater', 'Accept': 'application/vnd.github+json'})
    try:
        with urlopen(request, timeout=25) as response:
            final = urlsplit(response.geturl())
            require(final.scheme == 'https' and final.hostname in
                    {'api.github.com', 'raw.githubusercontent.com', 'codeload.github.com'},
                    'wrong_source', 'Official download redirected to an unexpected destination.')
            advertised = response.headers.get('Content-Length')
            require(not advertised or int(advertised) <= limit, 'download_too_large', 'Download exceeds the allowed size.')
            data = response.read(limit + 1)
    except (HTTPError, URLError, TimeoutError, OSError) as error:
        raise UpdateError('network_error', 'Official GitHub download failed; installation was not changed.') from error
    require(len(data) <= limit, 'download_too_large', 'Download exceeds the allowed size.')
    return data


def fetch_latest():
    result = json.loads(request_bytes(f'https://api.github.com/repos/{REPOSITORY}/commits/{BRANCH}', 2 * 1024 * 1024))
    commit = result.get('sha', '')
    require(bool(SHA.fullmatch(commit)), 'invalid_revision', 'GitHub did not return a full commit SHA.')
    manifest = validate_manifest(json.loads(request_bytes(
        f'https://raw.githubusercontent.com/{REPOSITORY}/{commit}/skills/duya/package.json', 64 * 1024)))
    return {'commit': commit, 'version': manifest['version'], 'manifest': manifest}


def base_report(info, latest):
    return {'status': 'current' if info['state'].get('commit') == latest['commit'] else 'update_available',
            'current_version': info['version'], 'latest_version': latest['version'],
            'commit': latest['commit'], 'backup': None, 'changed': [], 'reload_required': False,
            'target': str(info['actual']), 'current_commit': info['state'].get('commit'),
            'revision_known': bool(info['state'].get('commit'))}


def check_update(target=None, latest=None):
    """Read-only, including when latest is injected by an isolated test."""
    info = target_info(target, allow_cache=True)
    latest = latest or fetch_latest()
    require(bool(SHA.fullmatch(latest['commit'])), 'invalid_revision', 'Expected a full commit SHA.')
    report = base_report(info, latest)
    if info['plugin_cache']:
        report.update(installation_kind='plugin_cache',
                      message='Read-only version check; install updates through the host native plugin manager.')
    return report


def snapshot_components(snapshot, commit):
    require(bool(SHA.fullmatch(commit)), 'invalid_revision', 'Expected a full commit SHA.')
    require(isinstance(snapshot, bytes) and len(snapshot) <= MAX_ZIP_BYTES,
            'download_too_large', 'Snapshot exceeds the allowed size.')
    try:
        with zipfile.ZipFile(io.BytesIO(snapshot)) as archive:
            entries = archive.infolist()
            require(len(entries) <= MAX_ENTRIES and sum(e.file_size for e in entries) <= MAX_UNPACKED_BYTES,
                    'package_too_large', 'Expanded package exceeds the allowed size.')
            paths, roots = {}, set()
            for entry in entries:
                raw = entry.filename.rstrip('/')
                path = safe_relative(raw)
                mode = stat.S_IFMT(entry.external_attr >> 16)
                require(mode in (0, stat.S_IFREG, stat.S_IFDIR) and not entry.flag_bits & 1,
                        'unsafe_archive', 'Archive contains a link, special file, or encrypted entry.')
                require(entry.file_size <= MAX_FILE_BYTES, 'package_too_large', 'An archive member is too large.')
                folded = raw.casefold()
                require(folded not in paths, 'unsafe_archive', 'Archive contains duplicate or case-colliding paths.')
                paths[folded] = entry
                roots.add(path.parts[0])
            require(len(roots) == 1, 'invalid_package', 'Snapshot must have one repository root.')
            prefix = next(iter(roots)) + '/skills/'
            manifest_path = prefix + 'duya/package.json'
            require(manifest_path.casefold() in paths, 'invalid_package', 'Snapshot has no Duya package manifest.')
            manifest = validate_manifest(json.loads(archive.read(paths[manifest_path.casefold()])))
            components = {}
            for name in manifest['components']:
                component_prefix = prefix + name + '/'
                files = {}
                for entry in entries:
                    if entry.is_dir() or not entry.filename.startswith(component_prefix):
                        continue
                    rel = entry.filename[len(component_prefix):]
                    safe_relative(rel)
                    require(rel != STATE and not any(part in ('.git', '.duya') for part in PurePosixPath(rel).parts),
                            'invalid_package', 'Package contains reserved installation/user-data files.')
                    # MCP registration/configuration belongs to the host/user, not this updater.
                    if PurePosixPath(rel).name == '.mcp.json':
                        continue
                    files[rel] = archive.read(entry)
                require('SKILL.md' in files, 'invalid_package', 'A declared component has no SKILL.md.')
                skill_name, marker = frontmatter(files['SKILL.md'].decode('utf-8-sig'))
                require(skill_name == name and (name == 'duya' or marker),
                        'invalid_skill', 'Component name/ownership marker does not match the package.')
                components[name] = files
            return manifest, components
    except (zipfile.BadZipFile, RuntimeError, UnicodeError, ValueError) as error:
        if isinstance(error, UpdateError):
            raise
        raise UpdateError('invalid_archive', 'Snapshot could not be safely parsed; nothing changed.') from error


def reject_nested_links(directory):
    if not directory.exists():
        return
    for root, directories, files in os.walk(directory, followlinks=False):
        for name in directories + files:
            require(not is_link(Path(root) / name), 'unsafe_install',
                    'An existing component contains a link/reparse point; nothing changed.')


def git_checkout(actual):
    for candidate in (actual, *actual.parents):
        if not (candidate / '.git').exists():
            continue
        # A project-local install is allowed to live inside an unrelated app's
        # Git worktree. Only the official full-package layout is a source clone.
        plugin = candidate / '.claude-plugin' / 'plugin.json'
        if (actual != candidate / 'skills' / 'duya' or not (candidate / 'VERSION').is_file()
                or not plugin.is_file() or read_json(plugin).get('name') != 'duya'):
            continue
        def run(*args):
            result = subprocess.run(['git', '-C', str(candidate), *args], capture_output=True, timeout=20)
            require(result.returncode == 0, 'git_check_failed', 'Could not inspect this Git checkout.')
            return result.stdout.decode('utf-8').strip()
        require(not run('status', '--porcelain'), 'git_dirty',
                'This Git checkout has local changes. Preserve them before a host-managed update.')
        require(run('branch', '--show-current') == BRANCH, 'git_branch_mismatch',
                'This Duya source checkout must be on main before a host-managed update.')
        origin = run('remote', 'get-url', 'origin')
        require(origin in {f'https://github.com/{REPOSITORY}', f'https://github.com/{REPOSITORY}.git',
                           f'git@github.com:{REPOSITORY}.git'}, 'git_origin_mismatch',
                'This Git checkout does not use the official Duya origin.')
        return candidate
    return None


def destinations(info, components, bridge_roots):
    actual = info['actual']
    parents = {actual.parent.resolve()}
    candidates = bridge_roots if bridge_roots is not None else [
        Path.home() / client / 'skills' for client in ('.agents', '.codex', '.claude', '.cursor')]
    candidates = [info['logical'].parent, *candidates]
    for parent in candidates:
        parent = Path(parent).expanduser().absolute()
        bridge = parent / 'duya'
        if bridge.exists() and bridge.resolve() == actual:
            require(not cache_path(parent.resolve()), 'plugin_cache', 'A matching bridge is inside a plugin cache.')
            parents.add(parent.resolve())
    result = [(actual, 'duya')]
    for parent in sorted(parents, key=str):
        for name in components:
            if name == 'duya':
                continue
            target = parent / name
            if is_link(target):
                canonical = actual.parent / name
                require(parent != actual.parent and target.resolve() == canonical,
                        'component_link', 'An existing thin component links outside the canonical Duya components.')
                # Skills CLI commonly links every host entry to its matching
                # .agents component. Keep that bridge and update its source once.
                continue
            if target.exists():
                require(target.is_dir() and (target / 'SKILL.md').is_file(), 'name_conflict',
                        'A component name is already occupied by unrelated local content.')
                require(not is_link(target / 'SKILL.md'), 'unsafe_install', 'A component entry must not be a link.')
                current_name, marker = frontmatter((target / 'SKILL.md').read_text(encoding='utf-8-sig'))
                require(current_name == name and marker, 'name_conflict',
                        'An existing sibling lacks the Duya ownership marker; no components changed.')
            result.append((target, name))
    for target, name in result:
        reject_nested_links(target)
        if target.exists():
            read_state(target, name)
    return result


def make_state(name, manifest, commit, files):
    return {'schema_version': 1, 'repository': REPOSITORY, 'branch': BRANCH,
            'component': name, 'version': manifest['version'], 'commit': commit,
            'owned_files': sorted(files), 'file_sha256': {path: digest(data) for path, data in files.items()}}


def safe_remove_stage(container):
    require(container.name.startswith('.duya-update-stage-') and container.resolve() == container.absolute()
            and not is_link(container), 'cleanup_failed', 'Refused unexpected temporary cleanup target.')
    if container.exists():
        shutil.rmtree(container)


def apply_snapshot(snapshot, target, commit, backup_root=None, *, bridge_roots=None):
    """Apply verified ZIP bytes; callers/tests can supply a local snapshot without network."""
    info = target_info(target)
    manifest, components = snapshot_components(snapshot, commit)
    latest = {'commit': commit, 'version': manifest['version'], 'manifest': manifest}
    report = base_report(info, latest)
    checkout = git_checkout(info['actual'])
    if checkout:
        report.update(status='git_update_required', git_root=str(checkout),
                      message='Use the host Git workflow for this clean official checkout; no files changed.',
                      commands=[['git', '-C', str(checkout), 'fetch', 'origin'],
                                ['git', '-C', str(checkout), 'merge', '--ff-only', commit]])
        return report
    targets = destinations(info, components, bridge_roots)
    jobs = []
    local_changes_preserved = []
    for destination, name in targets:
        files = components[name]
        old = read_state(destination, name) if destination.exists() else {}
        owned = set(old.get('owned_files', []))
        retired = sorted(path for path in owned - files.keys() if PurePosixPath(path).name != '.mcp.json')
        different = [rel for rel, data in files.items() if not (destination / rel).is_file()
                     or (destination / rel).read_bytes() != data]
        new_state = make_state(name, manifest, commit, files)
        if old == new_state:
            # Repeating an already installed revision is not an implicit reset
            # of edits the user made after that installation.
            local_changes_preserved.extend(str(destination / rel) for rel in different)
            continue
        if different or retired or old != new_state:
            jobs.append({'destination': destination, 'name': name, 'files': files, 'retired': retired,
                         'different': different, 'state': new_state, 'existed': destination.exists(),
                         'old_moved': False, 'new_moved': False})
    if not jobs:
        report.update(status='current', current_version=manifest['version'],
                      local_changes_preserved=local_changes_preserved)
        return report
    root = Path(backup_root).expanduser().absolute() if backup_root is not None else Path.home() / '.duya' / 'updates'
    for parent in (root, *root.parents):
        require(not is_link(parent), 'unsafe_backup', 'Backup path must not pass through links/reparse points.')
    root = root.resolve()
    memory_roots = [(Path.home() / '.duya' / 'memory').resolve()]
    if os.environ.get('DUYA_MEMORY_HOME'):
        memory_roots.append(Path(os.environ['DUYA_MEMORY_HOME']).expanduser().resolve())
    require(all(root != memory and memory not in root.parents for memory in memory_roots),
            'unsafe_backup', 'Backups cannot be placed in user memory.')
    for destination, _ in targets:
        require(root != destination and destination not in root.parents, 'unsafe_backup',
                'Backups must be outside all updated components.')
    for parent in (root, *root.parents):
        require(not is_link(parent), 'unsafe_backup', 'Backup path must not pass through links/reparse points.')
    group = root / digest(str(info['actual']).casefold().encode())[:16]
    group.mkdir(parents=True, exist_ok=True)
    lock = group / '.update.lock'
    try:
        with lock.open('x', encoding='utf-8') as stream:
            stream.write(str(os.getpid()))
    except FileExistsError as error:
        raise UpdateError('update_busy', 'Another update owns this target lock; retry after it finishes.') from error
    backup = None
    staged = []
    rollback_complete = True
    try:
        timestamp = dt.datetime.now(dt.timezone.utc).strftime('%Y%m%dT%H%M%S.%fZ')
        backup = group / timestamp
        backup.mkdir()
        # Complete staging and backup for every component before the first replacement.
        for index, job in enumerate(jobs):
            destination, name = job['destination'], job['name']
            container = Path(tempfile.mkdtemp(prefix='.duya-update-stage-', dir=destination.parent.parent))
            job.update(container=container, new=container / 'new', old=container / 'old')
            staged.append(job)
            if job['existed']:
                shutil.copytree(destination, job['new'])
                shutil.copytree(destination, backup / f'{index:02d}-{name}')
            else:
                job['new'].mkdir()
            for retired in job['retired']:
                obsolete = job['new'] / retired
                require(not obsolete.is_dir(), 'owned_path_conflict', 'A retired owned file has become a user directory.')
                obsolete.unlink(missing_ok=True)
            for rel, data in job['files'].items():
                output = job['new'] / rel
                require(not output.is_dir(), 'owned_path_conflict', 'An official file name is occupied by a user directory.')
                output.parent.mkdir(parents=True, exist_ok=True)
                output.write_bytes(data)
            (job['new'] / STATE).write_text(json.dumps(job['state'], ensure_ascii=False, indent=2), encoding='utf-8')
        (backup / 'update.json').write_text(json.dumps({'commit': commit, 'version': manifest['version'],
            'components': [{'target': str(job['destination']), 'name': job['name'], 'existed': job['existed'],
                            'replaced_files': job['different'], 'retired_files': job['retired']}
                           for job in jobs]}, ensure_ascii=False, indent=2), encoding='utf-8')
        for job in staged:
            if job['existed']:
                os.replace(job['destination'], job['old'])
                job['old_moved'] = True
            os.replace(job['new'], job['destination'])
            job['new_moved'] = True
        for job in staged:
            for rel, data in job['files'].items():
                require((job['destination'] / rel).read_bytes() == data,
                        'verification_failed', 'Installed official file verification failed.')
        report.update(status='updated', backup=str(backup), reload_required=True,
                      local_changes_preserved=local_changes_preserved,
                      changed=[{'component': job['name'], 'path': str(job['destination']),
                                'replaced_files': job['different'], 'removed_owned_files': job['retired']}
                               for job in jobs],
                      message='Official files updated; unknown local files and existing MCP files retained. Modified official files remain in the full backups.')
        return report
    except Exception as error:
        for job in reversed(staged):
            try:
                if job['new_moved']:
                    os.replace(job['destination'], job['container'] / 'failed-new')
                    job['new_moved'] = False
                if job['old_moved']:
                    os.replace(job['old'], job['destination'])
                    job['old_moved'] = False
            except OSError:
                rollback_complete = False
        raise UpdateError('apply_failed' if rollback_complete else 'rollback_incomplete',
                          'Update failed; prior components restored.' if rollback_complete else
                          'Update failed and automatic rollback is incomplete. Keep the backup and temporary folders for recovery.',
                          backup=str(backup) if backup else None, rollback_complete=rollback_complete,
                          recovery_paths=[] if rollback_complete else [str(job['container']) for job in staged]) from error
    finally:
        if rollback_complete:
            for job in staged:
                safe_remove_stage(job['container'])
        lock.unlink(missing_ok=True)


def apply_update(target=None, backup_root=None):
    info = target_info(target)
    latest = fetch_latest()
    snapshot = request_bytes(f'https://codeload.github.com/{REPOSITORY}/zip/{latest["commit"]}', MAX_ZIP_BYTES)
    manifest, _ = snapshot_components(snapshot, latest['commit'])
    require(manifest == latest['manifest'], 'manifest_mismatch',
            'Downloaded package differs from the manifest read at the fixed commit; nothing changed.')
    return apply_snapshot(snapshot, info['logical'], latest['commit'], backup_root)


def main(argv=None):
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    for command in ('check', 'apply'):
        command_parser = commands.add_parser(command)
        command_parser.add_argument('--target', help='Existing duya skill directory; defaults to this installation.')
        if command == 'apply':
            command_parser.add_argument('--backup-root', help='Keep update backups here instead of ~/.duya/updates.')
    args = parser.parse_args(argv)
    try:
        result = check_update(args.target) if args.command == 'check' else apply_update(args.target, args.backup_root)
        print(json.dumps(result, ensure_ascii=False, indent=2))
        return 0
    except UpdateError as error:
        result = {'status': 'error', 'code': error.code, 'message': str(error),
                  'current_version': None, 'latest_version': None, 'commit': None,
                  'backup': None, 'changed': [], 'reload_required': False, **error.details}
    except (OSError, ValueError, KeyError, TypeError, AttributeError, subprocess.SubprocessError):
        result = {'status': 'error', 'code': 'update_error', 'message': 'Update could not complete; inspect the installation and retry.',
                  'current_version': None, 'latest_version': None, 'commit': None,
                  'backup': None, 'changed': [], 'reload_required': False}
    print(json.dumps(result, ensure_ascii=False, indent=2))
    return 1


if __name__ == '__main__':
    sys.exit(main())
