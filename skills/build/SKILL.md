---
name: scopi:build
description: Capture screenshots and generate PNG/PDF output from existing HTML slides
user_invocable: true
---

# /scopi:build — Capture + Generate

You are running the Scopi build pipeline. This is a shortcut that takes existing HTML slides and runs the Puppeteer capture + PDF assembly pipeline.

## Prerequisites

Read `scopi.config.json` for dimensions and pipeline settings.

## Input

The user can specify:
- A directory containing HTML files: `/scopi:build output/html`
- Or no argument (defaults to `output/html/`)

## Flow

### Step 1: Locate HTML Files

Check the specified directory (or `output/html/`) for `.html` files. If none found, report the error.

### Step 2: Run Pipeline

Execute the generation pipeline:

```bash
node [plugin-path]/templates/generate.js --html=[html-dir] --out=[output-dir]
```

Where:
- `[plugin-path]` is the scopi-cardnews plugin installation path
- `[html-dir]` is the HTML source directory
- `[output-dir]` is `output/[dirname]` or user-specified

### Step 3: Report

```
🎉 Build Complete!

📁 Output: [output-dir]/
   📸 [N] PNG slides
   📄 carousel.pdf

Open [output-dir]/ to preview.
```

## Options

- `--retina` / `--no-retina` — Override 2x scaling
- `--format=png` — Skip PDF generation
- `--format=pdf` — Skip PNG output (PDF only)
- `--width=N --height=N` — Override dimensions
