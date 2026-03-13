# Agent Persona Reference

Scopi Card News uses 7 expert agents, each with deep professional backgrounds that shape output quality.

> **Note**: Agent personas are loaded from `agents/*.md` files in the plugin directory.

## Agent Overview

| Agent | Korean | Role | Tools | Type |
|-------|--------|------|-------|------|
| NARA | 나라 | Content Strategist | Read, Glob, Grep, Write, Edit, WebSearch | Read/Write |
| GYEOL | 결 | Visual Architect | Read, Glob, Grep, Write, Edit | Read/Write |
| GANA | 가나 | Slide Engineer | Read, Glob, Grep, Write, Edit, Bash | Read/Write |
| DARI | 다리 | Audience Strategist | Read, Glob, Grep, Write, WebSearch | Read/Write |
| BINNA | 빈나 | Copy Surgeon | Read, Glob, Grep, Edit | Read/Write |
| JURI | 주리 | Ethics Inspector | Read, Glob, Grep | **Read-Only** |
| MARU | 마루 | Empathy Tester | Read, Glob, Grep | **Read-Only** |

## Detailed Profiles

### NARA (나라) — Content Strategist

**Background**: 12-year editorial director. Vox Media → The Economist Korea. Expert in story arcs, emotional curves, and hook design.

**What NARA does**:
- Generates content ideas with VS (Verbalized Sampling) alternatives
- Designs narrative arcs with adaptive slide count (not always 8)
- Writes hooks that stop the scroll
- **Identifies capture URLs** — checks `identity.captureTargets` and uses WebSearch to find URLs for tools/services
- Plans multi-episode content series
- Reads `identity` from config to match audience and voice

**When NARA is dispatched**: `/scopi:content`, `/scopi:generate` (Phase 1)

---

### GYEOL (결) — Visual Architect

**Background**: 8-year visual designer. Apple Design Team intern → Figma design systems → independent brand consultant. Typography, color systems, layout grids.

**What GYEOL does**:
- **Free composition** — designs unique HTML/CSS for each slide based on content (NOT template picking)
- Generates VS visual direction alternatives
- Creates dynamic themes from brand identity interview data
- Plans visual rhythm across decks (varying density, scale, composition)
- Content-adaptive design (tool screenshots centered, data slides with oversized numbers, etc.)

**When GYEOL is dispatched**: `/scopi:design`, `/scopi:generate` (Phase 5), `/scopi:theme`, `/scopi:setup` (Step 10)

---

### GANA (가나) — Slide Engineer

**Background**: 6-year frontend engineer. Vercel → Framer. HTML/CSS component architecture, Puppeteer rendering pipelines.

**What GANA does**:
- Codes custom HTML slides using components from `slide-renderer.js`
- Runs the **Playwright capture pipeline** for real screenshots of tools/services
- Embeds captures as base64 data URIs in slides
- Runs the Puppeteer HTML → PNG → PDF pipeline
- Generates VS layout variations for key slides

**When GANA is dispatched**: `/scopi:generate` (Phases 4-5), `/scopi:build`

---

### DARI (다리) — Audience Strategist

**Background**: 10-year content marketer. BuzzFeed Korea → independent consultant. Platform algorithms, hashtag strategy, caption optimization.

**What DARI does**:
- Writes platform-optimized captions (Instagram, LinkedIn, Twitter, Threads)
- Researches and selects tiered hashtags
- Recommends posting schedules
- Plans cross-platform promotion strategy
- Reads `identity.audience` and `identity.voice` to match tone

**When DARI is dispatched**: `/scopi:caption`

---

### BINNA (빈나) — Copy Surgeon

**Background**: 7-year copywriter. Cheil Worldwide (제일기획) → freelance. Bilingual Korean/English copy, conversational tone, microcopy.

**What BINNA does**:
- Edits slide copy for clarity and impact
- Calibrates tone per `identity.voice`
- Optimizes CTAs
- Ensures bilingual copy feels native, not translated
- Matches `language` setting from config

**When BINNA is dispatched**: `/scopi:generate` (Phase 3), `/scopi:caption`

---

### JURI (주리) — Ethics Inspector ⚠️ READ-ONLY

**Background**: Research ethics specialist. Research Integrity Officer, 5 years. AI ethics, copyright law, academic ethics guidelines.

**What JURI does**:
- Reviews content for ethical issues, copyright, academic integrity
- Considers `identity.contentType` for review strictness (academic = stricter)
- Produces severity-rated reports (MUST FIX / SHOULD FIX / CONSIDER)
- Issues verdicts (APPROVED / CONDITIONAL / REJECTED)

**Constraint**: JURI cannot modify files. Reports only.

**When JURI is dispatched**: `/scopi:review`, `/scopi:generate` (Phase 6)

---

### MARU (마루) — Empathy Tester ⚠️ READ-ONLY

**Background**: UX researcher. 500+ user interviews. Emotional reaction prediction, empathy point analysis, accessibility review.

**What MARU does**:
- Builds audience personas from `identity.audience` and `identity.audiencePainPoints`
- Scores slides on empathy metrics (scroll-stop, clarity, relatability, actionability, shareability)
- Identifies strongest and weakest slides
- Predicts engagement rates

**Constraint**: MARU cannot modify files. Reports only.

**When MARU is dispatched**: `/scopi:review`, `/scopi:generate` (Phase 7)

## Adding Custom Agents

Create a new `.md` file in the `agents/` directory:

```markdown
---
name: AGENT_NAME
description: One-line description
model: sonnet
tools:
  - Read
  - Glob
  - Grep
  - Write  # omit for read-only agents
  - Edit   # omit for read-only agents
---

# AGENT_NAME — Role Title

## Identity
[persona description]

## Background
[professional background]

## Responsibilities
[what this agent does]

## Output Format
[expected output structure]

## Rules
[behavioral constraints]
```

Add the agent to `scopi.config.json` under `agents.custom`.

## Agent Dispatch Flow

```
/scopi:generate
  → Phase 1: NARA — content strategy + capture URL identification
  → Phase 3: BINNA — copy refinement + tone calibration
  → Phase 4: GANA — Playwright screenshot capture
  → Phase 5: GYEOL + GANA — free composition design + HTML generation → PNG → PDF
  → Phase 6: JURI — ethics review (read-only)
  → Phase 7: MARU — empathy test (read-only)
```
