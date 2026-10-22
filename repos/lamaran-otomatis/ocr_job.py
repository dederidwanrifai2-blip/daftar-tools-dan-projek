
import json
import re
import sys
from pathlib import Path

import pytesseract
from PIL import Image, ImageOps

pytesseract.pytesseract.tesseract_cmd = (
    r"C:\Program Files\Tesseract-OCR\tesseract.exe"
)

KEYWORDS = [
    r"\bSMA\b",
    r"\bSMU\b",
    r"\bSMK\b",
    r"\bSLTA\b",
    r"\bMA\b",
    r"\bMAK\b",
    r"\bSMALB\b",
    r"\bSMLB\b",
    r"\bPaket\s+C\b",
    r"\bMadrasah\s+Aliyah\b",
    r"\bSekolah\s+Menengah\s+(?:Atas|Kejuruan)\b",
]

OUTPUT_DIR = Path(r"C:\Users\Hype\tools\lamar otomatis\json")
OUTPUT_DIR.mkdir(parents=True, exist_ok=True)


def main():
    if len(sys.argv) < 2:
        raise ValueError("Masukkan path foto sebagai argumen.")

    image_path = Path(sys.argv[1]).resolve()

    # Setiap foto mempunyai file hasil sendiri.
    output_file = OUTPUT_DIR / f"ocr_result_{image_path.stem}.json"

    try:
        if not image_path.is_file():
            raise FileNotFoundError(
                f"Foto tidak ditemukan: {image_path}"
            )

        with Image.open(image_path) as image:
            image = ImageOps.exif_transpose(image).convert("RGB")
            text = pytesseract.image_to_string(
                image, lang="ind+eng"
            )

        matched = [
            keyword
            for keyword in KEYWORDS
            if re.search(keyword, text, re.IGNORECASE)
        ]

        result = {
            "status": "success",
            "image": str(image_path),
            "text": text,
            "is_sma_smk": bool(matched),
            "matched_keywords": matched,
            "ocr_empty": not bool(text.strip()),
        }

        output_file.write_text(
            json.dumps(result, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

        print(f"Hasil OCR disimpan: {output_file}")

    except Exception as error:
        error_result = {
            "status": "error",
            "image": str(image_path),
            "message": str(error),
        }

        output_file.write_text(
            json.dumps(error_result, ensure_ascii=False, indent=2),
            encoding="utf-8",
        )

        raise


if __name__ == "__main__":
    main()

