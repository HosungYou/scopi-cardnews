# Scopi Checkpoint Handler Protocol

## Core Principle

**Human decisions at creative direction points are NEVER bypassed. AI produces options, humans choose.**

## Checkpoint Levels

### REQUIRED (CP-R)
- Pipeline STOPS and waits for human input
- No timeout, no auto-proceed, no default selection
- Must be explicitly approved before continuing
- If the LLM proceeds without human input, the checkpoint has FAILED

### RECOMMENDED (CP-M)
- Pipeline pauses and presents information for review
- If the user does not respond within the same turn, the agent proceeds with a stated default
- The default action is announced before proceeding

### INFORMATIONAL (CP-I)
- Pipeline presents information and continues
- No pause required
- User can interrupt if needed

## Checkpoint Definitions

### CP-R-01: Content Direction Lock

**When**: After NARA presents 3 VS alternatives with T-Scores
**What**: User selects Option A, B, C, or describes a custom direction
**Enforcement**: Use `AskUserQuestion`. DO NOT proceed to Phase 2 until the user responds.
**Violation**: If the agent auto-selects an option without user input, the entire generation must restart.

```
CP-R-01 CONTENT DIRECTION
-------------------------------------------------------

NARA has generated 3 content directions.

[VS alternatives displayed above]

Which direction? (A / B / C / or describe your own)
DO NOT auto-select. Waiting for your input.
-------------------------------------------------------
```

### CP-R-02: Visual Direction Lock (Teams Mode only)

**When**: After GYEOL presents 3 VS visual directions
**What**: User selects visual approach
**Enforcement**: Use `AskUserQuestion`. DO NOT proceed to slide generation until the user responds.

```
CP-R-02 VISUAL DIRECTION
-------------------------------------------------------

GYEOL has generated 3 visual directions.

[VS alternatives displayed above]

Which visual direction? (A / B / C / or describe your own)
DO NOT auto-select. Waiting for your input.
-------------------------------------------------------
```

### CP-R-03: Ethics Block Resolution

**When**: JURI flags a MUST FIX item
**What**: User acknowledges the issue and approves the fix or provides alternative
**Enforcement**: Use `AskUserQuestion`. DO NOT proceed to final render until resolved.

```
CP-R-03 ETHICS REVIEW
-------------------------------------------------------

JURI has flagged [N] issue(s) requiring resolution.

[Issues displayed above]

How should we proceed?
- "fix" to apply JURI's recommended fixes
- "override [reason]" to proceed despite the flag
- "revise [instruction]" to address differently
-------------------------------------------------------
```

### CP-M-01: Pre-Flight Confirmation

**When**: Before NARA generates VS alternatives
**What**: Confirm identity settings (audience, voice, language, theme)
**Default**: If user presses Enter or does not modify, proceed with current config

### CP-M-02: Final Preview

**When**: After all slides are rendered to PNG
**What**: User reviews the generated slides
**Default**: If user does not request changes, proceed to caption generation prompt

### CP-I-01: Mode Announcement

**When**: After mode detection (Sequential vs Teams)
**What**: Inform user which mode was selected and why

### CP-I-02: Quality Report

**When**: After JURI and MARU complete their reviews (no MUST FIX items)
**What**: Display ethics approval status and empathy scores

## Checkpoint State Recording

After each REQUIRED checkpoint, record the decision in the episode's `plan.md`:

```markdown
## Checkpoint Log

| Checkpoint | Decision | Timestamp |
|------------|----------|-----------|
| CP-R-01 | Option B selected (T=0.42) | 2026-03-19 22:30 |
| CP-R-02 | Visual direction A (T=0.78) | 2026-03-19 22:35 |
| CP-R-03 | N/A (no MUST FIX items) | 2026-03-19 22:40 |
```

This creates an audit trail of all human decisions during the generation process.

## Anti-Bypass Rules

1. **Never auto-select a VS option.** Even if the user says "auto" or "just pick one", present the options and ask.
   Exception: If the user explicitly says "always use lowest T-Score" in their config (`pipeline.autoSelectLowestT: true`), this counts as a standing human decision.

2. **Never skip CP-R-03.** If JURI flags a MUST FIX, the pipeline stops regardless of mode, speed preference, or user impatience.

3. **Record all checkpoint decisions.** Even "proceed with default" is a decision worth recording.

4. **Checkpoint state survives agent handoff.** When one agent hands off to another, checkpoint decisions travel with the content brief.
