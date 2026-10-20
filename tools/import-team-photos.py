"""Prepare high-quality web copies: python tools/import-team-photos.py <photo-root>.

The team approved cropped web copies to meet the official 10 MB upload limit.
Originals are never changed. Files with _1 take priority for duplicates.
"""
import json
import hashlib
import shutil
import sys
from pathlib import Path
from PIL import Image, ImageOps

ROOT = Path(__file__).resolve().parents[1]
PHOTOS = Path(sys.argv[1])
ONLY = set(sys.argv[2:])  # Optional member slugs for a selective update.
manifest_path = ROOT / 'docs' / 'team-photo-sources.json'
previous = {row['source']: row for row in json.loads(manifest_path.read_text(encoding='utf-8'))} if manifest_path.exists() else {}
DEST = ROOT / 'public' / 'figures' / 'team'
DEST.mkdir(parents=True, exist_ok=True)
SOURCES = {
    '23单人照': {
        '陈林金涛.JPG': 'linjintao-chen',
        '毛竺田_1.png': 'zhutian-mao',
        '米永远.JPG': 'yongyuan-mi',
        '汪洪逸.jpg': 'hongyi-wang',
        '韦凯婷.png': 'kaiting-wei',
        '熊鑫_1.jpeg': 'xin-xiong',
        '杨馥榕.JPG': 'furong-yang',
        '赵清影.jpg': 'qingying-zhao',
        '周天宇_1.png': 'tianyu-zhou',
    },
    '24单人照': {
        '陈嘉轩_1.png': 'jiaxuan-chen',
        '代恒宇_1.jpg': 'hengyu-dai',
        '戴奕含_1.png': 'yihan-dai',
        '高煜恒.JPG': 'yuheng-gao',
        '葛治言.JPG': 'zhiyan-ge',
        '梁恒玮.JPG': 'hengwei-liang',
        '刘珂宇.JPG': 'keyu-liu',
        '逯宇扬.JPG': 'yuyang-lu',
        '彭昱嘉.jpeg': 'yujia-peng',
        '汪依诺.JPG': 'yinuo-wang',
        '王昊_1.png': 'hao-wang',
        '王建烨.JPG': 'jianye-wang',
        '王昕语_1.jpg': 'xinyu-wang',
        '王子奇_1.JPG': 'ziqi-wang',
        '吴雨森.JPG': 'yusen-wu',
        '杨彦萍.JPG': 'yanping-yang',
        '周紫杨_1.jpg': 'ziyang-zhou',
    },
}
# (top, height) within the initial centred 4:5 frame. These review choices
# align heads and shoulders while keeping faces clear of the frame edges.
FRAMING = {
    'furong-yang': (.13, .78), 'hengwei-liang': (.23, .72),
    'hengyu-dai': (.21, .74), 'hongyi-wang': (.10, .86),
    'jianye-wang': (.24, .71), 'kaiting-wei': (.28, .68),
    'keyu-liu': (.14, .80), 'linjintao-chen': (.15, .80),
    'qingying-zhao': (.25, .71), 'xinyu-wang': (.27, .69),
    'yanping-yang': (.31, .65), 'yihan-dai': (.32, .64),
    'yinuo-wang': (.29, .67), 'yuheng-gao': (.26, .70),
    'yujia-peng': (.32, .64), 'yusen-wu': (.18, .77),
    'yuyang-lu': (.24, .72), 'zhiyan-ge': (.24, .72),
    'ziqi-wang': (.31, .65), 'ziyang-zhou': (.32, .64),
    'hao-wang': (.14, .65),
}
BASE_CENTERING = {'jiaxuan-chen': (.5, .15)}
HORIZONTAL_CENTER = {'hao-wang': .65}
manifest = []
for cohort, files in SOURCES.items():
    for filename, slug in files.items():
        if ONLY and slug not in ONLY:
            continue
        original = PHOTOS / cohort / filename
        target = DEST / (slug + '.webp')
        source_hash = hashlib.sha256(original.read_bytes()).hexdigest()
        with Image.open(original) as image:
            upright = ImageOps.exif_transpose(image).convert('RGB')
            original_size = upright.size
            # Consistent 4:5 portraits. Never upscale a small original.
            base_width = min(upright.width, int(upright.height * 4 / 5)) // 4 * 4
            framed = ImageOps.fit(upright, (base_width, base_width * 5 // 4), Image.Resampling.LANCZOS, centering=BASE_CENTERING.get(slug, (.5, .5)))
            top, fraction = FRAMING.get(slug, (0, 1))
            crop_width = int(framed.width * fraction) // 4 * 4
            crop_height = crop_width * 5 // 4
            left = max(0, min(framed.width - crop_width, int(framed.width * HORIZONTAL_CENTER.get(slug, .5) - crop_width / 2)))
            upper = min(int(framed.height * top), framed.height - crop_height)
            framed = framed.crop((left, upper, left + crop_width, upper + crop_height))
            width = min(1600, framed.width)
            portrait = framed.resize((width, width * 5 // 4), Image.Resampling.LANCZOS)
            portrait.save(target, quality=95, method=6)
        manifest.append({'source': 'figures/team/' + target.name,
                         'original': cohort + '/' + filename,
                         'sourceSha256': source_hash,
                         'sha256': hashlib.sha256(target.read_bytes()).hexdigest(),
                         'bytes': target.stat().st_size,
                         'width': portrait.width, 'height': portrait.height,
                         'originalWidth': original_size[0], 'originalHeight': original_size[1]})
        assert hashlib.sha256(original.read_bytes()).hexdigest() == source_hash
if not ONLY:
    original = PHOTOS / '总合照' / 'DSCF4744.JPG'
    target = DEST / 'scu-china-2026.webp'
    source_hash = hashlib.sha256(original.read_bytes()).hexdigest()
    with Image.open(original) as image:
        group = ImageOps.exif_transpose(image).convert('RGB')
        original_size = group.size
        group.thumbnail((4800, 4800), Image.Resampling.LANCZOS)
        group.save(target, quality=95, method=6)
    assert hashlib.sha256(original.read_bytes()).hexdigest() == source_hash
    manifest.append({'source': 'figures/team/' + target.name,
                     'original': '总合照/DSCF4744.JPG', 'sourceSha256': source_hash,
                     'sha256': hashlib.sha256(target.read_bytes()).hexdigest(),
                     'bytes': target.stat().st_size, 'width': group.width, 'height': group.height,
                     'originalWidth': original_size[0], 'originalHeight': original_size[1]})
for row in manifest:
    old = previous.get(row['source'], {})
    if old.get('sha256') == row['sha256'] and old.get('url'):
        row['url'] = old['url']
    elif ONLY:
        # Use a new name on the official CDN to avoid its 24-hour cache.
        path = ROOT / 'public' / row['source']
        upload = path.with_name(path.stem + '-' + row['sha256'][:12] + path.suffix)
        shutil.copyfile(path, upload)
        row['uploadFile'] = upload.relative_to(ROOT / 'public').as_posix()
    previous[row['source']] = row
updated_count = len(manifest)
manifest = list(previous.values()) if ONLY else manifest
assert max(item['bytes'] for item in manifest) < 10 * 1024 * 1024
manifest_path.write_text(json.dumps(manifest, ensure_ascii=False, indent=2) + '\n', encoding='utf-8')
print(json.dumps({'updatedPhotos': updated_count, 'totalPhotos': len(manifest),
                  'totalMiB': round(sum(item['bytes'] for item in manifest) / 2**20, 2)}))
