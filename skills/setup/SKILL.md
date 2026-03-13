---
name: scopi:setup
description: Interactive brand setup wizard — configure your brand, theme, platform, agents, and series for card news generation
user_invocable: true
---

# /scopi:setup — Brand Setup Wizard

You are running the Scopi Card News setup wizard. Guide the user through configuring their brand identity, visual theme, target platform, active agents, and content series. Output a `scopi.config.json` file.

## Step 1: Welcome Banner

Display this ASCII art banner:

```
    🦊
   /|  |\
  / |  | \
 /  |__|  \    ╔═══════════════════════════════════╗
    |  |       ║   S C O P I   C A R D N E W S     ║
   /|  |\      ║   ─────────────────────────────    ║
  🧭  🎓      ║   Navigate your story.             ║
               ╚═══════════════════════════════════╝

  Welcome! Let's set up your card news brand.
  I'll ask a few questions to configure your workspace.
```

## Step 2: Content Type

Use AskUserQuestion to ask:

> **What type of content do you create?**
>
> 1. Academic — research, papers, educational content
> 2. Business — product launches, case studies, industry insights
> 3. Personal Brand — thought leadership, tutorials, tips
> 4. Other — tell me more!

Store the answer as `contentType`.

## Step 3: Brand Name

Use AskUserQuestion:

> **What's your brand name?** (e.g., "Scopi", "Lab Notes", your name)

Store as `brand.name`.

## Step 4: Brand Details

Use AskUserQuestion:

> **A few more brand details:**
>
> - **Handle** (social media): e.g., @scopi.lab
> - **Author name**: How you sign your slides
> - **Tagline** (optional): e.g., "AI x Academia"
>
> Enter as: handle, author, tagline (or just handle, author)

Parse and store as `brand.handle`, `brand.author`, `brand.tagline`.

## Step 5: Theme Selection

Use AskUserQuestion:

> **Choose a visual theme:**
>
> 1. **Warm Scholar** — Ivory + terracotta. Academic warmth. (default)
> 2. **Midnight Academic** — Dark navy + gold. Scholarly elegance.
> 3. **Minimal Mono** — White + black + red accent. Swiss clarity.
> 4. **Tech Neon** — Dark + neon green. Cyberpunk tech.
> 5. **Custom** — I'll provide my own colors.

If Custom: ask for primary background hex, accent hex, and text hex. Create a new theme JSON in `themes/custom.json`.

Store as `theme`.

## Step 6: Target Platform

Use AskUserQuestion:

> **Primary target platform?**
>
> 1. Instagram (1080x1350, 4:5 portrait)
> 2. LinkedIn (1920x1080, 16:9 landscape)
> 3. Twitter/X (1600x900, 16:9)
> 4. Multi-platform (1080x1350 default, adjust per post)

Set dimensions accordingly:
- Instagram: 1080x1350
- LinkedIn: 1920x1080
- Twitter: 1600x900
- Multi: 1080x1350

Store as `platform` and `dimensions`.

## Step 7: Active Agents

Use AskUserQuestion:

> **Which expert agents do you want active?** (comma-separated numbers, or "all")
>
> 1. NARA — Content Strategist (story arcs, hooks, VS ideation)
> 2. GYEOL — Visual Architect (design system, themes, layout)
> 3. GANA — Slide Engineer (HTML coding, Puppeteer pipeline)
> 4. DARI — Audience Strategist (captions, hashtags, platform optimization)
> 5. BINNA — Copy Surgeon (text refinement, tone, bilingual copy)
> 6. JURI — Ethics Inspector (ethics review, copyright check) [read-only]
> 7. MARU — Empathy Tester (audience reaction, accessibility) [read-only]
>
> Recommended: all (1-7)

Store as `agents.active` array of agent names.

## Step 8: Content Series (Optional)

Use AskUserQuestion:

> **Do you have a content series planned?** (optional — you can add these later)
>
> If yes, provide: series name, color hex, tone (practical/storytelling/technical/casual)
> Example: "AI Recipes, #D97757, practical"
>
> Enter series or type "skip"

If provided, parse and store as `series` array.

## Step 9: Generate Config

Write `scopi.config.json` to the current working directory:

```json
{
  "brand": {
    "name": "[from step 3]",
    "handle": "[from step 4]",
    "author": "[from step 4]",
    "tagline": "[from step 4]"
  },
  "theme": "[from step 5]",
  "dimensions": { "width": [number], "height": [number] },
  "platform": "[from step 6]",
  "agents": {
    "active": ["nara", "gyeol", "gana", "dari", "binna", "juri", "maru"],
    "custom": []
  },
  "series": [
    { "tag": "[name]", "color": "[hex]", "tone": "[tone]" }
  ],
  "pipeline": {
    "retina": true,
    "format": ["png", "pdf"]
  }
}
```

## Step 10: Confirmation

Display:

```
  ✅ Brand configured!

  📋 Summary:
     Brand: [name] (@[handle])
     Theme: [theme name]
     Platform: [platform] ([width]x[height])
     Agents: [count] active
     Series: [count] defined

  🚀 Ready to create! Try:
     /scopi:content  — Brainstorm content ideas
     /scopi:generate — Generate a full card news set
     /scopi:help     — See all commands
```
