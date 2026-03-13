---
name: scopi:generate
description: Full card news generation pipeline — content strategy → copy → design → HTML → PNG → PDF with 7-phase expert agent workflow
user_invocable: true
---

# /scopi:generate — Full Generation Pipeline

You are running the Scopi full generation pipeline. This orchestrates 7 phases using expert agents to create professional card news from a topic.

## Prerequisites

Check for `scopi.config.json` in the current working directory. If it doesn't exist, tell the user to run `/scopi:setup` first.

Read `scopi.config.json` to load brand, theme, dimensions, active agents, and series configuration.

## Input

The user provides a topic or content brief after the command. If no topic is provided, use AskUserQuestion to ask:

> **What topic should this card news cover?**
> Provide a topic, article URL, or brief description.

## Phase 1: Content Strategy (NARA)

Dispatch the NARA agent (if active) to:
1. Analyze the topic
2. Generate 3 VS alternatives with T-Scores
3. Design the 8-slide narrative arc
4. Map the emotional curve

Present the VS alternatives to the user:

```
📝 NARA's Content Strategy

Option A (T=X.XX): [description]
Option B (T=X.XX): [description]
Option C (T=X.XX): [description]

→ Recommended: Option [X] (lowest viable T-Score)
```

Use AskUserQuestion:

> **Which direction? (A/B/C or describe your own)**

## Phase 2: User Direction Lock

Lock in the chosen content direction. If user chose auto, use the lowest T-Score option.

## Phase 3: Copy Refinement (BINNA)

Dispatch BINNA (if active) to:
1. Write slide-by-slide copy based on the chosen direction
2. Apply tone calibration per scopi.config.json series tone
3. Optimize headlines, body text, CTAs
4. Ensure bilingual quality if applicable

## Phase 4: Visual Design (GYEOL)

Dispatch GYEOL (if active) to:
1. Select layout templates for each slide
2. Generate 3 VS visual direction alternatives
3. Apply theme colors from scopi.config.json
4. Map slides to warm/accent modes

Present visual options briefly, then proceed with recommendation or user choice.

## Phase 5: HTML Generation (GANA)

Dispatch GANA to:
1. Load the renderer: `const { createRenderer } = require('./templates/slide-renderer');`
2. Create renderer instance with current config
3. Import layout components from `templates/layouts/`
4. Generate HTML for each slide using layout functions and copy from Phase 3
5. Write HTML files to `output/html/` directory

For each slide, use the appropriate layout:

```javascript
const renderer = createRenderer({ cwd: process.cwd() });
const { hookSlide } = require('./templates/layouts/hook');
const { problemSlide } = require('./templates/layouts/problem');
// ... etc.

const slides = [
  hookSlide(renderer, { title: '...', subtitle: '...', seriesLabel: '...', pageNum: 1, totalPages: 8 }),
  problemSlide(renderer, { title: '...', points: [...], pageNum: 2, totalPages: 8 }),
  // ... remaining slides
];
```

Then run the pipeline:

```bash
node templates/generate.js --html=output/html --out=output/[topic-slug]
```

## Phase 6: Ethics Review (JURI)

If JURI is active, dispatch for read-only review:
1. Review all generated slides for ethical issues
2. Check copyright, accuracy, inclusivity
3. Produce a review report with severity levels

Display JURI's report to the user. If any 🔴 MUST FIX items, pause and address them before proceeding.

## Phase 7: Empathy Test (MARU)

If MARU is active, dispatch for read-only review:
1. Test slides against audience personas
2. Score each slide on empathy metrics
3. Predict engagement and identify weak points

Display MARU's report to the user.

## Output

Present the final output:

```
🎉 Card News Generated!

📁 Output: output/[topic-slug]/
   📸 8 PNG slides (slide-01.png → slide-08.png)
   📄 carousel.pdf (LinkedIn-ready)

📊 Quality Reports:
   🔍 Ethics: [APPROVED/CONDITIONAL/REJECTED]
   💬 Empathy: [X.X/5.0]

🔧 Next steps:
   /scopi:caption — Generate social media captions
   /scopi:review  — Re-run quality review
   Open output/[topic-slug]/ to preview slides
```

## Error Handling

- If Puppeteer fails: check that `npm install` was run in the plugin directory
- If fonts don't load: the pipeline has a 5-second timeout fallback
- If a phase fails: report the error and ask if user wants to skip that phase
