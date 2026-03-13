# Technical Specification (SPEC)

**Product**: Scopi Cardnews
**Version**: 1.0.0
**Author**: Hosung You
**Date**: 2026-03-12
**Status**: Released

---

## 1. System Architecture

### 1.1 Architecture Overview

```
┌─────────────────────────────────────────────────────┐
│                   Claude Code CLI                    │
│                                                     │
│  ┌──────────┐  ┌──────────┐  ┌──────────────────┐  │
│  │  Skills   │  │  Agents  │  │  Design System   │  │
│  │ (9 SKILL  │  │ (7 .md   │  │  + Renderer      │  │
│  │  .md)     │  │  files)  │  │  + Pipeline       │  │
│  └────┬─────┘  └────┬─────┘  └────────┬─────────┘  │
│       │              │                  │            │
│       └──────────────┼──────────────────┘            │
│                      │                               │
│              ┌───────▼────────┐                      │
│              │ scopi.config   │                      │
│              │    .json       │                      │
│              └───────┬────────┘                      │
│                      │                               │
│              ┌───────▼────────┐                      │
│              │  themes/*.json │                      │
│              └────────────────┘                      │
└─────────────────────────────────────────────────────┘
                       │
                       ▼
              ┌────────────────┐
              │   Puppeteer    │
              │   (Chromium)   │
              └───────┬────────┘
                      │
              ┌───────▼────────┐
              │  Output:       │
              │  PNG + PDF     │
              └────────────────┘
```

### 1.2 Component Diagram

```
scopi-cardnews/
│
├── Plugin Layer
│   ├── plugin.json              → Registers skills + agents with Claude Code
│   └── .claude-plugin/
│       ├── marketplace.json     → Marketplace registry
│       └── plugin.json          → Plugin entry point for marketplace
│
├── Skill Layer (User Interface)
│   └── skills/*/SKILL.md       → 9 slash commands, each a prompt template
│
├── Agent Layer (AI Personas)
│   └── agents/*.md             → 7 expert personas with tool constraints
│
├── Engine Layer (Rendering)
│   ├── templates/design-system.js   → Theme-aware token engine
│   ├── templates/slide-renderer.js  → Config-aware component factory
│   ├── templates/generate.js        → HTML → PNG → PDF pipeline
│   └── templates/layouts/*.js       → 8 reusable slide templates
│
├── Data Layer (Configuration)
│   ├── themes/*.json                → Visual theme presets
│   ├── config/scopi.config.example  → Example user config
│   └── [cwd]/scopi.config.json      → Per-project user config (generated)
│
└── Output Layer
    └── [cwd]/output/               → Generated PNG + PDF files
```

### 1.3 Data Flow

```
User Input (topic)
    │
    ▼
┌─ Skills Layer ──────────────────────────────────────┐
│  /scopi:generate dispatches agents in sequence      │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─ Agent Layer ───────────────────────────────────────┐
│  Phase 1: NARA  → content strategy + VS            │
│  Phase 2: User  → direction selection               │
│  Phase 3: BINNA → copy refinement                   │
│  Phase 4: GYEOL → visual design + VS               │
│  Phase 5: GANA  → HTML generation                   │
│  Phase 6: JURI  → ethics report (read-only)         │
│  Phase 7: MARU  → empathy report (read-only)        │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─ Engine Layer ──────────────────────────────────────┐
│  design-system.js  ← themes/*.json + config         │
│       │                                             │
│       ▼                                             │
│  slide-renderer.js → components (inline HTML/CSS)   │
│       │                                             │
│       ▼                                             │
│  layouts/*.js      → full HTML slide documents      │
│       │                                             │
│       ▼                                             │
│  generate.js       → Puppeteer → PNG → pdf-lib →   │
│                       PDF                           │
└─────────────────────────────────────────────────────┘
    │
    ▼
Output: output/{slug}/slide-01.png ... slide-08.png
        output/{slug}/carousel.pdf
```

---

## 2. Module Specifications

### 2.1 Design System (`templates/design-system.js`)

**Purpose**: Provide theme-aware design tokens to all rendering components.

**Exports**:

