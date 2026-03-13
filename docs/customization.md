# Customization Guide

Scopi Card News is designed for deep customization at every level — themes, agents, layouts, series, dimensions, and pipeline settings.

## Prerequisites

- Plugin installed and enabled (`claude plugin list` should show `scopi-cardnews`)
- `/scopi:setup` run at least once in your project directory (creates `scopi.config.json`)
- `npm install` completed in the plugin directory (for Puppeteer rendering)

## Configuration (`scopi.config.json`)

The config file controls all aspects of your card news generation. It is created by `/scopi:setup` and lives in your project root. It is gitignored by default — each project has its own config.

```json
{
  "brand": {
    "name": "Your Brand",
    "handle": "@your.handle",
    "author": "Your Name",
    "tagline": "Your Tagline"
  },
  "theme": "warm-scholar",
  "dimensions": { "width": 1080, "height": 1350 },
  "platform": "instagram",
  "agents": {
    "active": ["nara", "gyeol", "gana", "dari", "binna", "juri", "maru"],
    "custom": []
  },
  "series": [
    { "tag": "recipe", "color": "#D97757", "tone": "practical" }
  ],
  "pipeline": {
    "retina": true,
    "format": ["png", "pdf"]
  }
}
```

## Themes

### Using Built-in Themes

Set `theme` in config to one of:
- `warm-scholar` — Ivory + terracotta (default)
- `midnight-academic` — Dark navy + gold
- `minimal-mono` — White + black + red accent
- `tech-neon` — Dark + neon green

### Creating a Custom Theme

1. Create a JSON file in the plugin's `themes/` directory (or your project's `themes/`)
2. Follow the theme JSON structure:

```json
{
  "name": "My Theme",
  "description": "One-line description",
  "colors": {
    "warmBg": "#...",
    "accent": "#...",
    "accentBg": "#...",
    "accentText": "#...",
    "textPrimary": "#...",
    "textSecondary": "#...",
    "textTertiary": "#...",
    "cardBg": "#...",
    "termBg": "#...",
    "termHeader": "#..."
  },
  "fonts": {
    "heading": "'Font Name', sans-serif",
    "body": "'Font Name', serif",
    "code": "'Font Name', monospace"
  }
}
```

3. Set `"theme": "my-theme"` in `scopi.config.json`

### Color Token Reference

| Token | Purpose | Example |
|-------|---------|---------|
| `warmBg` | Primary slide background | `#FAF9F5` |
| `accent` | Accent color (highlights, badges) | `#D97757` |
| `accentBg` | Accent slide background | `#D97757` |
| `accentText` | Text on accent background | `#FFFFFF` |
| `textPrimary` | Main headings | `#141413` |
| `textSecondary` | Body text | `#4A4845` |
| `textTertiary` | Captions, meta | `#8A8680` |
| `cardBg` | Card component background | `#FFFFFF` |
| `termBg` | Terminal mockup background | `#2D2A2E` |
| `termHeader` | Terminal header bar | `#383539` |
| `termPrompt` | Terminal prompt color | `#D97757` |

## Layout Components

### Built-in Layouts

| Layout | File | Slide Position | Background |
|--------|------|---------------|------------|
| Hook | `templates/layouts/hook.js` | 1 | Accent |
| Problem | `templates/layouts/problem.js` | 2 | Warm |
| Solution | `templates/layouts/solution.js` | 3 | Warm |
| Demo | `templates/layouts/demo.js` | 4 | Warm |
| Result | `templates/layouts/result.js` | 5 | Warm |
| Tip | `templates/layouts/tip.js` | 6 | Warm |
| Caution | `templates/layouts/caution.js` | 7 | Warm |
| CTA | `templates/layouts/cta.js` | 8 | Accent |

### Creating Custom Layouts

Create a new `.js` file in `templates/layouts/`:

```javascript
function myLayout(renderer, data) {
  const { DESIGN, slideWrapper, footer } = renderer;
  const D = DESIGN.colors;
  const F = DESIGN.fonts;

  const content = `
    <!-- Your slide HTML here -->
    <h2 style="font-size: ${DESIGN.fontSize.title}; color: ${D.textPrimary};">
      ${data.title}
    </h2>
    ${footer('warm', data.pageNum, data.totalPages)}
  `;

  return slideWrapper('warm', content);
}

module.exports = { myLayout };
```

Key rules:
- Always use `slideWrapper()` for the outer HTML document
- Always use design tokens from `DESIGN` — never hardcode colors/fonts
- Use inline styles only (no external CSS)
- Fill 100% vertical space

## Agents

### Selecting Active Agents

In `scopi.config.json`, set `agents.active` to include only the agents you want:

```json
{
  "agents": {
    "active": ["nara", "gana"],
    "custom": []
  }
}
```

Removing an agent means its phase is skipped in the pipeline. GANA is the minimum required agent for generation.

### Custom Agents

1. Create a `.md` file in `agents/` following the agent persona format
2. Add the filename (without `.md`) to `agents.custom` in config
3. The agent will appear in `/scopi:setup` and can be dispatched by skills

## Dimensions

### Platform Presets

| Platform | Width | Height | Ratio |
|----------|-------|--------|-------|
| Instagram | 1080 | 1350 | 4:5 |
| LinkedIn | 1920 | 1080 | 16:9 |
| Twitter/X | 1600 | 900 | 16:9 |
| Square | 1080 | 1080 | 1:1 |

### Custom Dimensions

Set any width/height in config:

```json
{
  "dimensions": { "width": 1200, "height": 1500 }
}
```

## Content Series

Define series for consistent branding across episodes:

```json
{
  "series": [
    { "tag": "AI Recipes", "color": "#D97757", "tone": "practical" },
    { "tag": "Research Tips", "color": "#2B6CB0", "tone": "academic" },
    { "tag": "Tool Reviews", "color": "#38A169", "tone": "casual" }
  ]
}
```

Series properties:
- `tag` — Display name shown in the series badge
- `color` — Accent color override for this series
- `tone` — Guides NARA and BINNA's writing style (practical/academic/storytelling/casual/technical)

## Pipeline

### Output Formats

```json
{
  "pipeline": {
    "retina": true,
    "format": ["png", "pdf"]
  }
}
```

- `retina: true` — Renders at 2x resolution (default)
- `format` — Choose `["png"]`, `["pdf"]`, or `["png", "pdf"]`

## Hooks

The `hooks/post-generate.sh` script runs after generation completes. Customize it to:
- Open the output folder
- Upload to a CDN
- Trigger a notification
- Run additional processing

## Marketplace Development

If you've forked or cloned this plugin for development, you can test changes locally before publishing:

```bash
# Load your local copy for a single session
claude --plugin-dir /path/to/your/scopi-cardnews

# Validate plugin structure
claude plugin validate /path/to/your/scopi-cardnews
```

### Publishing Your Fork as a Marketplace

If you want to distribute a customized version:

1. Push your fork to a public GitHub repository
2. Ensure `.claude-plugin/marketplace.json` and `.claude-plugin/plugin.json` exist
3. Users can add your marketplace:

```bash
claude plugin marketplace add YourGitHub/your-scopi-fork
claude plugin install your-plugin-name@your-marketplace-name
```

### Updating the Plugin

After pushing changes to GitHub:

```bash
# Users update via:
claude plugin marketplace update scopi-cardnews
claude plugin update scopi-cardnews
```
