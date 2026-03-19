---
name: scopi:build
description: Capture screenshots and generate PNG/PDF output from existing HTML slides
user_invocable: true
---

# /scopi:build — Capture + Generate

You are running the Scopi build pipeline. This takes existing HTML slides and runs the Puppeteer capture + PDF assembly pipeline. It can also run Playwright screenshot captures before building.

## Prerequisites

Read `scopi.config.json` for dimensions, pipeline settings, and capture targets.

## Input

The user can specify:
- A directory containing HTML files: `/scopi:build output/my-topic`
- Or no argument (scans `output/` for the most recent subdirectory with `.html` files, or falls back to `output/html/`)

## Flow

### Step 1: Capture (Optional)

If `pipeline.capture` is true and capture targets exist (either in config or in `assets/captures/`):

Check if captures need to be refreshed. If `assets/captures/` is empty or user requests fresh captures:

```javascript
const { captureAll } = require('./templates/capture.js');
const config = require('./scopi.config.json');

const captures = await captureAll(
  (config.identity.captureTargets || []).map(url => ({
    name: url.replace(/https?:\/\//, '').replace(/[./]/g, '-'),
    url: url,
    viewport: `${config.dimensions.width}x${Math.round(config.dimensions.width * 0.75)}`
  })),
  { outDir: 'assets/captures' }
);
```

### Step 2: Locate HTML Files

Check the specified directory for `.html` files. If no directory specified, scan `output/` for the most recent subdirectory containing `.html` files. If none found, report the error and suggest running `/scopi:generate` first.

### Step 3: Run Pipeline

Execute the generation pipeline:

```bash
node templates/generate.js --html=[html-dir] --out=[output-dir]
```

### Step 4: Report

```
Build Complete!

Output: [output-dir]/
  [N] PNG slides
  carousel.pdf

Captures: [N] screenshots (if any)

Open [output-dir]/ to preview.
```

## Options

- `--retina` / `--no-retina` — Override 2x scaling
- `--format=png` — Skip PDF generation
- `--format=pdf` — Skip PNG output (PDF only)
- `--width=N --height=N` — Override dimensions
- `--capture` — Force fresh screenshot captures before building
