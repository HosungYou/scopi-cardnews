---
name: scopi:generate
description: Full card news generation pipeline — auto-selects sequential (subagent) or collaborative (Agent Teams) mode based on environment
user_invocable: true
---

# /scopi:generate — Full Generation Pipeline

You are running the Scopi full generation pipeline. This orchestrates expert agents to create professional card news from a topic, using free composition (not template-picking) and real screenshot captures.

**This skill auto-detects Agent Teams availability and routes accordingly.** The user does NOT need to choose between modes — the system decides based on environment and content complexity.

## Checkpoint Protocol

**Read `config/checkpoint-handler.md` before proceeding.** This pipeline has 3 REQUIRED checkpoints (CP-R-01, CP-R-02, CP-R-03) where you MUST stop and wait for human input. Proceeding without human input at a REQUIRED checkpoint is a pipeline violation.

Summary:
- **CP-R-01**: Content direction selection (after NARA VS alternatives)
- **CP-R-02**: Visual direction selection (Teams Mode, after GYEOL VS alternatives)
- **CP-R-03**: Ethics block resolution (if JURI flags MUST FIX)

At each REQUIRED checkpoint, use `AskUserQuestion` and DO NOT proceed until the user responds.

---

## Prerequisites

### Step 1: Config check

Check for `scopi.config.json` in the current working directory.
- **Missing**: tell the user to run `/scopi:setup` first. Stop.
- **Exists**: read and validate required fields below.

### Step 2: Config validation

Read and validate `scopi.config.json`. For each missing or empty required field, collect it now:

| Field | Required | If missing → ask |
|-------|----------|-----------------|
| `brand.name` | Yes | "What's your brand name?" |
| `identity.audience` | Yes | "Who is your target audience?" |
| `identity.voice` | Yes | "What tone? (e.g. professional-warm, academic-direct)" |
| `language` | Yes | "Language? (ko / en)" |
| `theme` | No | Use defaults silently |
| `pipeline.teamMode` | No | Detected from flags/env |

If 2+ fields are missing, ask all at once in a single message — do NOT ask one-by-one.

### Step 3: `--teams` flag handling

Parse the command arguments:
- `--teams` or `-t` → force Agent Teams mode regardless of env var
- `--fast` or `-f` → force Subagent mode (skip Teams even if available)
- No flag → auto-detect (see Mode Detection below)

Example: `/scopi:generate "AI in publishing" --teams`

## Mode Detection (Auto-Routing)

```
Step 1: Was --teams flag passed?
  ├── YES → Teams Mode (skip env var check)
  └── NO → Step 2

Step 2: Is CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS=1 set?
  ├── NO → Subagent Mode (sequential pipeline)
  └── YES → Step 3

Step 3: Does the content benefit from agent debate?
  ├── Academic/research (identity.contentType = "academic") → Teams Mode
  ├── User says "team", "debate", "협업" → Teams Mode
  ├── Topic involves ethical complexity → Teams Mode
  └── Simple/promotional content → Subagent Mode (faster, cheaper)

Step 4: Announce the mode
  "🔄 Agent Teams mode — 5 agents will debate in parallel."
  or
  "▶ Sequential pipeline — faster single-agent mode."
```

The user can override at any time: "use teams" / "팀 모드로" → force Teams, "fast" / "빠르게" → force Subagent.

## Input

The user provides a topic or content brief after the command. If no topic is provided, use AskUserQuestion:

> **What topic should this card news cover?**
> Provide a topic, article URL, or brief description.

---

## Phase 1: Content Strategy (NARA)

This phase is identical in both modes — it requires user interaction.

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

### CP-R-01: REQUIRED CHECKPOINT

Use `AskUserQuestion`:

> **Which direction? (A/B/C or describe your own)**

**STOP HERE.** DO NOT proceed to Phase 2 until the user responds.
DO NOT auto-select an option. DO NOT assume a default.
If the user says "auto" or "you decide", respond: "I need you to choose. Which option resonates with your audience?" and wait again.

---

## Phase 2: User Direction Lock + Log

Lock in the chosen content direction. Record the decision:

```
VS Decision Log:
  Content (NARA): Options A(T=X.XX) / B(T=X.XX) / C(T=X.XX)
  Selected: [user's choice]
  NARA recommended: [which option]
  User followed recommendation: [yes/no]
```

Write this to the episode's `plan.md` under "## Episode Log".

NARA produces the full slide arc with:
- Slide-by-slide content (headline, body, key message)
- Emotional curve mapping
- Capture assignments (which slides feature which captured screenshots)

---

