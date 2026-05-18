#!/usr/bin/env python3
"""FORGIA Ω — OpenCV Vectorization Sidecar
Converts raster images to SVG paths using OpenCV edge detection and contour approximation.

Usage:
    python opencv_vectorize.py vectorize <input_path> <output_dir>
    python opencv_vectorize.py check
"""

import sys
import os
import json
import math
from pathlib import Path

def check_dependencies():
    """Check if OpenCV and required packages are available."""
    try:
        import cv2
        import numpy as np
        return {"ok": True, "opencv_version": cv2.__version__}
    except ImportError as e:
        return {"ok": False, "error": str(e)}

def contours_to_svg(contours, width, height, epsilon_factor=0.005):
    """Convert OpenCV contours to SVG path strings."""
    paths = []
    for cnt in contours:
        if len(cnt) < 3:
            continue
        # Douglas-Peucker approximation
        peri = cv2.arcLength(cnt, True)
        epsilon = epsilon_factor * peri
        approx = cv2.approxPolyDP(cnt, epsilon, True)
        if len(approx) < 3:
            continue
        # Build SVG path d
        d = "M "
        for i, pt in enumerate(approx):
            x, y = float(pt[0][0]), float(pt[0][1])
            if i == 0:
                d += f"{x:.2f} {y:.2f} "
            else:
                d += f"L {x:.2f} {y:.2f} "
        d += "Z"
        paths.append(d)
    return paths

def vectorize_image(input_path: str, output_dir: str):
    """Vectorize a raster image to SVG using OpenCV."""
    import cv2
    import numpy as np

    input_path = Path(input_path)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    # Load image
    img = cv2.imread(str(input_path), cv2.IMREAD_UNCHANGED)
    if img is None:
        raise ValueError(f"Could not load image: {input_path}")

    h, w = img.shape[:2]

    # Convert to grayscale if needed
    if len(img.shape) == 3:
        if img.shape[2] == 4:
            # RGBA: use alpha as mask, then grayscale
            alpha = img[:, :, 3]
            gray = cv2.cvtColor(img[:, :, :3], cv2.COLOR_BGR2GRAY)
            gray = cv2.bitwise_and(gray, gray, mask=(alpha > 128).astype(np.uint8) * 255)
        else:
            gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)
    else:
        gray = img

    # Adaptive threshold for edge detection
    blurred = cv2.GaussianBlur(gray, (5, 5), 0)
    edges = cv2.Canny(blurred, 50, 150)

    # Dilate to close gaps
    kernel = np.ones((3, 3), np.uint8)
    edges = cv2.dilate(edges, kernel, iterations=1)
    edges = cv2.erode(edges, kernel, iterations=1)

    # Find contours
    contours, hierarchy = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)

    # Filter small contours
    min_area = (w * h) * 0.0005  # 0.05% of image area
    filtered = [cnt for cnt in contours if cv2.contourArea(cnt) > min_area]

    # Generate SVG paths
    paths = contours_to_svg(filtered, w, h)

    # Build SVG document
    svg_content = f'''<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="{w}" height="{h}" viewBox="0 0 {w} {h}">
  <rect width="100%" height="100%" fill="#0a0a0b"/>
  <g stroke="#c8963e" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
'''
    for d in paths:
        svg_content += f'    <path d="{d}" />\n'
    svg_content += '  </g>\n</svg>'

    # Save SVG
    out_name = input_path.stem + "_vectorized.svg"
    out_path = output_dir / out_name
    with open(out_path, "w", encoding="utf-8") as f:
        f.write(svg_content)

    # Also save edge preview PNG
    preview_name = input_path.stem + "_edges.png"
    preview_path = output_dir / preview_name
    cv2.imwrite(str(preview_path), edges)

    # Compute complexity metrics
    total_points = sum(len(p) for p in paths)
    avg_points = total_points / len(paths) if paths else 0

    return {
        "status": "success",
        "input": str(input_path),
        "svg_path": str(out_path),
        "edge_preview": str(preview_path),
        "image_size": {"width": w, "height": h},
        "contours_found": len(contours),
        "contours_kept": len(filtered),
        "svg_paths": len(paths),
        "total_path_points": total_points,
        "avg_points_per_path": round(avg_points, 1),
        "svg_content": svg_content,
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

    elif cmd == "vectorize":
        if len(sys.argv) < 4:
            print(json.dumps({"error": "Usage: vectorize <input_path> <output_dir>"}), flush=True)
            sys.exit(1)
        try:
            result = vectorize_image(sys.argv[2], sys.argv[3])
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
