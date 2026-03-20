# VS (Verbalized Sampling) Methodology

## What is VS?

**Verbalized Sampling** is a creative methodology that prevents "mode collapse" — the tendency of AI to produce generic, predictable, safe-but-boring output.

Instead of generating one answer and moving forward, VS forces the generation of **multiple alternatives scored by novelty**, then selects the most creative viable option.

## The Problem: Mode Collapse

When AI generates content, it gravitates toward the statistical center — the most "average" response. This produces:
- Generic hooks ("Did you know...?")
- Standard layouts (centered, symmetrical, safe)
- Expected content angles (the obvious tutorial format)
- Identical slide compositions across every deck

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

NARA also adapts slide count per option — a 5-tool listicle might need 10 slides, while a single concept might need 6.

### 2. Visual Design (GYEOL)

When designing slides using free composition, GYEOL proposes 3 visual directions:

```
Option A (T=0.78): Clean centered layouts, consistent card structure
  → Professional, expected, LinkedIn-safe

Option B (T=0.45): Asymmetric splits, oversized typography, varied density
  → Dynamic, editorial, attention-grabbing

Option C (T=0.29): Full-bleed captures, minimal text, dramatic scale shifts
  → Unique for academic content, highly differentiated

→ User selects or GYEOL recommends lowest-T viable option
```

Each direction describes unique compositions per slide, not template selections.

### 3. Layout Variation (GANA)

When coding key slides (hook, CTA), GANA generates 3 structural variations:

```
Option A (T=0.75): Centered headline with subtitle below
Option B (T=0.40): Left-aligned headline with right accent block
Option C (T=0.25): Full-bleed background with text overlay
→ Build all three, user previews and selects
```

### 4. Theme Generation (GYEOL — during setup)

When generating themes from identity data, GYEOL creates 3 palette options with VS:

```
Option A (T=0.78): Expected palette for content type
Option B (T=0.45): Unexpected color combination that still works
Option C (T=0.29): Bold, distinctive palette that stands out
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

## Transparency: What T-Score Is and Is Not

### What T-Score IS
- A **self-assessed heuristic** where the agent evaluates the relative typicality of its own output
- A **comparative label** that helps users see which option is more conventional vs. more novel
- A **structured prompt technique** that forces the generation of meaningfully different alternatives

### What T-Score IS NOT
- NOT an entropy measurement derived from actual token probabilities (Claude API does not expose log-probabilities)
- NOT a validated psychometric scale with established reliability
- NOT guaranteed to be consistent across different runs for the same input

### Why it still works
Even as a self-assessed heuristic, T-Score serves its core purpose: it forces the agent to generate genuinely different options rather than three variations of the same idea. The value is in the structured comparison, not the precision of the number.

### Future validation path
When enough episodes exist (N >= 10), correlate T-Scores with actual social media performance data (reach, saves, comments) recorded in each episode's `plan.md`. This will reveal whether lower T-Scores genuinely correspond to higher engagement, or whether the relationship is more nuanced.

See `config/episode-log-template.md` for the data collection structure.

---

## Why This Matters

In a feed of 100 posts, the typical post gets scrolled past. VS ensures your card news:
1. **Stands out visually** -- unique compositions and unexpected layouts
2. **Hooks emotionally** -- unexpected angles and provocative openings
3. **Stays fresh** -- tracked novelty prevents creative fatigue
4. **Remains clear** -- novelty is bounded by comprehension

VS is not about being weird for the sake of it. It's about finding the most creative option that still communicates clearly.
