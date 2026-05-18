#!/usr/bin/env python3
"""FORGIA Ω — Claude Vision / Structural Analysis Sidecar
Analyses metalwork images for structural elements using Claude Vision API
when available, or OpenCV-based structural analysis as fallback.

Usage:
    python claude_vision.py analyse <input_path>
    python claude_vision.py analyse_b64 <base64_image>
    python claude_vision.py check
"""

import sys
import os
import json
import base64
import math
from pathlib import Path

CLAUDE_API_URL = "https://api.anthropic.com/v1/messages"
CLAUDE_MODEL = "claude-3-5-sonnet-20241022"

def check_dependencies():
    """Check if dependencies are available and if API key is set."""
    try:
        import cv2
        import numpy as np
        has_opencv = True
    except ImportError:
        has_opencv = False

    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    return {
        "ok": has_opencv,
        "has_opencv": has_opencv,
        "has_api_key": bool(api_key),
        "opencv_version": cv2.__version__ if has_opencv else None,
    }

def call_claude_vision(image_b64: str, media_type: str = "image/png"):
    """Call Claude Vision API for structural analysis."""
    import requests

    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        raise RuntimeError("ANTHROPIC_API_KEY not set")

    headers = {
        "x-api-key": api_key,
        "anthropic-version": "2023-06-01",
        "content-type": "application/json",
    }

    prompt = (
        "Analizza questa immagine di un manufatto in ferro battuto o acciaio. "
        "Identifica: tipo di struttura (griglia, pannello, cancello, ringhiera, porta, finestra, decorazione, etc.), "
        "elementi principali (barre verticali, barre orizzontali, giunti, saldature, decorazioni, riccioli, etc.), "
        "pattern geometrico predominante, grado di simmetria, e stima delle dimensioni in cm. "
        "Fornisci anche raccomandazioni per la fabbricazione (materiali suggeriti, passi di lavorazione, attrezzature). "
        "Rispondi SOLO in JSON con questi campi esatti: "
        "tipo_struttura (string), elementi_identificati (array di stringhe), "
        "pattern_geometrico (string), simmetria (string: alta/media/bassa), "
        "dimensioni_stimate {larghezza (number), altezza (number), profondita (number)}, "
        "raccomandazioni_fabbricazione (array di stringhe), confidence (number 0-1)."
    )

    payload = {
        "model": CLAUDE_MODEL,
        "max_tokens": 2048,
        "messages": [
            {
                "role": "user",
                "content": [
                    {
                        "type": "image",
                        "source": {
                            "type": "base64",
                            "media_type": media_type,
                            "data": image_b64,
                        },
                    },
                    {"type": "text", "text": prompt},
                ],
            }
        ],
    }

    resp = requests.post(CLAUDE_API_URL, headers=headers, json=payload, timeout=60)
    resp.raise_for_status()
    data = resp.json()

    content = data.get("content", [])
    text_parts = [c["text"] for c in content if c.get("type") == "text"]
    raw_text = "\n".join(text_parts)

    # Try to extract JSON from response
    raw_text = raw_text.strip()
    if raw_text.startswith("```json"):
        raw_text = raw_text[7:]
    if raw_text.startswith("```"):
        raw_text = raw_text[3:]
    if raw_text.endswith("```"):
        raw_text = raw_text[:-3]
    raw_text = raw_text.strip()

    analysis = json.loads(raw_text)
    analysis["source"] = "claude_vision"
    analysis["raw_response"] = raw_text[:500]
    return analysis

