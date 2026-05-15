import re

with open("src/index.css", "r") as f:
    css = f.read()

css = re.sub(
    r"\.category-tx-item \{.*?\border-bottom:.*?\}",
    ".category-tx-item {\n  display: flex;\n  justify-content: space-between;\n  align-items: flex-start;\n  padding: 0.75rem 0;\n  font-size: 0.9rem;\n  border-bottom: 1px dashed rgba(0, 0, 0, 0.08);\n  gap: 0.5rem;\n}",
    css,
    flags=re.DOTALL
)

css = re.sub(
    r"\.tx-info \{.*?\}",
    ".tx-info {\n  display: flex;\n  gap: 0.75rem;\n  flex: 1;\n  min-width: 0;\n}",
    css,
    flags=re.DOTALL
)

css = re.sub(
    r"\.tx-date \{.*?\}",
    ".tx-date {\n  color: var(--text-secondary);\n  min-width: 50px;\n  white-space: nowrap;\n}",
    css,
    flags=re.DOTALL
)

css = re.sub(
    r"\.tx-desc \{.*?\}",
    ".tx-desc {\n  font-weight: 500;\n  word-break: break-word;\n}",
    css,
    flags=re.DOTALL
)

# add .tx-right and .tx-amount
if ".tx-right" not in css:
    css = css.replace(
        "/* Action Buttons */",
        ".tx-right {\n  display: flex;\n  align-items: flex-start;\n  gap: 0.75rem;\n  flex-shrink: 0;\n}\n\n.tx-amount {\n  font-weight: 600;\n  white-space: nowrap;\n  margin-top: 1px;\n}\n\n/* Action Buttons */"
    )

with open("src/index.css", "w") as f:
    f.write(css)

