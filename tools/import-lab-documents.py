"""Import the supplied Notebook and Engineering DOCX files into native Wiki data.

The weekly notebook remains the readable page narrative. The full day-by-day
record is kept in collapsible entries so none of the supplied evidence is lost.
Engineering documents retain Product -> Cycle -> Design/Build/Test/Learn order.
Embedded figures are converted to browser-friendly WebP files without changing
their dimensions.
"""

from __future__ import annotations

import hashlib
import json
from pathlib import Path, PurePosixPath
import re
import subprocess
import tempfile
import xml.etree.ElementTree as ET
from zipfile import ZipFile


ROOT = Path(__file__).resolve().parent.parent
INBOX = ROOT / "需完成推送—完成后移出这个文件夹"
FIGURE_ROOT = ROOT / "public/figures/wet-lab"
NOTEBOOK_TARGET = ROOT / "src/content/lab-notebook.generated.json"
ENGINEERING_TARGET = ROOT / "src/content/engineering-products.generated.json"
PROVENANCE_TARGET = ROOT / "docs/lab-content-sources.json"

W = "{http://schemas.openxmlformats.org/wordprocessingml/2006/main}"
A = "{http://schemas.openxmlformats.org/drawingml/2006/main}"
R = "{http://schemas.openxmlformats.org/officeDocument/2006/relationships}"
REL = "{http://schemas.openxmlformats.org/package/2006/relationships}"

WEEK_HEADING = re.compile(
    r"^(?:July|August|September)\s+\d{1,2}\s+to\s+(?:August|September)\s+\d{1,2}:|^Resequencing and re-evaluation",
    re.IGNORECASE,
)
DATE_HEADING = re.compile(
    r"^(?:Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday),\s+(?:July|August|September)\s+\d{1,2},\s+2026$",
    re.IGNORECASE,
)
CYCLE_HEADING = re.compile(r"^Cycle\s+[IVX]+$", re.IGNORECASE)
FIGURE_CAPTION = re.compile(r"^(?:Fig\.|Figure)\s*\d+", re.IGNORECASE)
TABLE_CAPTION = re.compile(r"^Table\s*\d+", re.IGNORECASE)


def compact(value: str) -> str:
    return re.sub(r"\s+", " ", value.replace("\u00a0", " ")).strip()


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def value(node: ET.Element | None, path: str, default: str = "") -> str:
    if node is None:
        return default
    child = node.find("/".join(W + part for part in path.split("/")))
    return child.get(W + "val", default) if child is not None else default


def plain_text(node: ET.Element) -> str:
    pieces: list[str] = []
    for child in node.iter():
        if child.tag == W + "t":
            pieces.append(child.text or "")
        elif child.tag in (W + "tab", W + "br", W + "cr"):
            pieces.append(" ")
    return compact("".join(pieces))


def paragraph_runs(node: ET.Element, hyperlinks: dict[str, str]) -> list[dict[str, object]]:
    runs: list[dict[str, object]] = []

    def append(text: str, *, bold: bool = False, italic: bool = False, href: str | None = None) -> None:
        text = re.sub(r"\s+", " ", text.replace("\u00a0", " "))
        if not text:
            return
        item: dict[str, object] = {"text": text}
        if bold:
            item["bold"] = True
        if italic:
            item["italic"] = True
        if href:
            item["href"] = href
        if runs and all(runs[-1].get(key) == item.get(key) for key in ("bold", "italic", "href")):
            runs[-1]["text"] = str(runs[-1]["text"]) + text
        else:
            runs.append(item)

    def visit(container: ET.Element, href: str | None = None) -> None:
        for child in container:
            if child.tag == W + "hyperlink":
                rel_id = child.get(R + "id", "")
                visit(child, hyperlinks.get(rel_id))
            elif child.tag == W + "r":
                props = child.find(W + "rPr")
                bold_node = props.find(W + "b") if props is not None else None
                italic_node = props.find(W + "i") if props is not None else None
                bold = bold_node is not None and bold_node.get(W + "val", "1") not in ("0", "false", "off")
                italic = italic_node is not None and italic_node.get(W + "val", "1") not in ("0", "false", "off")
                parts: list[str] = []
                for run_child in child.iter():
                    if run_child.tag == W + "t":
                        parts.append(run_child.text or "")
                    elif run_child.tag in (W + "tab", W + "br", W + "cr"):
                        parts.append(" ")
                append("".join(parts), bold=bold, italic=italic, href=href)

    visit(node)
    if runs:
        runs[0]["text"] = str(runs[0]["text"]).lstrip()
        runs[-1]["text"] = str(runs[-1]["text"]).rstrip()
    return [run for run in runs if run["text"]]


