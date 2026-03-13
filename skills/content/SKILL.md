---
name: scopi:content
description: Content ideation with NARA using VS (Verbalized Sampling) — brainstorm topics, story arcs, and series with creative alternatives
user_invocable: true
---

# /scopi:content — Content Ideation

You are running the Scopi content ideation skill. This dispatches NARA (Content Strategist) to brainstorm content ideas using VS (Verbalized Sampling) methodology.

## Prerequisites

Read `scopi.config.json` for brand identity, series definitions, and content type.

## Input

The user provides context:
- `/scopi:content` — open brainstorm, NARA suggests based on brand
- `/scopi:content AI tools for researchers` — specific topic area
- `/scopi:content series:recipe` — brainstorm for a specific series

## Flow

### Step 1: Context

Gather context from config and user input:
- Brand identity and tagline
- Content type (academic, business, personal brand)
- Active series and their tones
- Any topic or constraint from the user

### Step 2: NARA Content Strategy

Dispatch NARA to generate content ideas. NARA MUST use VS methodology:

```
📝 NARA's Content Ideas

━━━ Topic Area: [area] ━━━

🅰️ Option A (T=0.85): [Standard/expected topic]
   Hook: "[opening line]"
   Arc: [1-line arc summary]
   Why: [why this works]

🅱️ Option B (T=0.42): [Moderately creative angle]
   Hook: "[opening line]"
   Arc: [1-line arc summary]
   Why: [why this is interesting]

🅲 Option C (T=0.31): [Most novel/unconventional angle]
   Hook: "[opening line]"
   Arc: [1-line arc summary]
   Why: [why this stands out]

→ Recommended: Option [X] — [reasoning]
```

### Step 3: Deep Dive

Use AskUserQuestion:

> **Which direction interests you? (A/B/C, or describe your own)**
> Or type "more" for 3 more options.

If user selects one, NARA produces the full 8-slide arc:

```markdown
## 8-Slide Arc: [chosen topic]

### Emotional Curve
[curiosity] → [frustration] → [discovery] → [understanding] → [mastery] → [caution] → [awareness] → [motivation]

### Slide Breakdown
1. **Hook** (accent): "[headline]" — [emotional target: curiosity]
2. **Problem**: "[headline]" — [emotional target: frustration]
3. **Solution**: "[headline]" — [emotional target: relief]
4. **Demo**: "[headline]" — [emotional target: understanding]
5. **Result**: "[headline]" — [emotional target: satisfaction]
6. **Tip**: "[headline]" — [emotional target: empowerment]
7. **Caution**: "[headline]" — [emotional target: responsibility]
8. **CTA** (accent): "[headline]" — [emotional target: action]

### Series Fit
[How this fits into existing series, or suggestion for a new series]
```

### Step 4: Next Steps

```
Ready to generate? Run:
  /scopi:generate [topic]   — Full pipeline with all agents
  /scopi:design [topic]     — Explore visual directions first
```
