# Scopi Cardnews

> **Professional card news generator plugin for [Claude Code](https://claude.ai/code)**
> 7 expert-persona agents · VS-powered creative design · Free composition · Playwright capture · HTML → PNG → PDF pipeline

Turn any topic into scroll-stopping social media card news. Scopi orchestrates 7 specialized AI agents — each with deep professional backgrounds — through a multi-phase production pipeline. Content strategy, real screenshot capture, free-composition visual design, copy refinement, HTML generation, ethics review, and empathy testing, all from a single `/scopi:generate` command.

**For researchers, creators, and anyone who publishes visual content on social media.**

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Commands](#commands)
- [The Generation Pipeline](#the-generation-pipeline)
- [Expert Agents](#expert-agents)
- [Dynamic Themes](#dynamic-themes)
- [VS Methodology](#vs-methodology)
- [Customization](#customization)
- [Project Structure](#project-structure)
- [Documentation](#documentation)
- [Troubleshooting](#troubleshooting)
- [Uninstall](#uninstall)
- [Contributing](#contributing)
- [License](#license)

---

## Installation

### Prerequisites

- **[Claude Code](https://claude.ai/code)** CLI installed and authenticated
- **Node.js 18+** (for Puppeteer rendering pipeline)
- **Playwright** (optional, for screenshot capture of external tools/services)

### Option 1: Marketplace Install (Recommended)

```bash
# Step 1: Add the scopi-cardnews marketplace
claude plugin marketplace add HosungYou/scopi-cardnews

# Step 2: Install the plugin
claude plugin install scopi-cardnews@scopi-cardnews
```

### Option 2: Local Install (for development)

```bash
git clone https://github.com/HosungYou/scopi-cardnews.git
cd scopi-cardnews && npm install
claude --plugin-dir /path/to/scopi-cardnews
```

### Verify Installation

```bash
claude plugin list
```

### Install Optional Dependencies

```bash
# For Playwright screenshot capture (recommended)
npx playwright install chromium
```

---

## Quick Start

### 1. Configure your brand

```
/scopi:setup
```

A deep brand identity interview captures your voice, audience, visual style, and generates a unique theme dynamically. Produces `scopi.config.json`.

### 2. Brainstorm content

```
/scopi:content AI tools for academic writing
```

NARA proposes 3 creative directions using VS methodology, identifies capture URLs for tools/services, and adapts slide count to content.

### 3. Generate card news

```
/scopi:generate
```

The full pipeline runs: content strategy → screenshot capture → free-composition design → HTML slides → PNG → PDF → ethics & empathy review.

### 4. Get social media copy

```
/scopi:caption
```

DARI and BINNA generate platform-optimized captions and hashtags.

### 5. Preview output

```
open output/your-topic/
```

---

## Commands

| Command | Agent(s) | Description |
|---------|----------|-------------|
| `/scopi:setup` | GYEOL | Brand identity interview + dynamic theme generation |
| `/scopi:content` | NARA | Brainstorm topics with VS creative alternatives |
| `/scopi:design` | GYEOL | Explore visual directions with free composition |
| `/scopi:generate` | All | Full pipeline → PNG + PDF output |
| `/scopi:build` | GANA | Capture screenshots + render HTML → PNG + PDF |
| `/scopi:caption` | DARI + BINNA | Social media captions + hashtags |
| `/scopi:review` | JURI + MARU | Ethics + empathy quality review (read-only) |
| `/scopi:theme` | GYEOL | View, customize, or regenerate your theme |
| `/scopi:help` | — | Show all commands and documentation |

---

## The Generation Pipeline

`/scopi:generate` orchestrates a complete production pipeline:

```
Phase 1  NARA     Content strategy + story arc + VS alternatives + capture URL identification
Phase 2  User     Select direction (or auto-commit to lowest T-Score)
Phase 3  BINNA    Copy refinement + tone calibration (identity-aware)
Phase 4  GANA     Playwright screenshot capture of tools/services
Phase 5  GYEOL    Free composition design + GANA HTML generation → PNG → PDF
Phase 6  JURI     Ethics review (read-only report)
Phase 7  MARU     Empathy test (read-only report)
```

### Key v2 Features

- **Free composition** — every slide is a unique design, not a template pick
- **Playwright capture** — real screenshots of tools/services embedded in slides
- **Identity-aware** — all decisions informed by your brand identity (voice, audience, visual style)
- **Adaptive slide count** — 6 or 12 slides, whatever the content needs
- **Visual rhythm** — varied density, scale, and composition across slides

---

## Expert Agents

7 agents with distinct professional backgrounds.

| Agent | Korean | Role | Type |
|-------|--------|------|------|
| **NARA** | 나라 | Content Strategist — story arcs, hooks, capture URLs | Read/Write |
| **GYEOL** | 결 | Visual Architect — free composition, themes, visual rhythm | Read/Write |
| **GANA** | 가나 | Slide Engineer — HTML coding, capture pipeline, rendering | Read/Write |
| **DARI** | 다리 | Audience Strategist — captions, hashtags, platforms | Read/Write |
| **BINNA** | 빈나 | Copy Surgeon — text refinement, bilingual copy | Read/Write |
| **JURI** | 주리 | Ethics Inspector — ethics, copyright, accuracy | **Read-Only** |
| **MARU** | 마루 | Empathy Tester — audience reaction, accessibility | **Read-Only** |

JURI and MARU are deliberately read-only — they review and report but never modify your content.

See [docs/agents.md](docs/agents.md) for full persona backgrounds.

---

## Dynamic Themes

Themes are **dynamically generated** during `/scopi:setup` based on your brand identity interview. There are no preset themes — GYEOL (Visual Architect) creates a unique color palette and font pairing that matches your:

- Content type (academic, business, personal brand)
- Visual style preference
- Communication voice
- Content priority

The theme is stored inline in `scopi.config.json` and can be customized or regenerated anytime with `/scopi:theme`.

---

## VS Methodology

**Verbalized Sampling** prevents AI "mode collapse" — the tendency to produce generic, predictable output.

At every creative decision point, Scopi generates **3 alternatives scored by T-Score** (typicality). Lower T-Score = more novel:

```
Option A (T=0.85): Standard tutorial walkthrough      ← safe but forgettable
Option B (T=0.42): "I was doing it wrong" confession  ← emotional, personal
Option C (T=0.31): Myth-busting contrarian take        ← scroll-stopping
→ Recommend Option C
```

VS is applied at 3 points:
1. **Content direction** (NARA) — what angle to take
2. **Visual design** (GYEOL) — how slides look and flow
3. **Layout structure** (GANA) — how key slides are composed

See [docs/vs-methodology.md](docs/vs-methodology.md) for the full explanation.

---

## Customization

| What | How |
|------|-----|
| **Brand identity** | Re-run `/scopi:setup` or edit `identity` in `scopi.config.json` |
| **Theme** | `/scopi:theme customize` or `/scopi:theme regenerate` |
| **Agents** | Add custom agent `.md` files in `agents/` |
| **Layouts** | Layout files in `templates/layouts/` serve as examples for free composition |
| **Series** | Define content series with tags, colors, tones in config |
| **Dimensions** | Set any width/height for any platform |
| **Pipeline** | Toggle retina, capture, choose output formats (png/pdf) |

See [docs/customization.md](docs/customization.md) for the full guide.

---

## Project Structure

```
scopi-cardnews/
├── .claude-plugin/
│   ├── marketplace.json         # Marketplace registry manifest
│   └── plugin.json              # Plugin entry point
├── plugin.json                  # Plugin manifest (skills + agents)
├── package.json                 # npm deps (puppeteer, pdf-lib, playwright)
│
├── skills/                      # 9 slash commands
│   ├── setup/SKILL.md           # /scopi:setup — brand identity interview
│   ├── generate/SKILL.md        # /scopi:generate — full pipeline
│   ├── design/SKILL.md          # /scopi:design — VS visual exploration
│   ├── build/SKILL.md           # /scopi:build — capture + render
│   ├── review/SKILL.md          # /scopi:review — ethics + empathy QA
│   ├── content/SKILL.md         # /scopi:content — content ideation
│   ├── caption/SKILL.md         # /scopi:caption — social media copy
│   ├── theme/SKILL.md           # /scopi:theme — theme management
│   └── help/SKILL.md            # /scopi:help — command reference
│
├── agents/                      # 7 expert agent personas
│   ├── nara.md                  # Content Strategist
│   ├── gyeol.md                 # Visual Architect
│   ├── gana.md                  # Slide Engineer
│   ├── dari.md                  # Audience Strategist
│   ├── binna.md                 # Copy Surgeon
│   ├── juri.md                  # Ethics Inspector (read-only)
│   └── maru.md                  # Empathy Tester (read-only)
│
├── templates/                   # Core rendering engine
│   ├── design-system.js         # Dynamic theme-aware design tokens
│   ├── slide-renderer.js        # Config-aware component library
│   ├── generate.js              # HTML → PNG → PDF pipeline
│   ├── capture.js               # Playwright screenshot capture
│   └── layouts/                 # Example layouts (inspiration for free composition)
│       ├── hook.js, problem.js, solution.js, demo.js
│       ├── result.js, tip.js, caution.js, cta.js
│
├── themes/
│   └── README.md                # Explains dynamic theme generation
│
├── config/
│   └── scopi.config.example.json
├── hooks/
│   └── post-generate.sh
└── docs/
    ├── agents.md                # Agent persona reference
    ├── customization.md         # Full customization guide
    ├── vs-methodology.md        # VS creative design explanation
    └── specs/
        ├── PRD.md, SPEC.md, SDD.md, TDD.md
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [Agents](docs/agents.md) | Agent persona reference — backgrounds, responsibilities, dispatch flow |
| [Customization](docs/customization.md) | Full customization guide — themes, agents, layouts, series, hooks |
| [VS Methodology](docs/vs-methodology.md) | Verbalized Sampling — T-Scores, integration points, anti-drift |
| [PRD](docs/specs/PRD.md) | Product Requirements |
| [SPEC](docs/specs/SPEC.md) | Technical Specification |
| [SDD](docs/specs/SDD.md) | Software Design Document |
| [TDD](docs/specs/TDD.md) | Test Design Document |

---

## Troubleshooting

### Plugin not showing slash commands

Restart Claude Code after installing. Skills load at session start.

### Puppeteer errors during generation

```bash
cd ~/.claude/plugins/marketplaces/HosungYou-scopi-cardnews
npm install puppeteer
```

On macOS, allow Chromium in System Settings > Privacy & Security.

### Playwright capture not working

```bash
npx playwright install chromium
```

If Playwright is unavailable, the capture pipeline falls back to Puppeteer.

### Fonts not rendering correctly

The pipeline waits up to 5 seconds for Google Fonts, then uses fallbacks. Use fonts available on Google Fonts for best results.

### `scopi.config.json` not found

Run `/scopi:setup` in your project directory.

### Theme issues

In v2, themes are inline in `scopi.config.json`. Use `/scopi:theme customize` to adjust or `/scopi:theme regenerate` to create a new one.

---

## Uninstall

```bash
claude plugin uninstall scopi-cardnews
claude plugin marketplace remove scopi-cardnews  # optional
```

---

## Contributing

Contributions welcome!

- **Agent improvements** — Refine agent personas for better output
- **Layout examples** — Add example layouts for free composition inspiration
- **Pipeline enhancements** — Improve capture, rendering, or PDF assembly
- **Bug reports** — Open an issue with reproduction steps

### Development Setup

```bash
git clone https://github.com/HosungYou/scopi-cardnews.git
cd scopi-cardnews && npm install
claude --plugin-dir .
```

---

## License

MIT — see [LICENSE](LICENSE)

---

## Author

**Hosung You** — Pennsylvania State University, College of Education

Built with [Claude Code](https://claude.ai/code).
