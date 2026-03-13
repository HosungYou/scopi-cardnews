# Product Requirements Document (PRD)

**Product**: Scopi Cardnews
**Version**: 1.0.0
**Author**: Hosung You
**Date**: 2026-03-12
**Status**: Released

---

## 1. Overview

### 1.1 Product Vision

Scopi Cardnews is an open-source Claude Code plugin that transforms any topic into professional, scroll-stopping social media card news. It packages a complete content production pipeline — from ideation to publication — into a set of slash commands powered by 7 specialized AI agents.

### 1.2 Problem Statement

Creating professional card news for social media requires:
- **Content strategy**: Knowing what angle to take, how to hook the audience
- **Visual design**: Consistent branding, color systems, typography
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
| Installation-to-first-output | < 10 minutes | Time from `claude plugin install` to first generated PNG |
| Pipeline reliability | > 95% | Successful generation without errors |
| Creative differentiation | T-Score < 0.50 avg | VS methodology prevents generic output |
| Platform coverage | 4 platforms | Instagram, LinkedIn, Twitter, Threads |

---

## 2. Functional Requirements

### 2.1 Core Features

#### FR-01: Interactive Setup Wizard
- **Priority**: P0 (Must Have)
- **Command**: `/scopi:setup`
- **Description**: Step-by-step wizard to configure brand identity, visual theme, target platform, active agents, and content series
- **Output**: `scopi.config.json` written to project root
- **Acceptance Criteria**:
  - Prompts for brand name, handle, author, tagline
  - Offers 4 theme presets + custom option
  - Sets platform-specific dimensions automatically
  - Allows agent selection (all or subset)
  - Supports optional content series definition

#### FR-02: Content Ideation with VS
- **Priority**: P0 (Must Have)
- **Command**: `/scopi:content`
- **Agent**: NARA
- **Description**: Generate 3 creative alternatives for content direction, each scored by T-Score (typicality). User selects or auto-commits to lowest viable T-Score.
- **Output**: 8-slide narrative arc with emotional curve
- **Acceptance Criteria**:
  - Always generates exactly 3 alternatives
  - Each alternative has a T-Score
  - Recommends lowest viable T-Score option
  - Produces complete 8-slide arc on selection

#### FR-03: Full Generation Pipeline
- **Priority**: P0 (Must Have)
- **Command**: `/scopi:generate`
- **Agents**: All active agents in sequence
- **Description**: Orchestrate 7-phase pipeline from content strategy to final output
- **Output**: PNG slides + PDF carousel + review reports
- **Acceptance Criteria**:
  - Runs all 7 phases in order
  - Skips inactive agents gracefully
  - Produces valid PNG at configured dimensions
  - Assembles PDF from PNGs
  - Displays JURI and MARU review reports
  - Handles errors per-phase without crashing pipeline

#### FR-04: Visual Design Exploration
- **Priority**: P1 (Should Have)
- **Command**: `/scopi:design`
- **Agent**: GYEOL
- **Description**: VS-powered visual direction exploration before committing to a design
- **Output**: 3 visual directions with T-Scores, slide design map
- **Acceptance Criteria**:
  - 3 visual alternatives with descriptions
  - Each scored by T-Score
  - Optional preview generation (hook slide)

#### FR-05: Build Pipeline
- **Priority**: P0 (Must Have)
- **Command**: `/scopi:build`
- **Agent**: GANA
- **Description**: Render existing HTML slides to PNG + PDF
- **Output**: PNG screenshots + PDF carousel
- **Acceptance Criteria**:
  - Accepts HTML directory as input
  - Respects config dimensions and retina setting
  - Generates both PNG and PDF by default

#### FR-06: Quality Review
- **Priority**: P1 (Should Have)
- **Command**: `/scopi:review`
- **Agents**: JURI + MARU (read-only)
- **Description**: Ethics review and empathy testing of generated content
- **Output**: Two review reports with severity ratings and scores
- **Acceptance Criteria**:
  - JURI produces severity-rated ethics report
  - MARU produces scored empathy report
  - Neither agent modifies any files
  - Reports include specific slide references

