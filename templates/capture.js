#!/usr/bin/env node
/**
 * Scopi Screenshot Capture Pipeline
 * Uses Playwright to capture real screenshots for card news content.
 *
 * Modes:
 *   1. URL capture: Navigate to URL, optionally select element, screenshot
 *   2. HTML capture: Render local HTML file, screenshot
 *   3. Config-based: JSON config with multiple capture targets
 *   4. Programmatic: Called from generate pipeline with target list
 *
 * Usage:
 *   node capture.js --url="https://elicit.com" --name="elicit" --viewport=1080x810
 *   node capture.js --config=captures.json
 */

const fs = require('fs');
const path = require('path');

// Playwright is optional — only needed for capture
let chromium;
try {
  chromium = require('playwright').chromium;
} catch {
  // Fall back to puppeteer if playwright not available
  try {
    const puppeteer = require('puppeteer');
    chromium = {
      launch: async (opts) => {
        const browser = await puppeteer.launch({
          headless: 'new',
          args: ['--no-sandbox', '--disable-setuid-sandbox'],
        });
        // Wrap puppeteer browser to match playwright API subset
        const origNewPage = browser.newPage.bind(browser);
        browser.newContext = async (ctxOpts) => {
          return {
            newPage: async () => {
              const page = await origNewPage();
              if (ctxOpts?.viewport) {
                await page.setViewport({
                  width: ctxOpts.viewport.width,
                  height: ctxOpts.viewport.height,
                  deviceScaleFactor: ctxOpts.deviceScaleFactor || 1,
                });
              }
              // Add playwright-compatible waitForTimeout
              page.waitForTimeout = (ms) => new Promise(r => setTimeout(r, ms));
              return page;
            },
            close: async () => { /* no-op for puppeteer, pages close individually */ },
          };
        };
        return browser;
      }
    };
  } catch {
    chromium = null;
  }
}

function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach(arg => {
    const match = arg.match(/^--(\w+)=(.+)$/);
    if (match) args[match[1]] = match[2];
  });
  return args;
}

/**
 * Capture a single screenshot
 * @param {object} browser - Playwright browser instance
 * @param {object} target - { name, url, html, selector, viewport, delay, deviceScaleFactor, outDir }
 * @returns {Promise<string>} Path to saved PNG
 */
async function captureOne(browser, target) {
  const {
    name,
    url,
    html,
    selector,
    viewport = '1080x810',
    waitFor,
    delay = 1500,
    deviceScaleFactor = 2,
    outDir,
  } = target;

  const [width, height] = viewport.split('x').map(Number);
  const outputDir = outDir || path.join(process.cwd(), 'assets', 'captures');
  fs.mkdirSync(outputDir, { recursive: true });

  const context = await browser.newContext({
    viewport: { width, height },
    deviceScaleFactor,
    colorScheme: target.colorScheme || 'light',
  });

  const page = await context.newPage();
  const pngPath = path.join(outputDir, `${name}.png`);

  try {
    if (html) {
      if (html.startsWith('<')) {
        // Raw HTML string
        await page.setContent(html, { waitUntil: 'domcontentloaded' });
      } else {
        // HTML file path
        const htmlContent = fs.readFileSync(path.resolve(html), 'utf-8');
        await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });
      }
    } else if (url) {
      await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 30000 });
    }

    if (waitFor) {
      try {
        await page.waitForSelector(waitFor, { timeout: 10000 });
      } catch { /* selector not found, continue */ }
    }

    await page.waitForTimeout(delay);

    const screenshotOpts = { path: pngPath, type: 'png' };

    if (selector) {
      const element = await page.$(selector);
      if (element) {
        await element.screenshot(screenshotOpts);
      } else {
        await page.screenshot(screenshotOpts);
      }
    } else {
      await page.screenshot(screenshotOpts);
    }

    console.log(`  ✓ ${name}.png (${width}x${height} @${deviceScaleFactor}x)`);
    return pngPath;
  } catch (err) {
    console.error(`  ✕ ${name}: ${err.message}`);
    return null;
  } finally {
    await context.close();
  }
}

/**
 * Capture multiple targets
 * @param {object[]} targets - Array of capture target configs
 * @param {object} opts - { outDir }
 * @returns {Promise<Map<string, string>>} name → png path
 */
async function captureAll(targets, opts = {}) {
  if (!chromium) {
    console.error('❌ Neither playwright nor puppeteer is installed. Run: npm install playwright');
    return new Map();
  }

  const outDir = opts.outDir || path.join(process.cwd(), 'assets', 'captures');
  console.log(`\n📸 Scopi Capture Pipeline`);
  console.log(`   Targets: ${targets.length}`);
  console.log(`   Output: ${outDir}\n`);

  const browser = await chromium.launch({ headless: true });
  const results = new Map();

  for (const target of targets) {
    const pngPath = await captureOne(browser, { ...target, outDir });
    if (pngPath) results.set(target.name, pngPath);
  }

  await browser.close();
  console.log(`\n   ✅ Captured ${results.size}/${targets.length} screenshots.\n`);
  return results;
}

// CLI mode
async function main() {
  const args = parseArgs();

  if (args.config) {
    const configPath = path.resolve(args.config);
    const config = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    await captureAll(config.captures, { outDir: args.out });
  } else if (args.url || args.html) {
    await captureAll([{
      name: args.name || 'capture',
      url: args.url,
      html: args.html,
      selector: args.selector,
      viewport: args.viewport || '1080x810',
    }], { outDir: args.out });
  } else {
    console.log('Usage:');
    console.log('  node capture.js --url="https://..." --name="screenshot"');
    console.log('  node capture.js --config=captures.json');
    console.log('  node capture.js --html=file.html --name="local"');
  }
}

if (require.main === module) {
  main().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
}

module.exports = { captureOne, captureAll };