def opencv_structural_analysis(img_path: str):
    """Fallback structural analysis using OpenCV."""
    import cv2
    import numpy as np

    img = cv2.imread(img_path)
    if img is None:
        raise ValueError(f"Could not load image: {img_path}")

    h, w = img.shape[:2]
    gray = cv2.cvtColor(img, cv2.COLOR_BGR2GRAY)

    # Edge detection
    edges = cv2.Canny(gray, 50, 150)
    edge_density = np.count_nonzero(edges) / (h * w)

    # Hough lines
    lines = cv2.HoughLinesP(edges, 1, np.pi / 180, threshold=80, minLineLength=w * 0.15, maxLineGap=10)
    line_count = len(lines) if lines is not None else 0

    # Orientation classification
    vertical_lines = 0
    horizontal_lines = 0
    diagonal_lines = 0
    if lines is not None:
        for l in lines:
            x1, y1, x2, y2 = l[0]
            angle = math.degrees(math.atan2(y2 - y1, x2 - x1))
            angle = abs(angle) % 180
            if angle < 20 or angle > 160:
                horizontal_lines += 1
            elif 70 < angle < 110:
                vertical_lines += 1
            else:
                diagonal_lines += 1

    # Symmetry: compare left/right halves
    half_w = w // 2
    left = gray[:, :half_w]
    right = cv2.flip(gray[:, w - half_w:], 1)
    min_h = min(left.shape[1], right.shape[1])
    left_crop = left[:, :min_h]
    right_crop = right[:, :min_h]
    diff = cv2.absdiff(left_crop, right_crop)
    symmetry_score = 1.0 - (np.mean(diff) / 255.0)

    # Contours for element detection
    contours, _ = cv2.findContours(edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
    contour_count = len([c for c in contours if cv2.contourArea(c) > (h * w) * 0.001])

    # Classify structure type
    if vertical_lines > horizontal_lines * 2 and line_count > 5:
        tipo = "ringhiera / griglia verticale"
    elif horizontal_lines > vertical_lines * 2 and line_count > 5:
        tipo = "pannello / griglia orizzontale"
    elif diagonal_lines > 2:
        tipo = "cancello / struttura diagonale"
    elif edge_density > 0.15 and contour_count > 20:
        tipo = "decorazione / elemento ornamentale"
    elif line_count <= 3 and contour_count < 10:
        tipo = "elemento semplice / staffa"
    else:
        tipo = "pannello misto / struttura combinata"

    # Pattern detection
    if vertical_lines > 0 and horizontal_lines > 0:
        pattern = "griglia rettangolare"
    elif vertical_lines > 0:
        pattern = "barre verticali"
    elif horizontal_lines > 0:
        pattern = "barre orizzontali"
    elif diagonal_lines > 0:
        pattern = "elementi diagonali"
    else:
        pattern = "irregolare / decorativo"

    # Dimensions (heuristic: assume image fills frame, scale by density)
    scale = 1.0 + edge_density * 2
    est_w = round(max(30, min(300, w / 4 * scale)), 1)
    est_h = round(max(30, min(300, h / 4 * scale)), 1)
    est_d = round(max(2, min(20, (est_w + est_h) / 20)), 1)

    simmetria = "alta" if symmetry_score > 0.75 else "media" if symmetry_score > 0.5 else "bassa"

    elementi = []
    if vertical_lines > 0:
        elementi.append(f"{vertical_lines} barre verticali")
    if horizontal_lines > 0:
        elementi.append(f"{horizontal_lines} barre orizzontali")
    if diagonal_lines > 0:
        elementi.append(f"{diagonal_lines} elementi diagonali")
    if contour_count > 5:
        elementi.append(f"{contour_count} dettagli / decorazioni")
    if not elementi:
        elementi.append("elemento unitario")

    raccomandazioni = [
        "Taglio laser / plasma per precisione",
        "Saldatura MIG/TIG per giunti",
        "Trattamento superficiale: sabbiatura + verniciatura",
    ]
    if tipo.startswith("decorazione"):
        raccomandazioni.append("Lavorazione a mano per dettagli ornamentali")
    if line_count > 10:
        raccomandazioni.append("Assemblaggio su tavolo di montaggio")

    return {
        "tipo_struttura": tipo,
        "elementi_identificati": elementi,
        "pattern_geometrico": pattern,
        "simmetria": simmetria,
        "dimensioni_stimate": {
            "larghezza": est_w,
            "altezza": est_h,
            "profondita": est_d,
        },
        "raccomandazioni_fabbricazione": raccomandazioni,
        "confidence": round(min(0.92, 0.5 + edge_density * 2 + symmetry_score * 0.2), 2),
        "source": "opencv_fallback",
        "metrics": {
            "edge_density": round(edge_density, 4),
            "line_count": line_count,
            "vertical_lines": vertical_lines,
            "horizontal_lines": horizontal_lines,
            "diagonal_lines": diagonal_lines,
            "symmetry_score": round(symmetry_score, 3),
            "contour_count": contour_count,
        },
    }

def analyse_image(input_path: str):
    """Run structural analysis on an image."""
    # Try Claude Vision first if API key is available
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if api_key:
        try:
            # Encode image to base64
            with open(input_path, "rb") as f:
                img_bytes = f.read()
            b64 = base64.b64encode(img_bytes).decode("ascii")

            # Detect media type from extension
            ext = Path(input_path).suffix.lower()
            mime = "image/png" if ext == ".png" else "image/jpeg" if ext in (".jpg", ".jpeg") else "image/png"

            result = call_claude_vision(b64, mime)
            result["input"] = input_path
            return result
        except Exception as e:
            # Fall back to OpenCV on Claude error
            fallback = opencv_structural_analysis(input_path)
            fallback["input"] = input_path
            fallback["claude_error"] = str(e)
            fallback["note"] = "Claude Vision failed, using OpenCV fallback"
            return fallback

    # No API key: use OpenCV fallback
    result = opencv_structural_analysis(input_path)
    result["input"] = input_path
    result["note"] = "Claude Vision not configured (no ANTHROPIC_API_KEY), using OpenCV fallback"
    return result

def analyse_b64(image_b64: str, media_type: str = "image/png"):
    """Run structural analysis on a base64-encoded image."""
    api_key = os.environ.get("ANTHROPIC_API_KEY", "")
    if api_key:
        try:
            result = call_claude_vision(image_b64, media_type)
            result["source"] = "claude_vision"
            return result
        except Exception as e:
            # Decode and fallback
            img_data = base64.b64decode(image_b64)
            import tempfile
            tmp_path = tempfile.mktemp(suffix=".png")
            with open(tmp_path, "wb") as f:
                f.write(img_data)
            fallback = opencv_structural_analysis(tmp_path)
            os.remove(tmp_path)
            fallback["claude_error"] = str(e)
            fallback["note"] = "Claude Vision failed, using OpenCV fallback"
            return fallback

    # Decode for OpenCV fallback
    img_data = base64.b64decode(image_b64)
    import tempfile
    tmp_path = tempfile.mktemp(suffix=".png")
    with open(tmp_path, "wb") as f:
        f.write(img_data)
    result = opencv_structural_analysis(tmp_path)
    os.remove(tmp_path)
    result["note"] = "Claude Vision not configured (no ANTHROPIC_API_KEY), using OpenCV fallback"
    return result

def main():
    if len(sys.argv) < 2:
        print(json.dumps({"error": "No command provided"}), flush=True)
        sys.exit(1)

    cmd = sys.argv[1]

    if cmd == "check":
        result = check_dependencies()
        print(json.dumps(result), flush=True)
        sys.exit(0 if result["ok"] else 1)

    elif cmd == "analyse":
        if len(sys.argv) < 3:
            print(json.dumps({"error": "Usage: analyse <input_path>"}), flush=True)
            sys.exit(1)
        try:
            result = analyse_image(sys.argv[2])
            print(json.dumps(result), flush=True)
            sys.exit(0)
        except Exception as e:
            print(json.dumps({"status": "error", "error": str(e)}), flush=True)
            sys.exit(1)

    elif cmd == "analyse_b64":
        if len(sys.argv) < 3:
            print(json.dumps({"error": "Usage: analyse_b64 <base64_image> [media_type]"}), flush=True)
            sys.exit(1)
        try:
            mime = sys.argv[3] if len(sys.argv) > 3 else "image/png"
            result = analyse_b64(sys.argv[2], mime)
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