class DocumentImporter:
    def __init__(self, source: Path, asset_prefix: str, asset_dir: Path, *, loose_figure_captions: bool = False):
        self.source = source
        self.asset_prefix = asset_prefix
        self.asset_dir = asset_dir
        self.asset_dir.mkdir(parents=True, exist_ok=True)
        self.archive = ZipFile(source)
        self.body = ET.fromstring(self.archive.read("word/document.xml")).find(W + "body")
        assert self.body is not None
        relationships = ET.fromstring(self.archive.read("word/_rels/document.xml.rels"))
        self.relationships = {
            relation.get("Id", ""): relation.get("Target", "")
            for relation in relationships.findall(REL + "Relationship")
        }
        self.hyperlinks = {
            rel_id: target
            for rel_id, target in self.relationships.items()
            if target.startswith(("http://", "https://"))
        }
        self.image_number = 0
        self.image_sources: list[dict[str, object]] = []
        self.loose_figure_captions = loose_figure_captions

    def close(self) -> None:
        self.archive.close()

    def images(self, node: ET.Element) -> list[str]:
        paths: list[str] = []
        for blip in node.iter(A + "blip"):
            rel_id = blip.get(R + "embed", "")
            target = self.relationships.get(rel_id)
            assert target, f"{self.source.name}: missing relationship {rel_id}"
            member = str(PurePosixPath("word") / target)
            data = self.archive.read(member)
            self.image_number += 1
            stem = f"{self.asset_prefix}-fig-{self.image_number:02d}"
            destination = self.asset_dir / f"{stem}.webp"
            suffix = PurePosixPath(target).suffix.lower()
            with tempfile.TemporaryDirectory(prefix="igem-docx-image-") as temp_dir:
                original = Path(temp_dir) / f"source{suffix}"
                original.write_bytes(data)
                command = ["cwebp", "-quiet", "-mt"]
                # Small diagrams and gels benefit from lossless edges; large photographs
                # use a high visual quality setting to keep the Wiki responsive.
                if len(data) <= 350_000:
                    command.extend(["-lossless", "-z", "8"])
                else:
                    command.extend(["-q", "88", "-m", "6", "-sharp_yuv"])
                command.extend([str(original), "-o", str(destination)])
                subprocess.run(command, check=True)
            public_path = "/" + destination.relative_to(ROOT / "public").as_posix()
            paths.append(public_path)
            self.image_sources.append({
                "source": member,
                "output": public_path,
                "sourceBytes": len(data),
                "outputBytes": destination.stat().st_size,
                "sha256": sha256(destination),
            })
        return paths

    def table(self, node: ET.Element, caption: str) -> dict[str, object]:
        grid: list[list[str]] = []
        for row in node.findall(W + "tr"):
            cells: list[str] = []
            for cell in row.findall(W + "tc"):
                paragraphs = [plain_text(p) for p in cell.findall(W + "p")]
                cells.append("; ".join(part for part in paragraphs if part))
            if any(cells):
                grid.append(cells)
        assert grid, f"{self.source.name}: empty table"
        width = max(len(row) for row in grid)
        grid = [row + [""] * (width - len(row)) for row in grid]
        columns = grid[0]
        if not any(columns):
            columns = [f"Column {index + 1}" for index in range(width)]
        rows = grid[1:]
        return {
            "kind": "table",
            "caption": caption or "Experimental record table",
            "columns": columns,
            "rows": rows,
            **({"collapsed": True} if len(rows) > 12 else {}),
        }

    def elements(self) -> list[dict[str, object]]:
        result: list[dict[str, object]] = []
        pending_table_caption = ""
        pending_figure_caption = ""
        last_figure: dict[str, object] | None = None

        for node in self.body:
            if node.tag == W + "tbl":
                result.append({"type": "block", "block": self.table(node, pending_table_caption)})
                pending_table_caption = ""
                for image in self.images(node):
                    block = {"kind": "figure", "src": image, "alt": "Experimental record figure", "caption": ""}
                    result.append({"type": "block", "block": block})
                    last_figure = block
                continue
            if node.tag != W + "p":
                continue
            text = plain_text(node)
            image_paths = self.images(node)
            if image_paths:
                if len(image_paths) == 1:
                    block = {
                        "kind": "figure",
                        "src": image_paths[0],
                        "alt": pending_figure_caption or "Experimental record figure",
                        "caption": pending_figure_caption,
                    }
                else:
                    block = {
                        "kind": "figure-grid",
                        "figures": [
                            {"src": image, "alt": pending_figure_caption or f"Experimental record panel {index + 1}", "caption": ""}
                            for index, image in enumerate(image_paths)
                        ],
                        "caption": pending_figure_caption,
                    }
                pending_figure_caption = ""
                result.append({"type": "block", "block": block})
                last_figure = block
                if not text:
                    continue
            if not text:
                continue
            if FIGURE_CAPTION.match(text):
                if last_figure is not None and not last_figure.get("caption"):
                    last_figure["caption"] = text
                    if last_figure["kind"] == "figure":
                        last_figure["alt"] = text
                    else:
                        for index, figure in enumerate(last_figure["figures"]):
                            figure["alt"] = f"{text} Panel {index + 1}"
                    last_figure = None
                else:
                    pending_figure_caption = text
                continue
            if TABLE_CAPTION.match(text):
                pending_table_caption = text
                continue
            if self.loose_figure_captions and last_figure is not None and not DATE_HEADING.match(text):
                last_figure["caption"] = text
                if last_figure["kind"] == "figure":
                    last_figure["alt"] = text
                else:
                    for index, figure in enumerate(last_figure["figures"]):
                        figure["alt"] = f"{text} Panel {index + 1}"
                last_figure = None
                continue
            last_figure = None
            style = value(node, "pPr/pStyle")
            result.append({
                "type": "paragraph",
                "text": text,
                "runs": paragraph_runs(node, self.hyperlinks) or [{"text": text}],
                "style": style,
            })
        assert not pending_table_caption, f"{self.source.name}: unmatched table caption {pending_table_caption}"
        assert not pending_figure_caption, f"{self.source.name}: unmatched figure caption {pending_figure_caption}"
        return result


