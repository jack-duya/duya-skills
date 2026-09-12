"""Duya's independent, standard-library article renderer and clipboard preview.

Supports an intentionally bounded Markdown subset, not full CommonMark.
Rendering never fetches remote assets, rewrites prose, or publishes to WeChat.
"""
from __future__ import annotations
import argparse
import hashlib
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import re
import sys
from urllib.parse import unquote, urlsplit

SKILL = Path(__file__).resolve().parents[1]
THEMES = SKILL / 'assets/wechat/themes.json'
SANS = "-apple-system,BlinkMacSystemFont,'PingFang SC','Microsoft YaHei',sans-serif"
SERIF = "'Noto Serif CJK SC','Source Han Serif SC','Songti SC',SimSun,serif"
ENUMS = {
    'font': {'sans', 'serif'}, 'cover': {'masthead', 'split', 'stripe', 'frame', 'note', 'band'},
    'heading': {'rule', 'rail', 'number', 'tab', 'stamp', 'underline'},
    'quote': {'rule', 'panel', 'large', 'double', 'note', 'bracket'},
    'density': {'airy', 'balanced', 'compact'}, 'align': {'left', 'center'},
}


def load_themes():
    data = json.loads(THEMES.read_text(encoding='utf-8'))
    themes = data['themes']
    if len(themes) != 12 or len({t['id'] for t in themes}) != 12:
        raise ValueError('Expected 12 unique theme IDs.')
    for theme in themes:
        if not re.fullmatch(r'[a-z][a-z0-9-]*', theme['id']):
            raise ValueError('Invalid theme ID.')
        for field, allowed in ENUMS.items():
            if theme[field] not in allowed:
                raise ValueError('Invalid theme property: ' + field)
        if theme['radius'] not in (0, 6, 12) or not isinstance(theme['numbering'], bool):
            raise ValueError('Invalid theme geometry.')
        for color in ('accent', 'paper', 'ink', 'muted', 'line', 'tint', 'highlight'):
            if not re.fullmatch(r'#[0-9a-fA-F]{6}', theme['colors'][color]):
                raise ValueError('Invalid theme color.')
    if data['default'] not in {t['id'] for t in themes}:
        raise ValueError('Unknown default theme.')
    return data


def escape(text):
    return html.escape(str(text), quote=True)


def span(text, style=''):
    return '<span' + (f' style="{escape(style)}"' if style else '') + '>' + escape(text) + '</span>'


def section(body, style):
    return f'<section style="{escape(style)}">{body}</section>'


def safe_url(value, image=False):
    value = html.unescape(value.strip())
    if any(ord(c) < 32 for c in value) or '\\' in value:
        return None
    try:
        parsed = urlsplit(value)
    except ValueError:
        return None
    if parsed.scheme.lower() in ('https', 'http') and parsed.netloc and not parsed.username:
        return value
    if not image and parsed.scheme.lower() in ('mailto', 'tel') and parsed.path:
        return value
    return None


class TextReader(HTMLParser):
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.parts = []
    def handle_data(self, data):
        self.parts.append(data)
    def handle_starttag(self, tag, attrs):
        if tag == 'br':
            self.parts.append('\n')
    def handle_endtag(self, tag):
        if tag in ('p', 'section', 'h1', 'h2', 'h3', 'blockquote', 'li', 'tr'):
            self.parts.append('\n')


def visible_text(markup):
    reader = TextReader()
    reader.feed(markup)
    return ''.join(reader.parts)


def compact(text):
    return re.sub(r'\s+', '', text)


