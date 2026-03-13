# VS (Verbalized Sampling) Methodology

## What is VS?

**Verbalized Sampling** is a creative methodology that prevents "mode collapse" — the tendency of AI to produce generic, predictable, safe-but-boring output.

Instead of generating one answer and moving forward, VS forces the generation of **multiple alternatives scored by novelty**, then selects the most creative viable option.

## The Problem: Mode Collapse

When AI generates content, it gravitates toward the statistical center — the most "average" response. This produces:
- Generic hooks ("Did you know...?")
- Standard layouts (centered, symmetrical, safe)
- Expected content angles (the obvious tutorial format)

The result: content that looks like everything else in the feed. Scroll-past material.

## The Solution: T-Score Alternatives

VS introduces the **T-Score** (Typicality Score), measuring how "expected" a response is:

| T-Score | Meaning | Example |
|---------|---------|---------|
| 0.90+ | Extremely typical | "5 Tips for Better Research" |
| 0.60-0.89 | Standard | "Why Your Research Workflow is Broken" |
| 0.30-0.59 | Moderately creative | "I Was Doing Research Wrong for 3 Years" |
| 0.10-0.29 | Highly novel | "The Research Method Nobody Talks About" |
| <0.10 | Experimental | (may sacrifice clarity for novelty) |

**Lower T-Score = more novel = more likely to stop the scroll.**

## How VS Works in Scopi

VS is integrated at 3 decision points:

### 1. Content Direction (NARA)

When brainstorming topics, NARA generates 3 alternatives:

```
Option A (T=0.85): Standard tutorial — step-by-step walkthrough
  Hook: "How to use Claude for academic writing"
  → Safe, clear, but forgettable

Option B (T=0.42): Confession narrative — "I was doing it wrong"
  Hook: "I spent 3 years formatting papers manually. Then..."
  → Emotional, relatable, personal

Option C (T=0.31): Myth-busting — "Everyone thinks X, but actually Y"
  Hook: "APA formatting doesn't have to take 2 hours"
  → Contrarian, provocative, scroll-stopping

→ Recommend Option C (lowest T-Score, highest novelty)
```

### 2. Visual Design (GYEOL)

When designing slides, GYEOL proposes 3 visual directions:

```
Option A (T=0.78): Clean grid, standard card layout
  → Professional, expected, LinkedIn-safe

Option B (T=0.45): Asymmetric split, oversized typography
  → Dynamic, editorial, attention-grabbing

Option C (T=0.29): Terminal-first, code-aesthetic with accent pops
  → Unique for academic content, highly differentiated

→ User selects or GYEOL recommends lowest-T viable option
```

### 3. Layout Variation (GANA)

When coding key slides (hook, CTA), GANA generates 3 structural variations:

```
Option A (T=0.75): Centered headline with subtitle below
Option B (T=0.40): Left-aligned headline with right accent block
Option C (T=0.25): Full-bleed background with text overlay
→ Build all three, user previews and selects
```

## The T-Score Selection Rule

**Default**: Select the lowest T-Score option that doesn't sacrifice clarity or audience comprehension.

**Exceptions**:
- Academic content: tolerate higher T-Scores for accuracy (T=0.40-0.60)
- Casual/personal brand: push lower T-Scores (T=0.20-0.40)
- First episode in a series: go bold (lowest T-Score)
- Established series: maintain consistency (moderate T-Scores)

## Tracking T-Scores

Each generation logs its T-Scores to prevent drift back to generic output:

```
Episode 1: Hook T=0.31, Visual T=0.29 → novel
Episode 2: Hook T=0.45, Visual T=0.38 → moderate
Episode 3: Hook T=0.72, Visual T=0.68 → drifting! Push lower
```

If T-Scores trend upward across episodes, NARA will flag the drift and push for more creative alternatives.

## Why This Matters

In a feed of 100 posts, the typical post gets scrolled past. VS ensures your card news:
1. **Stands out visually** — unusual layouts and color use
2. **Hooks emotionally** — unexpected angles and provocative openings
3. **Stays fresh** — tracked novelty prevents creative fatigue
4. **Remains clear** — novelty is bounded by comprehension

VS is not about being weird for the sake of it. It's about finding the most creative option that still communicates clearly.