def paragraph_block(item: dict[str, object]) -> dict[str, object]:
    return {"kind": "document-paragraph", "runs": item["runs"]}


def merge_wrapped_paragraphs(items: list[dict[str, object]]) -> list[dict[str, object]]:
    """Join source paragraphs that are only visual line wraps in the supplied DOCX."""
    merged: list[dict[str, object]] = []
    for item in items:
        previous = merged[-1] if merged else None
        can_join = (
            previous is not None
            and previous["type"] == "paragraph"
            and item["type"] == "paragraph"
            and not re.search(r"[.!?:;]$", str(previous["text"]))
            and not re.match(r"^(?:[•▪◦]|\d+[.)]\s|Purpose:|Objective:|Materials:|Procedure:|Result(?:s)?(?: and Notes)?:)", str(item["text"]))
        )
        if not can_join:
            merged.append(item)
            continue
        previous["text"] = compact(f"{previous['text']} {item['text']}")
        previous_runs = list(previous["runs"])
        current_runs = list(item["runs"])
        if previous_runs and current_runs:
            previous_runs.append({"text": " "})
        previous["runs"] = previous_runs + current_runs
    return merged


def blocks_from(items: list[dict[str, object]], heading_words: set[str] | None = None) -> list[dict[str, object]]:
    blocks: list[dict[str, object]] = []
    heading_words = heading_words or set()
    for item in items:
        if item["type"] == "block":
            blocks.append(item["block"])
        elif str(item["text"]).strip() in heading_words:
            blocks.append({"kind": "heading", "text": item["text"]})
        else:
            blocks.append(paragraph_block(item))
    return blocks


def import_notebook(summary_path: Path, daily_path: Path) -> tuple[dict[str, object], list[dict[str, object]]]:
    summary = DocumentImporter(summary_path, "notebook-summary", FIGURE_ROOT / "notebook")
    daily = DocumentImporter(daily_path, "notebook-daily", FIGURE_ROOT / "notebook", loose_figure_captions=True)
    try:
        summary_items = summary.elements()
        daily_items = daily.elements()
    finally:
        summary.close()
        daily.close()

    summary_sections: list[dict[str, object]] = []
    current_title = "Experimental Overview"
    current_items: list[dict[str, object]] = []
    skipped_titles = {
        "iGEM 2026 Notebook Astaxanthin and Crocetin",
        "Astaxanthin and Crocin Acid Experimental Record",
        "Notebook Astaxanthin and Crocetin",
        "July to September 2026",
    }
    for item in summary_items:
        if item["type"] == "paragraph" and item["text"] in skipped_titles:
            continue
        if item["type"] == "paragraph" and WEEK_HEADING.search(str(item["text"])):
            if current_items:
                summary_sections.append({"title": current_title, "body": "", "blocks": blocks_from(merge_wrapped_paragraphs(current_items))})
            current_title = str(item["text"])
            current_items = []
        else:
            current_items.append(item)
    if current_items:
        summary_sections.append({"title": current_title, "body": "", "blocks": blocks_from(merge_wrapped_paragraphs(current_items))})

    entries: list[dict[str, object]] = []
    current_date = ""
    current_items = []
    for item in daily_items:
        if item["type"] == "paragraph" and DATE_HEADING.match(str(item["text"])):
            if current_date:
                entries.append({"kind": "details", "summary": current_date, "blocks": blocks_from(current_items)})
            current_date = str(item["text"])
            current_items = []
        elif current_date:
            current_items.append(item)
    if current_date:
        entries.append({"kind": "details", "summary": current_date, "blocks": blocks_from(current_items)})
    assert len(entries) >= 30, f"Expected a full daily notebook, found {len(entries)} entries"

    page = {
        "title": "Lab Notebook",
        "eyebrow": "Lab / Notebook",
        "intro": "Our notebook records the construction, screening and validation of the astaxanthin and crocetin modules in Dunaliella salina from July to September 2026. The weekly account presents the experimental logic, while the complete dated record preserves procedures, observations, tables and supporting figures.",
        "status": "review-ready",
        "sections": summary_sections + [{
            "title": "Complete Daily Experimental Record",
            "body": "Open any date to view the corresponding purpose, materials, procedure, result and supporting evidence from the complete laboratory record.",
            "blocks": entries,
        }],
    }
    return page, summary.image_sources + daily.image_sources