# ═══════════════════════════════════════════════
# BRANCH A: Subagent Mode (Sequential Pipeline)
# ═══════════════════════════════════════════════

If Agent Teams is NOT available or content is simple, use this sequential pipeline.

## Phase 3A: Copy Refinement (BINNA)

Dispatch BINNA (if active) to:
1. Refine slide-by-slide copy based on NARA's arc
2. Apply tone calibration per `identity.voice`
3. Optimize headlines, body text, CTAs
4. Ensure bilingual quality if applicable
5. Match language setting from config (`ko` or `en`)

## Phase 4A: Screenshot Capture (GANA)

If `pipeline.capture` is true and capture targets were identified:

Dispatch GANA to run the capture pipeline:

```javascript
const { captureAll } = require('./templates/capture.js');

const captures = await captureAll([
  { name: 'tool-name', url: 'https://...', selector: '.key-ui', viewport: '1080x810' },
  // ... from NARA's capture targets
], { outDir: 'assets/captures' });
```

If no capture targets exist, skip this phase.

## Phase 5A: Visual Design + HTML Generation (GYEOL + GANA)

### Phase 5A-1: Visual Direction (GYEOL)

Dispatch GYEOL to generate 3 VS visual directions with T-Scores.
Each direction should describe: color mood, typography approach, layout strategy, and how it handles the cover slide.

Present to the user:

```
GYEOL's Visual Directions

Option A (T=X.XX): [description — e.g., "Clean editorial, serif-heavy, centered layouts"]
  Cover: [cover approach]
  Data slides: [data visualization style]

Option B (T=X.XX): [description — e.g., "Asymmetric splits, oversized numbers, high contrast"]
  Cover: [cover approach]
  Data slides: [data visualization style]

Option C (T=X.XX): [description — e.g., "Full-bleed imagery, minimal text, dramatic scale"]
  Cover: [cover approach]
  Data slides: [data visualization style]

Recommended: Option [X] (lowest viable T-Score)
Theme preset: [recommended theme for each direction]
```

### CP-R-02: REQUIRED CHECKPOINT

Use `AskUserQuestion`:

> **Which visual direction? (A/B/C or describe your own)**

**STOP HERE.** DO NOT proceed to slide generation until the user responds.
DO NOT auto-select. Record the decision in the episode's VS decision log.

### Phase 5A-2: Slide Generation (GYEOL + GANA)

After the user locks a visual direction, GYEOL designs each slide as a **unique composition** following the selected direction, and GANA implements as HTML.
See "Free Composition Design" section below for details.

## Phase 6A: Ethics Review (JURI)

If JURI is active, dispatch for read-only review.
Display report.

### CP-R-03: REQUIRED CHECKPOINT (if MUST FIX items exist)

If JURI flags any MUST FIX items, the pipeline STOPS.

Use `AskUserQuestion`:

> **JURI has flagged [N] issue(s) requiring resolution.**
> [List issues]
> How should we proceed? ("fix" / "override [reason]" / "revise [instruction]")

**STOP HERE.** DO NOT proceed to Phase 7A or final render until resolved.
Record the decision in the episode's checkpoint log.

## Phase 7A: Empathy Test (MARU)

If MARU is active, dispatch for read-only review.
Display report.

---

# ═══════════════════════════════════════════════
# BRANCH B: Agent Teams Mode (Collaborative)
# ═══════════════════════════════════════════════

If Agent Teams is available AND content benefits from debate, use this collaborative pipeline.

## Phase 3B: Create Design Team

After the user locks a content direction, create the Agent Teams:

```
Create an agent team for Scopi Card News production.

Team structure:
- GYEOL (Visual Architect): Design 3 VS visual directions per slide.
  Read agents/gyeol.md for full personality and rules.
  Read scopi.config.json for theme and brand.
- BINNA (Copy Surgeon): Refine all slide copy for tone and brevity.
  Read agents/binna.md for full personality and rules.
- JURI (Ethics Inspector): Review designs and copy in real-time.
  READ-ONLY — provides feedback through messages, never edits files.
  Read agents/juri.md for full review framework.
- MARU (Empathy Tester): Test audience reaction in real-time.
  READ-ONLY — provides feedback through messages, never edits files.
  Read agents/maru.md for full empathy metrics.
- GANA (Slide Engineer): Implement final HTML/CSS after design lock.
  Read agents/gana.md for code style and typography guard.
  Read templates/slide-renderer.js for component library.
```

### Shared Task List

