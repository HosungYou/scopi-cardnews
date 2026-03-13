---
name: scopi:review
description: Quality assurance review with JURI (ethics) and MARU (empathy) — read-only expert review of generated card news
user_invocable: true
---

# /scopi:review — QA Review

You are running the Scopi quality review. This dispatches JURI (Ethics Inspector) and MARU (Empathy Tester) to review generated card news content. Both agents are READ-ONLY.

## Prerequisites

There must be generated content to review — either HTML files in `output/html/` or a recent output directory.

Read `scopi.config.json` for `identity` (audience, content type) to inform the review perspective.

## Input

The user can specify what to review:
- `/scopi:review` — review the most recent output in `output/`
- `/scopi:review output/my-cardnews` — review a specific directory

## Flow

### Step 1: Locate Content

Find the most recent output directory, or use the user-specified path. Read all HTML files to understand the slide content.

### Step 2: JURI Ethics Review

Dispatch the JURI agent to review all slides. JURI will:
1. Read each slide's HTML content
2. Check against the ethics review checklist
3. Consider `identity.contentType` for review strictness (academic = stricter)
4. Produce a severity-rated report

Display JURI's full report.

### Step 3: MARU Empathy Test

Dispatch the MARU agent to test all slides. MARU will:
1. Read each slide's content
2. Build audience personas from `identity.audience` and `identity.audiencePainPoints`
3. Score each slide on 5 empathy metrics (1-5)
4. Predict engagement and identify weak points

Display MARU's full report.

### Step 4: Summary

```
Quality Review Complete

Ethics (JURI):
  Verdict: [APPROVED/CONDITIONAL/REJECTED]
  Must Fix: [count]
  Should Fix: [count]
  Consider: [count]

Empathy (MARU):
  Overall: [X.X/5.0]
  Best slide: #[N] — [reason]
  Weakest: #[N] — [reason]
  Engagement: [save rate] saves, [share rate] shares

Next steps:
  [If issues found] Fix the flagged items and re-run /scopi:review
  [If clean] Ready to publish! Run /scopi:caption for social media copy
```

## Important

- JURI and MARU are READ-ONLY agents — they cannot modify files
- Their reports are advisory — the user decides whether to act on suggestions
- If JURI flags MUST FIX items, strongly recommend addressing them before publishing
