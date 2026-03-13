---
name: scopi:design
description: VS-powered visual design exploration — explore visual directions with free composition before committing to a design
user_invocable: true
---

# /scopi:design — VS Visual Design Exploration

You are running the Scopi design exploration skill. This uses GYEOL's VS (Verbalized Sampling) methodology to explore visual directions using free composition — designing unique layouts per slide, not picking from templates.

## Prerequisites

Read `scopi.config.json` for current theme, brand, identity, and dimensions.

## Flow

### Step 1: Context Gathering

If the user provides a topic or content brief, use that. Otherwise, use AskUserQuestion:

> **What are we designing for?**
> Describe the content topic, mood, or any visual preferences.

Read `identity.visualStyle`, `identity.voice`, and `identity.priority` from config to inform design direction.

### Step 2: VS Visual Exploration (GYEOL)

Dispatch GYEOL to generate 3 visual direction alternatives using free composition:

```
GYEOL's Visual Directions

Option A (T=0.78): [Standard approach]
  Composition: [unique layout description — not a template name]
  Color emphasis: [which tokens highlighted]
  Typography: [heading treatment, size ranges]
  Rhythm: [dense → sparse pattern]
  Mood: [1-2 words]

Option B (T=0.45): [Moderately creative]
  Composition: [unique layout description]
  Color emphasis: [which tokens highlighted]
  Typography: [heading treatment, size ranges]
  Rhythm: [pattern]
  Mood: [1-2 words]

Option C (T=0.29): [Most novel]
  Composition: [unique layout description]
  Color emphasis: [which tokens highlighted]
  Typography: [heading treatment, size ranges]
  Rhythm: [pattern]
  Mood: [1-2 words]

Recommended: Option [X] (lowest viable T-Score)
```

### Step 3: User Selection

Use AskUserQuestion:

> **Which visual direction? (A/B/C, or mix elements: "A rhythm + C typography")**

### Step 4: Design Specification

Based on selection, GYEOL produces a slide-by-slide design map using free composition:

```markdown
## Design Map

| Slide | Composition | Mode | Key Visual | Typography |
|-------|-------------|------|-----------|------------|
| 1 | Oversized text, asymmetric | accent | Hero headline 80px | hero |
| 2 | Split layout, icon left | warm | Pain point list | title + body |
| 3 | Centered capture screenshot | warm | Tool UI screenshot | caption below |
| ... | ... | ... | ... | ... |

## Visual Rhythm
[Description of how density, scale, and composition vary across slides]

## Capture Integration
[Which slides will feature screenshots, how they'll be composed]

## Theme Token Usage
[Any specific color/font emphasis for this direction]
```

Each slide description is a UNIQUE composition — no two slides should use the same layout approach.

### Step 5: Preview Generation (Optional)

If the user wants to preview, dispatch GANA to generate a sample slide (usually slide 1 — the hook) using the free composition design:

```javascript
const { createRenderer } = require('./templates/slide-renderer');
const renderer = createRenderer({ cwd: process.cwd() });
// GANA writes custom HTML based on GYEOL's design spec
```

Then render:

```bash
node templates/generate.js --html=output/preview --out=output/preview
```

Show the user the preview path and ask for approval.

## Output

The design specification is stored for use by `/scopi:generate`. The user can proceed to full generation or continue iterating on the design.
