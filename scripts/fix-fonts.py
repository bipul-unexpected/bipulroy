from pathlib import Path

root = Path("src")
replacements = [
    ("'Playfair Display', Georgia, serif", "var(--font-heading)"),
    ('"Playfair Display", Georgia, serif', "var(--font-heading)"),
    ("'Lato', sans-serif", "var(--font-body)"),
    ('"Lato", sans-serif', "var(--font-body)"),
]

for p in root.rglob("*"):
    if p.suffix not in {".tsx", ".ts", ".css"}:
        continue
    text = p.read_text(encoding="utf-8")
    original = text
    for old, new in replacements:
        text = text.replace(old, new)
    if text != original:
        p.write_text(text, encoding="utf-8")
        print(f"fixed {p}")

print("done")
