# Software Design Document (SDD)

**Product**: Scopi Cardnews
**Version**: 1.0.0
**Author**: Hosung You
**Date**: 2026-03-12
**Status**: Released

---

## 1. Design Philosophy

### 1.1 Core Principles

1. **Config-driven, not code-driven**: Users customize via JSON, not JavaScript
2. **Theme-aware tokens**: No hardcoded colors/fonts anywhere in rendering code
3. **Agent separation of concerns**: Each agent has a single, clear responsibility
4. **Read-only safety net**: Review agents (JURI, MARU) cannot modify files
5. **Graceful degradation**: Missing config/theme/fonts → defaults, not crashes
6. **Inline everything**: Puppeteer renders snapshots — no external CSS runtime

### 1.2 Design Decisions

| Decision | Rationale |
|----------|-----------|
| Inline CSS over external stylesheets | Puppeteer renders a snapshot, external CSS is unreliable across environments |
| Factory pattern for renderer | Each `createRenderer()` call binds to current config, enabling per-project customization |
| JSON themes over CSS variables | JSON is easier to create/edit for non-developers, parseable by agents |
| 7 agents over 1 monolithic prompt | Separation enables skip/swap of individual phases, clearer responsibility |
| SKILL.md over code-based commands | Prompt-based skills are portable, editable, and don't require compilation |
| CommonJS over ESM | Puppeteer and Node.js compat without configuration complexity |

---

## 2. Layered Architecture

### 2.1 Layer Responsibilities

```
┌─────────────────────────────────────────────┐
│  Layer 1: User Interface (Skills)           │
│  ─────────────────────────────────────────  │
│  9 SKILL.md files define slash commands.     │
│  Each skill is a prompt template that        │
│  orchestrates agents and tools.              │
│  Skills are the ONLY user-facing interface.  │
└──────────────────┬──────────────────────────┘
                   │ dispatches
┌──────────────────▼──────────────────────────┐
│  Layer 2: Intelligence (Agents)             │
│  ─────────────────────────────────────────  │
│  7 agent personas define behavior,           │
│  tool permissions, and output format.        │
│  Agents are dispatched by skills.            │
│  JURI + MARU are read-only.                  │
└──────────────────┬──────────────────────────┘
                   │ uses
┌──────────────────▼──────────────────────────┐
│  Layer 3: Engine (Templates)                │
│  ─────────────────────────────────────────  │
│  design-system.js: Token resolution          │
│  slide-renderer.js: Component factory        │
│  layouts/*.js: Slide templates               │
│  generate.js: Rendering pipeline             │
└──────────────────┬──────────────────────────┘
                   │ reads
┌──────────────────▼──────────────────────────┐
│  Layer 4: Data (Config + Themes)            │
│  ─────────────────────────────────────────  │
│  scopi.config.json: Per-project config       │
│  themes/*.json: Visual presets               │
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

### 3.1 Token Resolution

```
DEFAULTS (hardcoded)
    │
    ▼ override by
