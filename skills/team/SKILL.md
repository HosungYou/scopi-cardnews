---
name: scopi:team
description: Agent Teams mode — multi-agent collaboration with real-time debate, shared tasks, and inter-agent messaging for card news generation
user_invocable: true
---

# /scopi:team — Agent Teams Generation Pipeline

You are running the Scopi Agent Teams pipeline. This uses Claude Code's experimental Agent Teams feature to create a collaborative team where agents **debate, challenge, and refine** each other's work in real-time — unlike the sequential subagent pipeline (`/scopi:generate`).

## Prerequisites

1. **Agent Teams must be enabled**. Check if `CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS` is set:
   ```json
   // ~/.claude/settings.json
   { "env": { "CLAUDE_CODE_EXPERIMENTAL_AGENT_TEAMS": "1" } }
   ```
   If not enabled, tell the user and offer to set it up.

2. **Claude Code v2.1.32+** required. Check with `claude --version`.

3. Read `scopi.config.json` for brand, identity, theme, dimensions, pipeline settings.

## When to Use Teams vs Generate

| Use `/scopi:team` when... | Use `/scopi:generate` when... |
|---|---|
| Complex topic needing debate | Simple, clear-cut content |
| Academic rigor required | Quick promotional card news |
| Multiple ethical considerations | Low-risk topic |
| User wants agent collaboration visible | User wants fast, autonomous output |
| Design quality is critical | Iterating on existing content |

## Input

Same as `/scopi:generate`:
- `/scopi:team [topic]` — generate card news with team collaboration
- `/scopi:team` — prompt for topic

---

## Architecture: Subagents vs Agent Teams

```
/scopi:generate (Sequential Subagents)
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
NARA → User → BINNA → GANA → GYEOL → JURI → MARU
  ↓       ↓       ↓       ↓       ↓       ↓
(each reports back to main, no inter-agent talk)


/scopi:team (Agent Teams)
━━━━━━━━━━━━━━━━━━━━━━━━━
Phase 1: NARA (subagent) → User Choice

Phase 2: Design Team (parallel, with messaging)
┌─────────────────────────────────────────────┐
│  BINNA ←→ MARU     (copy ↔ empathy)        │
│    ↕                   ↕                     │
│  GYEOL ←→ JURI     (design ↔ ethics)        │
│    ↕                                         │
│  GANA               (implements after lock)  │
│                                              │
│  Shared Task List — agents claim & debate    │
└─────────────────────────────────────────────┘

Phase 3: Render + Final QA
```

---

## Phase 1: Content Strategy (NARA — Subagent)

This phase remains a subagent call because it requires user interaction.

1. Dispatch NARA agent to analyze topic against brand identity
2. Generate 3 VS alternatives with T-Scores
3. Present to user → lock direction
4. NARA produces the full slide arc with emotional curve

This is identical to `/scopi:generate` Phase 1-2.

---

## Phase 2: Create Design Team

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

Each agent should read their agent definition file and scopi.config.json
before starting work.
```

### Shared Task List

Create these tasks with dependencies:

```
Task 1: [BINNA] Refine slide copy
  Input: NARA's slide arc (provided in spawn prompt)
  Output: Refined copy for all slides
  No dependencies — starts immediately

Task 2: [GYEOL] Design 3 VS visual directions
  Input: NARA's arc + theme from config
  Output: 3 visual directions with T-Scores
  No dependencies — starts immediately

Task 3: [JURI] Ethics review of visual directions
  Input: GYEOL's 3 directions
  Output: Ethics flags per direction
  Blocked by: Task 2
  → Message GYEOL directly with findings

Task 4: [MARU] Audience test of visual directions
  Input: GYEOL's 3 directions + BINNA's copy
  Output: Empathy scores per direction
  Blocked by: Task 2, Task 1
  → Message GYEOL directly with predictions

Task 5: [GYEOL] Synthesize feedback → final design spec
  Input: JURI feedback + MARU predictions + own VS analysis
  Output: Final slide-by-slide design specification
  Blocked by: Task 3, Task 4

Task 6: [GANA] Generate slides.js
  Input: BINNA's copy + GYEOL's final spec + theme
  Output: Complete slides.js with all HTML
  Blocked by: Task 1, Task 5
  → Message JURI for license check on any images
  → Message MARU for readability check on font sizes

Task 7: [JURI] Final ethics audit
  Input: Generated slides.js HTML
  Output: Final APPROVED/CONDITIONAL/REJECTED
  Blocked by: Task 6

Task 8: [MARU] Final empathy test
  Input: Generated slides.js content
  Output: Empathy scores + engagement prediction
  Blocked by: Task 6
```

### Inter-Agent Communication Protocols

The power of Agent Teams is that agents **message each other directly**. Define these communication patterns:

#### GYEOL ↔ JURI (Design ↔ Ethics)
```
GYEOL → JURI: "Direction B uses an arXiv figure at 15% opacity.
               Is this acceptable under fair use?"
