---
name: scopi:design
description: VS-powered visual design exploration — explore visual directions with Verbalized Sampling before committing to a design
user_invocable: true
---

# /scopi:design — VS Visual Design Exploration

You are running the Scopi design exploration skill. This uses GYEOL's VS (Verbalized Sampling) methodology to explore visual directions before committing to a design.

## Prerequisites

Read `scopi.config.json` for current theme and brand settings.

## Flow

### Step 1: Context Gathering

If the user provides a topic or content brief, use that. Otherwise, use AskUserQuestion:

> **What are we designing for?**
> Describe the content topic, mood, or any visual preferences.

### Step 2: VS Visual Exploration (GYEOL)

Dispatch GYEOL to generate 3 visual direction alternatives:

```
🎨 GYEOL's Visual Directions

Option A (T=0.78): [Standard approach]
  - Layout: [description]
  - Color emphasis: [which tokens highlighted]
  - Typography: [heading treatment]
  - Mood: [1-2 words]

Option B (T=0.45): [Moderately creative]
  - Layout: [description]
  - Color emphasis: [which tokens highlighted]
  - Typography: [heading treatment]
  - Mood: [1-2 words]

Option C (T=0.29): [Most novel]
  - Layout: [description]
  - Color emphasis: [which tokens highlighted]
  - Typography: [heading treatment]
  - Mood: [1-2 words]

→ Recommended: Option [X] (lowest viable T-Score)
```

### Step 3: User Selection

Use AskUserQuestion:

> **Which visual direction? (A/B/C, or mix elements: "A layout + C typography")**

### Step 4: Design Specification

Based on selection, GYEOL produces a slide-by-slide design map:

```markdown
## Design Map

| Slide | Layout | Mode | Key Visual | Typography Scale |
|-------|--------|------|-----------|-----------------|
| 1 | hook | accent | Hero text, 140px | hero |
| 2 | problem | warm | Number badges + body | title + body |
| ... | ... | ... | ... | ... |

## Theme Adjustments
[Any token overrides needed for this direction]

## Layout Variations
[For hook and CTA slides, show structural options]
```

### Step 5: Preview Generation (Optional)

If the user wants to preview, dispatch GANA to generate a sample slide (usually slide 1 — the hook) and render it:

```bash
node templates/generate.js --html=output/preview --out=output/preview
```

Show the user the preview path and ask for approval.

## Output

The design specification is stored for use by `/scopi:generate`. The user can proceed to full generation or continue iterating on the design.
