---
name: scopi:generate
description: Full card news generation pipeline — content strategy → capture → free composition → HTML → PNG → PDF with expert agent workflow
user_invocable: true
---

# /scopi:generate — Full Generation Pipeline

You are running the Scopi full generation pipeline. This orchestrates expert agents to create professional card news from a topic, using free composition (not template-picking) and real screenshot captures.

## Prerequisites

Check for `scopi.config.json` in the current working directory. If it doesn't exist, tell the user to run `/scopi:setup` first.

Read `scopi.config.json` to load:
- `brand` — brand name, handle, author, tagline
- `identity` — contentType, audience, audiencePainPoints, voice, visualStyle, priority, captureTargets
- `theme` — inline theme object (name, colors, fonts)
- `dimensions` — width, height
- `language` — ko or en
- `pipeline` — retina, format, capture settings

## Input

The user provides a topic or content brief after the command. If no topic is provided, use AskUserQuestion:

> **What topic should this card news cover?**
> Provide a topic, article URL, or brief description.

---

## Phase 1: Content Strategy (NARA)

Dispatch the NARA agent to:
1. Read `identity` from config — audience, pain points, voice, content type
2. Analyze the topic in the context of the brand identity
3. Generate 3 VS alternatives with T-Scores
4. Design the narrative arc (slide count adapts to content — NOT always 8)
5. Map the emotional curve
6. **Identify capture URLs** — check `identity.captureTargets` and use WebSearch to find URLs for any tools/services mentioned

Present the VS alternatives to the user:

```
NARA's Content Strategy

Option A (T=X.XX): [description]
  Slide count: [N]
  Hook: "[opening line]"

Option B (T=X.XX): [description]
  Slide count: [N]
  Hook: "[opening line]"

Option C (T=X.XX): [description]
  Slide count: [N]
  Hook: "[opening line]"

Recommended: Option [X] (lowest viable T-Score)

Capture Targets:
  - [service] → [url], selector: [css], viewport: [dims]
  - ...
```

Use AskUserQuestion:

> **Which direction? (A/B/C or describe your own)**

---

## Phase 2: User Direction Lock

Lock in the chosen content direction. If user chose auto, use the lowest T-Score option.

NARA produces the full slide arc with:
- Slide-by-slide content (headline, body, key message)
- Emotional curve mapping
- Capture assignments (which slides feature which captured screenshots)

---

## Phase 3: Copy Refinement (BINNA)

Dispatch BINNA (if active) to:
1. Refine slide-by-slide copy based on NARA's arc
2. Apply tone calibration per `identity.voice`
3. Optimize headlines, body text, CTAs
4. Ensure bilingual quality if applicable
5. Match language setting from config (`ko` or `en`)

---

## Phase 4: Screenshot Capture (GANA)

If `pipeline.capture` is true and capture targets were identified:

Dispatch GANA to run the capture pipeline:

```javascript
const { captureAll } = require('./templates/capture.js');

const captures = await captureAll([
  { name: 'tool-name', url: 'https://...', selector: '.key-ui', viewport: '1080x810' },
  // ... from NARA's capture targets
], { outDir: 'assets/captures' });
```

This produces PNG screenshots in `assets/captures/` that GYEOL will incorporate into slide designs.

If no capture targets exist, skip this phase.

---

## Phase 5: Visual Design + HTML Generation (GYEOL + GANA)

This is the core creative phase. GYEOL and GANA work together to produce unique slides.

### GYEOL: Free Composition Design

GYEOL designs each slide as a **unique composition** — NOT picking from preset templates. For each slide:

1. Consider the CONTENT of that specific slide
2. Consider what comes before and after (visual rhythm)
3. Design a layout that serves the content
4. Use components from `slide-renderer.js` as building blocks (terminal, card, accentBlock, footer, seriesTag, etc.)
5. Compose them DIFFERENTLY each time

**Content-Adaptive Design**:
- Tool/service slides → center the Playwright capture screenshot, minimal text
- Data/stat slides → oversized number (200px+), supporting context
- Before/after slides → true split layout
- Quote/hook slides → oversized text, asymmetric placement
- Terminal demo slides → full-bleed terminal mockup

