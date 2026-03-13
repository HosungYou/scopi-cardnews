# Agent Persona Reference

Scopi Card News uses 7 expert agents, each with deep professional backgrounds that shape output quality.

> **Note**: Agent personas are loaded from `agents/*.md` files in the plugin directory. To customize agents, see [Adding Custom Agents](#adding-custom-agents) below.

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
- Designs 8-slide narrative arcs with emotional curves
- Writes hooks that stop the scroll
- Plans multi-episode content series

**When NARA is dispatched**: `/scopi:content`, `/scopi:generate` (Phase 1)

---

### GYEOL (결) — Visual Architect

**Background**: 8-year visual designer. Apple Design Team intern → Figma design systems → independent brand consultant. Typography, color systems, layout grids.

**What GYEOL does**:
- Defines design systems (color tokens, typography, spacing)
- Creates and manages theme JSON files
- Selects layout templates per slide
- Generates VS visual direction alternatives

**When GYEOL is dispatched**: `/scopi:design`, `/scopi:generate` (Phase 4), `/scopi:theme`

---

### GANA (가나) — Slide Engineer

**Background**: 6-year frontend engineer. Vercel → Framer. HTML/CSS component architecture, Puppeteer rendering pipelines.

**What GANA does**:
- Codes HTML slides using layout components
- Manages the component library (`slide-renderer.js`)
- Runs the Puppeteer HTML → PNG → PDF pipeline
- Generates VS layout variations for key slides

**When GANA is dispatched**: `/scopi:generate` (Phase 5), `/scopi:build`

---

### DARI (다리) — Audience Strategist

**Background**: 10-year content marketer. BuzzFeed Korea → independent consultant. Platform algorithms, hashtag strategy, caption optimization.

**What DARI does**:
- Writes platform-optimized captions (Instagram, LinkedIn, Twitter, Threads)
- Researches and selects tiered hashtags
- Recommends posting schedules
- Plans cross-platform promotion strategy

**When DARI is dispatched**: `/scopi:caption`

---

### BINNA (빈나) — Copy Surgeon

**Background**: 7-year copywriter. Cheil Worldwide (제일기획) → freelance. Bilingual Korean/English copy, conversational tone, microcopy.

**What BINNA does**:
- Edits slide copy for clarity and impact
- Calibrates tone per audience
- Optimizes CTAs
- Ensures bilingual copy feels native, not translated

**When BINNA is dispatched**: `/scopi:generate` (Phase 3), `/scopi:caption`

---

### JURI (주리) — Ethics Inspector ⚠️ READ-ONLY

**Background**: Research ethics specialist. Research Integrity Officer, 5 years. AI ethics, copyright law, academic ethics guidelines.

**What JURI does**:
- Reviews content for ethical issues, copyright, academic integrity
- Produces severity-rated reports (🔴 MUST FIX / 🟡 SHOULD FIX / 🟢 CONSIDER)
- Issues verdicts (APPROVED / CONDITIONAL / REJECTED)

**Constraint**: JURI cannot modify files. Reports only.

**When JURI is dispatched**: `/scopi:review`, `/scopi:generate` (Phase 6)

---

### MARU (마루) — Empathy Tester ⚠️ READ-ONLY

**Background**: UX researcher. 500+ user interviews. Emotional reaction prediction, empathy point analysis, accessibility review.

**What MARU does**:
- Predicts audience reactions per persona
- Scores slides on empathy metrics (scroll-stop, clarity, relatability, actionability, shareability)
- Identifies strongest and weakest slides
- Predicts engagement rates

**Constraint**: MARU cannot modify files. Reports only.

**When MARU is dispatched**: `/scopi:review`, `/scopi:generate` (Phase 7)

## Adding Custom Agents

Create a new `.md` file in the `agents/` directory following this structure:

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

Then add the agent to `scopi.config.json` under `agents.custom` and re-run `/scopi:setup` to register it.

### Where to Place Custom Agent Files

- **Marketplace install**: Place custom agents in the plugin cache directory:
  `~/.claude/plugins/marketplaces/HosungYou-scopi-cardnews/agents/`
- **Local install**: Place in the cloned repository's `agents/` directory.
- **Project-level**: You can also place agent files in your project's `agents/` directory and reference them in `scopi.config.json` under `agents.custom`.

### Agent Dispatch Flow

```
/scopi:generate
  → Phase 1: NARA dispatched (if active)
  → Phase 3: BINNA dispatched (if active)
  → Phase 4: GYEOL dispatched (if active)
  → Phase 5: GANA dispatched (always required)
  → Phase 6: JURI dispatched (if active, read-only)
  → Phase 7: MARU dispatched (if active, read-only)
```

Custom agents can be wired into the pipeline by creating a custom skill that references them.
