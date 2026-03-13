# Software Design Document (SDD)

**Product**: Scopi Cardnews
**Version**: 2.0.0
**Author**: Hosung You
**Date**: 2026-03-12
**Status**: Released

---

## 1. Design Philosophy

### 1.1 Core Principles

1. **Config-driven, not code-driven**: Users customize via JSON, not JavaScript
2. **Dynamic theme-aware tokens**: Themes generated from identity, not picked from presets
3. **Free composition**: Every slide is a unique design — no template picking
4. **Identity-aware**: All agent decisions informed by brand identity (voice, audience, visual style)
5. **Capture-first**: Real screenshots of tools/services over text descriptions
6. **Read-only safety net**: Review agents (JURI, MARU) cannot modify files
7. **Graceful degradation**: Missing config/theme/fonts/captures → defaults, not crashes
8. **Inline everything**: Puppeteer renders snapshots — no external CSS runtime

### 1.2 Design Decisions

| Decision | Rationale |
|----------|-----------|
| Dynamic themes over presets | Users get a unique brand identity, not a generic template |
| Free composition over layout templates | Every slide serves its content, not the other way around |
| Playwright capture integration | Real screenshots are more authentic than text descriptions |
| Inline theme in config | Simpler architecture — one file, no theme file lookups |
| Identity interview over simple form | Deeper understanding of user's brand enables better output |
| Adaptive slide count | Content drives structure — a 5-tool listicle needs 10 slides, a concept needs 6 |
| CommonJS over ESM | Puppeteer and Node.js compat without configuration complexity |

---

## 2. Layered Architecture

### 2.1 Layer Responsibilities

```
┌─────────────────────────────────────────────┐
│  Layer 1: User Interface (Skills)           │
│  ─────────────────────────────────────────  │
│  9 SKILL.md files define slash commands.     │
│  Skills orchestrate agents and tools.        │
│  Skills are identity-aware (read config).    │
└──────────────────┬──────────────────────────┘
                   │ dispatches
┌──────────────────▼──────────────────────────┐
│  Layer 2: Intelligence (Agents)             │
│  ─────────────────────────────────────────  │
│  7 agent personas with identity awareness.   │
│  NARA: content + capture URL identification  │
│  GYEOL: free composition + dynamic themes    │
│  GANA: capture pipeline + HTML generation    │
│  JURI + MARU: read-only review               │
└──────────────────┬──────────────────────────┘
                   │ uses
┌──────────────────▼──────────────────────────┐
│  Layer 3: Engine (Templates + Capture)      │
│  ─────────────────────────────────────────  │
│  design-system.js: Dynamic token resolution  │
│  slide-renderer.js: Component factory        │
│  capture.js: Playwright screenshot pipeline  │
│  layouts/*.js: Example layouts (inspiration) │
│  generate.js: Rendering pipeline             │
└──────────────────┬──────────────────────────┘
                   │ reads
┌──────────────────▼──────────────────────────┐
│  Layer 4: Data (Config)                     │
│  ─────────────────────────────────────────  │
│  scopi.config.json: Inline theme + identity  │
│  DEFAULTS: Built-in fallbacks                │
└─────────────────────────────────────────────┘
```

### 2.2 Dependency Direction

Dependencies flow **downward only**:
- Skills → Agents → Engine → Data
- No layer depends on a layer above it
- Engine layer has zero knowledge of skills or agents

---

## 3. Design System Architecture

### 3.1 Token Resolution (v2)

```
DEFAULTS (hardcoded)
    │
    ▼ override by
Config theme (config.theme.colors/fonts — inline)
    │
    ▼ override by
Config brand (config.brand)
Config dimensions (config.dimensions)
    │
    ▼ produces
DESIGN object (runtime)
    │
    ├── colors, fonts, fontSize, spacing, brand
    ├── identity (from config.identity)
    └── language (from config.language)
    │
    ▼ consumed by
Renderer components + Agent decisions
```

### 3.2 Dynamic Theme Generation (New in v2)