**Visual Rhythm** across the deck:
- Vary text size dramatically between slides
- Alternate dense (text-heavy) and sparse (visual-dominant)
- Use accent bg sparingly but strategically (max 2 per deck)
- Include at least one "surprise" slide that breaks the pattern

### VS Visual Directions

For key slides (hook, CTA), generate 3 structural variations:

```
Option A (T=0.75): Standard centered layout
Option B (T=0.40): Asymmetric split with bold typography
Option C (T=0.25): Oversized single element, minimal text
→ Build recommended option (or all three for user choice)
```

### GANA: HTML Generation

For each slide, GANA writes complete HTML using the renderer:

```javascript
const { createRenderer } = require('./templates/slide-renderer');
const renderer = createRenderer({ cwd: process.cwd() });
const { DESIGN, slideWrapper, terminal, card, footer, seriesTag, accentBlock } = renderer;

// Each slide is CUSTOM HTML — not a template call
const slide1HTML = slideWrapper('accent', `
  ${seriesTag('accent')}
  <div style="flex:1; display:flex; flex-direction:column; justify-content:center; padding:0 ${DESIGN.spacing.slide};">
    <!-- GYEOL's unique design for this slide -->
    <h1 style="font-family:${DESIGN.fonts.heading}; font-size:72px; color:${DESIGN.colors.accentText}; line-height:1.1;">
      ${headline}
    </h1>
  </div>
  ${footer('accent', 1, totalSlides)}
`);
```

**Embedding captures in slides**:

```javascript
const fs = require('fs');
const captureImg = fs.readFileSync('assets/captures/tool-name.png');
const base64 = captureImg.toString('base64');
const imgTag = `<img src="data:image/png;base64,${base64}" style="width:100%; border-radius:${DESIGN.spacing.borderRadius}; box-shadow:0 8px 32px rgba(0,0,0,0.12);" />`;
```

Write all HTML files to `output/html/`.

### Run the Pipeline

```bash
node templates/generate.js --html=output/html --out=output/[topic-slug]
```

---

## Phase 6: Ethics Review (JURI)

If JURI is active, dispatch for read-only review:
1. Review all generated slides for ethical issues
2. Check copyright, accuracy, inclusivity
3. Produce a severity-rated report

Display JURI's report. If any MUST FIX items, pause and address them before proceeding.

---

## Phase 7: Empathy Test (MARU)

If MARU is active, dispatch for read-only review:
1. Test slides against audience personas (derived from `identity.audience`)
2. Score each slide on empathy metrics
3. Predict engagement and identify weak points

Display MARU's report.

---

## Output

Present the final output:

```
Card News Generated!

Output: output/[topic-slug]/
  [N] PNG slides (slide-01.png → slide-[N].png)
  carousel.pdf

Captures: [N] screenshots captured
  [list captured services]

Quality Reports:
  Ethics: [APPROVED/CONDITIONAL/REJECTED]
  Empathy: [X.X/5.0]

Next steps:
  /scopi:caption — Generate social media captions
  /scopi:review  — Re-run quality review
  Open output/[topic-slug]/ to preview slides
```

---

## Key v2 Principles

1. **Free composition** — every slide is a unique design, not a template pick
2. **Content drives layout** — the content determines the visual approach, not vice versa
3. **Capture integration** — real screenshots of tools/services, embedded as base64
4. **Identity-aware** — all decisions informed by the user's identity (voice, audience, visual style)
5. **Adaptive slide count** — 6 slides or 12 slides, whatever the content needs
6. **Visual rhythm** — the deck has variety, contrast, and surprise
7. **Design tokens only** — all colors/fonts from DESIGN, never hardcoded

## Error Handling

- If Playwright/Puppeteer fails: check that dependencies are installed (`npm install`)
- If capture fails: skip capture, use text descriptions instead
- If fonts don't load: the pipeline has a 5-second timeout fallback
- If a phase fails: report the error and ask if user wants to skip that phase