#### FR-07: Caption Generation
- **Priority**: P1 (Should Have)
- **Command**: `/scopi:caption`
- **Agents**: DARI + BINNA
- **Description**: Platform-optimized social media captions with hashtags
- **Output**: Captions for Instagram, LinkedIn, Twitter, Threads
- **Acceptance Criteria**:
  - Platform-specific formatting and tone
  - Tiered hashtag strategy
  - CTA in every caption
  - Posting time recommendations

#### FR-08: Theme Management
- **Priority**: P1 (Should Have)
- **Command**: `/scopi:theme`
- **Agent**: GYEOL
- **Description**: Browse, apply, customize, or create visual themes
- **Output**: Theme applied to config, or new theme JSON created
- **Acceptance Criteria**:
  - Lists all available themes with color previews
  - Applies theme by updating config
  - Creates new theme from user inputs

#### FR-09: Help Reference
- **Priority**: P0 (Must Have)
- **Command**: `/scopi:help`
- **Description**: Display all commands, agents, themes, and documentation links
- **Acceptance Criteria**:
  - Lists all 9 commands with descriptions
  - Lists all 7 agents with roles
  - Shows theme options
  - Provides quick start guide

### 2.2 Agent System

#### FR-10: Expert Agent Personas
- **Priority**: P0 (Must Have)
- **Description**: 7 agents with distinct professional backgrounds, tool permissions, and output formats
- **Acceptance Criteria**:
  - Each agent has a unique persona with professional backstory
  - JURI and MARU are strictly read-only (no Write/Edit tools)
  - Agents can be enabled/disabled via config
  - Custom agents can be added via `.md` files

### 2.3 Rendering Engine

#### FR-11: Theme-Aware Design System
- **Priority**: P0 (Must Have)
- **Description**: Design tokens that adapt to theme JSON files and user config
- **Acceptance Criteria**:
  - Loads theme from `themes/*.json`
  - Merges with defaults (theme overrides defaults)
  - Brand config overrides theme
  - Supports all color, font, and spacing tokens

#### FR-12: Config-Aware Component Library
- **Priority**: P0 (Must Have)
- **Description**: Reusable HTML components that respect current design system
- **Components**: compositeIcon, foxMascot, foxIcon, seriesTag, footer, terminal, accentBlock, card, numberBadge, slideWrapper
- **Acceptance Criteria**:
  - All components use design tokens (no hardcoded values)
  - slideWrapper produces valid HTML5 documents
  - Components render correctly at 2x retina

#### FR-13: HTML → PNG → PDF Pipeline
- **Priority**: P0 (Must Have)
- **Description**: Puppeteer-based rendering pipeline
- **Acceptance Criteria**:
  - Renders HTML at configured dimensions
  - 2x deviceScaleFactor for retina output
  - Waits for Google Fonts (5s timeout)
  - Assembles PNGs into PDF via pdf-lib
  - Supports custom dimensions per project

---

## 3. Non-Functional Requirements

### 3.1 Performance
- Full pipeline (8 slides) should complete in < 60 seconds
- Individual slide rendering should take < 5 seconds
- Font loading timeout: 5 seconds with fallback

### 3.2 Reliability
- Pipeline should not crash on font load failures
- Each phase should handle errors independently
- Config missing = use defaults (no crash)

### 3.3 Extensibility
- Custom themes via JSON files
- Custom agents via Markdown files
- Custom layouts via JavaScript modules
- Custom series via config

### 3.4 Compatibility
- Node.js 18+
- macOS, Linux (Windows via WSL)
- Claude Code CLI (latest)

### 3.5 Security
- No sensitive data in generated output
- No API keys in config files
- JURI reviews for data privacy issues

---

## 4. Out of Scope (v1.0)

- Real-time preview in browser
- Animation/video output
- Direct social media posting API
- Collaborative multi-user editing
- Version control for generated content
- Analytics/engagement tracking integration

---

## 5. Release Plan

| Version | Focus | Timeline |
|---------|-------|----------|
| **1.0.0** | Core pipeline, 7 agents, 4 themes, 9 commands | Released |
| 1.1.0 | Additional themes, community agent contributions | Future |
| 1.2.0 | Capture integration (screenshot from URLs) | Future |
| 2.0.0 | Multi-format output (stories, reels, video) | Future |
