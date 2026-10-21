"""Import the supplied Integrated Human Practices ZIP archives.

The source documents keep their authored order.  Their long internal structure
is grouped into collapsible chapters so the article contents panel exposes only
the three project-level chapters requested by the team.
"""

from __future__ import annotations

import hashlib
import importlib.util
import json
from pathlib import Path
import re
import tempfile
from typing import Any
from zipfile import ZipFile


ROOT = Path(__file__).resolve().parent.parent
INBOX = ROOT / "需完成推送—完成后移出这个文件夹"
OUTPUT = ROOT / "src/content/integrated-human-practices.generated.json"
PROVENANCE = ROOT / "docs/ihp-content-sources.json"
ASSET_DIR = ROOT / "public/figures/hp/ihp"

BACKGROUND_ZIP = INBOX / "IHP-背景调查-2026HP.zip"
IMPROVEMENT_ZIP = INBOX / "IHP-项目改进.zip"


def load_document_importer():
    source = ROOT / "tools/import-lab-documents.py"
    spec = importlib.util.spec_from_file_location("lab_document_importer", source)
    assert spec and spec.loader
    module = importlib.util.module_from_spec(spec)
    spec.loader.exec_module(module)
    return module.DocumentImporter


DocumentImporter = load_document_importer()


def sha256(path: Path) -> str:
    return hashlib.sha256(path.read_bytes()).hexdigest()


def english_docx(archive_path: Path, temp_dir: Path) -> tuple[Path, str]:
    with ZipFile(archive_path) as archive:
        documents = [item for item in archive.infolist() if item.filename.lower().endswith(".docx") and not item.is_dir()]
        assert documents, f"No DOCX found in {archive_path.name}"
        # The complete English deliverable is the largest DOCX in both supplied archives.
        member = max(documents, key=lambda item: item.file_size)
        destination = temp_dir / f"{archive_path.stem}-english.docx"
        destination.write_bytes(archive.read(member))
        return destination, member.filename


TEXT_FIXES = {
    "Water Chestnut vs. D. salina": "Duckweed vs. D. salina",
    "Water Chestnut": "Duckweed",
    "Chlamydomonas-based platform": "D. salina-based platform",
    "D. salina over D. salinais": "D. salina over H. pluvialis is",
    "Dunia species": "D. salina",
    "D. salinacan": "D. salina can",
    "ASXAN BIOTECH GROUP (ABG)nology": "ASXAN BIOTECH GROUP (ABG)",
    "safranal": "crocetin",
    "Safranal": "Crocetin",
    "safronic acid": "crocetin",
    "Safronic acid": "Crocetin",
    "safrenic acid": "crocetin",
    "Safrenic acid": "Crocetin",
    "crocin acid": "crocetin",
    "Crocin acid": "Crocetin",
}


def repair_text(text: str) -> str:
    for source, replacement in TEXT_FIXES.items():
        text = text.replace(source, replacement)
    text = re.sub(r"\bE\.coli\b", "E. coli", text)
    text = re.sub(r"\bMr\.(?=[A-Z])", "Mr. ", text)
    text = re.sub(r"\bMs\.(?=[A-Z])", "Ms. ", text)
    return text


def repair_item(item: dict[str, Any]) -> dict[str, Any]:
    if item["type"] == "paragraph":
        item["text"] = repair_text(str(item["text"]))
        for run in item["runs"]:
            run["text"] = repair_text(str(run["text"]))
    return item


def paragraph_block(item: dict[str, Any]) -> dict[str, Any]:
    return {"kind": "document-paragraph", "runs": item["runs"]}


