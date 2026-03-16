/**
 * Scopi Card News Design System v2 — Dynamic Theme Engine
 * Themes are generated at setup time, not loaded from presets.
 * Config carries the full theme inline.
 */

const fs = require('fs');
const path = require('path');

// Fallback design tokens (used when no config exists)
const DEFAULTS = {
  width: 1080,
  height: 1350,

  colors: {
    warmBg: '#FAF9F5',
    accentBg: '#D97757',
    cardBg: '#FFFFFF',
    codeBlockBg: '#2D2A2E',

    textPrimary: '#141413',
    textSecondary: '#4A4845',
    textTertiary: '#8A8680',

    accentText: '#FFFFFF',
    accentTextSoft: 'rgba(255,255,255,0.85)',

    accent: '#D97757',
    accentSoft: 'rgba(217,119,87,0.08)',
    accentMedium: 'rgba(217,119,87,0.15)',
    accentBorder: 'rgba(217,119,87,0.2)',

    kraft: '#D4A27F',
    manilla: '#EBDBBC',
    oat: '#E3DACC',

    success: '#2D7A4F',
    error: '#C0392B',
    highlight: '#D97757',

    termBg: '#2D2A2E',
    termHeader: '#383539',
    termPrompt: '#D97757',
    termText: '#FCFCFA',
    termGreen: '#A9DC76',
    termYellow: '#FFD866',
    termComment: '#727072',
    termDotRed: '#FF6188',
    termDotYellow: '#FFD866',
    termDotGreen: '#A9DC76',
  },

  fonts: {
    heading: "'Inter', 'Noto Sans KR', -apple-system, sans-serif",
    body: "'Source Serif 4', 'Noto Serif KR', Georgia, serif",
    code: "'SF Mono', 'Fira Code', 'Menlo', monospace",
  },

  fontSize: {
    hero: '140px',
    title: '120px',
    subtitle: '64px',
    body: '48px',
    bodyLarge: '56px',
    caption: '40px',
    code: '44px',
    small: '32px',
    tag: '36px',
  },

  spacing: {
    padding: '40px',
    paddingLarge: '52px',
    gap: '20px',
    gapLarge: '28px',
    borderRadius: '20px',
    borderRadiusSmall: '12px',
    borderRadiusLarge: '28px',
  },

  brand: {
    name: 'Scopi',
    tag: 'scopi.lab',
    author: 'Scopi',
    tagline: 'AI × Academia',
  },
};

/**
 * Load user config (scopi.config.json) from the working directory
 */
function loadConfig(cwd) {
  const configPath = path.join(cwd || process.cwd(), 'scopi.config.json');
  if (!fs.existsSync(configPath)) return {};
  try {
    return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
  } catch {
    return {};
  }
}

/**
 * Build the full design system by merging defaults + config inline theme
 * In v2, the theme lives INSIDE scopi.config.json (generated at setup)
 * No more separate theme JSON files.
 */
function createDesignSystem(opts = {}) {
  const cwd = opts.cwd || process.cwd();
  const config = loadConfig(cwd);
  const inlineTheme = config.theme || {};

  const DESIGN = {
    width: config.dimensions?.width || DEFAULTS.width,
    height: config.dimensions?.height || DEFAULTS.height,

    colors: {
      ...DEFAULTS.colors,
      ...(inlineTheme.colors || {}),
    },

    fonts: {
      ...DEFAULTS.fonts,
      ...(inlineTheme.fonts || {}),
    },

    fontSize: {
      ...DEFAULTS.fontSize,
      ...(inlineTheme.fontSize || {}),
    },
    spacing: {
      ...DEFAULTS.spacing,
      ...(inlineTheme.spacing || {}),
    },

    brand: {
      ...DEFAULTS.brand,
      ...(config.brand || {}),
    },

    // v2: expose full identity for agents
    identity: config.identity || {},
    language: config.language || 'en',
  };

  return DESIGN;
}

module.exports = { createDesignSystem, DEFAULTS, loadConfig };
