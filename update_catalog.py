import json
from pathlib import Path

catalog_path = Path(r"c:\Projetos\Aurora\.agent-skills\catalog.json")
with open(catalog_path, "r", encoding="utf-8") as f:
    catalog = json.load(f)

new_skills = [
    {
        "name": "design-taste-frontend",
        "description": "Senior UI/UX Engineer skill. Overrides LLM biases, enforces strict metrics, and CSS hardware acceleration.",
        "tags": ["design", "frontend", "performance", "ui-ux"],
        "status": "production",
        "version": "1.0.0"
    },
    {
        "name": "find-skills",
        "description": "Utility to find and map skills across the Aurora ecosystem.",
        "tags": ["tooling", "discovery"],
        "status": "production",
        "version": "1.0.0"
    },
    {
        "name": "full-output-enforcement",
        "description": "Enforces full, non-truncated code outputs for critical system components.",
        "tags": ["quality", "integrity"],
        "status": "production",
        "version": "1.0.0"
    },
    {
        "name": "gpt-taste",
        "description": "Design taste calibration specifically for GPT-based models (compatible with Antigravity).",
        "tags": ["design", "calibration"],
        "status": "production",
        "version": "1.0.0"
    },
    {
        "name": "high-end-visual-design",
        "description": "Advanced visual design principles for premium, S-Tier web experiences.",
        "tags": ["design", "premium", "visual"],
        "status": "production",
        "version": "1.0.0"
    },
    {
        "name": "image-taste-frontend",
        "description": "Calibrates visual assets and image choices for frontend excellence.",
        "tags": ["design", "assets", "frontend"],
        "status": "production",
        "version": "1.0.0"
    },
    {
        "name": "industrial-brutalist-ui",
        "description": "Raw mechanical interfaces fusing Swiss typographic print with military terminal aesthetics.",
        "tags": ["design", "industrial", "brutalist"],
        "status": "production",
        "version": "1.0.0"
    },
    {
        "name": "minimalist-ui",
        "description": "Clean, ultra-minimalist design language focusing on negative space and typography.",
        "tags": ["design", "minimalist"],
        "status": "production",
        "version": "1.0.0"
    },
    {
        "name": "redesign-existing-projects",
        "description": "Framework for systematically refactoring and upgrading existing UI architectures.",
        "tags": ["refactoring", "design"],
        "status": "production",
        "version": "1.0.0"
    },
    {
        "name": "stitch-design-taste",
        "description": "High-fidelity design taste pack specifically optimized for Stitch screen generation.",
        "tags": ["design", "stitch", "premium"],
        "status": "production",
        "version": "1.0.0"
    }
]

existing_names = {s["name"] for s in catalog["skills"]}
for ns in new_skills:
    if ns["name"] not in existing_names:
        catalog["skills"].append(ns)

with open(catalog_path, "w", encoding="utf-8") as f:
    json.dump(catalog, f, indent=2, ensure_ascii=False)

print("Catalog updated successfully.")
