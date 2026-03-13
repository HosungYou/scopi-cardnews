# Test Design Document (TDD)

**Product**: Scopi Cardnews
**Version**: 2.0.0
**Author**: Hosung You
**Date**: 2026-03-12
**Status**: Released

---

## 1. Test Strategy

### 1.1 Overview

Testing for Scopi Cardnews covers 5 levels:

| Level | Scope | Method |
|-------|-------|--------|
| **Unit** | Individual modules and functions | Node.js script execution |
| **Integration** | Module interactions (design-system ↔ renderer ↔ capture ↔ pipeline) | End-to-end script |
| **Plugin** | Claude Code plugin registration, skill loading, agent dispatch | CLI verification |
| **Visual** | Output quality, theme application, free composition rendering | Manual inspection |
| **Capture** | Playwright/Puppeteer screenshot capture pipeline | URL capture tests |

---

## 2. Unit Tests

### 2.1 Design System Tests

#### T-DS-01: Default Design System Creation
```
Given: No scopi.config.json
When: createDesignSystem() is called
Then: Returns DEFAULTS with all tokens, identity={}, language='en'
```

#### T-DS-02: Inline Theme Loading
```
Given: Config with inline theme { colors: { accent: "#FF0000" } }
When: createDesignSystem() is called
Then: DESIGN.colors.accent === "#FF0000"
```

#### T-DS-03: Identity Exposure
```
Given: Config with identity.audience = "PhD students"
When: createDesignSystem() is called
Then: DESIGN.identity.audience === "PhD students"
```

#### T-DS-04: Language Exposure
```
Given: Config with language = "ko"
When: createDesignSystem() is called
Then: DESIGN.language === "ko"
```

#### T-DS-05: Config Override
```
Given: Config with brand.name = "TestBrand", dimensions = {width: 1920, height: 1080}
When: createDesignSystem() is called
Then: DESIGN.brand.name === "TestBrand" AND DESIGN.width === 1920
```

#### T-DS-06: Missing Config Graceful
```
Given: No scopi.config.json exists
When: createDesignSystem() is called
Then: Returns DEFAULTS without error
```

### 2.2 Slide Renderer Tests

#### T-SR-01 through T-SR-08: Same as v1 (component creation, modes, HTML5 validity)

### 2.3 Capture Pipeline Tests

#### T-CP-01: captureAll with Empty Targets
```
Given: Empty targets array
When: captureAll([]) is called
Then: Returns empty Map, no errors
```

#### T-CP-02: captureOne URL
```
Given: Valid URL target { name: 'test', url: 'https://example.com' }
When: captureOne(browser, target) is called
Then: Returns path to PNG file in outDir
```

#### T-CP-03: captureOne with Selector
```
Given: Target with selector { name: 'test', url: '...', selector: '.main' }
When: captureOne(browser, target) is called
Then: Captures only the selected element
```

#### T-CP-04: Playwright Fallback
```
Given: Playwright is not installed
When: captureAll(targets) is called
Then: Falls back to Puppeteer, captures succeed
```

#### T-CP-05: captureOne HTML
```
Given: HTML target { name: 'test', html: '<div>test</div>' }
When: captureOne(browser, target) is called
Then: Renders HTML and captures as PNG
```

---

## 3. Integration Tests

### 3.1 Design System → Renderer Integration

#### T-INT-01: Inline Theme Propagates to Components
```
Given: Config with inline theme (accent = "#3B82F6")
When: createRenderer(), then seriesTag('warm') is called
Then: Series tag text color is "#3B82F6"
```

#### T-INT-02: Custom Dimensions Propagate
```
Given: Config with dimensions {width: 1920, height: 1080}
When: createRenderer(), then slideWrapper() is called
Then: HTML contains width:1920px and height:1080px
```

### 3.2 Capture → Slide Integration

#### T-INT-03: Capture Embedding
```
Given: Captured PNG at assets/captures/test.png
When: Read as base64, embed in slide HTML as data URI
Then: Image renders correctly in Puppeteer output
```

### 3.3 Renderer → Pipeline Integration

