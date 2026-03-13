/**
 * Scopi Card News Design System — Theme-Aware Engine
 * Loads theme from scopi.config.json or falls back to built-in defaults.
 * Warm-only mode with terracotta accent blocks.
 * 2x font sizes for mobile feed impact.
 */

const fs = require('fs');
const path = require('path');

// Default design tokens (warm-scholar theme baked in)
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
    padding: '52px',
    paddingLarge: '60px',
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
 * Load theme JSON from themes/ directory
 * @param {string} themeName - Theme file name (without .json)
 * @param {string} pluginRoot - Root directory of the plugin
 * @returns {object} Theme color/font overrides
 */
function loadTheme(themeName, pluginRoot) {
  if (!themeName) return {};
  const themePath = path.join(pluginRoot, 'themes', `${themeName}.json`);
  if (!fs.existsSync(themePath)) return {};
  try {
    return JSON.parse(fs.readFileSync(themePath, 'utf-8'));
  } catch {
    return {};
  }
}

/**
 * Load user config (scopi.config.json) from the working directory
 * @param {string} cwd - Current working directory to search for config
 * @returns {object} User config or empty object
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
 * Build the full design system by merging defaults + theme + user config
 * @param {object} opts - { cwd, pluginRoot }
 * @returns {object} Complete DESIGN object
 */
function createDesignSystem(opts = {}) {
  const pluginRoot = opts.pluginRoot || path.resolve(__dirname, '..');
  const cwd = opts.cwd || process.cwd();
  const config = loadConfig(cwd);
  const theme = loadTheme(config.theme, pluginRoot);

  // Merge: defaults ← theme colors/fonts ← config brand overrides
  const DESIGN = {
    width: config.dimensions?.width || DEFAULTS.width,
    height: config.dimensions?.height || DEFAULTS.height,

    colors: {
      ...DEFAULTS.colors,
      ...(theme.colors || {}),
    },

    fonts: {
      ...DEFAULTS.fonts,
      ...(theme.fonts || {}),
    },

    fontSize: { ...DEFAULTS.fontSize },
    spacing: { ...DEFAULTS.spacing },

    brand: {
      ...DEFAULTS.brand,
      ...(config.brand || {}),
    },
  };

  return DESIGN;
}

// Export both the factory and static defaults for backward compat
module.exports = { createDesignSystem, DEFAULTS, loadTheme, loadConfig };