def content_blocks(items: list[dict[str, Any]], headings: set[str]) -> list[dict[str, Any]]:
    blocks: list[dict[str, Any]] = []
    pending_list: list[list[dict[str, Any]]] = []

    def flush_list() -> None:
        if pending_list:
            blocks.append({"kind": "document-list", "items": list(pending_list)})
            pending_list.clear()

    for item in items:
        if item["type"] == "block":
            flush_list()
            blocks.append(item["block"])
            continue
        text = str(item["text"]).strip()
        if not text:
            continue
        if str(item.get("style", "")) == "af0" or text.startswith(("•", "▪", "◦")):
            runs = item["runs"]
            if runs:
                runs[0]["text"] = re.sub(r"^[•▪◦]\s*", "", str(runs[0]["text"]))
            pending_list.append(runs)
            continue
        flush_list()
        if text in headings:
            blocks.append({"kind": "document-heading", "text": text, "runs": item["runs"]})
        else:
            blocks.append(paragraph_block(item))
    flush_list()
    return blocks


def figure_paths(block: dict[str, Any]) -> list[str]:
    if block.get("kind") == "figure":
        return [str(block["src"])]
    if block.get("kind") == "figure-grid":
        return [str(figure["src"]) for figure in block["figures"]]
    if block.get("kind") == "details":
        return [path for child in block["blocks"] for path in figure_paths(child)]
    return []


def set_figure_caption(block: dict[str, Any], caption: str) -> None:
    if block.get("kind") == "figure":
        if not block.get("caption"):
            block["caption"] = caption
            block["alt"] = caption
    elif block.get("kind") == "figure-grid" and not block.get("caption"):
        block["caption"] = caption
        for index, figure in enumerate(block["figures"], start=1):
            figure["alt"] = f"{caption}, panel {index}"


BACKGROUND_HEADINGS = {
    "Inspiration",
    "Common Production Methods for High-Value Terpenoids and Their Comparison",
    "Current Status and Challenges of Algal Production of Terpenoids and Other Food Ingredients",
    "Common Challenges",
    "Region-Specific Challenges in Southwestern China",
    "Climate-related challenges",
    "Topographical and hydrological challenges",
    "Brief Comparison of Market Prospects and Policy Requirements for High-Value Terpenoids in China and Abroad",
    "Comparison of Market Prospects",
    "Comparison of Policy Requirements",
    "Applicability of Chinese, European, and U.S. Regulations to This Project",
    "China",
    "European Union",
    "United States",
    "Summary",
}


PROJECT_HEADINGS = {
    "Formulation of scientific questions",
    "How scientific questions emerge",
    "Team Formation (November–December 2025)",
    "Winter Break Training & Brainstorming Session (January–February 2026)",
    "Duckweed vs. D. salina: Daily Training (March–June 2026)",
    "Formal Research Project (from July 2026 to present)",
    "Iterative Record",
    "March 2026-First Improvement",
    "June 2026-Second Iteration",
    "From July 2026 to present – Third iteration",
    "Mid-August — Exchange with iGEM Ambassador Mr. Zhang Xiaohan",
    "Late August — Exchange with Professor Ji Xiaojun and his research team",
    "Late August — Exchange with Professor Qin Jiu-fu of Sichuan University",
    "Local circumstances",
    "The first challenge—land in the basin, but no sunlight.",
    "The second dilemma—land with light, but no level ground.",
    "Early September 2026 — communication with ASXAN BIOTECH GROUP (ABG)",
    "Early October 2026 — Exchange with the Chengdu Municipal Administration for Market Regulation",
    "Risk Register and Risk Classification",
    "Key biosafety risks",
    "Biosafety Prevention Strategies",
    "Sustainable Development Goals (SDGs)",
    "Detailed breakdown of sub-objectives",
    "SDG Tension Analysis",
    "Ethics and Social Implications",
    "Existing Issues and Reflections",
    "Technical aspects",
    "HP and the Social Dimension",
    "Education and Communication",
    "Identifying the issues:",
    "Perspectives and Recommendations:",
    "Our improvements:",
    "Summary",
}


def import_document(source: Path, prefix: str) -> tuple[list[dict[str, Any]], list[dict[str, Any]]]:
    importer = DocumentImporter(source, prefix, ASSET_DIR)
    try:
        items = [repair_item(item) for item in importer.elements()]
    finally:
        importer.close()
    return items, importer.image_sources


