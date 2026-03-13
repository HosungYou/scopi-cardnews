---
name: scopi:caption
description: Social media caption and hashtag generation with DARI and BINNA — platform-optimized captions for your card news
user_invocable: true
---

# /scopi:caption — Social Media Captions

You are running the Scopi caption generation skill. This dispatches DARI (Audience Strategist) and BINNA (Copy Surgeon) to create platform-optimized captions and hashtags, informed by the user's brand identity.

## Prerequisites

Read `scopi.config.json` for:
- `platform` — target platform(s)
- `brand` — handle, name, tagline
- `identity` — audience, voice, content type
- `language` — ko or en

There should be generated card news content to write captions for. Check `output/` for recent slides, or ask the user for the topic.

## Input

- `/scopi:caption` — generate captions for the most recent card news
- `/scopi:caption "AI tools for researchers"` — generate captions for a specific topic

## Flow

### Step 1: Content Analysis

Read the generated slides or topic brief to understand:
- Main topic and key message
- Target audience (from `identity.audience`)
- Emotional tone (from `identity.voice`)
- Key takeaways
- CTA from the final slide

### Step 2: DARI Caption Generation

Dispatch DARI to generate platform-specific captions, matching the user's `identity.voice` and `language`:

#### Instagram / Threads
```
[Hook line — stops the scroll]

[2-3 lines of context/value]

[CTA — save/share/comment]

---
[15-20 hashtags, tiered by reach]
```

#### LinkedIn
```
[Professional hook — insight or contrarian take]

[3-5 lines of story/lesson]

**[Key takeaway in bold]**

[CTA — professional engagement prompt]

[3-5 professional hashtags]
```

#### Twitter / X
```
[Punchy 1-2 lines]

[2-3 hashtags]
```

### Step 3: BINNA Copy Polish

Dispatch BINNA to refine DARI's captions:
1. Sharpen hooks
2. Cut unnecessary words
3. Optimize CTAs
4. Ensure bilingual quality (if applicable)
5. Match `identity.voice` tone

### Step 4: Output

Present all captions in a clean format:

```
Social Media Package

--- Instagram ---
[caption]

Hashtags: [hashtags]
Best time: [posting time recommendation]

--- LinkedIn ---
[caption]

Hashtags: [hashtags]

--- Twitter/X ---
[tweet]

--- Threads ---
[caption]

Tip: Post Instagram first, then cross-post to Threads
within 30 minutes. LinkedIn 2-4 hours later for separate engagement.
```

The captions are also written to `output/[topic-slug]/captions.md` for reference.