| Function | Signature | Description |
|----------|-----------|-------------|
| `createDesignSystem` | `(opts?: {cwd?, pluginRoot?}) → DESIGN` | Build merged token set |
| `loadTheme` | `(themeName, pluginRoot) → themeOverrides` | Load theme JSON |
| `loadConfig` | `(cwd) → userConfig` | Load scopi.config.json |
| `DEFAULTS` | `object` | Static default tokens |

**Merge Order**: `DEFAULTS` ← `theme.colors/fonts` ← `config.brand/dimensions`

**Token Categories**:

| Category | Count | Examples |
|----------|-------|---------|
| Colors | 28 | warmBg, accent, textPrimary, termBg, ... |
| Fonts | 3 | heading, body, code |
| Font Sizes | 9 | hero (140px) → tag (36px) |
| Spacing | 6 | padding, gap, borderRadius, ... |
| Brand | 4 | name, tag, author, tagline |
| Dimensions | 2 | width, height |

### 2.2 Slide Renderer (`templates/slide-renderer.js`)

**Purpose**: Config-aware component factory producing inline HTML/CSS.

**Exports**:

| Function | Signature | Description |
|----------|-----------|-------------|
| `createRenderer` | `(opts?) → RendererInstance` | Factory function |

**RendererInstance Methods**:

| Method | Returns | Description |
|--------|---------|-------------|
| `compositeIcon(size)` | HTML string | 🎓+🧭 composite emoji |
| `foxMascot(size)` | SVG string | Terracotta fox + grad cap |
| `foxIcon(size)` | SVG string | Compact fox face |
| `seriesTag(mode, opts)` | HTML string | Editorial badge |
| `footer(mode, pageNum, totalPages)` | HTML string | Author + page dots |
| `terminal(title, lines, opts)` | HTML string | Terminal mockup |
| `accentBlock(content, opts)` | HTML string | Terracotta highlight box |
| `card(content, opts)` | HTML string | White elevated card |
| `numberBadge(num, mode)` | HTML string | Circular number badge |
| `slideWrapper(mode, content)` | HTML string | Full HTML5 document |
| `DESIGN` | object | Current design tokens |

**Design Principles**:
- Inline styles only (no external CSS at runtime)
- All values from DESIGN tokens (no hardcoded colors/fonts/sizes)
- HTML5 compliant output
- Google Fonts loaded via `<link>` in `<head>`

### 2.3 Layout Components (`templates/layouts/*.js`)

**Purpose**: 8 reusable slide templates following the narrative arc pattern.

| Module | Export | Slide # | Default Mode | Key Props |
|--------|--------|---------|-------------|-----------|
| `hook.js` | `hookSlide(renderer, data)` | 1 | accent | title, subtitle, seriesLabel |
| `problem.js` | `problemSlide(renderer, data)` | 2 | warm | title, points[{num, text}] |
| `solution.js` | `solutionSlide(renderer, data)` | 3 | warm | title, description, highlight |
| `demo.js` | `demoSlide(renderer, data)` | 4 | warm | title, terminalTitle, lines[] |
| `result.js` | `resultSlide(renderer, data)` | 5 | warm | title, before{}, after{} |
| `tip.js` | `tipSlide(renderer, data)` | 6 | warm | title, tipIcon, tipText, details |
| `caution.js` | `cautionSlide(renderer, data)` | 7 | warm | title, warnings[{icon, text}], note |
| `cta.js` | `ctaSlide(renderer, data)` | 8 | accent | title, subtitle, cta, handles[], nextEpisode |

**Common Props** (all layouts): `pageNum`, `totalPages`

### 2.4 Generation Pipeline (`templates/generate.js`)

**Purpose**: Orchestrate HTML → PNG → PDF conversion.

**Exports**:

| Function | Signature | Description |
|----------|-----------|-------------|
| `generateFromHTML` | `(htmlSlides[], opts?) → {pngPaths[], pdfPath}` | Core pipeline |

**Pipeline Steps**:

```
1. Load config (scopi.config.json)
2. Create design system
3. mkdir output directory
4. Launch Puppeteer (headless Chromium)
5. Set viewport (width × height × deviceScaleFactor)
6. For each HTML slide:
   a. setContent(html, {waitUntil: 'domcontentloaded'})
   b. Wait for fonts (document.fonts.ready, 5s timeout)
   c. Settle delay (800ms)
   d. Screenshot → PNG
7. Close browser
8. Assemble PNGs → PDF via pdf-lib
9. Return paths
```