def import_engineering(source: Path, slug: str) -> tuple[dict[str, object], list[dict[str, object]]]:
    importer = DocumentImporter(source, f"engineering-{slug}", FIGURE_ROOT / "engineering")
    try:
        items = importer.elements()
    finally:
        importer.close()
    paragraphs = [item for item in items if item["type"] == "paragraph"]
    assert paragraphs, f"{source.name}: no paragraphs"
    title = str(paragraphs[0]["text"])
    title_position = items.index(paragraphs[0])
    intro_item = next(item for item in items[title_position + 1:] if item["type"] == "paragraph")
    intro = str(intro_item["text"])
    content_start = items.index(intro_item) + 1
    cycles: list[dict[str, object]] = []
    current_cycle = ""
    current_items: list[dict[str, object]] = []
    for item in items[content_start:]:
        if item["type"] == "paragraph" and CYCLE_HEADING.match(str(item["text"])):
            if current_cycle:
                cycles.append({
                    "kind": "details",
                    "summary": current_cycle,
                    "open": True,
                    "blocks": blocks_from(current_items, {"Design", "Build", "Test", "Learn"}),
                })
            current_cycle = str(item["text"])
            current_items = []
        elif current_cycle:
            current_items.append(item)
    if current_cycle:
        cycles.append({
            "kind": "details",
            "summary": current_cycle,
            "open": True,
            "blocks": blocks_from(current_items, {"Design", "Build", "Test", "Learn"}),
        })
    assert cycles, f"{source.name}: no engineering cycles"
    return {"title": title, "body": intro, "blocks": cycles}, importer.image_sources


def update_asset_maps(asset_paths: list[str]) -> None:
    for target_name in ("src/content/local-assets.json", "src/content/deploy-assets.json"):
        target = ROOT / target_name
        mapping = json.loads(target.read_text(encoding="utf-8"))
        for asset in asset_paths:
            relative = asset.lstrip("/")
            mapping[relative] = relative
        target.write_text(json.dumps(mapping, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    files = {
        "dailyNotebook": INBOX / "iGEM  2026  Experiment  Notebook.docx",
        "summaryNotebook": INBOX / "iGEM 2026   Notebook   Astaxanthin and Crocetin.docx",
        "citraurinEngineering": INBOX / "iGEM2026_SCU-China_Engineering_β-Citraurin_EN.docx",
        "iononeEngineering": INBOX / "iGEM2026_SCU-China_Engineering_β-Ionone_EN.docx",
    }
    for source in files.values():
        assert source.exists(), f"Missing source: {source}"

    notebook, notebook_assets = import_notebook(files["summaryNotebook"], files["dailyNotebook"])
    citraurin, citraurin_assets = import_engineering(files["citraurinEngineering"], "beta-citraurin")
    ionone, ionone_assets = import_engineering(files["iononeEngineering"], "beta-ionone")
    engineering = [citraurin, ionone]

    NOTEBOOK_TARGET.write_text(json.dumps(notebook, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    ENGINEERING_TARGET.write_text(json.dumps(engineering, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    assets = notebook_assets + citraurin_assets + ionone_assets
    update_asset_maps([str(asset["output"]) for asset in assets])
    PROVENANCE_TARGET.write_text(json.dumps({
        "sources": [
            {"role": role, "file": source.name, "sha256": sha256(source), "bytes": source.stat().st_size}
            for role, source in files.items()
        ],
        "generatedAssets": assets,
        "notebookSections": len(notebook["sections"]),
        "engineeringModules": len(engineering),
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "notebookSections": len(notebook["sections"]),
        "dailyEntries": len(notebook["sections"][-1]["blocks"]),
        "engineeringCycles": [len(module["blocks"]) for module in engineering],
        "figures": len(assets),
        "figureMiB": round(sum(int(asset["outputBytes"]) for asset in assets) / 2**20, 2),
    }, indent=2))


if __name__ == "__main__":
    main()