def import_background(items: list[dict[str, Any]]) -> tuple[dict[str, Any], list[dict[str, Any]]]:
    starts = [index for index, item in enumerate(items) if item.get("text") == "Background Research"]
    assert len(starts) >= 2, "Background document structure changed"
    start = starts[-1] + 1
    references_at = next(index for index in range(start, len(items)) if items[index].get("text") == "References")
    content = items[start:references_at]
    for item in content:
        if item.get("text") == "1.5 Summary":
            item["text"] = "Summary"
            item["runs"] = [{"text": "Summary"}]

    references: list[dict[str, Any]] = []
    for item in items[references_at + 1:]:
        if item["type"] != "paragraph":
            continue
        label = str(item["text"])
        match = re.search(r"https?://\S+", label)
        reference: dict[str, Any] = {"label": label}
        if match:
            reference["href"] = match.group(0).rstrip(".,)")
        references.append(reference)

    blocks = content_blocks(content, BACKGROUND_HEADINGS)
    for block in blocks:
        if block.get("kind") == "table":
            block["caption"] = "Table 1 Comparison of high-value terpenoid production routes"

    return {
        "title": "Background Research",
        "body": "We began by asking why a new photosynthetic chassis is needed, then compared production routes, regional constraints, markets and regulatory pathways before defining DunaTerp's role.",
        "blocks": blocks,
    }, references


def import_improvement(items: list[dict[str, Any]]) -> dict[str, Any]:
    start = next(index for index, item in enumerate(items) if item.get("text") == "“The scientist is not a person who gives the right answers, he’s one who asks the right questions.”")
    boundaries = [
        ("Preliminary Project Design and Three Iterations", start, "Project refinement"),
        ("Project Refinement", "Project refinement", "Project Implementation"),
        ("Project Implementation", "Project Implementation", "biological safety"),
        ("Biosafety", "biological safety", "Understanding and Reflection"),
        ("Understanding and Reflection", "Understanding and Reflection", "self-examination"),
        ("Self-examination and Future Plan", "self-examination", None),
    ]
    text_positions = {
        str(item.get("text")): index
        for index, item in enumerate(items)
        if item["type"] == "paragraph"
    }
    details: list[dict[str, Any]] = []
    for summary, begin, end in boundaries:
        begin_index = begin if isinstance(begin, int) else text_positions[begin] + 1
        end_index = len(items) if end is None else text_positions[end]
        details.append({
            "kind": "details",
            "summary": summary,
            "blocks": content_blocks(items[begin_index:end_index], PROJECT_HEADINGS),
        })

    caption_by_path: dict[str, str] = {}
    ordered_captions = [
        "Fig. 1 SCU-China recruitment booth",
        "Fig. 2a Winter training and project brainstorming",
        "Fig. 2b Team members during centralized winter training",
        "Fig. 3 Group meeting on candidate project directions",
        "Project consultation with Professor Zhang Nianhui",
        "Project consultation with Professor Zhang Yang",
        "Project consultation with Professor Wang Hongning",
        "Project consultation with Professor Xu Hui",
        "Project consultation with Professor Cao Yang",
        "Project consultation with Professor Liu Ke",
        "Technical consultation with Professor Xu Hui",
        "Technical consultation with Dr. Song Yao",
        "Technical consultation with Professor Wu Chuanfang",
        "Project refinement with iGEM Ambassador Zhang Xiaohan",
        "Project refinement with Professor Ji Xiaojun and his research team",
        "Project refinement with Professor Qin Jiufu",
        "Fig. 4 Visit to the ASXAN BIOTECH GROUP (ABG) cultivation base",
        "Fig. 5 Symposium with the Chengdu Municipal Administration for Market Regulation",
    ]
    figure_blocks = [
        block
        for detail in details
        for block in detail["blocks"]
        if block.get("kind") in {"figure", "figure-grid"}
    ]
    assert len(figure_blocks) == len(ordered_captions), (len(figure_blocks), len(ordered_captions))
    for block, caption in zip(figure_blocks, ordered_captions):
        set_figure_caption(block, caption)
        for path in figure_paths(block):
            caption_by_path[path] = caption

    table_blocks = [
        block
        for detail in details
        for block in detail["blocks"]
        if block.get("kind") == "table"
    ]
    table_captions = [
        "Table 2 Biosafety risk register and classification",
        "Table 3 Tensions and trade-offs across the Sustainable Development Goals",
    ]
    assert len(table_blocks) == len(table_captions), (len(table_blocks), len(table_captions))
    for block, caption in zip(table_blocks, table_captions):
        block["caption"] = caption

    return {
        "title": "Project Improvement",
        "body": "Stakeholder feedback was used as design input. Each round identifies a concrete problem, records the recommendation, and shows how that recommendation changed the project.",
        "blocks": details,
    }


