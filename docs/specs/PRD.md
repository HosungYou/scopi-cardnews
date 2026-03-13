# Product Requirements Document (PRD)

**Product**: Scopi Cardnews
**Version**: 2.0.0
**Author**: Hosung You
**Date**: 2026-03-12
**Status**: Released

---

## 1. Overview

### 1.1 Product Vision

Scopi Cardnews is an open-source Claude Code plugin that transforms any topic into professional, scroll-stopping social media card news. It packages a complete content production pipeline — from ideation to publication — into a set of slash commands powered by 7 specialized AI agents with free composition design and real screenshot capture.

### 1.2 Problem Statement

Creating professional card news for social media requires:
- **Content strategy**: Knowing what angle to take, how to hook the audience
- **Visual design**: Unique compositions per slide, not cookie-cutter templates
- **Real screenshots**: Capturing actual tool/service UIs for authentic content
- **Technical execution**: HTML → screenshot → PDF pipeline
- **Copy refinement**: Platform-appropriate tone, bilingual support
- **Quality assurance**: Ethics review, audience empathy testing

Each of these is typically a separate skill or tool. Researchers and creators spend hours manually combining these steps, often producing generic content that fails to stand out in crowded feeds.

### 1.3 Target Users

| Persona | Description | Primary Need |
|---------|-------------|-------------|
| **Academic Researcher** | Publishes research findings on social media | Professional-looking slides with accurate content |
| **Content Creator** | Produces educational/informational card news | Streamlined pipeline, creative differentiation |
| **Brand Manager** | Manages social media presence | Consistent branding, multi-platform output |
| **Educator** | Creates instructional materials | Clean layouts, accessible design |

### 1.4 Success Metrics

| Metric | Target | Measurement |
|--------|--------|-------------|
| Installation-to-first-output | < 10 minutes | Time from install to first generated PNG |
| Pipeline reliability | > 95% | Successful generation without errors |
| Creative differentiation | T-Score < 0.50 avg | VS methodology prevents generic output |
| Platform coverage | 4 platforms | Instagram, LinkedIn, Twitter, Threads |
| Design uniqueness | No two slides identical | Free composition produces unique layouts |

---

## 2. Functional Requirements

### 2.1 Core Features

#### FR-01: Brand Identity Interview
- **Priority**: P0 (Must Have)
- **Command**: `/scopi:setup`
- **Description**: Deep 12-step interview capturing voice, audience, visual identity, then dynamically generates a unique theme via GYEOL agent
- **Output**: `scopi.config.json` with brand, identity, inline theme
- **Acceptance Criteria**:
  - Language selection (Korean/English)
  - Content type, audience, pain points (selection + free-text mix)
  - Voice/tone selection
  - Visual style preference
  - Content priority
  - Capture target registration
  - Brand basics (name, handle, author, tagline)
  - Platform selection with auto-dimensions
  - GYEOL dynamically generates theme from interview data
  - Theme presented to user for approval/adjustment

#### FR-02: Content Ideation with VS + Capture URL Identification
- **Priority**: P0 (Must Have)
- **Command**: `/scopi:content`
- **Agent**: NARA
- **Description**: Generate 3 creative alternatives with adaptive slide counts, identify capture URLs for tools/services
- **Output**: Narrative arc with emotional curve and capture targets
- **Acceptance Criteria**:
  - Always generates exactly 3 alternatives with T-Scores
  - Slide count adapts to content (not always 8)
  - Identifies capturable URLs from identity.captureTargets and WebSearch
  - Reads identity from config to match audience and voice
  - Recommends lowest viable T-Score option

#### FR-03: Full Generation Pipeline
- **Priority**: P0 (Must Have)
- **Command**: `/scopi:generate`
- **Agents**: All active agents
- **Description**: Orchestrate multi-phase pipeline with free composition and capture integration
- **Output**: PNG slides + PDF carousel + review reports
- **Acceptance Criteria**:
  - NARA identifies capture URLs during content strategy
  - GANA captures screenshots via Playwright
  - GYEOL designs unique compositions per slide (free composition)
  - Visual rhythm varies across the deck
  - Captures embedded as base64 in slides
  - JURI and MARU review reports displayed
  - Identity-aware throughout all phases

#### FR-04: Visual Design Exploration (Free Composition)
- **Priority**: P1 (Should Have)
- **Command**: `/scopi:design`
- **Agent**: GYEOL
- **Description**: VS-powered visual direction exploration using free composition — unique layouts per slide, not template picking
- **Acceptance Criteria**:
  - 3 visual directions describing unique compositions
  - Content-adaptive design (screenshots centered, data oversized, etc.)
  - Visual rhythm planning across deck

