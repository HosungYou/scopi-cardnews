---
name: scopi:theme
description: View, customize, or regenerate your dynamically generated theme
user_invocable: true
---

# /scopi:theme — Theme Manager

You are running the Scopi theme manager. In v2, themes are dynamically generated during `/scopi:setup` based on the brand identity interview — there are no preset themes. This skill lets users view, customize, or regenerate their theme.

## Input Modes

- `/scopi:theme` — View current theme details
- `/scopi:theme customize` — Modify specific theme tokens
- `/scopi:theme regenerate` — Re-run GYEOL's theme generation with new parameters

## Flow: View

Read `scopi.config.json` and display the current inline theme:

```
Your Theme: [theme name]
[description]

Colors:
  Background:  [warmBg]
  Accent:      [accent]
  Text:        [textPrimary] / [textSecondary] / [textTertiary]
  Card:        [cardBg]
  Terminal:    [termBg] / [termHeader]

Fonts:
  Heading: [heading font]
  Body:    [body font]
  Code:    [code font]

Options:
  /scopi:theme customize   — Modify specific tokens
  /scopi:theme regenerate  — Generate a new theme from scratch
```

## Flow: Customize

Read the current theme from `scopi.config.json`. Use AskUserQuestion:

> **What would you like to change?**
> Examples: "accent color to #3B82F6", "heading font to Playfair Display", "darker background"
> You can describe changes naturally — GYEOL will interpret and apply them.

Dispatch GYEOL to:
1. Interpret the user's request
2. Adjust the relevant tokens
3. Ensure color harmony is maintained (derived colors like accentSoft, accentBorder update automatically)
4. Present the updated theme for approval

Update `scopi.config.json` with the new theme values.

## Flow: Regenerate

Use AskUserQuestion:

> **What visual direction do you want?**
> Describe the mood, style, or reference — or answer these:
> 1. Warm/cool/dark/light?
> 2. Any specific colors?
> 3. Any reference brands or styles?

Dispatch GYEOL to generate a completely new theme based on:
- The user's new direction
- Existing `identity` data from config
- VS methodology (3 options with T-Scores)

Present 3 theme options:

```
GYEOL's Theme Options

Option A (T=0.78): [name]
  [description]
  Background: [warmBg] Accent: [accent]
  Fonts: [heading] + [body]

Option B (T=0.45): [name]
  [description]
  Background: [warmBg] Accent: [accent]
  Fonts: [heading] + [body]

Option C (T=0.29): [name]
  [description]
  Background: [warmBg] Accent: [accent]
  Fonts: [heading] + [body]

Recommended: Option [X]
```

Use AskUserQuestion:

> **Which theme? (A/B/C)**

Write the selected theme to `scopi.config.json`.

## Theme Structure (in scopi.config.json)

```json
{
  "theme": {
    "name": "Generated Theme Name",
    "description": "One-line description",
    "colors": {
      "warmBg": "#...",
      "accent": "#...",
      "accentBg": "#...",
      "accentText": "#...",
      "accentTextSoft": "rgba(...)",
      "textPrimary": "#...",
      "textSecondary": "#...",
      "textTertiary": "#...",
      "cardBg": "#...",
      "accentSoft": "rgba(...)",
      "accentMedium": "rgba(...)",
      "accentBorder": "rgba(...)",
      "termBg": "#...",
      "termHeader": "#...",
      "termPrompt": "#...",
      "termText": "#...",
      "termGreen": "#...",
      "termYellow": "#...",
      "termComment": "#..."
    },
    "fonts": {
      "heading": "'Font', 'Fallback', sans-serif",
      "body": "'Font', 'Fallback', serif",
      "code": "'Fira Code', monospace"
    }
  }
}
```

Themes are always inline in the config — never separate JSON files.
