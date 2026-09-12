"""Regression checks for Duya article fidelity and export boundaries.

All artifacts live in temporary directories. These checks do not claim that
WeChat's editor or mobile client has accepted the exported HTML.
"""
from __future__ import annotations

import base64
import hashlib
from html.parser import HTMLParser
import importlib.util
import json
from pathlib import Path
import re
import subprocess
import sys
import tempfile
import unittest
from unittest.mock import patch


ROOT = Path(__file__).resolve().parents[1]
MODULE_PATH = ROOT / 'skills' / 'duya' / 'tools' / 'wechat_layout.py'
SPEC = importlib.util.spec_from_file_location('duya_wechat_layout', MODULE_PATH)
layout = importlib.util.module_from_spec(SPEC)
SPEC.loader.exec_module(layout)


class ParsedHTML(HTMLParser):
    def __init__(self, source):
        super().__init__(convert_charrefs=True)
        self.tags = []
        self.text = []
        self.feed(source)

    def handle_starttag(self, tag, attrs):
        self.tags.append((tag, dict(attrs)))

    def handle_data(self, value):
        self.text.append(value)

    @property
    def plain(self):
        return ''.join(self.text)

    def elements(self, tag):
        return [attrs for name, attrs in self.tags if name == tag]


class WechatLayoutTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.catalog = layout.load_themes()
        cls.themes = cls.catalog['themes']
        cls.theme = next(t for t in cls.themes if t['id'] == cls.catalog['default'])

    def setUp(self):
        self.temp = tempfile.TemporaryDirectory(prefix='duya-wechat-test-')
        self.addCleanup(self.temp.cleanup)
        self.directory = Path(self.temp.name)
        self.input_path = self.directory / 'article.md'
        self.output_dir = self.directory / 'output'

    def render(self, source, theme=None, **kwargs):
        self.input_path.write_text(source, encoding='utf-8')
        report = layout.render_file(self.input_path, self.output_dir,
                                    theme or self.theme, **kwargs)
        fragment = (self.output_dir / report['files']['fragment']).read_text(encoding='utf-8')
        preview = (self.output_dir / report['files']['preview']).read_text(encoding='utf-8')
        self.assertEqual(self.input_path.read_text(encoding='utf-8'), source,
                         'Rendering must not rewrite its input.')
        return report, fragment, preview, ParsedHTML(fragment)

    def test_mixed_language_prices_and_punctuation_remain_exact(self):
        prose = "报价 ¥1,299.50; ROI=2.3%，Email: a@b.com。Don't change: C++ / C# (v2.1)."
        _, _, _, parsed = self.render('# 经营记录\n\n' + prose)
        self.assertIn(prose, parsed.plain)

    def test_csharp_heading_is_not_stripped_as_closing_marker(self):
        report, _, _, parsed = self.render('# C#\n\n## 认识 C#\n\n正文。\n\n### 正常闭合 ###')
        self.assertEqual(report['title'], 'C#')
        self.assertIn('认识 C#', parsed.plain)
        self.assertIn('正常闭合', parsed.plain)
        self.assertNotIn('正常闭合 ###', parsed.plain)

    def test_code_preserves_ascii_indentation_newlines_and_symbols(self):
        code = 'def quote():\n    price = 1299.50\n\treturn "<tag> & C#", price\n\nprint(quote())'
        _, _, _, parsed = self.render('# 代码\n\n```python\n' + code + '\n```')
        self.assertIn(code, parsed.plain)
        self.assertNotIn('\u3000', parsed.plain)

    def test_raw_html_and_title_are_visible_text_not_executable(self):
        payload = '<script>alert("x")</script><img src=x onerror=alert(1)>'
        _, fragment, _, parsed = self.render('# 标题\n\n' + payload,
                                              title='<svg onload=alert(2)>标题</svg>')
        self.assertIn(payload, parsed.plain)
        self.assertIn('<svg onload=alert(2)>标题</svg>', parsed.plain)
        self.assertFalse(parsed.elements('script'))
        self.assertFalse(parsed.elements('svg'))
        self.assertFalse(parsed.elements('img'))
        self.assertFalse(any(key.startswith('on') for _, attrs in parsed.tags for key in attrs))
        self.assertEqual(layout.validate(fragment), [])

    def test_dangerous_links_are_noninteractive_but_keep_caption(self):
        source = ('# 地址\n\n[甲](javascript:alert(1))\n'
                  '[乙](data:text/html,boom)\n[丙](java&#x09;script:alert(2))\n'
                  '[正常](https://example.com/a?x=1&y=2)')
        report, _, _, parsed = self.render(source)
        self.assertEqual([item['href'] for item in parsed.elements('a')],
                         ['https://example.com/a?x=1&y=2'])
        for caption in ('甲', '乙', '丙', '正常'):
            self.assertIn(caption, parsed.plain)
        self.assertTrue(report['warnings'])

    def test_malformed_url_does_not_abort_article(self):
        report, _, _, parsed = self.render('# 边界\n\n[坏地址](https://[bad)\n\n后续正文仍在。')
        self.assertFalse(parsed.elements('a'))
        self.assertIn('坏地址', parsed.plain)
        self.assertIn('后续正文仍在。', parsed.plain)
        self.assertTrue(report['warnings'])

    def test_malformed_image_address_leaves_a_visible_placeholder(self):
        report, _, _, parsed = self.render('# 图片\n\n![图片说明](https://[bad)\n\n后续正文仍在。')
        self.assertFalse(parsed.elements('img'))
        self.assertIn('图片说明', parsed.plain)
        self.assertIn('后续正文仍在。', parsed.plain)
        self.assertIsNone(report['assets'][0]['output'])

    def test_nonimage_private_file_is_not_read_as_image(self):
        private = self.directory / 'private.txt'
        private.write_text('private customer notes', encoding='utf-8')
        original = Path.read_bytes

        def guarded(path):
            if path.resolve() == private.resolve():
                self.fail('A nonimage local file must be rejected before reading its bytes.')
            return original(path)

        with patch.object(Path, 'read_bytes', guarded):
            report, _, _, parsed = self.render('# 素材\n\n![资料](private.txt)')
        self.assertFalse(parsed.elements('img'))
        self.assertNotIn('private customer notes', parsed.plain)
        self.assertIsNone(report['assets'][0]['output'])

    def test_fake_png_text_is_not_embedded(self):
        (self.directory / 'fake.png').write_text('a password is not an image', encoding='utf-8')
        report, _, _, parsed = self.render('# 素材\n\n![待补](fake.png)')
        self.assertFalse(parsed.elements('img'))
        self.assertNotIn('a password is not an image', parsed.plain)
        self.assertIsNone(report['assets'][0]['output'])
        self.assertFalse((self.output_dir / 'assets').exists())

    def test_local_png_copied_and_remote_picture_not_fetched(self):
        data = base64.b64decode('iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mP8/x8AAwMCAO+cOc8AAAAASUVORK5CYII=')
        (self.directory / 'dot.png').write_bytes(data)
        report, _, _, parsed = self.render('# 素材\n\n![一像素](dot.png)\n\n![](https://example.com/remote.jpg)')
        images = parsed.elements('img')
        self.assertEqual(len(images), 2)
        self.assertRegex(images[0]['src'], r'^assets/[a-f0-9]{16}\.png$')
        self.assertEqual((self.output_dir / images[0]['src']).read_bytes(), data)
        self.assertEqual(images[1]['src'], 'https://example.com/remote.jpg')
        self.assertEqual(images[1]['alt'], '')
        self.assertEqual(len(list((self.output_dir / 'assets').iterdir())), 1)
        self.assertTrue(any('外链图片' in message for message in report['warnings']))

    def test_fragment_excludes_preview_script_and_controls(self):
        _, fragment, preview, parsed = self.render('# 文章\n\n正文。')
        for tag in ('script', 'style', 'button', 'html', 'head', 'body'):
            self.assertFalse(parsed.elements(tag))
        self.assertNotIn('copyArticle', fragment)
        self.assertIn('copyArticle', preview)
        self.assertIn('text/html', preview)
        self.assertIn('text/plain', preview)
        self.assertNotIn('navigator.clipboard.read', preview)
        self.assertEqual(layout.validate(fragment), [])

    def test_twelve_themes_have_differences_beyond_palette(self):
        styles = []
        for theme in self.themes:
            with self.subTest(theme=theme['id']):
                report, fragment, _, parsed = self.render('# 同一标题\n\n## 同一章节\n\n正文。\n\n> 同一引文。', theme=theme)
                self.assertTrue(report['ok'])
                self.assertIn('同一引文。', parsed.plain)
                styles.append(re.sub(r'#[0-9a-fA-F]{6}', '#COLOR', fragment))
        self.assertEqual(len(self.themes), 12)
        self.assertEqual(len(set(styles)), 12,
                         'The twelve outputs must not differ by palette alone.')

    def test_tables_lists_quotes_and_order_remain_readable(self):
        source = ('# 内容\n\n| 服务 | 报价 |\n| --- | --- |\n| A\\|B | ¥199.50 |\n'
                  '\n1. 第一项\n   - 嵌套项\n2. 第二项\n\n> 引用正文。\n>\n> - 引用清单\n')
        report, _, _, parsed = self.render(source)
        self.assertTrue(report['ok'])
        self.assertEqual(len(parsed.elements('table')), 1)
        self.assertEqual(len(parsed.elements('th')), 2)
        self.assertEqual(len(parsed.elements('td')), 2)
        order = ['服务', '报价', 'A|B', '¥199.50', '第一项', '嵌套项', '第二项', '引用正文。', '引用清单']
        positions = [parsed.plain.index(text) for text in order]
        self.assertEqual(positions, sorted(positions))

    def test_table_terminal_escaped_pipe_is_content(self):
        _, _, _, parsed = self.render('# 表格\n\n字段 | 值\n--- | ---\n服务 | A\\|')
        self.assertIn('A|', parsed.plain)
        self.assertNotIn('A\\', parsed.plain)

    def test_missing_title_and_author_do_not_create_identity_or_cta(self):
        source = '只有正文，没有标题。\n\n我是渡鸦，这段是已有签名。'
        report, _, _, parsed = self.render(source)
        self.assertFalse(parsed.elements('h1'))
        self.assertEqual(report['title'], '')
        self.assertEqual(parsed.plain.count('我是渡鸦'), 1)
        self.assertNotIn('点赞', parsed.plain)
        self.assertNotIn('转发', parsed.plain)
        self.assertNotIn('{{', parsed.plain)

    def test_unclosed_fence_preserves_tail_and_reports_warning(self):
        report, _, _, parsed = self.render('# 未闭合\n\n```text\n  原样代码\n后续 # 内容')
        self.assertIn('  原样代码\n后续 # 内容', parsed.plain)
        self.assertTrue(any('未闭合' in warning for warning in report['warnings']))

    def test_delete_highlight_and_link_semantics_remain_distinct(self):
        _, fragment, _, parsed = self.render('# 标记\n\n~~已取消~~，==重点==，`x_y` 和 **结论**。')
        self.assertIn('已取消，重点，x_y 和 结论。', parsed.plain)
        self.assertIn('text-decoration:line-through', fragment)
        self.assertTrue(parsed.elements('strong'))

    def test_hashes_describe_original_bom_crlf_and_actual_output_bytes(self):
        # A fenced block leaves actual newlines in the output, exposing Windows
        # text-mode newline translation instead of testing a single-line HTML.
        text = '# 原始稿\r\n\r\n```python\r\n    value = "C#"\r\n    print(value)\r\n```\r\n'
        original = b'\xef\xbb\xbf' + text.encode('utf-8')
        self.input_path.write_bytes(original)
        report = layout.render_file(self.input_path, self.output_dir, self.theme)
        output = (self.output_dir / report['files']['fragment']).read_bytes()
        self.assertEqual(self.input_path.read_bytes(), original)
        self.assertEqual(report['source_sha256'], hashlib.sha256(original).hexdigest())
        normalized = text.replace('\r\n', '\n').encode('utf-8')
        self.assertNotEqual(report['source_sha256'], hashlib.sha256(normalized).hexdigest())
        self.assertEqual(report['output_sha256'], hashlib.sha256(output).hexdigest())
        self.assertIn(b'\n', output, 'This fixture must cover newline-bearing HTML.')
        self.assertIn('    value = "C#"\n    print(value)', ParsedHTML(output.decode('utf-8')).plain)

    def test_cli_can_disable_automatic_chapter_numbering(self):
        numbered = next(theme for theme in self.themes if theme['numbering'])
        source = '# 方案\n\n## 找到客户\n\n正文。\n\n## 写出内容\n\n第二段。'
        _, normal_fragment, _, _ = self.render(source, theme=numbered)
        normal_headings = [ParsedHTML(value).plain for value in
                           re.findall(r'<h2\b[^>]*>(.*?)</h2>', normal_fragment, re.S)]
        self.assertEqual(normal_headings, ['01找到客户', '02写出内容'])
        disabled_dir = self.directory / 'no-numbering'
        run = subprocess.run([sys.executable, '-X', 'utf8', str(MODULE_PATH), 'render',
                              '--input', str(self.input_path), '--output-dir', str(disabled_dir),
                              '--theme', numbered['id'], '--no-numbering'],
                             capture_output=True, text=True, encoding='utf-8', timeout=20)
        self.assertEqual(run.returncode, 0, run.stderr)
        report = json.loads(run.stdout)
        fragment = (disabled_dir / report['files']['fragment']).read_text(encoding='utf-8')
        headings = [ParsedHTML(value).plain for value in
                    re.findall(r'<h2\b[^>]*>(.*?)</h2>', fragment, re.S)]
        self.assertEqual(headings, ['找到客户', '写出内容'])
        self.assertTrue(report['ok'])

    def test_existing_numbered_headings_do_not_receive_second_numbers(self):
        numbered = next(theme for theme in self.themes if theme['numbering'])
        expected = ['01. 找到客户', '二、写出内容', '3) 检查原稿', '第四章 长期维护']
        source = '# 方案\n\n' + '\n\n'.join('## ' + value + '\n\n正文。' for value in expected)
        _, fragment, _, _ = self.render(source, theme=numbered)
        headings = [ParsedHTML(value).plain for value in
                    re.findall(r'<h2\b[^>]*>(.*?)</h2>', fragment, re.S)]
        self.assertEqual(headings, expected)


if __name__ == '__main__':
    unittest.main()