```
Task 1: [BINNA] Refine slide copy — starts immediately
Task 2: [GYEOL] Design 3 VS visual directions — starts immediately
Task 3: [JURI] Ethics review of directions — blocked by Task 2
Task 4: [MARU] Audience test of directions — blocked by Task 1, 2
Task 5: [GYEOL] Synthesize feedback → final spec — blocked by Task 3, 4
Task 6: [GANA] Generate slides.js — blocked by Task 1, 5
Task 7: [JURI] Final ethics audit — blocked by Task 6
Task 8: [MARU] Final empathy test — blocked by Task 6
```

### Inter-Agent Communication

Agents message each other directly (see each agent's "Team Communication" section):
- **GYEOL ↔ JURI**: license checks, copyright concerns, attribution
- **GYEOL ↔ MARU**: audience resonance, readability, scroll-stop
- **BINNA ↔ MARU**: persona reaction, tone calibration, curiosity testing
- **GANA ↔ JURI**: image license verification
- **GANA ↔ MARU**: content density, font readability

### CP-R-02: REQUIRED CHECKPOINT (Teams Mode)

After GYEOL presents 3 VS visual directions, use `AskUserQuestion`:

> **Which visual direction? (A/B/C or describe your own)**

**STOP HERE.** DO NOT proceed to slide generation until the user responds.
Record the decision in the episode's VS decision log.

## Phase 4B: Render + Synthesis

After the Design Team completes all tasks:
1. Team Lead collects final outputs
2. Render slides: `node templates/generate.js --slides=output/[topic]/slides.js --out=output/[topic]`
3. Clean up the team

---

# ═══════════════════════════════════════════════
# SHARED: Free Composition Design Principles
# ═══════════════════════════════════════════════

Both modes use the same design principles:

### GYEOL: Free Composition Design

GYEOL designs each slide as a **unique composition** — NOT picking from preset templates. For each slide:

1. Consider the CONTENT of that specific slide
2. Consider what comes before and after (visual rhythm)
3. Design a layout that serves the content
4. Use components from `slide-renderer.js` as building blocks
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

### GANA: HTML Generation

```javascript
const { createRenderer } = require('./templates/slide-renderer');
const renderer = createRenderer({ cwd: process.cwd() });
const { DESIGN, slideWrapper, terminal, card, footer, seriesTag, accentBlock } = renderer;
```

**Embedding captures in slides**:
```javascript
const fs = require('fs');
const captureImg = fs.readFileSync('assets/captures/tool-name.png');
const base64 = captureImg.toString('base64');
const imgTag = `<img src="data:image/png;base64,${base64}" ... />`;
```

---

## Output

Present the final output (same format for both modes):

```
Card News Generated!

Mode: [Sequential / Agent Teams]
Output: output/[topic-slug]/
  [N] PNG slides (slide-01.png → slide-[N].png)
  carousel.pdf

Quality Reports:
  Ethics: [APPROVED/CONDITIONAL/REJECTED]
  Empathy: [X.X/5.0]
  [If Teams mode] Debate: [N] inter-agent messages, [M] issues resolved

Next steps:
  /scopi:caption — Generate social media captions
  /scopi:review  — Re-run quality review
  Open output/[topic-slug]/ to preview slides
```

---

## Key Principles

1. **Free composition** — every slide is a unique design, not a template pick
2. **Content drives layout** — the content determines the visual approach
3. **Capture integration** — real screenshots of tools/services, embedded as base64
4. **Identity-aware** — all decisions informed by the user's identity
5. **Adaptive slide count** — 6 slides or 12 slides, whatever the content needs
6. **Visual rhythm** — the deck has variety, contrast, and surprise
7. **Design tokens only** — all colors/fonts from DESIGN, never hardcoded
8. **Graceful degradation** — same quality regardless of mode, Teams just catches issues earlier

## Post-Generation: Episode Log

After generation completes, append the Episode Log to the episode's `plan.md`.
Use the template from `config/episode-log-template.md`:

1. **VS Decision Log**: Record all T-Scores presented, which option was selected, whether user followed NARA's recommendation
2. **Checkpoint Log**: Record all checkpoint decisions with timestamps
3. **Performance Data**: Leave blank (user fills in after posting)

This data is required for future VS validation. Without it, the claim that "VS improves creative output" remains unverifiable.

---

## Error Handling

- If Agent Teams fails mid-pipeline: fall back to Subagent mode for remaining phases
- If Playwright/Puppeteer fails: check dependencies (`npm install`)
- If capture fails: skip capture, use text descriptions instead
- If fonts don't load: 5-second timeout fallback
- If a phase fails: report the error and ask if user wants to skip
