"""Exercise Duya updates against disposable local installations.

Fixtures are synthetic ZIPs. Every test blocks outbound socket connections;
no test downloads a release or changes a real client installation.
"""
from __future__ import annotations

import importlib.util
import io
import json
import os
from pathlib import Path
import shutil
import subprocess
import tempfile
import unittest
from unittest.mock import patch
from urllib.error import URLError
import zipfile


ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = ROOT / 'skills' / 'duya' / 'tools' / 'update.py'
SPEC = importlib.util.spec_from_file_location('duya_update', MODULE_PATH)
updater = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(updater)

COMMIT_A = 'a' * 40
COMMIT_B = 'b' * 40
COMPONENTS = ['duya', 'duya-video', 'duya-update']
MANIFEST = {
    'schema_version': 1,
    'version': '0.4.0',
    'repository': 'jack-duya/duya-skills',
    'branch': 'main',
    'components': COMPONENTS,
}


def skill_text(name, body='Current official instructions.'):
    marker = '' if name == 'duya' else 'metadata:\n  duya_component: true\n'
    return f'---\nname: {name}\ndescription: Fixture for update checks.\n{marker}---\n\n# {name}\n\n{body}\n'


def official_files(*, legacy_file=False, body='Current official instructions.'):
    result = {
        'skills/duya/package.json': json.dumps(MANIFEST).encode(),
        'skills/duya/SKILL.md': skill_text('duya', body).encode(),
        'skills/duya/knowledge/example.md': b'Official knowledge, edition 2.\n',
        'skills/duya-video/SKILL.md': skill_text('duya-video').encode(),
        'skills/duya-update/SKILL.md': skill_text('duya-update').encode(),
    }
    if legacy_file:
        result['skills/duya/knowledge/retired.md'] = b'Obsolete official method.\n'
    return result


def snapshot(files=None, *, extra=None):
    files = official_files() if files is None else files
    data = io.BytesIO()
    with zipfile.ZipFile(data, 'w', zipfile.ZIP_DEFLATED) as archive:
        for name, value in files.items():
            archive.writestr('duya-fixture/' + name, value)
        for name, value in (extra or {}).items():
            archive.writestr(name, value)
    return data.getvalue()


def tree_bytes(directory):
    """Capture actual file bytes and directory names, including unexpected files."""
    if not directory.exists():
        return None
    result = {}
    for p in sorted(directory.rglob('*')):
        relative = p.relative_to(directory).as_posix()
        result[relative] = None if p.is_dir() else p.read_bytes()
    return result


