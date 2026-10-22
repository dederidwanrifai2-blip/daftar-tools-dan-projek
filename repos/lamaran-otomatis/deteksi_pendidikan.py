
import json
import re
import sys
from pathlib import Path

OUTPUT_DIR = Path(
    r"C:\Users\Hype\tools\lamar otomatis\hasil_klasifikasi"
)

KEYWORDS = [
    ("D1", r"\bD\s*1\b"),
    ("D2", r"\bD\s*2\b"),
    ("D3", r"\bD\s*3\b"),
    ("D4", r"\bD\s*4\b"),
    ("S1", r"\bS\s*(?:1|I)\b"),
    ("S2", r"\bS\s*2\b"),
    ("S3", r"\bS\s*3\b"),
    ("Diploma", r"\bDiploma\b"),
    ("Sarjana", r"\bSarjana\b"),
    ("Magister", r"\bMagister\b"),
    ("Master", r"\bMaster\b"),
    ("Doktor", r"\bDoktor\b"),
    ("Pascasarjana", r"\bPascasarjana\b"),
]


def main():
    if len(sys.argv) < 2:
        raise ValueError("Path JSON OCR harus diberikan.")

    input_file = Path(sys.argv[1])

    if not input_file.is_file():
        raise FileNotFoundError(
            f"JSON OCR tidak ditemukan: {input_file}"
        )

    data = json.loads(
        input_file.read_text(encoding="utf-8-sig")
    )

    if data.get("status") != "success":
        raise ValueError(
            f"OCR tidak berstatus success: {input_file.name}"
        )

    text = data.get("text", "")
    if not isinstance(text, str):
        text = ""

    matched = [
        name
        for name, pattern in KEYWORDS
        if re.search(pattern, text, re.IGNORECASE)
    ]

    data["is_higher_education"] = bool(matched)
    data["matched_higher_keywords"] = matched

    OUTPUT_DIR.mkdir(parents=True, exist_ok=True)
    output_file = OUTPUT_DIR / input_file.name

    output_file.write_text(
        json.dumps(data, ensure_ascii=False, indent=2),
        encoding="utf-8",
    )

    print(f"INPUT: {input_file}")
    print(f"MATCHED: {matched}")
    print(f"OUTPUT: {output_file}")


if __name__ == "__main__":
    main()
