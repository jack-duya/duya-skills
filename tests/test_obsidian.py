"""Offline behavior checks; every save uses an isolated temporary directory."""
import hashlib
import importlib.util
import json
from pathlib import Path
import tempfile
import unittest
from unittest import mock


ROOT = Path(__file__).resolve().parents[1]
SPEC = importlib.util.spec_from_file_location('duya_obsidian', ROOT / 'skills/duya/tools/obsidian.py')
obsidian = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(obsidian)


def bundle():
    return {
        'schema_version': 1, 'index_title': '量子阅读索引',
        'notes': [
            {'id': 'source', 'title': '来源-中文原文', 'kind': 'source',
             'body': '第一行：保留“中文”、C#、¥299.00 和 **原始强调**。\n\n> 来源没有证明必然有效。',
             'sources': [{'title': '访谈资料', 'path': '资料/原文.md', 'locator': '第 2 段'}],
             'boundaries': ['只适用于本次材料，效果尚待验证。'], 'tags': ['量子阅读/来源'],
             'links': [{'target': 'method', 'reason': '原文第 2 段支持该条件。'}]},
            {'id': 'method', 'title': '方法-先看处境', 'kind': 'method',
             'body': '1. 先辨认处境。\n2. 再确定内容入口。',
             'sources': [{'title': '出处链接', 'url': 'https://example.com/source?a=1&b=2'}],
             'links': [{'target': 'source', 'reason': '需回到原文核对适用范围。'}]}
        ]
    }


def snapshot(root):
    return {p.relative_to(root).as_posix(): p.read_bytes() if p.is_file() else None
            for p in root.rglob('*')}


class ObsidianTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory()
        self.addCleanup(self.temp.cleanup)
        self.root = Path(self.temp.name)
        self.vault = self.root / '我的知识库'
        self.vault.mkdir()

    def save(self, data=None, **kwargs):
        return obsidian.save_bundle(data if data is not None else bundle(), self.vault, **kwargs)

    def assert_rejected_unchanged(self, data=None, **kwargs):
        before = snapshot(self.vault)
        with self.assertRaises(obsidian.ObsidianError):
            self.save(data, **kwargs)
        self.assertEqual(before, snapshot(self.vault))

    def test_unicode_links_index_sources_and_hashes_are_real(self):
        data = bundle()
        result = self.save(data)
        self.assertEqual('saved', result['status'])
        self.assertEqual(3, result['created'])
        self.assertTrue(result['verified'])
        self.assertFalse(result['confirmed_obsidian'])
        self.assertEqual('markdown-export', result['mode'])
        self.assertEqual('渡鸦知识库/量子阅读索引.md', result['entry_relative'])
        original = self.vault / '渡鸦知识库/来源-中文原文.md'
        note = original.read_text(encoding='utf-8')
        self.assertIn(data['notes'][0]['body'], note)
        self.assertIn('资料位置：资料/原文.md；定位：第 2 段', note)
        self.assertIn('只适用于本次材料，效果尚待验证。', note)
        self.assertIn('[[渡鸦知识库/方法-先看处境|方法-先看处境]]：原文第 2 段支持该条件。', note)
        index = Path(result['entry']).read_text(encoding='utf-8')
        for title in ('来源-中文原文', '方法-先看处境'):
            self.assertIn('[[渡鸦知识库/' + title + '|' + title + ']]', index)
            self.assertTrue((self.vault / '渡鸦知识库' / (title + '.md')).is_file())
        for item in result['files']:
            self.assertEqual(hashlib.sha256((self.vault / item['relative']).read_bytes()).hexdigest(),
                             item['sha256'])
            self.assertNotIn(str(self.vault), (self.vault / item['relative']).read_text(encoding='utf-8'))

    def test_idempotent_and_portable_bytes(self):
        first = self.save()
        before = snapshot(self.vault)
        stamps = {p: p.stat().st_mtime_ns for p in self.vault.rglob('*.md')}
        second = self.save()
        self.assertEqual('unchanged', second['status'])
        self.assertEqual(0, second['created'])
        self.assertEqual(3, second['unchanged'])
        self.assertEqual(before, snapshot(self.vault))
        self.assertEqual(stamps, {p: p.stat().st_mtime_ns for p in self.vault.rglob('*.md')})
        another = self.root / 'different-vault'
        another.mkdir()
        other = obsidian.save_bundle(bundle(), another)
        self.assertEqual(before, snapshot(another))
        self.assertEqual([v['sha256'] for v in first['files']], [v['sha256'] for v in other['files']])

    def test_existing_conflict_stops_all_new_notes_and_keeps_config(self):
        (self.vault / '.obsidian').mkdir()
        (self.vault / '.obsidian/app.json').write_bytes(b'{"custom":true}')
        (self.vault / 'private.md').write_bytes(b'user original\r\n')
        target = self.vault / '渡鸦知识库'
        target.mkdir()
        (target / '方法-先看处境.md').write_text('用户自己的旧笔记', encoding='utf-8')
        self.assert_rejected_unchanged()
        self.assertFalse((target / '来源-中文原文.md').exists())

    def test_existing_links_resolve_without_modifying_target_or_config(self):
        (self.vault / '.obsidian').mkdir()
        config = self.vault / '.obsidian/app.json'
        config.write_bytes(b'{"custom":true}')
        (self.vault / '旧知识').mkdir()
        existing = self.vault / '旧知识/原有方法.md'
        existing.write_bytes('已有方法，不得重写。'.encode('utf-8'))
        data = bundle()
        data['notes'][1]['existing_links'] = [{'path': '旧知识/原有方法.md', 'reason': '用户明确提供的对比关系。'}]
        result = self.save(data)
        note = (self.vault / '渡鸦知识库/方法-先看处境.md').read_text(encoding='utf-8')
        self.assertIn('[[旧知识/原有方法|原有方法]]：用户明确提供的对比关系。', note)
        self.assertTrue(result['confirmed_obsidian'])
        self.assertEqual(b'{"custom":true}', config.read_bytes())
        self.assertEqual('已有方法，不得重写。'.encode('utf-8'), existing.read_bytes())

    def test_missing_target_or_source_is_rejected_before_writing(self):
        variations = []
        missing = bundle()
        missing['notes'][0]['existing_links'] = [{'path': 'missing.md', 'reason': '没有这个目标。'}]
        variations.append(missing)
        missing = bundle()
        missing['notes'][0]['links'][0]['target'] = 'unknown'
        variations.append(missing)
        missing = bundle()
        missing['notes'][1]['sources'] = []
        variations.append(missing)
        missing = bundle()
        missing['notes'][1]['sources'][0]['url'] = 'javascript:alert(1)'
        variations.append(missing)
        for data in variations:
            with self.subTest(data=data):
                self.assert_rejected_unchanged(data)

    def test_duplicate_ids_titles_and_index_collision(self):
        for mutate in (
            lambda d: d['notes'][1].update(id='source'),
            lambda d: d['notes'][1].update(title=d['notes'][0]['title']),
            lambda d: d.update(index_title=d['notes'][0]['title']),
        ):
            data = bundle()
            mutate(data)
            self.assert_rejected_unchanged(data)
        data = bundle()
        data['notes'][0]['title'] = 'Notes'
        data['notes'][1]['title'] = 'notes'
        self.assert_rejected_unchanged(data)

    def test_unsafe_folder_and_titles_are_rejected(self):
        for folder in ('../outside', '/outside', 'C:/outside', 'folder\\escape',
                       '.git/notes', 'a/.obsidian/notes', 'CON', 'folder.', 'a//b'):
            with self.subTest(folder=folder):
                self.assert_rejected_unchanged(folder=folder)
        for title in ('../escape', 'a/b', 'a\\b', 'NUL', 'lpt1.txt', 'bad:title', 'bad?',
                      'bad*', 'trailing ', 'a.md', 'a#heading', 'a|alias', 'a[[link]]'):
            with self.subTest(title=title):
                data = bundle()
                data['notes'][0]['title'] = title
                self.assert_rejected_unchanged(data)

    def test_existing_case_collision_is_rejected_portably(self):
        (self.vault / 'notes').mkdir()
        self.assert_rejected_unchanged(folder='Notes')

    def test_current_install_and_protected_vault_are_rejected(self):
        with mock.patch.object(obsidian, 'INSTALL', self.vault.resolve()):
            self.assert_rejected_unchanged()
        protected = self.vault / '.obsidian'
        protected.mkdir()
        with self.assertRaises(obsidian.ObsidianError):
            obsidian.save_bundle(bundle(), protected)
        self.assertEqual([], list(protected.iterdir()))

    def make_symlink(self, path, target, *, directory=True):
        try:
            path.symlink_to(target, target_is_directory=directory)
        except (OSError, NotImplementedError):
            self.skipTest('Local system cannot create symbolic links.')

    def test_symlink_vault_folder_or_note_cannot_escape(self):
        outside = self.root / 'outside'
        outside.mkdir()
        linked = self.root / 'linked-vault'
        self.make_symlink(linked, self.vault)
        with self.assertRaises(obsidian.ObsidianError):
            obsidian.save_bundle(bundle(), linked)
        linked_folder = self.vault / '渡鸦知识库'
        self.make_symlink(linked_folder, outside)
        with self.assertRaises(obsidian.ObsidianError):
            self.save()
        self.assertEqual([], list(outside.iterdir()))
        linked_folder.unlink()
        linked_folder.mkdir()
        outside_note = outside / 'original.md'
        outside_note.write_bytes(b'private note')
        self.make_symlink(linked_folder / '来源-中文原文.md', outside_note, directory=False)
        with self.assertRaises(obsidian.ObsidianError):
            self.save()
        self.assertEqual(b'private note', outside_note.read_bytes())

    def test_partial_write_failure_rolls_back_only_this_batch(self):
        (self.vault / 'prior.md').write_bytes(b'original note')
        before = snapshot(self.vault)
        original = obsidian._write_new
        calls = 0
        def fail_second(path, data):
            nonlocal calls
            calls += 1
            if calls == 2:
                raise OSError('injected disk failure')
            original(path, data)
        with mock.patch.object(obsidian, '_write_new', side_effect=fail_second):
            with self.assertRaises(obsidian.ObsidianError) as raised:
                self.save(folder='new/nested')
        self.assertEqual('save_failed', raised.exception.code)
        self.assertEqual(before, snapshot(self.vault))

    def test_concurrent_file_is_not_overwritten_or_rolled_back(self):
        original = obsidian._write_new
        calls = 0
        def concurrent_file(path, data):
            nonlocal calls
            calls += 1
            if calls == 2:
                path.write_bytes(b'concurrent user content')
            original(path, data)
        with mock.patch.object(obsidian, '_write_new', side_effect=concurrent_file):
            with self.assertRaises(obsidian.ObsidianError):
                self.save()
        self.assertEqual(b'concurrent user content',
                         (self.vault / '渡鸦知识库/方法-先看处境.md').read_bytes())
        self.assertFalse((self.vault / '渡鸦知识库/来源-中文原文.md').exists())

    def test_code_examples_are_not_unresolved_links(self):
        data = bundle()
        data['notes'][0]['body'] = (
            '使用 `[[笔记]]` 展示语法。\n\n```markdown\n[[不存在的代码示例]]\n```\n\n'
            '~~~text\n[[第二个例子]]\n~~~\n\n正文没有实际关系。')
        self.save(data)
        self.assertIn(data['notes'][0]['body'],
                      (self.vault / '渡鸦知识库/来源-中文原文.md').read_text(encoding='utf-8'))

    def test_actual_body_link_is_checked_and_preserved(self):
        data = bundle()
        data['notes'][0]['body'] += '\n\n[[渡鸦知识库/方法-先看处境|显式正文链接]]'
        self.save(data)
        self.assertIn('[[渡鸦知识库/方法-先看处境|显式正文链接]]',
                      (self.vault / '渡鸦知识库/来源-中文原文.md').read_text(encoding='utf-8'))
        data = bundle()
        data['notes'][0]['body'] += '\n[[并不存在]]'
        self.assert_rejected_unchanged(data)

    def test_discover_only_registered_candidates_without_writes(self):
        config = self.root / 'obsidian.json'
        config.write_text(json.dumps({'vaults': {
            'real': {'path': str(self.vault), 'private': 'do-not-output'},
            'missing': {'path': str(self.root / 'absent')},
            'relative': {'path': 'not-an-absolute-vault'}, 'invalid': 42},
            'unrelated_secret': 'do-not-output'}), encoding='utf-8')
        malformed = self.root / 'malformed.json'
        malformed.write_bytes(b'{invalid')
        before = snapshot(self.root)
        result = obsidian.discover([config, malformed, self.root / 'nonexistent.json'])
        self.assertEqual(before, snapshot(self.root))
        self.assertEqual(['real', 'missing'], [v['id'] for v in result['candidates']])
        self.assertTrue(result['candidates'][0]['exists'])
        self.assertFalse(result['candidates'][1]['exists'])
        self.assertTrue(all(v['candidate_only'] for v in result['candidates']))
        self.assertNotIn('do-not-output', json.dumps(result))
        self.assertEqual(1, len(result['warnings']))

    def test_repository_demo_bundle_exports_five_notes_and_real_index(self):
        demo = json.loads((ROOT / 'skills/duya/assets/learning/demo-bundle.json').read_text(encoding='utf-8-sig'))
        result = self.save(demo)
        self.assertEqual(6, result['created'])
        self.assertEqual('渡鸦知识库/量子阅读示例索引.md', result['entry_relative'])
        for note in demo['notes']:
            saved = self.vault / '渡鸦知识库' / (note['title'] + '.md')
            self.assertTrue(saved.is_file())
            self.assertIn(note['body'], saved.read_text(encoding='utf-8'))


if __name__ == '__main__':
    unittest.main()
