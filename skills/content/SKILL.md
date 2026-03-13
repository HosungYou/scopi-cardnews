---
name: scopi:content
description: Content ideation with NARA using VS (Verbalized Sampling) — brainstorm topics, story arcs, and series with creative alternatives
user_invocable: true
---

# /scopi:content — Content Ideation

You are running the Scopi content ideation skill. This dispatches NARA (Content Strategist) to brainstorm content ideas using VS (Verbalized Sampling) methodology, informed by the user's brand identity.

## Prerequisites

Read `scopi.config.json` for brand identity, audience, pain points, content type, and language.

## Input

The user provides context:
- `/scopi:content` — open brainstorm, NARA suggests based on brand identity
- `/scopi:content AI tools for researchers` — specific topic area
- `/scopi:content series:recipe` — brainstorm for a specific series

## Flow

### Step 1: Context

Gather context from config and user input:
- `identity.contentType` — academic, business, personal brand
- `identity.audience` — who reads this content
- `identity.audiencePainPoints` — what problems they face
- `identity.voice` — communication style
- `identity.captureTargets` — services that can be featured
- `brand` — name, tagline
- `language` — ko or en
- Any topic or constraint from the user

### Step 2: NARA Content Strategy

Dispatch NARA to generate content ideas. NARA MUST:
1. Use VS methodology (3 alternatives with T-Scores)
2. Read identity to match audience and voice
3. Identify capture URLs for any tools/services mentioned
4. Adapt slide count to content (NOT always 8)

```
NARA's Content Ideas

Topic Area: [area]

Option A (T=0.85): [Standard/expected topic]
  Hook: "[opening line]"
  Arc: [1-line arc summary]
  Slides: [N] slides
  Captures: [services to screenshot]
  Why: [why this works for this audience]

Option B (T=0.42): [Moderately creative angle]
  Hook: "[opening line]"
  Arc: [1-line arc summary]
  Slides: [N] slides
  Captures: [services to screenshot]
  Why: [why this is interesting]

Option C (T=0.31): [Most novel/unconventional angle]
  Hook: "[opening line]"
  Arc: [1-line arc summary]
  Slides: [N] slides
  Captures: [services to screenshot]
  Why: [why this stands out]

Recommended: Option [X] — [reasoning]
```

### Step 3: Deep Dive

Use AskUserQuestion:

> **Which direction interests you? (A/B/C, or describe your own)**
> Or type "more" for 3 more options.

If user selects one, NARA produces the full slide arc:

```markdown
## Slide Arc: [chosen topic]

### Emotional Curve
[curiosity] → [frustration] → [discovery] → ... → [motivation]

### Slide Breakdown
1. **Hook** (accent): "[headline]" — [emotional target]
2. **[slide type]**: "[headline]" — [emotional target]
3. ...
[N]. **CTA** (accent): "[headline]" — [emotional target]

### Capture Targets
- **[service]** → name: "[id]", url: "[url]", selector: "[css]"
- ...

### Series Fit
[How this fits into existing series, or suggestion for a new series]
```

### Step 4: Next Steps

```
Ready to generate? Run:
  /scopi:generate [topic]   — Full pipeline with all agents
  /scopi:design [topic]     — Explore visual directions first
```
