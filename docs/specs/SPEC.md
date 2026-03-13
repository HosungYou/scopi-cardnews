# Technical Specification (SPEC)

**Product**: Scopi Cardnews
**Version**: 2.0.0
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
│  │  Skills   │  │  Agents  │  │  Engine Layer     │  │
│  │ (9 SKILL  │  │ (7 .md   │  │  Design System   │  │
│  │  .md)     │  │  files)  │  │  Renderer        │  │
│  │           │  │          │  │  Capture          │  │
│  │           │  │          │  │  Pipeline         │  │
│  └────┬─────┘  └────┬─────┘  └────────┬─────────┘  │
│       │              │                  │            │
│       └──────────────┼──────────────────┘            │
│                      │                               │
│              ┌───────▼────────┐                      │
│              │ scopi.config   │ (inline theme +      │
│              │    .json       │  identity data)      │
│              └───────┬────────┘                      │
└──────────────────────┼──────────────────────────────┘
                       │
              ┌────────▼────────┐
              │   Playwright    │ ← capture external URLs
              │   Puppeteer     │ ← render HTML → PNG
              └───────┬────────┘
                      │
              ┌───────▼────────┐
              │  Output:       │
              │  PNG + PDF     │
              │  + captures    │
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
├── Engine Layer (Rendering + Capture)
│   ├── templates/design-system.js   → Dynamic theme-aware token engine
│   ├── templates/slide-renderer.js  → Config-aware component factory
│   ├── templates/generate.js        → HTML → PNG → PDF pipeline
│   ├── templates/capture.js         → Playwright screenshot capture
│   └── templates/layouts/*.js       → Example layouts (inspiration)
│
├── Data Layer (Configuration)
│   ├── [cwd]/scopi.config.json      → Per-project config (inline theme + identity)
│   └── config/scopi.config.example  → Example config
│
└── Output Layer
    ├── [cwd]/output/                → Generated PNG + PDF files
    └── [cwd]/assets/captures/       → Playwright screenshots
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
│  Phase 1: NARA  → content strategy + VS + captures  │
│  Phase 2: User  → direction selection                │
│  Phase 3: BINNA → copy refinement (identity-aware)   │
│  Phase 4: GANA  → Playwright capture (URLs → PNG)    │
│  Phase 5: GYEOL → free composition + GANA HTML gen   │
│  Phase 6: JURI  → ethics report (read-only)          │
│  Phase 7: MARU  → empathy report (read-only)         │
└─────────────────────────────────────────────────────┘
    │
    ▼
┌─ Engine Layer ──────────────────────────────────────┐
│  capture.js   → Playwright → PNG screenshots        │
│       │                                             │
│  design-system.js ← config.theme (inline) + identity │
│       │                                             │
│       ▼                                             │
│  slide-renderer.js → components (inline HTML/CSS)   │
│       │                                             │
│       ▼                                             │
│  [Custom HTML per slide — free composition]         │
│       │                                             │
│       ▼                                             │
│  generate.js → Puppeteer → PNG → pdf-lib → PDF     │
└─────────────────────────────────────────────────────┘
    │
    ▼
Output: output/{slug}/slide-01.png ... slide-[N].png
        output/{slug}/carousel.pdf
        assets/captures/*.png
```

---

## 2. Module Specifications

### 2.1 Design System (`templates/design-system.js`)

**Purpose**: Provide dynamic theme-aware design tokens with identity data.

**Exports**:

| Function | Signature | Description |
|----------|-----------|-------------|
| `createDesignSystem` | `(opts?: {cwd?}) → DESIGN` | Build merged token set from inline theme |
| `loadConfig` | `(cwd) → userConfig` | Load scopi.config.json |
| `DEFAULTS` | `object` | Static default tokens |

**Merge Order**: `DEFAULTS` ← `config.theme.colors/fonts` ← `config.brand/dimensions`

**v2 Changes**:
- Theme loaded from `config.theme` object (not separate JSON file)
- `DESIGN.identity` exposes identity data to agents
- `DESIGN.language` exposes language setting
- Removed `loadTheme()` function (themes are inline)

### 2.2 Capture Pipeline (`templates/capture.js`)

**Purpose**: Screenshot capture of external tools/services.

**Exports**:

| Function | Signature | Description |
|----------|-----------|-------------|
| `captureOne` | `(browser, target) → pngPath` | Capture single URL/HTML |
| `captureAll` | `(targets[], opts?) → Map<name, path>` | Batch capture |

**Target Schema**:

```typescript
interface CaptureTarget {
  name: string;          // Screenshot identifier
  url?: string;          // URL to capture
  html?: string;         // HTML string to capture (alternative)
  selector?: string;     // CSS selector for element capture
  viewport?: string;     // "widthxheight" (e.g., "1080x810")
}
```

**Browser Priority**: Playwright (preferred) → Puppeteer (fallback)

### 2.3 Slide Renderer (`templates/slide-renderer.js`)

**Purpose**: Config-aware component factory producing inline HTML/CSS.

Components: compositeIcon, foxMascot, foxIcon, seriesTag, footer, terminal, accentBlock, card, numberBadge, slideWrapper, DESIGN.

**v2 Note**: In free composition, agents use these components as building blocks but compose them uniquely per slide, rather than calling fixed layout functions.

### 2.4 Layout Examples (`templates/layouts/*.js`)

**Purpose**: 8 example layouts serving as inspiration for free composition. NOT used as rigid templates in v2.

### 2.5 Generation Pipeline (`templates/generate.js`)

**Purpose**: Orchestrate HTML → PNG → PDF conversion.

Same as v1. Accepts HTML slides array, renders via Puppeteer at configured dimensions.

---

## 3. Plugin Registration

Same as v1 (marketplace.json, plugin.json structure).

---

## 4. Configuration Schema

### 4.1 scopi.config.json (v2)

```typescript
interface ScopiConfig {
  language: 'ko' | 'en';
  brand: {
    name: string;
    handle: string;
    author: string;
    tagline?: string;
  };
  identity: {
    contentType: string;        // academic, business, personal-brand
    audience: string;           // Free-text audience description
    audiencePainPoints: string;  // Free-text pain points
    voice: string;              // Communication style
    visualStyle: string;        // Visual preference
    priority: string;           // Content priority
    captureTargets: string[];   // URLs for screenshot capture
  };
  theme: {                      // INLINE theme (not a file reference)
    name: string;
    description: string;
    colors: Partial<DesignColors>;
    fonts: Partial<DesignFonts>;
  };
  dimensions: {
    width: number;
    height: number;
  };
  platform: 'instagram' | 'linkedin' | 'twitter' | 'multi';
  agents: {
    active: string[];
    custom: string[];
  };
  series: Array<{
    tag: string;
    color: string;
    tone: string;
  }>;
  pipeline: {
    retina: boolean;
    format: ('png' | 'pdf')[];
    capture: boolean;
  };
}
```

---

## 5. Dependencies

| Package | Version | Purpose | Required |
|---------|---------|---------|----------|
| puppeteer | ^24.39.0 | HTML rendering + fallback capture | Required |
| pdf-lib | ^1.17.1 | PDF assembly | Required |
| playwright | ^1.58.0 | Screenshot capture (preferred) | Optional |

---

## 6. Error Handling

| Error | Cause | Recovery |
|-------|-------|----------|
| Config not found | No scopi.config.json | Use DEFAULTS, warn user |
| Playwright not installed | Optional dep missing | Fall back to Puppeteer |
| Capture URL unreachable | Network/DNS failure | Skip capture, warn user |
| Puppeteer launch fail | Chromium not installed | `npm install puppeteer` message |
| Font load timeout | Google Fonts slow/offline | Continue after 5s with fallbacks |

---

## 7. Security Considerations

- No API keys stored in config or output
- Capture targets are user-specified URLs only
- JURI reviews for data privacy issues
- `scopi.config.json` is gitignored by default
- Puppeteer runs headless only