During `/scopi:setup`, GYEOL generates a theme from interview data:

```
identity.contentType  ─┐
identity.visualStyle  ─┤
identity.voice        ─┼──→ GYEOL ──→ theme object (colors + fonts)
identity.priority     ─┤
brand.name            ─┘
```

Color derivation logic:
- Academic + warm → ivory/cream bg, terracotta/burgundy accents, serif body
- Academic + dark → deep navy/charcoal bg, gold/copper accents, serif body
- Business + clean → white/light gray bg, blue/teal accents, sans-serif
- Tech + modern → dark bg, neon accents, monospace-heavy

---

## 4. Free Composition Design (New in v2)

### 4.1 Philosophy

In v1, agents picked from 8 preset layout templates. In v2, GYEOL designs a **unique composition** for each slide based on its content.

### 4.2 Content-Adaptive Patterns

| Content | Composition Approach |
|---------|---------------------|
| Tool/service with capture | Screenshot centered, minimal text |
| Data/statistics | Oversized number (200px+), supporting context |
| Before/after comparison | True split layout |
| Quote/hook | Oversized text, asymmetric placement |
| Terminal/CLI demo | Full-bleed terminal mockup |

### 4.3 Visual Rhythm

A deck should NOT be 8 identical frames. GYEOL plans:
- Dramatic text size variation between slides
- Alternating dense (text-heavy) and sparse (visual-dominant) slides
- Accent bg used sparingly (max 2 per deck)
- At least one "surprise" slide that breaks the pattern

### 4.4 Layout Examples as Inspiration

The 8 layout files in `templates/layouts/` serve as **examples and building blocks**:
- Agents can reference them for structural ideas
- But NEVER call them as rigid templates
- Each slide gets custom HTML written by GANA

---

## 5. Capture Pipeline Design (New in v2)

### 5.1 Architecture

```
NARA identifies URLs    GANA runs capture       GYEOL designs around
(content strategy)  →   (Playwright/Puppeteer)  →  captures
                              │
                              ▼
                        assets/captures/*.png
                              │
                              ▼
                        base64 data URI → embedded in HTML slide
```

### 5.2 Browser Strategy

```
try Playwright (preferred — better screenshot quality)
catch → fall back to Puppeteer
catch → skip capture, warn user
```

### 5.3 Capture Target Flow

1. Pre-registered in `identity.captureTargets` (setup interview)
2. Dynamically identified by NARA via WebSearch
3. Captured by GANA during generation Phase 4
4. Embedded by GANA as base64 during HTML generation

---

## 6. Agent Design

### 6.1 Agent Persona Pattern

Same as v1, plus:
- All agents read `identity` from config
- NARA has `WebSearch` for capture URL discovery
- GANA has `Bash` for capture pipeline execution
- GYEOL does free composition, not template selection

### 6.2 Pipeline Orchestration (v2)

```
/scopi:generate orchestration:

  NARA ──→ [user] ──→ BINNA ──→ GANA(capture) ──→ GYEOL+GANA ──→ JURI ──→ MARU
  (content   (pick)   (copy)    (screenshots)     (design+HTML)  (ethics) (empathy)
  +captures)                                       (→ PNG → PDF)
```

---

## 7. Rendering Pipeline Design

Same as v1 (Puppeteer, 2x retina, 5s font timeout, 800ms settle, pdf-lib assembly).

---

## 8. Extensibility Design

### 8.1 Extension Points

| Extension | Mechanism | Location |
|-----------|-----------|----------|
| Custom agent | Add MD file + config entry | `agents/` |
| Layout inspiration | Add JS module | `templates/layouts/` |
| Theme customization | `/scopi:theme customize` | `scopi.config.json` |
| Theme regeneration | `/scopi:theme regenerate` | `scopi.config.json` |
| Custom series | Config entry | `scopi.config.json` |
| Post-generation hook | Shell script | `hooks/post-generate.sh` |
| Capture targets | Config entry or NARA discovery | `identity.captureTargets` |
