# Test Design Document (TDD)

**Product**: Scopi Cardnews
**Version**: 1.0.0
**Author**: Hosung You
**Date**: 2026-03-12
**Status**: Released

---

## 1. Test Strategy

### 1.1 Overview

Testing for Scopi Cardnews covers 4 levels:

| Level | Scope | Method |
|-------|-------|--------|
| **Unit** | Individual modules and functions | Node.js script execution |
| **Integration** | Module interactions (design-system ↔ renderer ↔ pipeline) | End-to-end script |
| **Plugin** | Claude Code plugin registration, skill loading, agent dispatch | CLI verification |
| **Visual** | Output quality, theme application, layout rendering | Manual inspection + PNG comparison |

### 1.2 Test Environment

- **Runtime**: Node.js 18+
- **Platform**: macOS (primary), Linux (CI)
- **Dependencies**: puppeteer, pdf-lib
- **Test Runner**: Direct `node` execution (no test framework dependency)

---

## 2. Unit Tests

### 2.1 Design System Tests

#### T-DS-01: Default Design System Creation
```
Given: No scopi.config.json, no theme
When: createDesignSystem() is called
Then: Returns DEFAULTS object with all 28 color tokens, 3 fonts, 9 font sizes, 6 spacing values, 4 brand values
```

#### T-DS-02: Theme Loading
```
Given: Theme "warm-scholar" exists in themes/
When: createDesignSystem({theme: "warm-scholar"}) is called
Then: Returns DESIGN with warm-scholar colors merged over defaults
```

#### T-DS-03: Missing Theme Handling
```
Given: Theme "nonexistent" does not exist
When: loadTheme("nonexistent", pluginRoot) is called
Then: Returns empty object (no crash)
```

#### T-DS-04: Config Override
```
Given: scopi.config.json with brand.name = "TestBrand", dimensions = {width: 1920, height: 1080}
When: createDesignSystem() is called
Then: DESIGN.brand.name === "TestBrand" AND DESIGN.width === 1920
```

#### T-DS-05: Merge Order
```
Given: DEFAULTS.colors.accent = "#D97757", theme.colors.accent = "#FF0000", config has no color override
When: createDesignSystem() is called
Then: DESIGN.colors.accent === "#FF0000" (theme overrides default)
```

#### T-DS-06: All Themes Load
```
Given: All 4 theme JSON files exist
When: Each is loaded via loadTheme()
Then: All return valid objects with "name", "colors", and "fonts" keys
```

### 2.2 Slide Renderer Tests

#### T-SR-01: Renderer Creation
```
Given: Valid design system
When: createRenderer() is called
Then: Returns object with all 11 methods (compositeIcon, foxMascot, foxIcon, seriesTag, footer, terminal, accentBlock, card, numberBadge, slideWrapper, DESIGN)
```

#### T-SR-02: Composite Icon
```
Given: Renderer instance
When: compositeIcon(64) is called
Then: Returns HTML string containing 🧭 and 🎓 emojis with correct sizing
```

#### T-SR-03: Fox Mascot SVG
```
Given: Renderer instance
When: foxMascot(120) is called
Then: Returns valid SVG string with width="120" and accent color from DESIGN
```

#### T-SR-04: Series Tag Modes
```
Given: Renderer instance
When: seriesTag('warm') and seriesTag('accent') are called
Then: Warm mode uses accent color for text; accent mode uses white
```

#### T-SR-05: Footer Page Dots
```
Given: Renderer instance
When: footer('warm', 3, 8) is called
Then: Returns HTML with 8 dots, 3rd dot is active (wider, accent color)
```

#### T-SR-06: Terminal Lines
```
Given: Renderer instance
When: terminal('Test', [{type:'prompt',text:'hello'}, {type:'output',highlight:'ok',text:'done'}]) is called
Then: Returns HTML with terminal header (3 dots), prompt line with ❯, output line with ✓
```

#### T-SR-07: Slide Wrapper HTML5
```
Given: Renderer instance
When: slideWrapper('warm', '<p>test</p>') is called
Then: Returns complete HTML5 document with <!DOCTYPE html>, Google Fonts link, baseCSS, and slide-root div
```

#### T-SR-08: Slide Wrapper Accent Mode
```
Given: Renderer instance
When: slideWrapper('accent', '<p>test</p>') is called
Then: Background color is DESIGN.colors.accentBg (not warmBg)
```

### 2.3 Layout Component Tests

#### T-LC-01 through T-LC-08: Each Layout Generates Valid HTML

For each layout (hook, problem, solution, demo, result, tip, caution, cta):
```
Given: Renderer instance and appropriate data object
When: [layout]Slide(renderer, data) is called
Then: Returns string starting with "<!DOCTYPE html>" and containing slide content
```

#### T-LC-09: Hook Slide Uses Accent Mode
```
Given: hookSlide(renderer, {title:'Test', pageNum:1, totalPages:8})
When: Output is inspected
Then: Background is DESIGN.colors.accentBg
```

#### T-LC-10: CTA Slide Includes Fox Mascot
```
Given: ctaSlide(renderer, {title:'Follow', pageNum:8, totalPages:8})
When: Output is inspected
Then: Contains SVG with fox mascot
```

#### T-LC-11: Problem Slide Number Badges
```
Given: problemSlide(renderer, {title:'Issues', points:[{num:1,text:'A'},{num:2,text:'B'}], pageNum:2, totalPages:8})
When: Output is inspected
Then: Contains two number badges (1 and 2)
```

---

## 3. Integration Tests

### 3.1 Design System → Renderer Integration

