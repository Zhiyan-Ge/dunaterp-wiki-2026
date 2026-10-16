"""Convert the two supplied protocols to native, site-styled HTML sections.

No prose rewriting. Read numbering from DOCX (textutil loses ordered lists).
Emit an apply_patch patch, or --check to verify the committed output and text.
Unsupported embedded assets fail explicitly so they cannot disappear silently.
"""
import hashlib
import html
from html.parser import HTMLParser
import json
from pathlib import Path
import sys
import xml.etree.ElementTree as ET
from zipfile import ZipFile

ROOT = Path(__file__).resolve().parent.parent
TARGET = ROOT / 'src/content/wet-lab-protocols.json'
W = '{http://schemas.openxmlformats.org/wordprocessingml/2006/main}'


def val(node, path, default=''):
    child = node.find('/'.join(W + part for part in path.split('/')))
    return child.get(W + 'val', default) if child is not None else default


def text(node):
    return ''.join(t.text or '' for t in node.iter(W + 't'))


def inline(node):
    result = ''
    for run in node.iter(W + 'r'):
        content = ''
        for child in run:
            if child.tag == W + 't':
                content += html.escape(child.text or '')
            elif child.tag == W + 'tab':
                content += ' '
            elif child.tag in (W + 'br', W + 'cr'):
                content += '<br>'
        for property_name, tag in [('b', 'strong'), ('i', 'em')]:
            prop = run.find(W + 'rPr/' + W + property_name)
            if prop is not None and prop.get(W + 'val', '1') not in ('0', 'false', 'off'):
                content = f'<{tag}>{content}</{tag}>'
        vertical = val(run, 'rPr/vertAlign')
        if vertical in ('superscript', 'subscript'):
            tag = 'sup' if vertical == 'superscript' else 'sub'
            content = f'<{tag}>{content}</{tag}>'
        result += content
    return result


class TextReader(HTMLParser):
    def __init__(self):
        super().__init__()
        self.parts = []

    def handle_data(self, data):
        self.parts.append(data)


def compact(value):
    return ''.join(value.split())


def convert(filename, label):
    source = ROOT / 'public/protocols' / filename
    with ZipFile(source) as archive:
        body = ET.fromstring(archive.read('word/document.xml')).find(W + 'body')
        for tag in ('drawing', 'pict', 'object', 'hyperlink', 'footnoteReference', 'endnoteReference', 'vMerge', 'gridSpan'):
            assert body.find('.//' + W + tag) is None, f'{filename}: handle {tag} before importing'
        assert not any('/media/' in name or '/embeddings/' in name for name in archive.namelist())
        numbering = ET.fromstring(archive.read('word/numbering.xml'))
        abstracts = {a.get(W + 'abstractNumId'): a for a in numbering.findall(W + 'abstractNum')}
        formats = {}
        starts = {}
        for num in numbering.findall(W + 'num'):
            num_id = num.get(W + 'numId')
            abstract = abstracts[val(num, 'abstractNumId')]
            for level in abstract.findall(W + 'lvl'):
                level_id = int(level.get(W + 'ilvl'))
                formats[num_id, level_id] = val(level, 'numFmt')
                start = int(val(level, 'start', '1'))
                override = num.find(f'{W}lvlOverride[@{W}ilvl="{level_id}"]')
                starts[num_id, level_id] = int(val(override, 'startOverride', str(start))) if override is not None else start

        sections = []
        chunks = []
        stack = []
        counts = {}

        def close_lists(level=-1):
            while stack and stack[-1][1] >= level:
                _, _, tag = stack.pop()
                chunks.append(f'</li></{tag}>')

        def finish():
            close_lists()
            if sections:
                sections[-1]['html'] = '\n'.join(chunks)
            chunks.clear()

        for element in body:
            if element.tag == W + 'tbl':
                close_lists()
                rows = element.findall(W + 'tr')
                chunks.append('<div class="research-table-scroll" role="region" aria-label="Protocol table" tabindex="0"><table>')
                for index, row in enumerate(rows):
                    chunks.append('<thead>' if index == 0 else '<tbody>' if index == 1 else '')
                    chunks.append('<tr>')
                    for cell in row.findall(W + 'tc'):
                        tag = 'th scope="col"' if index == 0 else 'td'
                        content = '<br>'.join(inline(p) for p in cell.findall(W + 'p'))
                        chunks.append(f'<{tag}>{content}</{tag.split()[0]}>')
                    chunks.append('</tr>')
                    if index == 0:
                        chunks.append('</thead>')
                if len(rows) > 1:
                    chunks.append('</tbody>')
                chunks.append('</table></div>')
                continue
            if element.tag != W + 'p' or not text(element).strip():
                continue
            value = text(element).strip()
            style = val(element, 'pPr/pStyle')
            if style == '2' and not value.startswith('Protocol'):
                finish()
                sections.append({'title': value, 'html': ''})
                continue
            assert sections, f'Content before first heading in {filename}'
            num_id = val(element, 'pPr/numPr/numId')
            if num_id:
                level = int(val(element, 'pPr/numPr/ilvl', '0'))
                key = (num_id, level)
                for child_key in list(counts):
                    if child_key[0] == num_id and child_key[1] > level:
                        del counts[child_key]
                counts[key] = counts.get(key, starts[key] - 1) + 1
                if stack and (stack[-1][1] > level or (stack[-1][1] == level and stack[-1][0] != num_id)):
                    close_lists(level)
                if stack and stack[-1][:2] == key:
                    chunks.append('</li><li>')
                else:
                    fmt = formats[key]
                    assert fmt in ('bullet', 'decimal', 'lowerLetter'), fmt
                    tag = 'ul' if fmt == 'bullet' else 'ol'
                    attributes = '' if tag == 'ul' else f' start="{counts[key]}"' + (' type="a"' if fmt == 'lowerLetter' else '')
                    chunks.append(f'<{tag}{attributes}><li>')
                    stack.append((num_id, level, tag))
                chunks.append(inline(element))
            else:
                close_lists()
                tag = 'h3' if style == '2' else 'h4' if style == '4' else 'p'
                chunks.append(f'<{tag}>{inline(element)}</{tag}>')
        finish()
        reader = TextReader()
        for section in sections:
            reader.parts.append(section['title'])
            reader.feed(section['html'])
        assert compact(''.join(reader.parts)) == compact(text(body)), f'Text fidelity failed: {filename}'
        return {'label': label, 'file': '/protocols/' + filename,
                'sha256': hashlib.sha256(source.read_bytes()).hexdigest(), 'sections': sections}


documents = [convert('Experiment_CPP2146_EN.docx', 'CPP2146'), convert('Experiment_Team_EN.docx', 'Team experiments')]
output = json.dumps(documents, ensure_ascii=False, indent=2) + '\n'
if '--check' in sys.argv:
    assert TARGET.read_text() == output, 'Regenerate wet-lab-protocols.json'
    print('PASS: both DOCX files match native content, including all table cells and original numbering; no embedded assets omitted.')
else:
    print('*** Begin Patch')
    if TARGET.exists():
        print('*** Delete File: ' + str(TARGET))
    print('*** Add File: ' + str(TARGET))
    print('\n'.join('+' + line for line in output.splitlines()))
    print('*** End Patch')