#### T-INT-04: Full Pipeline (2 Slides)
```
Given: 2 minimal HTML slides
When: generateFromHTML(slides, opts) is called
Then: 2 PNG files + 1 PDF created, no errors
```

#### T-INT-05: Pipeline with Retina
```
Given: Config with pipeline.retina = true
When: Pipeline runs
Then: Output PNGs are 2x resolution
```

### 3.4 Full Pipeline Integration

#### T-INT-06: End-to-End (Capture + Render)
```
Given: Config with captureTargets, custom inline theme, identity data
When: Full pipeline runs (capture → HTML → PNG → PDF)
Then: Captures saved, slides rendered with captures embedded, PDF assembled
```

---

## 4. Plugin Tests

### 4.1 Registration Tests

Same as v1 (marketplace registration, plugin installation, listing, validation).

### 4.2 Skill Loading Tests

#### T-PLG-05: All Skills Registered
```
Given: Plugin installed
When: /scopi:help is invoked
Then: All 9 commands are listed
```

#### T-PLG-06: Setup Wizard
```
Given: Plugin installed, no scopi.config.json
When: /scopi:setup is invoked
Then: 12-step interview, GYEOL generates theme, config created
Then: Config has language, brand, identity, inline theme, dimensions, pipeline
```

### 4.3 Agent Loading Tests

#### T-PLG-07: Agent Dispatch Order
```
Given: All agents active
When: /scopi:generate is invoked
Then: NARA → BINNA → GANA(capture) → GYEOL+GANA(design+HTML) → JURI → MARU
```

#### T-PLG-08: Read-Only Constraint
```
Given: JURI or MARU dispatched
When: Agent attempts Write or Edit
Then: Tool call blocked
```

---

## 5. Visual Tests (Manual)

### 5.1 Free Composition Verification

#### T-VIS-01: No Two Slides Identical
```
Check: Each slide in the deck has a visually distinct layout
Check: Text sizes, element placement, and density vary
```

#### T-VIS-02: Visual Rhythm
```
Check: Deck alternates between dense and sparse slides
Check: Accent bg used on max 2 slides
Check: At least one slide "breaks the pattern"
```

#### T-VIS-03: Content-Adaptive Layout
```
Check: Tool/service slides center the screenshot
Check: Data slides have oversized numbers
Check: Hook slides have asymmetric or dramatic text
```

### 5.2 Capture Integration

#### T-VIS-04: Embedded Screenshots
```
Check: Captured screenshots render at high quality in slides
Check: Screenshots have border-radius and shadow styling
Check: Slide layout is designed AROUND the capture, not cramming it in
```

### 5.3 Dynamic Theme

#### T-VIS-05: Theme Matches Identity
```
Check: Academic identity → warm/scholarly palette
Check: Tech identity → dark/modern palette
Check: Colors are harmonious, not random
```

### 5.4 Layout Rendering

#### T-VIS-06: Vertical Space Fill
```
Check: Every slide fills 100% of vertical space
```

#### T-VIS-07: Font Rendering
```
Check: Fonts are crisp at 2x retina
Check: Font family matches theme.fonts settings
```

---

## 6. Test Execution

```bash
# Run all unit + integration tests
node tests/run-all.js

# Run pipeline test only
node tests/test-pipeline.js

# Run capture test
node tests/test-capture.js

# Plugin verification
claude plugin validate .
```

### 6.1 Acceptance Criteria

- **Unit tests**: 100% pass rate
- **Integration tests**: 100% pass rate
- **Plugin tests**: Registration, install, skill loading verified
- **Visual tests**: Free composition produces unique slides, captures embed correctly
- **Capture tests**: Playwright capture succeeds (or Puppeteer fallback works)

---

## 7. Known Limitations

| Limitation | Impact | Mitigation |
|------------|--------|------------|
| Font loading depends on network | First run may have fallback fonts | 5s timeout + 800ms settle |
| Playwright is optional dependency | Some installs lack capture | Puppeteer fallback |
| Capture depends on target URLs being accessible | Sites may block or timeout | Skip + warn |
| T-Score is subjective | VS alternatives may vary | Agent personas guide consistency |
| Free composition quality varies | Depends on agent creativity | Layout examples as inspiration |