#### FR-05: Build Pipeline with Capture
- **Priority**: P0 (Must Have)
- **Command**: `/scopi:build`
- **Agent**: GANA
- **Description**: Run Playwright capture + Puppeteer rendering pipeline
- **Acceptance Criteria**:
  - Captures screenshots from registered URLs (Playwright primary, Puppeteer fallback)
  - Renders existing HTML to PNG + PDF
  - Respects config dimensions and retina setting

#### FR-06: Quality Review
- **Priority**: P1 (Should Have)
- **Command**: `/scopi:review`
- **Agents**: JURI + MARU (read-only)
- **Description**: Ethics review and empathy testing informed by identity data
- **Acceptance Criteria**:
  - JURI adjusts strictness based on identity.contentType
  - MARU builds personas from identity.audience
  - Neither agent modifies any files

#### FR-07: Caption Generation
- **Priority**: P1 (Should Have)
- **Command**: `/scopi:caption`
- **Agents**: DARI + BINNA
- **Description**: Platform-optimized captions matching identity.voice and language
- **Acceptance Criteria**:
  - Matches language setting (ko/en)
  - Tone calibrated to identity.voice
  - Platform-specific formatting

#### FR-08: Dynamic Theme Management
- **Priority**: P1 (Should Have)
- **Command**: `/scopi:theme`
- **Agent**: GYEOL
- **Description**: View, customize, or regenerate dynamically generated themes
- **Acceptance Criteria**:
  - View current inline theme
  - Customize specific tokens with natural language
  - Regenerate completely with VS (3 options)
  - No preset themes — all themes are generated

#### FR-09: Help Reference
- **Priority**: P0 (Must Have)
- **Command**: `/scopi:help`
- **Description**: Display all commands, agents, and v2 features

### 2.2 Agent System

#### FR-10: Expert Agent Personas
- **Priority**: P0 (Must Have)
- **Description**: 7 agents with distinct professional backgrounds, identity-aware
- **Acceptance Criteria**:
  - NARA identifies capture URLs
  - GYEOL does free composition (not template picking)
  - GANA runs Playwright capture pipeline
  - All agents read identity from config
  - JURI and MARU are strictly read-only

### 2.3 Rendering Engine

#### FR-11: Dynamic Theme Design System
- **Priority**: P0 (Must Have)
- **Description**: Design tokens that load inline theme from config (no separate theme files)
- **Acceptance Criteria**:
  - Loads theme from config.theme object (not file)
  - Exposes identity and language to agents
  - Merges with defaults

#### FR-12: Playwright Capture Pipeline
- **Priority**: P0 (Must Have)
- **Description**: Real screenshot capture of external tools/services
- **Acceptance Criteria**:
  - Playwright primary, Puppeteer fallback
  - URL capture with optional CSS selector
  - Configurable viewport
  - Saves to assets/captures/

#### FR-13: HTML → PNG → PDF Pipeline
- **Priority**: P0 (Must Have)
- **Description**: Puppeteer-based rendering pipeline
- **Acceptance Criteria**:
  - 2x deviceScaleFactor for retina
  - 5s font timeout with fallback
  - pdf-lib PDF assembly

---

## 3. Non-Functional Requirements

### 3.1 Performance
- Full pipeline should complete in < 120 seconds (including captures)
- Individual slide rendering < 5 seconds
- Screenshot capture < 15 seconds per URL

### 3.2 Reliability
- Pipeline handles capture failures gracefully (skip, use text instead)
- Each phase handles errors independently
- Config missing = use defaults

### 3.3 Extensibility
- Dynamic themes via GYEOL generation
- Custom agents via Markdown files
- Layout examples for free composition inspiration
- Custom series via config

### 3.4 Compatibility
- Node.js 18+
- macOS, Linux (Windows via WSL)
- Playwright or Puppeteer for capture

---

## 4. Out of Scope (v2.0)

- Real-time preview in browser
- Animation/video output
- Direct social media posting API
- Collaborative multi-user editing
- Analytics/engagement tracking integration

---

## 5. Release Plan

| Version | Focus | Status |
|---------|-------|--------|
| **1.0.0** | Core pipeline, 7 agents, 4 preset themes, 9 commands | Superseded |
| **2.0.0** | Free composition, Playwright capture, dynamic themes, identity interview | Released |
| 2.1.0 | Community agent contributions, additional capture capabilities | Future |
| 3.0.0 | Multi-format output (stories, reels, video) | Future |
