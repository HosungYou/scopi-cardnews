# Changelog

All notable changes to Scopi Card News will be documented in this file.

## [2.2.0] — 2026-03-14

### Added
- **GYEOL: Anti-AI Design Checklist** — 7 hard rules to eliminate AI-generated visual patterns (rgba abuse, uniform borderRadius, fake letter-spacing, equal padding, emoji icons, flat fills, identical layouts). Minimum requirements per deck (asymmetric layout, scale contrast, radius variety).
- **GYEOL: Image Rules** — Complete image selection, licensing, and integration guidelines. When/how to use cover images, captures, and when NOT to use images. Integration with `license-checker.js`.
- **GYEOL: VS Enforcement** — Structural enforcement of VS methodology. Must produce 3 alternatives, include T<0.35 option, incorporate 30% of lowest-T elements in final output.
- **GANA: Korean Typography Guard** — Line-height rules by font size, container overflow strategies, padding-to-font-size ratios, flex alignment rules, content length maximums.

### Fixed
- **Text overlap on slide 5** — Red box padding increased (22→28px), font-size reduced (38→36px), line-height increased (1.5→1.65)
- **Text overflow on slide 6** — `min-height: 0` replaced with `min-height: auto` to prevent content crushing
- **Baseline alignment break on slide 8** — `align-items: baseline` replaced with `flex-start` for mixed-size text
- **Journal attribution overflow on slide 2** — Added `flex-wrap: wrap`, `min-width: 0`, reduced font-size (34→32px)
- **Editorial quote clipping on slides 4 & 7** — Line-height increased (1.45→1.55), font-size adjusted
- **`threeColumnCards` component** — Dynamic line-height based on body font size, padding scales with font, `flex-wrap` on headers, `min-height: auto` on cards
- **`progressBars` component** — `align-items: baseline` → `flex-start`, added `flex-wrap`, sublabel line-height added
- **`statComparison` component** — Added `flex-wrap`, `min-width: 0` for overflow safety, dynamic label line-height

## [2.1.0] — 2026-03-14

### Added
- **Chart component library** — 7 new reusable components in `slide-renderer.js`:
  - `horizontalBarChart()` — data visualization with proportional bars
  - `statComparison()` — side-by-side big number comparison
  - `threeColumnCards()` — comparison layouts (e.g., Harvard's 3 syllabus models)
  - `editorialBadge()` — marks editorial interpretation vs. cited data
  - `dataStamp()` — temporal attribution for data-driven slides
  - `sourceCitation()` — DOI and paper reference block
  - `progressBars()` — proportional data without axes
- **Content depth validator** (`content-validator.js`) — Scores slide arcs for substantive content. Detects generic phrases ("기회와 도전"), counts specific data points, penalizes platitudes.
- **License checker** (`license-checker.js`) — Validates copyright status before embedding external content. Auto-detects CC, Unsplash, Pexels (allowed) vs. arXiv, Elsevier, Springer (blocked).
- **QA gate** (`qa-gate.js`) — Enforces JURI/MARU quality checks in the pipeline. Configurable via `pipeline.strictQA` in config. Blocks output on JURI MUST FIX items or MARU score below threshold.
- **Development mode script** (`scripts/dev-mode.sh`) — Symlinks plugin cache to source for instant updates during development.
- **One-click deploy script** (`scripts/deploy.sh`) — Bumps version, pushes to GitHub, clears cache, reinstalls plugin in one command.

### Changed
- Component count in `slide-renderer.js`: 11 → 18
- Pipeline now supports `pipeline.strictQA` and `pipeline.minQAScore` config options

### Fixed
- QA agents (JURI/MARU) were not automatically enforced in the generation pipeline
- No copyright validation when embedding external figures
- No content depth checking allowed surface-level card news to pass
- Plugin cache required manual uninstall/reinstall after updates

## [2.0.0] — 2026-03-13

### Added
- Free composition design system (no preset templates)
- 7 specialized agents: NARA, GYEOL, GANA, DARI, BINNA, JURI, MARU
- VS (Verbalized Sampling) methodology for content and visual alternatives
- Dynamic theme generation from brand identity interview
- Playwright/Puppeteer capture pipeline for real screenshots
- Celadon Grove theme with Korean typography support
- 9 user-invocable skills (`/scopi:setup`, `/scopi:generate`, etc.)

### Changed
- Theme system: separate JSON files → inline in `scopi.config.json`
- Design system: static presets → dynamic config-driven tokens

## [1.0.0] — 2026-03-12

### Added
- Initial release
- Basic card news generation pipeline
- Template-based slide layouts
- PDF carousel assembly
