# Customization Guide

Scopi Card News is designed for deep customization — themes, agents, layouts, series, dimensions, and pipeline settings.

## Configuration (`scopi.config.json`)

The config file is created by `/scopi:setup` and lives in your project root.

```json
{
  "language": "ko",
  "brand": {
    "name": "Your Brand",
    "handle": "@your.handle",
    "author": "Your Name",
    "tagline": "Your Tagline"
  },
  "identity": {
    "contentType": "academic",
    "audience": "PhD students, early-career faculty",
    "audiencePainPoints": "Literature reviews take too long",
    "voice": "professional-warm",
    "visualStyle": "warm-academic",
    "priority": "information,visual-impact",
    "captureTargets": ["elicit.com", "consensus.app"]
  },
  "theme": {
    "name": "Generated Theme Name",
    "description": "One-line description",
    "colors": { "warmBg": "#FAF9F5", "accent": "#D97757", "..." : "..." },
    "fonts": { "heading": "'Inter', sans-serif", "body": "'Source Serif 4', serif", "code": "'Fira Code', monospace" }
  },
  "dimensions": { "width": 1080, "height": 1350 },
  "platform": "instagram",
  "agents": {
    "active": ["nara", "gyeol", "gana", "dari", "binna", "juri", "maru"],
    "custom": []
  },
  "series": [],
  "pipeline": {
    "retina": true,
    "format": ["png", "pdf"],
    "capture": true
  }
}
```

## Dynamic Themes

In v2, themes are **dynamically generated** during `/scopi:setup` based on your brand identity interview. There are no preset theme files.

### Viewing Your Theme

```
/scopi:theme
```

Displays your current theme colors, fonts, and options.

### Customizing Your Theme

```
/scopi:theme customize
```

Describe changes naturally: "accent color to blue", "darker background", "use Playfair Display for headings". GYEOL interprets and applies changes while maintaining color harmony.

### Regenerating Your Theme

```
/scopi:theme regenerate
```

GYEOL generates 3 new theme options using VS methodology, based on your identity data. Pick your favorite.

### Color Token Reference

| Token | Purpose |
|-------|---------|
| `warmBg` | Primary slide background |
| `accent` | Accent color (highlights, badges) |
| `accentBg` | Accent slide background |
| `accentText` | Text on accent background |
| `accentTextSoft` | Soft text on accent background |
| `textPrimary` | Main headings |
| `textSecondary` | Body text |
| `textTertiary` | Captions, meta |
| `cardBg` | Card component background |
| `accentSoft` | Soft accent (borders, backgrounds) |
| `accentMedium` | Medium accent opacity |
| `accentBorder` | Accent border color |
| `termBg` | Terminal mockup background |
| `termHeader` | Terminal header bar |
| `termPrompt` | Terminal prompt color |
| `termText` | Terminal text color |
| `termGreen` | Terminal green (success) |
| `termYellow` | Terminal yellow (warning) |
| `termComment` | Terminal comment color |

## Free Composition (Layout System)

In v2, GYEOL designs **unique HTML/CSS for each slide** based on content. The layout files in `templates/layouts/` are examples and inspiration, not rigid templates.

### How It Works

1. GYEOL considers the CONTENT of each slide
2. GYEOL considers visual rhythm (what comes before and after)
3. GYEOL designs a layout that serves the content
4. GANA builds it using components from `slide-renderer.js`

### Content-Adaptive Design

| Content Type | Design Approach |
|-------------|----------------|
| Tool/service review | Center a Playwright screenshot, minimal text |
| Data/statistics | Oversized number (200px+), supporting context |
| Before/after | True split layout (left vs right, or top vs bottom) |
| Quote/hook | Oversized text, asymmetric placement |
| Terminal demo | Full-bleed terminal mockup |
| List/tips | Numbered items with visual hierarchy |

### Available Components

From `slide-renderer.js`:
- `slideWrapper(mode, content)` — Full HTML document wrapper
- `terminal(header, lines)` — Terminal/CLI mockup
- `card(title, content)` — Content card
- `accentBlock(content)` — Accent-colored block
- `footer(mode, pageNum, totalPages)` — Slide footer with branding
- `seriesTag(mode)` — Series label badge
- `numberBadge(num, mode)` — Numbered badge

## Playwright Capture

Real screenshots of tools/services can be embedded in slides.

### How It Works

1. NARA identifies capturable URLs during content strategy
2. GANA runs the capture pipeline (`templates/capture.js`)
3. Screenshots are saved to `assets/captures/`
4. GYEOL designs slides around the captures
5. GANA embeds captures as base64 data URIs

### Pre-registering Capture Targets

Add URLs to `identity.captureTargets` in config:

```json
{
  "identity": {
    "captureTargets": ["elicit.com", "consensus.app", "claude.ai"]
  }
}
```

NARA will also use WebSearch to find URLs for tools/services mentioned in content.

## Agents

### Selecting Active Agents

```json
{
  "agents": {
    "active": ["nara", "gana"],
    "custom": []
  }
}
```

Removing an agent skips its phase. GANA is the minimum required agent.

### Custom Agents

1. Create a `.md` file in `agents/` following the agent persona format
2. Add the filename (without `.md`) to `agents.custom` in config

## Dimensions

| Platform | Width | Height | Ratio |
|----------|-------|--------|-------|
| Instagram | 1080 | 1350 | 4:5 |
| LinkedIn | 1920 | 1080 | 16:9 |
| Twitter/X | 1600 | 900 | 16:9 |
| Square | 1080 | 1080 | 1:1 |

Custom: set any width/height in config.

## Content Series

```json
{
  "series": [
    { "tag": "AI Recipes", "color": "#D97757", "tone": "practical" },
    { "tag": "Research Tips", "color": "#2B6CB0", "tone": "academic" }
  ]
}
```

## Pipeline

```json
{
  "pipeline": {
    "retina": true,
    "format": ["png", "pdf"],
    "capture": true
  }
}
```

- `retina: true` — Renders at 2x resolution (default)
- `format` — Choose `["png"]`, `["pdf"]`, or `["png", "pdf"]`
- `capture: true` — Enable Playwright screenshot capture