JURI → GYEOL: "🔴 MUST FIX: arXiv ≠ CC license. The paper is
               Elsevier-published. Build a self-made chart instead."
GYEOL revises Direction B without the figure.
```

#### GYEOL ↔ MARU (Design ↔ Empathy)
```
GYEOL → MARU: "Direction C uses 92px headline with asymmetric layout.
               Will this resonate with 대학원생 audience?"
MARU → GYEOL: "Scroll-stop: 4/5 (strong). But body text at 34px with
               line-height 1.3 will clip on mobile. Increase to 1.6+."
GYEOL adjusts typography.
```

#### BINNA ↔ MARU (Copy ↔ Empathy)
```
BINNA → MARU: "Hook headline: '금지했다고 생각한 그 대학들' —
               does this trigger curiosity for 교수 persona?"
MARU → BINNA: "Curiosity: 4/5 for 교수. But 초임교수 persona
               might feel defensive. Add '실제로는' for softer landing."
BINNA adjusts: '금지했다고 생각했던 그 대학들, 실제로 무엇을 하고 있을까?'
```

#### GANA ↔ JURI (Code ↔ License)
```
GANA → JURI: "Cover image: Unsplash photo by Allen Y. Free license?"
JURI → GANA: "✅ Unsplash license allows commercial use. Proceed.
              Add 'Photo: Unsplash' in footer attribution."
```

#### GANA ↔ MARU (Code ↔ Readability)
```
GANA → MARU: "Slide 5 has 5 progress bars at 30px with sublabels.
              Total content height ~800px in 1350px slide. Readable?"
MARU → GANA: "Tight but acceptable. Remove sublabels on non-highlighted
              bars to create breathing room."
```

---

## Phase 3: Render + Synthesis

After the Design Team completes all tasks:

1. **Team Lead collects final outputs**:
   - BINNA's refined copy ✓
   - GYEOL's design spec (with JURI/MARU feedback incorporated) ✓
   - GANA's slides.js ✓
   - JURI's final verdict ✓
   - MARU's empathy scores ✓

2. **Render the slides**:
   ```bash
   node templates/generate.js --slides=output/[topic]/slides.js --out=output/[topic]
   ```

3. **Clean up the team**:
   Ask all teammates to shut down, then clean up team resources.

---

## Output

```
  ╔══════════════════════════════════════════════╗
  ║  SCOPI TEAM GENERATION — COMPLETE            ║
  ╚══════════════════════════════════════════════╝

  📋 Team Summary:
     BINNA: Copy refined — [N] slides, [X] revisions after MARU feedback
     GYEOL: Design locked — Direction [X] (T=[score]) selected
            [N] revisions from JURI, [M] from MARU
     GANA:  [N] slides generated, [X] license checks passed
     JURI:  [APPROVED/CONDITIONAL] — [N] issues found, [M] resolved in-team
     MARU:  Overall empathy [X.X/5.0] — [details]

  📂 Output: output/[topic-slug]/
     [N] PNG slides + carousel.pdf

  💬 Team Debate Highlights:
     - JURI blocked Direction A (copyright issue) → GYEOL switched to B
     - MARU reduced Slide 5 density → GANA removed 2 sublabels
     - BINNA ↔ MARU iterated hook 3x for optimal curiosity score

  🚀 Next steps:
     /scopi:caption — Generate social media captions
     /scopi:review  — Additional quality review
```

---

## Configuration

Add to `scopi.config.json`:

```json
{
  "pipeline": {
    "teamMode": true,
    "teamSize": 5,
    "teamDisplay": "auto",
    "teamDebate": true
  }
}
```

| Option | Default | Description |
|--------|---------|-------------|
| `teamMode` | `false` | Enable Agent Teams pipeline |
| `teamSize` | `5` | Number of teammates (GYEOL, BINNA, JURI, MARU, GANA) |
| `teamDisplay` | `"auto"` | `"auto"`, `"in-process"`, or `"tmux"` |
| `teamDebate` | `true` | Allow inter-agent messaging (if false, sequential like subagents) |

---

## Fallback

If Agent Teams is not enabled or fails:
1. Warn the user that Teams mode is unavailable
2. Offer to fall back to `/scopi:generate` (sequential subagent mode)
3. All content and quality remains identical — only the collaboration style differs

---

## Key Differences from /scopi:generate

| Aspect | /scopi:generate | /scopi:team |
|--------|----------------|-------------|
| Agent communication | None (sequential) | Real-time messaging |
| JURI/MARU timing | Post-hoc review only | Real-time during design |
| Design iterations | 0 (first output is final) | 2-3 rounds from feedback |
| Copy refinement | BINNA alone | BINNA + MARU collaboration |
| Token cost | Lower | ~3-5x higher |
| Quality | Good | Higher (issues caught earlier) |
| Speed | Faster | Slower (debate takes time) |
| Best for | Routine content | Complex/academic/high-stakes |
