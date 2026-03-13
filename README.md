# 🦊 Scopi Cardnews

> **Professional card news generator plugin for [Claude Code](https://claude.ai/code)**
> 7 expert-persona agents · VS-powered creative design · HTML → PNG → PDF pipeline

Turn any topic into scroll-stopping social media card news. Scopi orchestrates 7 specialized AI agents — each with deep professional backgrounds — through a 7-phase production pipeline. Content strategy, visual design, copy refinement, HTML generation, screenshot capture, ethics review, and empathy testing, all from a single `/scopi:generate` command.

**For researchers, creators, and anyone who publishes visual content on social media.**

---

## Table of Contents

- [Installation](#installation)
- [Quick Start](#quick-start)
- [Commands](#commands)
- [The 7-Phase Pipeline](#the-7-phase-pipeline)
- [Expert Agents](#expert-agents)
- [Themes](#themes)
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

### Option 1: Marketplace Install (Recommended)

Register the marketplace and install the plugin in two commands:

```bash
# Step 1: Add the scopi-cardnews marketplace
claude plugin marketplace add HosungYou/scopi-cardnews

# Step 2: Install the plugin
claude plugin install scopi-cardnews@scopi-cardnews
```

That's it. The plugin is now available in all Claude Code sessions.

### Option 2: Local Install (for development)

```bash
# Clone the repository
git clone https://github.com/HosungYou/scopi-cardnews.git

# Install npm dependencies (for Puppeteer + pdf-lib)
cd scopi-cardnews && npm install

# Load as a local plugin for a single session
claude --plugin-dir /path/to/scopi-cardnews
```

### Verify Installation

```bash
# Check that the plugin is installed and enabled
claude plugin list
```

You should see:

```
❯ scopi-cardnews@scopi-cardnews
  Version: 1.0.0
  Scope: user
  Status: ✔ enabled
```

### Install Puppeteer Dependencies

The generation pipeline requires Puppeteer to render HTML into PNG screenshots. After installing the plugin, ensure npm dependencies are available:

```bash
# If installed via marketplace, dependencies are in the plugin cache.
# If you get Puppeteer errors, install manually:
cd ~/.claude/plugins/marketplaces/HosungYou-scopi-cardnews && npm install
```

---

## Quick Start

### 1. Configure your brand

```
/scopi:setup
```

An interactive wizard walks you through brand name, colors, platform, agents, and content series. Generates `scopi.config.json` in your working directory.

### 2. Brainstorm content

```
/scopi:content AI tools for academic writing
```

NARA (Content Strategist) proposes 3 creative directions using VS methodology, each scored by novelty. Pick your favorite.

### 3. Generate card news

```
/scopi:generate
```

The full 7-phase pipeline runs: content strategy → copy refinement → visual design → HTML slides → PNG screenshots → PDF carousel → ethics & empathy review.

### 4. Get social media copy

```
/scopi:caption
```

DARI and BINNA generate platform-optimized captions and hashtags for Instagram, LinkedIn, Twitter, and Threads.

### 5. Preview output

```
open output/your-topic/
```

You'll find individual PNG slides (`slide-01.png` through `slide-08.png`) and a combined `carousel.pdf` ready for LinkedIn upload.

---

## Commands

| Command | Agent(s) | Description |
|---------|----------|-------------|
| `/scopi:setup` | — | Interactive brand setup wizard → `scopi.config.json` |
| `/scopi:content` | NARA | Brainstorm topics with VS creative alternatives |
| `/scopi:design` | GYEOL | Explore visual directions before committing |
| `/scopi:generate` | All | Full 7-phase pipeline → PNG + PDF output |
| `/scopi:build` | GANA | Render existing HTML slides → PNG + PDF |
| `/scopi:caption` | DARI + BINNA | Social media captions + hashtags |
| `/scopi:review` | JURI + MARU | Ethics + empathy quality review (read-only) |
| `/scopi:theme` | GYEOL | Browse, apply, or create visual themes |
| `/scopi:help` | — | Show all commands and documentation |

---

## The 7-Phase Pipeline

`/scopi:generate` orchestrates a complete production pipeline:

```
Phase 1  NARA     Content strategy + story arc + VS alternatives
Phase 2  User     Select direction (or auto-commit to lowest T-Score)
Phase 3  BINNA    Copy refinement + tone calibration
Phase 4  GYEOL    Visual design tokens + layout selection
Phase 5  GANA     HTML generation + Puppeteer → PNG → PDF
Phase 6  JURI     Ethics review (read-only report)
Phase 7  MARU     Empathy test (read-only report)
```

**Output**: PNG slides + PDF carousel + quality review reports.

Each phase is optional — agents can be enabled/disabled in `scopi.config.json`. GANA (Slide Engineer) is the only required agent for generation.

---

## Expert Agents

7 agents with distinct professional backgrounds, each specialized for their phase.

| Agent | Korean | Role | Specialty | Type |
|-------|--------|------|-----------|------|
| **NARA** | 나라 | Content Strategist | Story arcs, hooks, VS ideation | Read/Write |
| **GYEOL** | 결 | Visual Architect | Design systems, themes, layout | Read/Write |
| **GANA** | 가나 | Slide Engineer | HTML coding, Puppeteer pipeline | Read/Write |
| **DARI** | 다리 | Audience Strategist | Captions, hashtags, platforms | Read/Write |
| **BINNA** | 빈나 | Copy Surgeon | Text refinement, bilingual copy | Read/Write |
| **JURI** | 주리 | Ethics Inspector | Ethics, copyright, accuracy | **Read-Only** |
| **MARU** | 마루 | Empathy Tester | Audience reaction, accessibility | **Read-Only** |

JURI and MARU are deliberately read-only — they review and report but never modify your content. This separation ensures unbiased quality assessment.

See [docs/agents.md](docs/agents.md) for full persona backgrounds and output formats.

---

## Themes

4 built-in visual themes. Switch with `/scopi:theme` or edit `scopi.config.json`.

| Theme | Colors | Mood |
|-------|--------|------|
| **warm-scholar** | Ivory `#FAF9F5` + Terracotta `#D97757` | Academic warmth (default) |
| **midnight-academic** | Navy `#0F1B33` + Gold `#D4A843` | Scholarly elegance |
| **minimal-mono** | White `#FFFFFF` + Red `#E63946` | Swiss design clarity |
| **tech-neon** | Dark `#0D1117` + Green `#39D353` | Cyberpunk tech |

Create custom themes by adding a JSON file to `themes/`. See [docs/customization.md](docs/customization.md).

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
2. **Visual design** (GYEOL) — how slides look
3. **Layout structure** (GANA) — how slides are composed

See [docs/vs-methodology.md](docs/vs-methodology.md) for the full explanation.

---

## Customization

Scopi is designed for deep customization at every level:

| What | How |
|------|-----|
| **Brand** | Edit `brand` in `scopi.config.json` |
| **Theme** | Create a theme JSON in `themes/`, or use `/scopi:theme create` |
| **Agents** | Add custom agent `.md` files in `agents/` |
| **Layouts** | Add layout `.js` components in `templates/layouts/` |
| **Series** | Define content series with tags, colors, tones in config |
| **Dimensions** | Set any width/height for any platform |
| **Pipeline** | Toggle retina, choose output formats (png/pdf) |

See [docs/customization.md](docs/customization.md) for the full guide with code examples.

---

## Project Structure

```
scopi-cardnews/
├── .claude-plugin/
│   ├── marketplace.json         # Marketplace registry manifest
│   └── plugin.json              # Plugin entry point
├── plugin.json                  # Plugin manifest (skills + agents)
├── package.json                 # npm deps (puppeteer, pdf-lib)
│
├── skills/                      # 9 slash commands
│   ├── setup/SKILL.md           # /scopi:setup
│   ├── generate/SKILL.md        # /scopi:generate
│   ├── design/SKILL.md          # /scopi:design
│   ├── build/SKILL.md           # /scopi:build
│   ├── review/SKILL.md          # /scopi:review
│   ├── content/SKILL.md         # /scopi:content
│   ├── caption/SKILL.md         # /scopi:caption
│   ├── theme/SKILL.md           # /scopi:theme
│   └── help/SKILL.md            # /scopi:help
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
│   ├── design-system.js         # Theme-aware design tokens
│   ├── slide-renderer.js        # Config-aware component library
│   ├── generate.js              # HTML → PNG → PDF pipeline
│   └── layouts/                 # 8 slide layout components
│       ├── hook.js              # Slide 1: crisis hook (accent)
│       ├── problem.js           # Slide 2: pain points
│       ├── solution.js          # Slide 3: solution reveal
│       ├── demo.js              # Slide 4: terminal demo
│       ├── result.js            # Slide 5: before/after
│       ├── tip.js               # Slide 6: power-user tip
│       ├── caution.js           # Slide 7: ethics/limitations
│       └── cta.js               # Slide 8: CTA + teaser
│
├── themes/                      # Visual theme presets
│   ├── warm-scholar.json
│   ├── midnight-academic.json
│   ├── minimal-mono.json
│   └── tech-neon.json
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
        ├── PRD.md               # Product Requirements Document
        ├── SPEC.md              # Technical Specification
        ├── SDD.md               # Software Design Document
        └── TDD.md               # Test Design Document
```

---

## Documentation

| Document | Description |
|----------|-------------|
| [PRD](docs/specs/PRD.md) | Product Requirements — features, user personas, success metrics, release plan |
| [SPEC](docs/specs/SPEC.md) | Technical Specification — architecture, module specs, config schema, error handling |
| [SDD](docs/specs/SDD.md) | Software Design — layered architecture, token resolution, agent design, extensibility |
| [TDD](docs/specs/TDD.md) | Test Design — unit/integration/plugin/visual test cases, acceptance criteria |
| [Agents](docs/agents.md) | Agent persona reference — backgrounds, responsibilities, dispatch flow |
| [Customization](docs/customization.md) | Full customization guide — themes, agents, layouts, series, hooks |
| [VS Methodology](docs/vs-methodology.md) | Verbalized Sampling explanation — T-Scores, integration points, anti-drift |

---

## Troubleshooting

### Plugin not showing slash commands

Restart Claude Code after installing the plugin. Skills load at session start.

```bash
# Verify installation
claude plugin list | grep scopi
```

### Puppeteer errors during generation

The rendering pipeline requires Chromium. If Puppeteer can't launch:

```bash
# Reinstall puppeteer with Chromium
cd ~/.claude/plugins/marketplaces/HosungYou-scopi-cardnews
npm install puppeteer
```

On macOS, you may need to allow Chromium in System Settings > Privacy & Security.

### Fonts not rendering correctly

The pipeline waits up to 5 seconds for Google Fonts to load, then proceeds with fallbacks. For consistent results:
- Use fonts available on Google Fonts (Inter, Source Serif 4, Fira Code are defaults)
- The pipeline adds an 800ms settle time after font load

### `scopi.config.json` not found

Run `/scopi:setup` in your project directory to generate the config file. The config is per-project and gitignored by default.

### Theme not applying

Ensure the theme name in `scopi.config.json` matches a `.json` filename in `themes/` (without the extension):

```json
{ "theme": "midnight-academic" }
```

matches `themes/midnight-academic.json`.

---

## Uninstall

```bash
# Remove the plugin
claude plugin uninstall scopi-cardnews

# Remove the marketplace (optional)
claude plugin marketplace remove scopi-cardnews
```

---

## Update

```bash
# Update to latest version
claude plugin update scopi-cardnews
```

Or, to refresh the marketplace cache:

```bash
claude plugin marketplace update scopi-cardnews
```

---

## Contributing

Contributions welcome! Some ways to contribute:

- **New themes** — Add a theme JSON to `themes/` and submit a PR
- **New layouts** — Build reusable slide layout components
- **Agent improvements** — Refine agent personas for better output
- **Bug reports** — Open an issue with reproduction steps

### Development Setup

```bash
git clone https://github.com/HosungYou/scopi-cardnews.git
cd scopi-cardnews
npm install

# Test locally
claude --plugin-dir .
```

### Plugin Validation

```bash
claude plugin validate .
```

---

## License

MIT — see [LICENSE](LICENSE)

---

## Author

**Hosung You** — Pennsylvania State University, College of Education

Built with [Claude Code](https://claude.ai/code).
