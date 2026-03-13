---
name: scopi:theme
description: Browse, apply, or create visual themes for your card news — manage the theme system
user_invocable: true
---

# /scopi:theme — Theme Manager

You are running the Scopi theme manager. This lets users browse, apply, customize, and create themes.

## Input Modes

- `/scopi:theme` — Browse all available themes
- `/scopi:theme warm-scholar` — Apply a specific theme
- `/scopi:theme create` — Create a new custom theme
- `/scopi:theme customize` — Modify current theme tokens

## Flow: Browse

### List Available Themes

Read all `.json` files in the plugin's `themes/` directory. Display:

```
🎨 Available Themes

1. Warm Scholar (default)
   Ivory + terracotta — academic warmth
   ██████ #FAF9F5  ██████ #D97757

2. Midnight Academic
   Dark navy + gold — scholarly elegance
   ██████ #0F1B33  ██████ #D4A843

3. Minimal Mono
   White + black + red — Swiss clarity
   ██████ #FFFFFF  ██████ #E63946

4. Tech Neon
   Dark + neon green — cyberpunk tech
   ██████ #0D1117  ██████ #39D353

[+ any custom themes in project themes/ directory]

Current theme: [from scopi.config.json]
```

Use AskUserQuestion:

> **Select a theme to apply (1-4), or type "create" / "customize"**

## Flow: Apply

Update `scopi.config.json` to set the `theme` field to the selected theme name.

Confirm:
```
✅ Theme applied: [theme name]
   Run /scopi:build to regenerate slides with the new theme.
```

## Flow: Create

Use AskUserQuestion to gather:

1. **Theme name**: (e.g., "Ocean Breeze")
2. **Background color**: hex (e.g., #F0F4F8)
3. **Accent color**: hex (e.g., #2B6CB0)
4. **Text color**: hex (e.g., #1A202C)
5. **Card background**: hex (e.g., #FFFFFF)
6. **Terminal background**: hex (e.g., #1A202C)
7. **Font preference**: serif / sans-serif / monospace-heavy

Generate a complete theme JSON from these inputs, filling in derived colors (soft/medium/border variants, terminal palette). Write to `themes/[name-slug].json`.

## Flow: Customize

Read the current theme JSON. Display all tokens. Use AskUserQuestion to let the user modify specific tokens.

Write the updated theme back.

## Theme JSON Structure

```json
{
  "name": "Theme Name",
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
    "termHeader": "#...",
    "termPrompt": "#...",
    "termText": "#...",
    "termGreen": "#...",
    "termYellow": "#...",
    "termComment": "#..."
  },
  "fonts": {
    "heading": "...",
    "body": "...",
    "code": "..."
  }
}
```
