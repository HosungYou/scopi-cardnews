# 🦊 Scopi Cardnews

**Professional card news generator plugin for Claude Code** — expert-persona agents, VS-powered creative design, and a full HTML → PNG → PDF pipeline.

Turn any topic into scroll-stopping social media card news with 7 expert AI agents, 4 visual themes, and creative direction powered by Verbalized Sampling (VS).

## Features

- **7 Expert Agents** — Content strategist, visual architect, slide engineer, audience strategist, copy surgeon, ethics inspector, empathy tester
- **VS Creative Design** — Verbalized Sampling prevents generic "mode collapse" output
- **4 Built-in Themes** — Warm Scholar, Midnight Academic, Minimal Mono, Tech Neon
- **Full Pipeline** — HTML → Puppeteer → PNG → PDF in one command
- **9 Slash Commands** — Setup wizard, content ideation, design exploration, generation, review, captions
- **Deep Customization** — Custom themes, agents, layouts, series, dimensions

## Quick Start

### 1. Install

```bash
claude plugin add /path/to/scopi-cardnews
cd your-project && npm install --prefix /path/to/scopi-cardnews
```

### 2. Setup

```
/scopi:setup
```

Interactive wizard configures your brand, theme, platform, and agents. Generates `scopi.config.json`.

### 3. Create

```
/scopi:content AI tools for academic writing
```

Brainstorm content ideas with NARA using VS alternatives.

### 4. Generate

```
/scopi:generate
```

Full 7-phase pipeline: content strategy → copy → design → HTML → PNG → PDF.

### 5. Publish

```
/scopi:caption
```

Platform-optimized captions and hashtags for Instagram, LinkedIn, Twitter, Threads.

## Commands

| Command | Description |
|---------|-------------|
| `/scopi:setup` | Interactive brand setup wizard |
| `/scopi:generate` | Full pipeline: content → slides → PNG → PDF |
| `/scopi:design` | VS-powered visual design exploration |
| `/scopi:build` | Capture HTML → PNG + PDF |
| `/scopi:review` | Ethics + empathy QA review |
| `/scopi:content` | Content ideation with VS alternatives |
| `/scopi:caption` | Social media captions + hashtags |
| `/scopi:theme` | Browse, apply, or create themes |
| `/scopi:help` | Show all commands + docs |

## Agents

| Agent | Role | Specialty |
|-------|------|-----------|
| **NARA** (나라) | Content Strategist | Story arcs, hooks, VS ideation |
| **GYEOL** (결) | Visual Architect | Design systems, themes, layout |
| **GANA** (가나) | Slide Engineer | HTML coding, Puppeteer pipeline |
| **DARI** (다리) | Audience Strategist | Captions, hashtags, platforms |
| **BINNA** (빈나) | Copy Surgeon | Text refinement, tone, bilingual |
| **JURI** (주리) | Ethics Inspector | Ethics review (read-only) |
| **MARU** (마루) | Empathy Tester | Audience empathy (read-only) |

## Themes

| Theme | Description |
|-------|-------------|
| `warm-scholar` | Ivory + terracotta — academic warmth (default) |
| `midnight-academic` | Dark navy + gold — scholarly elegance |
| `minimal-mono` | White + black + red — Swiss clarity |
| `tech-neon` | Dark + neon green — cyberpunk tech |

## VS Methodology

Verbalized Sampling prevents AI "mode collapse" by generating **3 alternatives scored by novelty** (T-Score). Lower T-Score = more creative. The system recommends the most novel option that maintains clarity.

See [docs/vs-methodology.md](docs/vs-methodology.md) for details.

## Customization

- **Themes** — Create custom theme JSON files
- **Agents** — Add custom agent personas
- **Layouts** — Build new slide layout components
- **Series** — Define content series with colors and tones
- **Dimensions** — Any width/height for any platform

See [docs/customization.md](docs/customization.md) for the full guide.

## Project Structure

```
scopi-cardnews/
├── plugin.json              # Plugin manifest
├── package.json             # npm dependencies
├── skills/                  # 9 slash command skills
├── agents/                  # 7 expert agent personas
├── templates/               # Core engine
│   ├── design-system.js     # Theme-aware design tokens
│   ├── slide-renderer.js    # Config-aware component library
│   ├── generate.js          # HTML → PNG → PDF pipeline
│   └── layouts/             # 8 slide layout components
├── themes/                  # 4 visual theme presets
├── hooks/                   # Post-generation hooks
├── config/                  # Example configuration
└── docs/                    # Documentation
```

## Requirements

- [Claude Code](https://claude.com/claude-code) CLI
- Node.js 18+
- Puppeteer (installed via `npm install`)

## License

MIT — see [LICENSE](LICENSE)

## Author

**Hosung You** — Penn State College of Education

Built with Claude Code.
