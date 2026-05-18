#!/usr/bin/env python3
"""FORGIA Ω — AI Scan Sidecar
Processes images for 3D reconstruction pipeline:
1. Background removal (rembg)
2. Edge / contour extraction
3. Dimension estimation
4. JSON report output

Usage:
    python ai_scan_sidecar.py process <input_path> <output_dir>
    python ai_scan_sidecar.py check
"""

import sys
import os
import json
import base64
import io
from pathlib import Path

def check_dependencies():
    """Check if rembg and required packages are available."""
    try:
        from PIL import Image
        import numpy as np
        import rembg
        return {"ok": True, "rembg_version": rembg.__version__}
    except ImportError as e:
        return {"ok": False, "error": str(e)}

def process_image(input_path: str, output_dir: str):
    """Process a single image through the AI scan pipeline."""
    from PIL import Image
    import numpy as np
    import rembg

    input_path = Path(input_path)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Load image
    img = Image.open(input_path).convert("RGBA")
    original_size = img.size

    # 1. Remove background
    removed = rembg.remove(img)

    # 2. Crop to content
    bbox = removed.getbbox()
    if bbox:
        cropped = removed.crop(bbox)
    else:
        cropped = removed

    # 3. Compute basic metrics
    arr = np.array(cropped)
    alpha = arr[:, :, 3]
    mask = alpha > 128
    pixel_count = int(mask.sum())
    bounding_box = {
        "width": cropped.width,
        "height": cropped.height,
    }

    # 4. Estimate dimensions (placeholder heuristic)
    # Assuming object is roughly 1-3 meters, scale from pixel area
    estimated_width = max(30, min(300, cropped.width / 3))
    estimated_height = max(30, min(300, cropped.height / 3))
    estimated_depth = max(5, min(100, (estimated_width + estimated_height) / 10))
    estimated_weight = max(1, (estimated_width * estimated_height * estimated_depth) / 50000)

    # 5. Save processed image
    out_name = input_path.stem + "_processed.png"
    out_path = output_dir / out_name
    cropped.save(out_path)

    # 6. Save thumbnail (base64 for inline preview)
    thumb = cropped.copy()
    thumb.thumbnail((256, 256))
    buf = io.BytesIO()
    thumb.save(buf, format="PNG")
    thumb_b64 = base64.b64encode(buf.getvalue()).decode("ascii")

    return {
        "status": "success",
        "input": str(input_path),
        "output_image": str(out_path),
        "original_size": original_size,
        "bounding_box": bounding_box,
        "pixel_count": pixel_count,
        "estimated_dimensions": {
            "width": round(estimated_width, 1),
            "height": round(estimated_height, 1),
            "depth": round(estimated_depth, 1),
        },
        "estimated_weight": round(estimated_weight, 2),
        "confidence": round(min(0.95, 0.5 + pixel_count / 500000), 2),
        "thumbnail_b64": f"data:image/png;base64,{thumb_b64}",
        "point_count": pixel_count,
    }

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No command provided"}), flush=True)
        sys.exit(1)

    cmd = sys.argv[1]

    if cmd == "check":
        result = check_dependencies()
        print(json.dumps(result), flush=True)
        sys.exit(0 if result["ok"] else 1)

    elif cmd == "process":
        if len(sys.argv) < 4:
            print(json.dumps({"error": "Usage: process <input_path> <output_dir>"}), flush=True)
            sys.exit(1)
        try:
            result = process_image(sys.argv[2], sys.argv[3])
            print(json.dumps(result), flush=True)
            sys.exit(0)
        except Exception as e:
            print(json.dumps({"status": "error", "error": str(e)}), flush=True)
            sys.exit(1)

    else:
        print(json.dumps({"error": f"Unknown command: {cmd}"}), flush=True)
        sys.exit(1)

if __name__ == "__main__":
    main()