class UpdateTests(unittest.TestCase):
    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='duya-update-test-')
        self.addCleanup(self.temp.cleanup)
        self.directory = Path(self.temp.name)
        self.skills = self.directory / 'client' / 'skills'
        self.target = self.skills / 'duya'
        self.backups = self.directory / 'backups'
        self.target.mkdir(parents=True)
        self.old_core = skill_text('duya', 'Older local Duya instructions.').encode()
        (self.target / 'SKILL.md').write_bytes(self.old_core)
        # Backstop against accidental network access through any HTTP library.
        blocked = patch('socket.socket.connect', side_effect=AssertionError('Network forbidden in updater tests'))
        blocked.start()
        self.addCleanup(blocked.stop)

    def apply(self, payload=None, commit=COMMIT_A, **kwargs):
        return updater.apply_snapshot(
            snapshot() if payload is None else payload,
            self.target,
            commit=commit,
            backup_root=self.backups,
            **kwargs,
        )

    def assert_rejected_without_install_changes(self, payload, **kwargs):
        before = tree_bytes(self.skills)
        try:
            result = self.apply(payload, **kwargs)
        except Exception:
            result = None
        else:
            self.assertFalse(result.get('ok', False), result)
        self.assertEqual(tree_bytes(self.skills), before)
        return result

    def test_upgrade_old_main_installs_all_declared_shortcuts(self):
        self.apply()
        for relative, expected in official_files().items():
            self.assertEqual((self.skills / relative.removeprefix('skills/')).read_bytes(), expected)
        self.assertEqual(json.loads((self.target / 'package.json').read_text())['version'], '0.4.0')

    def test_modified_official_file_is_backed_up_before_new_content_is_installed(self):
        custom = skill_text('duya', '用户自己改过：报价 299 元。').encode()
        (self.target / 'SKILL.md').write_bytes(custom)
        self.apply()
        self.assertEqual((self.target / 'SKILL.md').read_bytes(), official_files()['skills/duya/SKILL.md'])
        candidates = list(self.backups.rglob('SKILL.md'))
        self.assertTrue(any(p.read_bytes() == custom for p in candidates), 'Original customized instructions missing from backup')

    def test_personal_files_memory_and_other_skills_remain_byte_identical(self):
        personal = self.target / 'my-client-notes.txt'
        personal.write_text('客户原话与未公开价格，保留原样。', encoding='utf-8')
        memory = self.directory / '.duya' / 'memory' / 'client-a' / 'records.json'
        memory.parent.mkdir(parents=True)
        memory.write_bytes(b'{"private":"unchanged"}\n')
        other = self.skills / 'unrelated-skill' / 'SKILL.md'
        other.parent.mkdir()
        other.write_bytes(b'Not managed by Duya.\n')
        before = {p: p.read_bytes() for p in [personal, memory, other]}
        self.apply()
        for p, value in before.items():
            self.assertEqual(p.read_bytes(), value)

    def test_same_commit_does_not_overwrite_later_local_customization(self):
        payload = snapshot()
        self.apply(payload)
        custom = b'User changed official file after installing this same commit.\n'
        (self.target / 'knowledge' / 'example.md').write_bytes(custom)
        before = tree_bytes(self.directory)
        self.apply(payload)
        self.assertEqual((self.target / 'knowledge' / 'example.md').read_bytes(), custom)
        self.assertEqual(tree_bytes(self.directory), before)

    def test_check_with_injected_latest_is_read_only(self):
        before = tree_bytes(self.directory)
        result = updater.check_update(self.target, latest={
            'commit': COMMIT_A,
            'version': '0.4.0',
            'manifest': MANIFEST,
        })
        self.assertIsInstance(result, dict)
        self.assertEqual(tree_bytes(self.directory), before)

    def test_corrupt_zip_is_rejected_before_installation(self):
        self.assert_rejected_without_install_changes(b'not a ZIP archive')

    def test_zip_path_escape_is_rejected_before_installation(self):
        for path in [
            'duya-fixture/skills/duya/../../../escaped.txt',
            '../escaped.txt',
            '/absolute-escape.txt',
            'C:/absolute-escape.txt',
            'duya-fixture/skills/duya/..\\..\\escaped.txt',
        ]:
            with self.subTest(path=path):
                self.assert_rejected_without_install_changes(snapshot(extra={path: b'escape'}))
                self.assertFalse((self.directory / 'escaped.txt').exists())

    def test_declared_shortcut_without_entry_is_rejected(self):
        files = official_files()
        del files['skills/duya-video/SKILL.md']
        self.assert_rejected_without_install_changes(snapshot(files))

    def test_non_duya_shortcut_collision_is_not_overwritten(self):
        collision = self.skills / 'duya-video'
        collision.mkdir()
        (collision / 'SKILL.md').write_bytes(b'---\nname: personal-video\ndescription: My own work.\n---\nPrivate instructions.\n')
        (collision / 'notes.txt').write_bytes(b'Keep all of this unrelated component.\n')
        self.assert_rejected_without_install_changes(snapshot())

    def create_directory_link(self, link, target):
        try:
            link.symlink_to(target, target_is_directory=True)
        except OSError as error:
            if getattr(error, 'winerror', None) == 1314 or error.errno in (1, 13):
                self.skipTest('Directory symlinks require an unavailable OS privilege')
            raise

    def test_existing_host_links_to_same_canonical_components_are_preserved(self):
        self.apply()
        bridge = self.directory / 'second-client' / 'skills'
        bridge.mkdir(parents=True)
        for name in COMPONENTS:
            self.create_directory_link(bridge / name, self.skills / name)
        latest_files = official_files(body='Updated through the same canonical installation.')
        self.apply(snapshot(latest_files), commit=COMMIT_B, bridge_roots=[bridge])
        for name in COMPONENTS:
            self.assertTrue((bridge / name).is_symlink(), f'Host bridge was replaced: {name}')
            self.assertEqual((bridge / name).resolve(), (self.skills / name).resolve())
            self.assertEqual((bridge / name / 'SKILL.md').read_bytes(), latest_files[f'skills/{name}/SKILL.md'])

    def test_host_shortcut_link_to_unrelated_installation_is_rejected(self):
        self.apply()
        bridge = self.directory / 'second-client' / 'skills'
        bridge.mkdir(parents=True)
        self.create_directory_link(bridge / 'duya', self.target)
        unrelated = self.directory / 'different-installation' / 'duya-video'
        unrelated.mkdir(parents=True)
        (unrelated / 'SKILL.md').write_bytes(skill_text('duya-video', 'Other independent copy.').encode())
        self.create_directory_link(bridge / 'duya-video', unrelated)
        before = tree_bytes(self.skills)
        other_before = (unrelated / 'SKILL.md').read_bytes()
        try:
            result = self.apply(snapshot(), commit=COMMIT_B, bridge_roots=[bridge])
        except Exception:
            pass
        else:
            self.assertFalse(result.get('ok', False), result)
        self.assertEqual(tree_bytes(self.skills), before)
        self.assertEqual((unrelated / 'SKILL.md').read_bytes(), other_before)
        self.assertTrue((bridge / 'duya-video').is_symlink())

    def test_network_failure_when_downloading_snapshot_leaves_installation_untouched(self):
        before = tree_bytes(self.directory)
        latest = {'commit': COMMIT_A, 'version': '0.4.0', 'manifest': MANIFEST}
        with patch.object(updater, 'fetch_latest', return_value=latest), \
                patch.object(updater, 'urlopen', side_effect=URLError('Download interrupted')) as request:
            try:
                result = updater.apply_update(self.target, backup_root=self.backups)
            except Exception:
                pass
            else:
                self.assertFalse(result.get('ok', False), result)
        request.assert_called_once()
        self.assertEqual(tree_bytes(self.directory), before)

    @unittest.skipUnless(shutil.which('git'), 'Git is not available for the unrelated project fixture')
    def test_project_scoped_install_inside_unrelated_git_repo_can_update(self):
        project = self.directory / 'my-app'
        self.skills = project / '.agents' / 'skills'
        self.target = self.skills / 'duya'
        self.target.mkdir(parents=True)
        (self.target / 'SKILL.md').write_bytes(self.old_core)
        source = project / 'README.md'
        source.write_bytes(b'User application. Not a Duya source checkout.\n')
        subprocess.run(['git', 'init', '-q', str(project)], check=True, capture_output=True)
        subprocess.run(['git', '-C', str(project), 'remote', 'add', 'origin',
                        'https://github.com/example/host-app.git'], check=True, capture_output=True)
        git_before = tree_bytes(project / '.git')
        self.apply()
        self.assertEqual((self.target / 'SKILL.md').read_bytes(), official_files()['skills/duya/SKILL.md'])
        self.assertTrue((self.skills / 'duya-video' / 'SKILL.md').is_file())
        self.assertEqual(source.read_bytes(), b'User application. Not a Duya source checkout.\n')
        self.assertEqual(tree_bytes(project / '.git'), git_before)

    def test_next_snapshot_removes_only_previously_managed_retired_file(self):
        self.apply(snapshot(official_files(legacy_file=True)))
        retired = self.target / 'knowledge' / 'retired.md'
        self.assertTrue(retired.is_file())
        personal = self.target / 'knowledge' / 'personal.md'
        personal.write_bytes(b'My independent research, never in a package.\n')
        self.apply(snapshot(), commit=COMMIT_B)
        self.assertFalse(retired.exists())
        self.assertEqual(personal.read_bytes(), b'My independent research, never in a package.\n')
        self.assertEqual((self.target / 'knowledge' / 'example.md').read_bytes(), official_files()['skills/duya/knowledge/example.md'])

    def test_plugin_managed_cache_is_rejected_without_writing(self):
        original_target = self.target
        for cache in [
            self.directory / '.codex' / 'plugins' / 'cache' / 'personal' / 'duyaskills' / '0.3.0' / 'skills' / 'duya',
            self.directory / '.claude' / 'plugins' / 'cache' / 'duya-skills' / 'duya' / '0.3.0' / 'skills' / 'duya',
        ]:
            with self.subTest(cache=cache):
                cache.mkdir(parents=True)
                (cache / 'SKILL.md').write_bytes(self.old_core)
                self.target = cache
                before = tree_bytes(self.directory)
                try:
                    result = self.apply()
                except Exception:
                    pass
                else:
                    self.assertFalse(result.get('ok', False), result)
                self.assertEqual(tree_bytes(self.directory), before)
        self.target = original_target

    def test_replacement_failure_restores_preexisting_installation(self):
        self.apply(snapshot(official_files(legacy_file=True)))
        personal = self.target / 'personal.txt'
        personal.write_bytes(b'Local file survives rollback.\n')
        before = tree_bytes(self.skills)
        real_replace = os.replace
        calls = []
        def fail_second_replace(src, dst, *args, **kwargs):
            calls.append((Path(src), Path(dst)))
            if len(calls) == 2:
                raise OSError('Injected second replacement failure')
            return real_replace(src, dst, *args, **kwargs)
        with patch.object(updater.os, 'replace', side_effect=fail_second_replace):
            try:
                result = self.apply(snapshot(official_files(body='New next version.')), commit=COMMIT_B)
            except Exception:
                pass
            else:
                self.assertFalse(result.get('ok', False), result)
        self.assertGreaterEqual(len(calls), 2, 'Failure injection did not reach the replacement boundary')
        self.assertEqual(tree_bytes(self.skills), before)

    def test_network_failure_during_check_leaves_installation_untouched(self):
        before = tree_bytes(self.directory)
        with patch.object(updater, 'urlopen', side_effect=URLError('Injected offline network')) as request:
            try:
                result = updater.check_update(self.target)
            except Exception:
                pass
            else:
                self.assertFalse(result.get('ok', False), result)
        request.assert_called_once()
        self.assertEqual(tree_bytes(self.directory), before)


if __name__ == '__main__':
    unittest.main()