def used_paths(value: Any) -> set[str]:
    if isinstance(value, dict):
        paths = {str(value["src"])} if isinstance(value.get("src"), str) and str(value["src"]).startswith("/figures/") else set()
        return paths | set().union(*(used_paths(child) for child in value.values()), set())
    if isinstance(value, list):
        return set().union(*(used_paths(child) for child in value), set())
    return set()


def update_asset_maps(paths: list[str]) -> None:
    local_target = ROOT / "src/content/local-assets.json"
    local_mapping = json.loads(local_target.read_text(encoding="utf-8"))
    deploy_target = ROOT / "src/content/deploy-assets.json"
    deploy_mapping = json.loads(deploy_target.read_text(encoding="utf-8"))
    for asset in paths:
        relative = asset.lstrip("/")
        local_mapping[relative] = relative
        # Keep a verified CDN URL when the importer is rerun after publication.
        deploy_mapping.setdefault(relative, relative)
    local_target.write_text(json.dumps(local_mapping, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    deploy_target.write_text(json.dumps(deploy_mapping, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")


def main() -> None:
    for source in (BACKGROUND_ZIP, IMPROVEMENT_ZIP):
        assert source.exists(), f"Missing source: {source}"
    ASSET_DIR.mkdir(parents=True, exist_ok=True)
    for stale in ASSET_DIR.glob("ihp-*.webp"):
        stale.unlink()

    with tempfile.TemporaryDirectory(prefix="dunaterp-ihp-") as temp:
        temp_dir = Path(temp)
        background_docx, background_member = english_docx(BACKGROUND_ZIP, temp_dir)
        improvement_docx, improvement_member = english_docx(IMPROVEMENT_ZIP, temp_dir)
        background_items, background_assets = import_document(background_docx, "ihp-background")
        improvement_items, improvement_assets = import_document(improvement_docx, "ihp-improvement")

    background, references = import_background(background_items)
    improvement = import_improvement(improvement_items)
    output = {"background": background, "improvement": improvement, "references": references}
    used = used_paths(output)
    all_assets = background_assets + improvement_assets
    retained_assets = [asset for asset in all_assets if asset["output"] in used]
    discarded_assets = [asset for asset in all_assets if asset["output"] not in used]
    for asset in discarded_assets:
        target = ROOT / "public" / str(asset["output"]).lstrip("/")
        if target.exists():
            target.unlink()

    OUTPUT.write_text(json.dumps(output, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    update_asset_maps(sorted(used))
    PROVENANCE.write_text(json.dumps({
        "sources": [
            {"archive": BACKGROUND_ZIP.name, "member": background_member, "sha256": sha256(BACKGROUND_ZIP), "bytes": BACKGROUND_ZIP.stat().st_size},
            {"archive": IMPROVEMENT_ZIP.name, "member": improvement_member, "sha256": sha256(IMPROVEMENT_ZIP), "bytes": IMPROVEMENT_ZIP.stat().st_size},
        ],
        "generatedAssets": retained_assets,
        "discardedFormatReferenceImages": len(discarded_assets),
        "pageSections": ["Background Research", "Stakeholder Analysis", "Project Improvement"],
    }, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(json.dumps({
        "backgroundBlocks": len(background["blocks"]),
        "improvementChapters": len(improvement["blocks"]),
        "references": len(references),
        "figures": len(retained_assets),
        "discardedFormatReferences": len(discarded_assets),
    }, indent=2))


if __name__ == "__main__":
    main()