Theme JSON (themes/*.json)
    │
    ▼ override by
User Config (scopi.config.json)
    │
    ▼ produces
DESIGN object (runtime)
    │
    ▼ consumed by
Renderer components
```

### 3.2 Token Categories

```
DESIGN
├── width: number              ← config.dimensions.width || 1080
├── height: number             ← config.dimensions.height || 1350
├── colors: {                  ← DEFAULTS.colors ← theme.colors
│   ├── warmBg
│   ├── accent
│   ├── accentBg
│   ├── accentText
│   ├── textPrimary
│   ├── textSecondary
│   ├── textTertiary
│   ├── cardBg
│   ├── term* (8 tokens)
│   └── ... (28 total)
│   }
├── fonts: {                   ← DEFAULTS.fonts ← theme.fonts
│   ├── heading
│   ├── body
│   └── code
│   }
├── fontSize: { ... }          ← DEFAULTS.fontSize (not overridable by theme)
├── spacing: { ... }           ← DEFAULTS.spacing (not overridable by theme)
└── brand: {                   ← DEFAULTS.brand ← config.brand
    ├── name
    ├── tag
    ├── author
    └── tagline
    }
```

### 3.3 Component Composition

```
slideWrapper(mode, content)
│
├── <html><head>
│   ├── Google Fonts <link>
│   └── <style> baseCSS (reset + body sizing)
│
└── <body>
    └── .slide-root (flex column, full dimensions, padded)
        │
        ├── seriesTag(mode)           ← top badge
        │   ├── compositeIcon(40)     ← 🎓+🧭
        │   └── brand.tag text
        │
        ├── [content area]            ← layout-specific
        │   ├── terminal(...)         ← code/CLI mockups
        │   ├── accentBlock(...)      ← highlighted boxes
        │   ├── card(...)             ← elevated cards
        │   ├── numberBadge(...)      ← step indicators
        │   └── foxMascot(...)        ← brand mascot
        │
        └── footer(mode, page, total) ← bottom bar
            ├── compositeIcon(48)
            ├── brand.author text
            └── page dots (active/inactive)
```

---

## 4. Agent Design

### 4.1 Agent Persona Pattern

Each agent `.md` follows a consistent structure:

```
Frontmatter (YAML)
├── name: Unique identifier
├── description: One-line role summary
├── model: sonnet (all agents use same model)
└── tools: [allowed tool list]

Body (Markdown)
├── Identity: Character name, meaning, personality
├── Background: Professional history (years, companies, expertise)
├── Responsibilities: Numbered task list
├── VS Methodology: (if applicable) How VS is applied
├── Output Format: Expected response structure
└── Rules: Behavioral constraints
```

### 4.2 Agent Tool Permissions

```
        Read  Glob  Grep  Write  Edit  Bash  WebSearch
NARA     ✓     ✓     ✓     ✓      ✓          ✓
GYEOL    ✓     ✓     ✓     ✓      ✓
GANA     ✓     ✓     ✓     ✓      ✓     ✓
DARI     ✓     ✓     ✓     ✓                  ✓
BINNA    ✓     ✓     ✓            ✓
JURI     ✓     ✓     ✓                              ← READ-ONLY
MARU     ✓     ✓     ✓                              ← READ-ONLY
```

### 4.3 Pipeline Orchestration

```
/scopi:generate orchestration:

  NARA ──→ [user decision] ──→ BINNA ──→ GYEOL ──→ GANA ──→ JURI ──→ MARU
  (content)  (direction)      (copy)    (design)  (build)  (ethics) (empathy)

  Sequential execution. Each phase receives output context from previous phases.
  Inactive agents are skipped. GANA is required (minimum viable pipeline).
```

---

## 5. VS (Verbalized Sampling) Design

### 5.1 Integration Points

| Point | Agent | What is sampled | T-Score range |
|-------|-------|----------------|---------------|
| Content Direction | NARA | Topic angle, narrative format | 0.25 - 0.90 |
| Visual Design | GYEOL | Layout style, color emphasis, typography | 0.25 - 0.80 |
| Layout Structure | GANA | Slide composition, element placement | 0.25 - 0.75 |

### 5.2 T-Score Algorithm

T-Score is a subjective typicality estimate:
- Agent generates 3 alternatives
- Each alternative is scored 0.0 (completely novel) to 1.0 (completely expected)
- Scoring is based on the agent's domain expertise
- Default recommendation: lowest T-Score that maintains clarity

### 5.3 Anti-Drift Mechanism

T-Scores are tracked across episodes. If average T-Score rises above 0.60 for 3 consecutive episodes, NARA flags creative drift and pushes for lower T-Score options.

---

## 6. Theme System Design

### 6.1 Theme File Contract

```json
{
  "name": "string (display name)",
  "description": "string (one-line)",
  "colors": {
    // Any subset of DEFAULTS.colors
    // Only specified keys override defaults
  },
  "fonts": {
    // Any subset of DEFAULTS.fonts
    // Only specified keys override defaults
  }
}
```

### 6.2 Theme Loading Strategy

```javascript
function createDesignSystem(opts) {
  const config = loadConfig(cwd);           // Step 1: Load user config
  const theme = loadTheme(config.theme);     // Step 2: Load theme JSON
  return {
    colors: { ...DEFAULTS.colors, ...theme.colors },  // Step 3: Merge
    fonts: { ...DEFAULTS.fonts, ...theme.fonts },
    brand: { ...DEFAULTS.brand, ...config.brand },
    width: config.dimensions?.width || DEFAULTS.width,
    height: config.dimensions?.height || DEFAULTS.height,
    fontSize: DEFAULTS.fontSize,   // Not overridable by theme (intentional)
    spacing: DEFAULTS.spacing,     // Not overridable by theme (intentional)
  };
}
```

**Design decision**: `fontSize` and `spacing` are NOT overridable by themes. These are carefully calibrated for mobile feed readability at 2x scale. Allowing theme-level overrides would risk breaking the visual hierarchy.

---

## 7. Rendering Pipeline Design

### 7.1 Puppeteer Configuration

```javascript
{
  headless: 'new',                           // New headless mode
  args: ['--no-sandbox', '--disable-setuid-sandbox'],
  viewport: {
    width: DESIGN.width,                     // From config
    height: DESIGN.height,                   // From config
    deviceScaleFactor: retina ? 2 : 1,       // 2x for retina
  }
}
```

### 7.2 Font Loading Strategy

```
1. setContent(html, {waitUntil: 'domcontentloaded'})
   └── Does NOT wait for fonts (would timeout on slow networks)

2. Promise.race([
     page.evaluateHandle('document.fonts.ready'),  ← Wait for fonts
     setTimeout(5000)                               ← Or give up after 5s
   ])

3. setTimeout(800)  ← Extra settle time for layout recalculation
```

### 7.3 Screenshot Configuration

```javascript
{
  type: 'png',
  clip: {
    x: 0, y: 0,
    width: DESIGN.width,
    height: DESIGN.height,
  }
}
```

Clip is explicit to ensure exact dimensions regardless of viewport overflow.

### 7.4 PDF Assembly

```javascript
// pdf-lib: one PNG per page, sized to slide dimensions
for (const pngPath of pngPaths) {
  const pngImage = await pdfDoc.embedPng(pngBytes);
  const page = pdfDoc.addPage([width, height]);
  page.drawImage(pngImage, { x: 0, y: 0, width, height });
}
```

---

## 8. Extensibility Design

### 8.1 Extension Points

| Extension | Mechanism | Location |
|-----------|-----------|----------|
| Custom theme | Add JSON file | `themes/` |
| Custom agent | Add MD file + config entry | `agents/` + `scopi.config.json` |
| Custom layout | Add JS module | `templates/layouts/` |
| Custom series | Config entry | `scopi.config.json` |
| Post-generation hook | Shell script | `hooks/post-generate.sh` |

### 8.2 Layout Module Contract

```javascript
// Every layout module MUST export a function with this signature:
function layoutName(renderer, data) {
  // renderer: createRenderer() instance (has DESIGN, all components)
  // data: slide-specific props (title, content, pageNum, totalPages)
  // MUST return: complete HTML5 document string (via slideWrapper)
}
```

### 8.3 Agent MD Contract

```yaml
---
name: AGENT_NAME          # Required: unique identifier
description: string       # Required: one-line summary
model: sonnet             # Required: model to use
tools:                    # Required: allowed tool list
  - Read
  - Glob
  - Grep
  # Optional: Write, Edit, Bash, WebSearch
---
# Markdown body with persona definition
```