**Configuration**:

| Option | Source | Default |
|--------|--------|---------|
| width | config.dimensions.width | 1080 |
| height | config.dimensions.height | 1350 |
| retina | config.pipeline.retina | true |
| formats | config.pipeline.format | ["png", "pdf"] |
| outDir | CLI arg or function param | output/cardnews |

---

## 3. Plugin Registration

### 3.1 Marketplace Structure

```
.claude-plugin/
├── marketplace.json    → Marketplace registry (name, owner, plugins[])
└── plugin.json         → Plugin entry point (name, version, skills path)
```

### 3.2 marketplace.json Schema

```json
{
  "$schema": "https://anthropic.com/claude-code/marketplace.schema.json",
  "name": "scopi-cardnews",
  "description": "...",
  "owner": { "name": "...", "email": "..." },
  "plugins": [{
    "name": "scopi-cardnews",
    "version": "1.0.0",
    "source": "./",
    "category": "productivity",
    "tags": [...]
  }]
}
```

### 3.3 Skill Registration

Skills are registered via `plugin.json` (root level):

```json
{
  "skills": [
    "skills/setup",
    "skills/generate",
    ...
  ]
}
```

Each skill directory contains `SKILL.md` with frontmatter:

```yaml
---
name: scopi:generate
description: Full card news generation pipeline
user_invocable: true
---
```

### 3.4 Agent Registration

Agents are registered via `plugin.json`:

```json
{
  "agents": [
    "agents/nara.md",
    "agents/gyeol.md",
    ...
  ]
}
```

---

## 4. Configuration Schema

### 4.1 scopi.config.json

```typescript
interface ScopiConfig {
  brand: {
    name: string;        // Brand display name
    handle: string;      // Social media handle (e.g., "@scopi.lab")
    author: string;      // Author name for slide footer
    tagline?: string;    // Optional tagline
  };
  theme: string;         // Theme file name (without .json)
  dimensions: {
    width: number;       // Slide width in pixels
    height: number;      // Slide height in pixels
  };
  platform: 'instagram' | 'linkedin' | 'twitter' | 'multi';
  agents: {
    active: string[];    // Agent names to enable
    custom: string[];    // Custom agent file names
  };
  series: Array<{
    tag: string;         // Series display name
    color: string;       // Accent color hex
    tone: 'practical' | 'academic' | 'storytelling' | 'casual' | 'technical';
  }>;
  pipeline: {
    retina: boolean;     // 2x deviceScaleFactor
    format: ('png' | 'pdf')[];
  };
}
```

### 4.2 Theme JSON

```typescript
interface ThemeConfig {
  name: string;
  description: string;
  colors: Partial<DesignColors>;  // Overrides DEFAULTS.colors
  fonts: Partial<DesignFonts>;    // Overrides DEFAULTS.fonts
}
```

---

## 5. Dependencies

| Package | Version | Purpose | License |
|---------|---------|---------|---------|
| puppeteer | ^24.39.0 | Chromium screenshot rendering | Apache-2.0 |
| pdf-lib | ^1.17.1 | PDF assembly from PNG images | MIT |

**Runtime**: Node.js 18+
**Platform**: macOS, Linux (Puppeteer manages its own Chromium)

---

## 6. Error Handling

| Error | Cause | Recovery |
|-------|-------|----------|
| Config not found | No scopi.config.json | Use DEFAULTS, warn user |
| Theme not found | Theme name doesn't match file | Use DEFAULTS colors, warn |
| Puppeteer launch fail | Chromium not installed | `npm install puppeteer` message |
| Font load timeout | Google Fonts slow/offline | Continue after 5s with fallbacks |
| PNG write fail | Output directory permissions | Report error, suggest `mkdir -p` |
| PDF assembly fail | Corrupt PNG | Skip corrupt slide, continue |

---

## 7. Security Considerations

- No API keys stored in config or output
- No network requests during rendering (fonts are cached after first load)
- JURI agent reviews for data privacy issues in content
- `scopi.config.json` is gitignored by default
- No user data transmitted to external services
- Puppeteer runs with `--no-sandbox` for compatibility (headless only)
