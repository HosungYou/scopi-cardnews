---
name: scopi:help
description: Show all Scopi Card News commands, agents, and documentation
user_invocable: true
---

# /scopi:help — Command Reference

Display the following help information, adapting language based on `scopi.config.json` language setting (default to English if no config exists):

```
SCOPI CARDNEWS v2.0 — Command Reference

SETUP & CONFIG
  /scopi:setup     Brand identity interview + dynamic theme generation
  /scopi:theme     View, customize, or regenerate your theme
  /scopi:help      This help page

CONTENT CREATION
  /scopi:content   Brainstorm content ideas with NARA (VS-powered)
  /scopi:generate  Full pipeline: strategy → capture → design → HTML → PNG → PDF
  /scopi:design    Explore visual directions with GYEOL (VS-powered)

BUILD & OUTPUT
  /scopi:build     Capture screenshots + render HTML → PNG + PDF
  /scopi:caption   Generate social media captions + hashtags

QUALITY
  /scopi:review    Ethics (JURI) + empathy (MARU) review

EXPERT AGENTS (7)
  NARA  (나라)  Content Strategist — story arcs, hooks, capture URLs
  GYEOL (결)    Visual Architect — free composition, themes, visual rhythm
  GANA  (가나)  Slide Engineer — HTML coding, capture pipeline, rendering
  DARI  (다리)  Audience Strategist — captions, hashtags, platforms
  BINNA (빈나)  Copy Surgeon — text refinement, tone, bilingual
  JURI  (주리)  Ethics Inspector — ethics review [read-only]
  MARU  (마루)  Empathy Tester — audience empathy [read-only]

v2 FEATURES
  - Free composition — every slide is a unique design
  - Playwright capture — real screenshots of tools/services
  - Dynamic themes — generated from your brand identity
  - Identity-aware — content and design match your voice
  - Adaptive slides — 6 or 12, whatever the content needs
  - VS methodology — 3 creative alternatives at every decision

PROJECT STRUCTURE
  scopi.config.json     Your brand, identity, theme & pipeline config
  output/               Generated slides (PNG + PDF)
  assets/captures/      Playwright screenshots

QUICK START
  1. /scopi:setup           — Configure your brand identity
  2. /scopi:content         — Brainstorm a topic
  3. /scopi:generate [topic] — Generate card news
  4. /scopi:caption         — Get social media copy
```
