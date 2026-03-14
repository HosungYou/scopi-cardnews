# Contributing to Scopi Card News

## Development Setup

### Prerequisites
- Node.js 18+
- Claude Code CLI
- Git

### Install dependencies
```bash
cd /Volumes/External\ SSD/Projects/scopi-cardnews
npm install
npx playwright install chromium  # optional, for external captures
```

## Development Workflow

### 1. Enable Dev Mode

Dev mode symlinks the plugin cache to your source directory, so changes take effect immediately in Claude Code without redeploying.

```bash
./scripts/dev-mode.sh on
```

This creates a symlink:
```
~/.claude/plugins/cache/scopi-cardnews/scopi-cardnews/2.0.0/
  → /Volumes/External SSD/Projects/scopi-cardnews/
```

**Important:** Always disable dev mode before deploying:
```bash
./scripts/dev-mode.sh off
```

### 2. Make Changes

Edit files in the source directory. Key locations:

| Directory | Purpose |
|-----------|---------|
| `templates/` | Core engine (renderer, design system, capture, generate) |
| `skills/` | Skill definitions (SKILL.md files) |
| `agents/` | Agent persona definitions |
| `config/` | Default configuration |
| `scripts/` | Development and deployment scripts |

### 3. Test

```bash
# Verify renderer components
node -e "const r = require('./templates/slide-renderer.js'); \
  const s = r.createRenderer({cwd:'./config'}); \
  console.log(Object.keys(s).join(', '))"

# Test content validator
node -e "const {validateContentDepth} = require('./templates/content-validator.js'); \
  console.log(validateContentDepth([{data:'54.8%'}]).verdict)"

# Test license checker
node -e "const {checkLicense} = require('./templates/license-checker.js'); \
  console.log(checkLicense({source:'unsplash'}))"

# Generate test slides
node templates/generate.js --slides=output/test/slides.js --out=output/test
```

### 4. Deploy

One-click deployment handles everything:

```bash
./scripts/deploy.sh patch   # 2.0.0 → 2.0.1
./scripts/deploy.sh minor   # 2.0.0 → 2.1.0
./scripts/deploy.sh major   # 2.0.0 → 3.0.0
```

This automatically:
1. Bumps version in `package.json`, `plugin.json`, `marketplace.json`
2. Commits and pushes to GitHub
3. Clears old plugin cache
4. Creates new cache with dependencies
5. Updates `installed_plugins.json` registry

**Restart Claude Code** after deploying to load the new version.

## Architecture

### Agent Pipeline

```
NARA (Content) → BINNA (Copy) → GANA (Capture + Build)
                                      ↓
                              GYEOL (Visual Design)
                                      ↓
                              Puppeteer (Render)
                                      ↓
                              JURI + MARU (QA Gate)
```

### Component Library

All visual components live in `slide-renderer.js`. When adding new components:

1. Define the function inside `createRenderer()`
2. Use design tokens (`D.accent`, `F.heading`, `S.gap`) — never hardcode values
3. Support both `warm` and `accent` modes
4. Add to the `return` object
5. Test with `createRenderer({cwd:'./config'})`

### QA Gate

The QA gate (`qa-gate.js`) enforces quality checks:

- **JURI** (Ethics): MUST FIX items block output
- **MARU** (Empathy): Score below `pipeline.minQAScore` (default: 3.0) blocks output
- Configure via `scopi.config.json`:
  ```json
  {
    "pipeline": {
      "strictQA": true,
      "minQAScore": 3.0
    }
  }
  ```

## Code Style

- JavaScript (CommonJS modules)
- No TypeScript, no build step
- Template literals for HTML generation
- Design tokens for all visual values
- Korean + English bilingual support