#### T-INT-01: Theme Propagates to Components
```
Given: tech-neon theme (accent = "#39D353")
When: createRenderer() with tech-neon config, then seriesTag('warm') is called
Then: Series tag text color is "#39D353"
```

#### T-INT-02: Custom Dimensions Propagate
```
Given: Config with dimensions {width: 1920, height: 1080}
When: createRenderer(), then slideWrapper() is called
Then: HTML contains width:1920px and height:1080px
```

### 3.2 Renderer → Pipeline Integration

#### T-INT-03: Full Pipeline (2 Slides)
```
Given: 2 minimal HTML slides
When: generateFromHTML(slides, {outDir: testDir}) is called
Then: 2 PNG files created, 1 PDF created, no errors
```

#### T-INT-04: Pipeline with Retina
```
Given: Config with pipeline.retina = true
When: Pipeline runs
Then: Puppeteer viewport deviceScaleFactor === 2
```

#### T-INT-05: Pipeline PNG-Only Format
```
Given: Config with pipeline.format = ["png"]
When: Pipeline runs
Then: PNG files created, no PDF created
```

### 3.3 Layout → Pipeline Integration

#### T-INT-06: Full 8-Slide Generation
```
Given: All 8 layouts generate HTML slides
When: generateFromHTML(allSlides, opts) is called
Then: 8 PNGs + 1 PDF created, all at configured dimensions
```

---

## 4. Plugin Tests

### 4.1 Registration Tests

#### T-PLG-01: Marketplace Registration
```
Given: .claude-plugin/marketplace.json exists with valid schema
When: claude plugin marketplace add HosungYou/scopi-cardnews
Then: Marketplace added successfully
```

#### T-PLG-02: Plugin Installation
```
Given: Marketplace registered
When: claude plugin install scopi-cardnews@scopi-cardnews
Then: Plugin installed and enabled
```

#### T-PLG-03: Plugin Listing
```
Given: Plugin installed
When: claude plugin list
Then: Shows scopi-cardnews with Version: 1.0.0, Status: ✔ enabled
```

#### T-PLG-04: Plugin Validation
```
Given: Plugin directory
When: claude plugin validate /path/to/scopi-cardnews
Then: Validation passes with no errors
```

### 4.2 Skill Loading Tests

#### T-PLG-05: All Skills Registered
```
Given: Plugin installed
When: /scopi:help is invoked
Then: All 9 commands are listed and functional
```

#### T-PLG-06: Setup Wizard
```
Given: Plugin installed, no scopi.config.json
When: /scopi:setup is invoked
Then: Wizard prompts for brand, theme, platform, agents, series
Then: scopi.config.json is created with valid JSON
```

### 4.3 Agent Loading Tests

#### T-PLG-07: Agent Dispatch
```
Given: Plugin installed, all agents active in config
When: /scopi:generate is invoked
Then: Agents are dispatched in order (NARA → BINNA → GYEOL → GANA → JURI → MARU)
```

#### T-PLG-08: Read-Only Agent Constraint
```
Given: JURI or MARU dispatched
When: Agent attempts to use Write or Edit tools
Then: Tool call is blocked (tools not in agent's tool list)
```

---

## 5. Visual Tests (Manual)

### 5.1 Theme Application

#### T-VIS-01: Warm Scholar Theme
```
Check: Slides have ivory background (#FAF9F5), terracotta accent (#D97757)
Check: Text is dark (#141413), terminal has Monokai colors
```

#### T-VIS-02: Midnight Academic Theme
```
Check: Slides have dark navy background (#0F1B33), gold accent (#D4A843)
Check: Text is light (#E8E0D4)
```

#### T-VIS-03: Minimal Mono Theme
```
Check: White background, black text, red accent (#E63946)
```

#### T-VIS-04: Tech Neon Theme
```
Check: Dark background (#0D1117), green accent (#39D353)
```

### 5.2 Layout Rendering

#### T-VIS-05: Vertical Space Fill
```
Check: Every slide fills 100% of vertical space (no empty bottom halves)
```

#### T-VIS-06: Font Rendering
```
Check: Headings use Inter, body uses Source Serif 4, code uses Fira Code
Check: Fonts are crisp at 2x retina resolution
```

#### T-VIS-07: Footer Dots
```
Check: Page indicator dots are visible and correctly positioned
Check: Active dot is wider and accent-colored
```

#### T-VIS-08: Terminal Mockup
```
Check: Terminal has 3 colored dots (red, yellow, green)
Check: Prompt shows ❯ in accent color
Check: Output shows ✓ in green
```

---

## 6. Test Results Tracking

### 6.1 Result Format

| Test ID | Name | Status | Notes |
|---------|------|--------|-------|
| T-DS-01 | Default Design System | PASS/FAIL | details |
| T-DS-02 | Theme Loading | PASS/FAIL | details |
| ... | ... | ... | ... |

### 6.2 Test Execution

```bash
# Run all unit + integration tests
node tests/run-all.js

# Run pipeline test only
node tests/test-pipeline.js

# Plugin verification
claude plugin validate .
claude plugin list | grep scopi
```

### 6.3 Acceptance Criteria

- **Unit tests**: 100% pass rate
- **Integration tests**: 100% pass rate
- **Plugin tests**: Marketplace registration, install, and skill loading verified
- **Visual tests**: All 4 themes render correctly, layouts fill space, fonts are crisp

---

## 7. Known Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| Font loading depends on network | First run may have fallback fonts | 5s timeout + 800ms settle |
| Puppeteer Chromium download ~200MB | Slow first install | One-time download, cached |
| No automated visual regression | Theme changes need manual check | Reference screenshots |
| T-Score is subjective | VS alternatives may vary | Agent personas guide consistency |