def parse_markdown(source):
    """Every nonblank source line belongs to a node; unsupported syntax stays text."""
    lines = source.replace('\r\n', '\n').replace('\r', '\n').split('\n')
    nodes, warnings = [], []
    i = 0
    def special(line):
        s = line.strip()
        return bool(re.match(r'^(#{1,6})\s+|^(`{3,}|~{3,})|^>\s?|^(?:[-+*]|\d+[.)])\s+', s)
                    or re.fullmatch(r'(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,}', s))
    while i < len(lines):
        line, stripped = lines[i], lines[i].strip()
        if not stripped:
            i += 1
            continue
        fence = re.match(r'^\s*(`{3,}|~{3,})(.*)$', line)
        if fence:
            marker, language = fence.group(1), fence.group(2).strip()
            code = []
            i += 1
            while i < len(lines) and not re.fullmatch(r'\s*' + re.escape(marker[0]) + '{' + str(len(marker)) + r',}\s*', lines[i]):
                code.append(lines[i]); i += 1
            if i == len(lines):
                warnings.append('代码围栏未闭合；末尾内容按代码原样保留。')
            else:
                i += 1
            nodes.append({'kind': 'code', 'text': '\n'.join(code), 'language': language})
            continue
        heading = re.match(r'^\s*(#{1,6})\s+(.+?)\s*$', line)
        if heading:
            nodes.append({'kind': 'heading', 'level': len(heading.group(1)), 'text': re.sub(r'\s+#+$', '', heading.group(2))})
            i += 1; continue
        if re.fullmatch(r'(?:\*\s*){3,}|(?:-\s*){3,}|(?:_\s*){3,}', stripped):
            nodes.append({'kind': 'rule', 'text': ''}); i += 1; continue
        if stripped.startswith('>'):
            quote = []
            while i < len(lines) and lines[i].lstrip().startswith('>'):
                quote.append(re.sub(r'^\s*> ?', '', lines[i])); i += 1
            children, child_warnings = parse_markdown('\n'.join(quote))
            nodes.append({'kind': 'quote', 'children': children, 'text': '\n'.join(quote)})
            warnings.extend(child_warnings); continue
        if i + 1 < len(lines) and '|' in line and re.fullmatch(r'\s*\|?\s*:?-{3,}:?\s*(?:\|\s*:?-{3,}:?\s*)+\|?\s*', lines[i + 1]):
            def cells(row):
                row = row.strip()
                if row.startswith('|'):
                    row = row[1:]
                if row.endswith('|') and not row.endswith('\\|'):
                    row = row[:-1]
                return [x.strip().replace('\\|', '|') for x in re.split(r'(?<!\\)\|', row)]
            rows = [cells(line)]
            i += 2
            while i < len(lines) and '|' in lines[i] and lines[i].strip():
                rows.append(cells(lines[i])); i += 1
            nodes.append({'kind': 'table', 'rows': rows, 'text': ''}); continue
        item = re.match(r'^(\s*)([-+*]|\d+[.)])\s+(.*)$', line)
        if item:
            depth = min(6, len(item.group(1).expandtabs(4)) // 2)
            parts = [item.group(3)]
            i += 1
            while i < len(lines) and lines[i].strip() and not special(lines[i]) and len(lines[i]) - len(lines[i].lstrip()) > len(item.group(1)):
                parts.append(lines[i].strip()); i += 1
            nodes.append({'kind': 'item', 'marker': item.group(2), 'depth': depth, 'text': '\n'.join(parts)})
            continue
        paragraph = [line]
        i += 1
        while i < len(lines) and lines[i].strip() and not special(lines[i]):
            if i + 1 < len(lines) and '|' in lines[i] and re.match(r'^\s*\|?\s*:?-{3,}', lines[i + 1]):
                break
            paragraph.append(lines[i]); i += 1
        nodes.append({'kind': 'paragraph', 'text': '\n'.join(paragraph)})
    return nodes, warnings


class Renderer:
    def __init__(self, theme, input_path, output_dir):
        self.theme, self.colors = theme, theme['colors']
        self.input_path, self.output_dir = input_path, output_dir
        self.warnings, self.expected, self.assets = [], [], []
        self.chapter = 0
        self.gap = {'airy': 25, 'balanced': 21, 'compact': 17}[theme['density']]
        self.font = SERIF if theme['font'] == 'serif' else SANS

    def image(self, alt, target):
        remote = safe_url(target, image=True)
        location = remote
        if remote:
            self.warnings.append('外链图片须在实际公众号编辑器确认加载；通过微信 API 发布时需另行上传。')
        elif not re.match(r'^[a-zA-Z][a-zA-Z0-9+.-]*:', target) and not target.startswith('//'):
            path = (self.input_path.parent / unquote(target)).resolve()
            signatures = [(b'\x89PNG\r\n\x1a\n', '.png'), (b'\xff\xd8\xff', '.jpg'), (b'GIF87a', '.gif'), (b'GIF89a', '.gif')]
            if path.suffix.lower() in {'.png', '.jpg', '.jpeg', '.gif', '.webp'} and path.is_file() and path.stat().st_size <= 20 * 1024 * 1024:
                data = path.read_bytes()
                extension = next((ext for magic, ext in signatures if data.startswith(magic)), None)
                if data[:4] == b'RIFF' and data[8:12] == b'WEBP':
                    extension = '.webp'
                if extension:
                    name = hashlib.sha256(data).hexdigest()[:16] + extension
                    dest = self.output_dir / 'assets' / name
                    dest.parent.mkdir(parents=True, exist_ok=True)
                    if dest.resolve() != path:
                        dest.write_bytes(data)
                    location = 'assets/' + name
                    self.warnings.append('本地图片已复制到 assets；交付时保留该目录，粘贴后在公众号编辑器重新上传或确认。')
        self.assets.append({'source': target, 'output': location, 'alt': alt})
        if not location:
            self.warnings.append('图片未嵌入：素材不存在、类型不支持或地址不安全。请按素材清单补图。')
            return span('[图片待补' + ('：' + alt if alt else '') + ']')
        markup = f'<img src="{escape(location)}" alt="{escape(alt)}" style="max-width:100%;height:auto;display:block;margin:18px auto;border-radius:{self.theme["radius"]}px;" />'
        if alt:
            markup += '<span style="display:block;text-align:center;font-size:13px;line-height:1.6;color:' + self.colors['muted'] + ';margin:8px 0 20px;">' + escape(alt) + '</span>'
        return markup

    def inline(self, text, depth=0):
        if depth > 20:
            return escape(text)
        out, i = [], 0
        while i < len(text):
            if text[i] == '\\' and i + 1 < len(text) and text[i + 1] in r'\`*_{}[]()#+-.!|~=':
                out.append(escape(text[i + 1])); i += 2; continue
            if text[i] == '`':
                marker = re.match(r'`+', text[i:]).group()
                end = text.find(marker, i + len(marker))
                if end >= 0:
                    out.append(span(text[i + len(marker):end], f'font-family:monospace;font-size:0.9em;color:{self.colors["ink"]};background:{self.colors["tint"]};padding:2px 4px;border-radius:3px;'))
                    i = end + len(marker); continue
            is_image = text.startswith('![', i)
            start = i + 1 if is_image else i
            if text[start:start + 1] == '[':
                middle = text.find('](', start + 1)
                if middle >= 0:
                    pos, nesting = middle + 2, 1
                    while pos < len(text) and nesting:
                        if text[pos] == '(':
                            nesting += 1
                        elif text[pos] == ')':
                            nesting -= 1
                        pos += 1
                    if nesting == 0:
                        label, target = text[start + 1:middle], text[middle + 2:pos - 1].strip()
                        if target.startswith('<') and target.endswith('>'):
                            target = target[1:-1]
                        if is_image:
                            out.append(self.image(label, target))
                        else:
                            url = safe_url(target)
                            caption = self.inline(label, depth + 1)
                            if url:
                                out.append(f'<a href="{escape(url)}" style="color:{self.colors["accent"]};text-decoration:underline;overflow-wrap:anywhere;">{caption}</a>')
                                self.warnings.append('外链保留于 HTML；公众号中的点击能力以实际编辑器和账号能力为准。')
                            else:
                                out.append(caption + span('（' + target + '）'))
                                self.warnings.append('相对、锚点或不安全链接按文字保留，未生成可点击跳转。')
                        i = pos; continue
            matched = False
            for marker, tag, style in [
                ('**', 'strong', f'font-weight:700;color:{self.colors["accent"]};'),
                ('__', 'strong', f'font-weight:700;color:{self.colors["accent"]};'),
                ('~~', 'span', 'text-decoration:line-through;'),
                ('==', 'span', f'background-color:{self.colors["highlight"]};color:{self.colors["ink"]};padding:1px 2px;'),
                ('++', 'span', f'text-decoration:underline;text-decoration-color:{self.colors["accent"]};text-underline-offset:4px;'),
                ('*', 'em', 'font-style:italic;'),
            ]:
                if text.startswith(marker, i):
                    end = text.find(marker, i + len(marker))
                    if end > i + len(marker):
                        out.append(f'<{tag} style="{style}">' + self.inline(text[i + len(marker):end], depth + 1) + f'</{tag}>')
                        i = end + len(marker); matched = True; break
            if matched:
                continue
            out.append('<br />' if text[i] == '\n' else escape(text[i]))
            i += 1
        return ''.join(out)

    def content(self, text):
        markup = self.inline(text)
        self.expected.append(visible_text(markup))
        return markup

    def cover(self, title, author, summary):
        c, t = self.colors, self.theme
        title_markup = self.content(title)
        h = f'<h1 style="margin:0;font-family:{self.font};font-size:29px;font-weight:700;line-height:1.45;letter-spacing:0.5px;color:{c["ink"]};">{title_markup}</h1>'
        author_markup = '' if not author else '<p style="font-size:13px;margin:16px 0 0;color:' + c['muted'] + ';">' + span(author) + '</p>'
        summary_markup = '' if not summary else '<p style="font-size:16px;line-height:1.8;margin:18px 0 0;color:' + c['muted'] + ';">' + span(summary) + '</p>'
        body = h + author_markup + summary_markup
        styles = {
            'masthead': f'padding:16px 0 28px;border-top:5px solid {c["accent"]};border-bottom:1px solid {c["line"]};',
            'split': f'padding:12px 0 20px 18px;border-left:8px solid {c["accent"]};',
            'stripe': f'padding:22px 18px;border-top:2px solid {c["accent"]};background:{c["tint"]};border-bottom:7px solid {c["accent"]};',
            'frame': f'padding:28px 20px;border:1px solid {c["accent"]};border-radius:{t["radius"]}px;',
            'note': f'padding:24px 0 16px;border-bottom:3px double {c["accent"]};',
            'band': f'padding:28px 20px;background:{c["tint"]};border-left:4px solid {c["accent"]};border-radius:{t["radius"]}px;',
        }
        return section(body, styles[t['cover']] + f'text-align:{t["align"]};margin:0 0 30px;')

    def heading(self, text, level):
        c, t = self.colors, self.theme
        body = self.content(text)
        if level == 2:
            self.chapter += 1
            if t['numbering'] and not re.match(r'^(?:\d+[.、:：)\s]|[一二三四五六七八九十]+[、.：:]|第[一二三四五六七八九十\d]+[章节部分])', text):
                body = span(f'{self.chapter:02d}', f'display:block;font-family:{SANS};font-size:13px;letter-spacing:2px;color:{c["accent"]};margin-bottom:6px;') + body
        styles = {
            'rule': f'border-top:1px solid {c["line"]};padding-top:16px;',
            'rail': f'border-left:4px solid {c["accent"]};padding-left:12px;',
            'number': f'border-bottom:2px solid {c["accent"]};padding-bottom:12px;',
            'tab': f'background:{c["tint"]};padding:12px 16px;border-radius:{t["radius"]}px;',
            'stamp': f'border-top:2px solid {c["accent"]};border-bottom:1px solid {c["line"]};padding:12px 0;',
            'underline': f'padding-bottom:9px;border-bottom:1px solid {c["accent"]};',
        }
        style = styles[t['heading']] if level <= 2 else f'border-left:2px solid {c["line"]};padding-left:10px;'
        tag = 'h2' if level <= 2 else 'h3'
        return f'<{tag} style="font-family:{self.font};font-size:{22 if level <= 2 else 18}px;line-height:1.6;font-weight:700;color:{c["ink"]};margin:34px 0 18px;{style}">{body}</{tag}>'

    def blocks(self, nodes):
        c, t = self.colors, self.theme
        output = []
        for node in nodes:
            kind = node['kind']
            if kind == 'heading':
                output.append(self.heading(node['text'], node['level']))
            elif kind == 'paragraph':
                output.append(f'<p style="margin:0 0 {self.gap}px;line-height:1.9;overflow-wrap:anywhere;">{self.content(node["text"])}</p>')
            elif kind == 'item':
                marker = node['marker'] if node['marker'][0].isdigit() else '•'
                output.append(f'<p style="margin:10px 0 10px {12 + node["depth"] * 16}px;line-height:1.85;">' + span(marker + ' ', f'color:{c["accent"]};font-weight:700;') + self.content(node['text']) + '</p>')
            elif kind == 'rule':
                output.append(section('', f'height:0;border-top:1px solid {c["line"]};margin:30px 0;'))
            elif kind == 'code':
                text = node['text']
                self.expected.append(text)
                output.append(section('<p style="margin:0;font-family:monospace;font-size:13px;line-height:1.65;white-space:pre-wrap;overflow-wrap:anywhere;">' + span(text) + '</p>', f'background:{c["tint"]};color:{c["ink"]};padding:16px;border:1px solid {c["line"]};border-radius:{t["radius"]}px;margin:24px 0;'))
            elif kind == 'quote':
                styles = {
                    'rule': f'border-left:3px solid {c["accent"]};padding:2px 0 2px 18px;',
                    'panel': f'background:{c["tint"]};padding:22px 20px;border-radius:{t["radius"]}px;',
                    'large': f'font-family:{SERIF};font-size:21px;padding:22px 6px;border-top:1px solid {c["line"]};border-bottom:1px solid {c["line"]};',
                    'double': f'border-top:3px double {c["accent"]};border-bottom:3px double {c["accent"]};padding:22px 4px;',
                    'note': f'background:{c["tint"]};border-top:3px solid {c["accent"]};padding:20px 18px;',
                    'bracket': f'border-left:1px solid {c["accent"]};border-right:1px solid {c["accent"]};padding:12px 18px;',
                }
                output.append(section(self.blocks(node['children']), styles[t['quote']] + f'margin:26px 0;color:{c["ink"]};'))
            elif kind == 'table':
                rows = node['rows']
                body = []
                for row_index, row in enumerate(rows):
                    cells = []
                    for cell in row:
                        tag = 'th' if row_index == 0 else 'td'
                        cells.append(f'<{tag} style="border:1px solid {c["line"]};padding:10px 8px;text-align:left;vertical-align:top;overflow-wrap:anywhere;font-weight:{700 if row_index == 0 else 400};background:{c["tint"] if row_index == 0 else c["paper"]};">{self.content(cell)}</{tag}>')
                    body.append('<tr>' + ''.join(cells) + '</tr>')
                output.append('<table style="border-collapse:collapse;table-layout:fixed;width:100%;margin:24px 0;font-size:14px;line-height:1.75;"><tbody>' + ''.join(body) + '</tbody></table>')
                if max(map(len, rows)) > 3:
                    self.warnings.append('表格超过三列，手机阅读可能拥挤；请在预览中检查，必要时将原稿表格改为条目。')
        return ''.join(output)


class Validator(HTMLParser):
    ALLOWED = {'section', 'p', 'span', 'h1', 'h2', 'h3', 'strong', 'em', 'br', 'a', 'img', 'table', 'tbody', 'tr', 'th', 'td'}
    VOID = {'img', 'br'}
    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.errors, self.stack = [], []
        self.roots = 0
    def handle_starttag(self, tag, attrs):
        if not self.stack:
            self.roots += 1
            if tag != 'section':
                self.errors.append('正文根元素必须是 section。')
        if tag not in self.ALLOWED:
            self.errors.append('正文含不支持的标签：' + tag)
        allowed = {'style'} | ({'src', 'alt'} if tag == 'img' else set()) | ({'href'} if tag == 'a' else set())
        for key, value in attrs:
            if key not in allowed:
                self.errors.append('正文含不支持的属性：' + key)
            if key == 'style':
                if re.search(r'url\s*\(|expression\s*\(|var\s*\(|@|position\s*:|display\s*:\s*(grid|flex)|float\s*:', value or '', re.I):
                    self.errors.append('正文 CSS 含动态、外部或依赖布局的声明。')
            if key == 'href' and not safe_url(value or ''):
                self.errors.append('链接地址不安全。')
            if key == 'src' and not (safe_url(value or '', image=True) or re.fullmatch(r'assets/[a-f0-9]{16}\.(png|jpg|gif|webp)', value or '')):
                self.errors.append('图片地址不受支持。')
        if tag not in self.VOID:
            self.stack.append(tag)
    def handle_startendtag(self, tag, attrs):
        self.handle_starttag(tag, attrs)
        if tag not in self.VOID:
            self.handle_endtag(tag)
    def handle_endtag(self, tag):
        if not self.stack or self.stack[-1] != tag:
            self.errors.append('HTML 标签嵌套不完整：' + tag)
        else:
            self.stack.pop()
    def handle_data(self, data):
        if data.strip() and not self.stack:
            self.errors.append('正文容器外有文字。')
    def result(self):
        if self.stack:
            self.errors.append('HTML 有未闭合标签。')
        if self.roots != 1:
            self.errors.append('需要且只允许一个正文根容器。')
        return list(dict.fromkeys(self.errors))


def validate(fragment):
    checker = Validator()
    checker.feed(fragment)
    checker.close()
    return checker.result()


COPY_SCRIPT = r"""
async function copyArticle(){
 const article=document.getElementById('article'); const status=document.getElementById('copy-status');
 const body=article.innerHTML; const text=article.innerText;
 try{
  if(!navigator.clipboard||!window.ClipboardItem||!window.isSecureContext)throw new Error('fallback');
  await navigator.clipboard.write([new ClipboardItem({'text/html':new Blob([body],{type:'text/html'}),'text/plain':new Blob([text],{type:'text/plain'})})]);
  status.textContent='正文已复制。到公众号编辑器粘贴后，检查图片、外链和样式。';
 }catch(error){
  const selection=window.getSelection(); const range=document.createRange(); range.selectNodeContents(article);selection.removeAllRanges();selection.addRange(range);
  let copied=false;try{copied=document.execCommand('copy');}catch(e){}
  status.textContent=copied?'正文已复制。请在公众号编辑器检查粘贴结果。':'正文已选中，请按 Ctrl+C 或 ⌘C，再到公众号编辑器粘贴。';
 }
}
document.getElementById('copy').addEventListener('click',copyArticle);
document.querySelectorAll('[data-width]').forEach(b=>b.addEventListener('click',()=>{document.getElementById('paper').style.maxWidth=b.dataset.width+'px';document.querySelectorAll('[data-width]').forEach(x=>x.setAttribute('aria-pressed',String(x===b)));}));
"""


def preview_page(fragment, theme, title, warnings, fragment_name):
    c = theme['colors']
    note = ' '.join(dict.fromkeys(warnings)) or '先确认内容与样式，再复制正文。'
    return f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>{escape(title)} · {escape(theme['name'])}</title><style>
*{{box-sizing:border-box}}body{{margin:0;background:#edeae5;color:#262332;font-family:{SANS}}}header{{background:#24212c;color:#fbf8f2;padding:24px clamp(18px,4vw,64px);display:flex;gap:20px;align-items:center;justify-content:space-between;flex-wrap:wrap}}header p{{margin:0;font-size:13px;line-height:1.7;color:#d9d3c8}}header h1{{font-family:{SERIF};font-size:23px;margin:3px 0 9px}}button,a.button{{font:inherit;border:1px solid #b9b2a6;border-radius:5px;padding:10px 15px;background:#fcfaf6;color:#28242c;cursor:pointer;text-decoration:none}}button:hover{{background:#e6ddd0}}button:focus-visible,a:focus-visible{{outline:3px solid #ad8458;outline-offset:3px}}#copy{{background:#ead6ac;border-color:#ead6ac;font-weight:700}}.controls{{display:flex;gap:8px;flex-wrap:wrap}}.toolbar{{max-width:760px;margin:22px auto 0;padding:0 18px;display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap}}.toolbar button[aria-pressed="true"]{{background:#262332;color:white}}#paper{{max-width:420px;width:100%;margin:24px auto 48px;box-shadow:0 8px 32px #26233216}}#article{{background:{c['paper']}}}.notes{{font-size:13px;line-height:1.8;max-width:760px;margin:0 auto;padding:0 18px 30px;color:#595362}}#copy-status{{min-height:1.8em}}@media(max-width:480px){{#paper{{margin:18px 0 24px;box-shadow:none}}header{{padding:20px 16px}}.toolbar{{padding:0 12px}}}}
</style></head><body><header><div><p>渡鸦 · 公众号排版</p><h1>{escape(theme['name'])}</h1><p>{escape(theme['summary'])}</p></div><div class="controls"><button id="copy" type="button">复制正文</button><a class="button" href="{escape(fragment_name)}" download>下载正文 HTML</a></div></header><div class="toolbar"><span>文章预览</span><div class="controls"><button type="button" data-width="375" aria-pressed="false">375 px</button><button type="button" data-width="420" aria-pressed="true">420 px</button><button type="button" data-width="640" aria-pressed="false">640 px</button></div></div><main id="paper"><div id="article">{fragment}</div></main><footer class="notes"><p id="copy-status" role="status" aria-live="polite">{escape(note)}</p><p>只复制文章正文；此页面的按钮与提示不会进入公众号文章。</p></footer><script>{COPY_SCRIPT}</script></body></html>'''


def render_file(input_path, output_dir, theme, title=None, author=None, summary=None):
    input_path, output_dir = Path(input_path).resolve(), Path(output_dir).resolve()
    if input_path.suffix.lower() not in ('.md', '.markdown', '.txt'):
        raise ValueError('仅直接接收 UTF-8 Markdown 或纯文本；其他格式请先用宿主读取并归一化。')
    source = input_path.read_text(encoding='utf-8-sig')
    nodes, warnings = parse_markdown(source)
    renderer = Renderer(theme, input_path, output_dir)
    if nodes and nodes[0]['kind'] == 'heading' and nodes[0]['level'] == 1:
        original_title = nodes.pop(0)['text']
        title = original_title if title is None else title
    title = title or ''
    markup = renderer.cover(title, author, summary) if title else ''
    markup += renderer.blocks(nodes)
    c = theme['colors']
    fragment = section(markup, f'max-width:640px;margin:0 auto;padding:26px 22px 30px;background-color:{c["paper"]};color:{c["ink"]};font-family:{renderer.font};font-size:17px;line-height:1.9;letter-spacing:0.2px;word-break:normal;overflow-wrap:anywhere;text-align:left;')
    errors = validate(fragment)
    actual, cursor, missing = compact(visible_text(fragment)), 0, []
    for expected in renderer.expected:
        text = compact(expected)
        if not text:
            continue
        found = actual.find(text, cursor)
        if found < 0:
            missing.append(text[:60])
        else:
            cursor = found + len(text)
    if missing:
        errors.append('内容顺序校验失败。')
    warnings += renderer.warnings
    if not title:
        warnings.append('未提供标题；正文原样保留，未自动编造文章标题。')
    output_dir.mkdir(parents=True, exist_ok=True)
    base = input_path.stem + '.' + theme['id']
    fragment_path = output_dir / (base + '.html')
    preview_path = output_dir / (base + '.preview.html')
    report_path = output_dir / (base + '.report.json')
    if input_path in (fragment_path, preview_path, report_path):
        raise ValueError('输出不能覆盖输入。')
    report = {'ok': not errors, 'errors': errors, 'warnings': list(dict.fromkeys(warnings)),
        'theme': theme['id'], 'title': visible_text(renderer.inline(title)) if title else '',
        'stats': {'blocks': len(nodes), 'images': len(renderer.assets), 'characters': len(visible_text(fragment))},
        'source_sha256': hashlib.sha256(input_path.read_bytes()).hexdigest(), 'output_sha256': hashlib.sha256(fragment.encode('utf-8')).hexdigest(),
        'content_check': {'ok': not missing, 'missing': missing, 'method': 'Parsed content appears in order; review unsupported Markdown and original meaning separately.'},
        'assets': renderer.assets, 'files': {'fragment': fragment_path.name, 'preview': preview_path.name}}
    fragment_path.write_bytes(fragment.encode('utf-8'))
    preview_path.write_bytes(preview_page(fragment, theme, title or '文章预览', report['warnings'], fragment_path.name).encode('utf-8'))
    report_path.write_bytes(json.dumps(report, ensure_ascii=False, indent=2).encode('utf-8'))
    return report


def gallery(input_path, output_dir, themes):
    output_dir = Path(output_dir).resolve()
    reports = [render_file(input_path, output_dir, theme) for theme in themes]
    cards = []
    for i, (theme, report) in enumerate(zip(themes, reports), 1):
        c = theme['colors']
        cards.append(f'<a class="theme" href="{escape(report["files"]["preview"])}"><div class="sample" style="background:{c["paper"]};color:{c["ink"]};border-top:5px solid {c["accent"]};font-family:{SERIF if theme["font"] == "serif" else SANS}"><span class="seq" style="color:{c["accent"]}">{i:02d}</span><strong>{escape(theme["name"])}</strong><p>{escape(theme["summary"])}</p><span class="swatches">' + ''.join(f'<i style="background:{c[key]}"></i>' for key in ('accent', 'paper', 'tint', 'highlight')) + f'</span></div><div class="caption"><span>{escape(" · ".join(theme["use_cases"]))}</span><b>查看整篇 →</b></div></a>')
    page = f'''<!doctype html><html lang="zh-CN"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>渡鸦 · 十二种公众号阅读风格</title><style>*{{box-sizing:border-box}}body{{margin:0;background:#f4f0e8;color:#29242e;font-family:{SANS}}}.wrap{{max-width:1160px;margin:auto;padding:54px 28px}}header{{border-bottom:1px solid #bfb4a6;padding-bottom:35px;margin-bottom:32px}}.eyebrow{{letter-spacing:3px;font-size:12px;color:#756a59}}h1{{font-family:{SERIF};font-size:clamp(34px,5vw,58px);font-weight:600;letter-spacing:2px;margin:20px 0}}header p{{font-size:16px;line-height:1.9;max-width:720px;color:#675e55}}.grid{{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:24px}}.theme{{text-decoration:none;color:inherit;display:block;border:1px solid #d5cbbd;background:#fff;transition:transform .16s ease,box-shadow .16s ease}}.theme:hover{{transform:translateY(-4px);box-shadow:0 10px 24px #29242e14}}.theme:focus-visible{{outline:3px solid #705031;outline-offset:4px}}.sample{{padding:25px;min-height:245px}}.sample .seq{{display:block;font-size:12px;letter-spacing:2px;margin-bottom:22px}}.sample strong{{font-size:27px;font-weight:600}}.sample p{{font-size:14px;line-height:1.8;min-height:50px}}.swatches{{display:flex;gap:6px;margin-top:22px}}.swatches i{{width:25px;height:7px;border:1px solid #0001}}.caption{{padding:18px 20px;border-top:1px solid #e7dfd3;font-size:12px;line-height:1.8}}.caption b{{display:block;font-weight:500;margin-top:8px;color:#604327}}footer{{margin:38px 0 0;color:#776b5f;font-size:13px;line-height:1.8}}@media(max-width:880px){{.grid{{grid-template-columns:repeat(2,minmax(0,1fr))}}}}@media(max-width:540px){{.wrap{{padding:30px 18px}}.grid{{grid-template-columns:1fr}}}}</style></head><body><main class="wrap"><header><div class="eyebrow">渡鸦 · 公众号排版</div><h1>十二种阅读风格</h1><p>同一篇文章，十二种有区别的视觉表达。先看文章与读者需要什么，再选择标题、章节、引文和留白的关系。点击任意主题，查看完整排版并复制正文。</p></header><section class="grid">{''.join(cards)}</section><footer>所有主题都保留原文。复制完成后，请在实际公众号编辑器检查图片、外链和样式。主题不会自动添加作者、宣传语或阅读数据。</footer></main></body></html>'''
    (output_dir / 'index.html').write_bytes(page.encode('utf-8'))
    return reports


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    commands = parser.add_subparsers(dest='command', required=True)
    commands.add_parser('themes', help='List the twelve available themes.')
    check = commands.add_parser('validate', help='Validate the clean body fragment.')
    check.add_argument('html_file')
    render = commands.add_parser('render', help='Render an article into body, preview and report.')
    render.add_argument('--input', required=True)
    render.add_argument('--output-dir', required=True)
    render.add_argument('--theme')
    render.add_argument('--no-numbering', action='store_true', help='Disable theme chapter numbers.')
    for field in ('title', 'author', 'summary'):
        render.add_argument('--' + field)
    catalog = commands.add_parser('gallery', help='Generate all twelve full article previews.')
    catalog.add_argument('--input', required=True)
    catalog.add_argument('--output-dir', required=True)
    args = parser.parse_args()
    if args.command == 'validate':
        errors = validate(Path(args.html_file).read_text(encoding='utf-8'))
        print(json.dumps({'ok': not errors, 'errors': errors}, ensure_ascii=False))
        return 1 if errors else 0
    data = load_themes()
    if args.command == 'themes':
        print(json.dumps(data, ensure_ascii=False, indent=2)); return 0
    if args.command == 'gallery':
        reports = gallery(Path(args.input), Path(args.output_dir), data['themes'])
        print(json.dumps({'themes': len(reports), 'ok': all(r['ok'] for r in reports), 'output': str(Path(args.output_dir).resolve())}, ensure_ascii=False))
        return 0 if all(r['ok'] for r in reports) else 1
    theme_id = args.theme or data['default']
    theme = next((t for t in data['themes'] if t['id'] == theme_id or t['name'] == theme_id), None)
    if theme is None:
        parser.error('Unknown theme. Run themes to see the registry.')
    if args.no_numbering:
        theme = {**theme, 'numbering': False}
    report = render_file(args.input, args.output_dir, theme, args.title, args.author, args.summary)
    print(json.dumps(report, ensure_ascii=False, indent=2))
    return 0 if report['ok'] else 1


if __name__ == '__main__':
    try:
        sys.exit(main())
    except (ValueError, OSError) as error:
        print(json.dumps({'ok': False, 'error': str(error)}, ensure_ascii=False), file=sys.stderr)
        sys.exit(1)
