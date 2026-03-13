#!/usr/bin/env node
/**
 * Scopi Card News Generator Pipeline
 * HTML → PNG (Puppeteer) → PDF (pdf-lib)
 *
 * Usage:
 *   node templates/generate.js --slides=path/to/slides.js --out=output/my-cardnews
 *   node templates/generate.js --html=output/html --out=output/my-cardnews
 *
 * Config-driven: reads scopi.config.json from cwd for dimensions, retina, format.
 */

const puppeteer = require('puppeteer');
const { PDFDocument } = require('pdf-lib');
const fs = require('fs');
const path = require('path');

const { createDesignSystem, loadConfig } = require('./design-system');

// Parse CLI args
function parseArgs() {
  const args = {};
  process.argv.slice(2).forEach(arg => {
    const [key, val] = arg.replace('--', '').split('=');
    args[key] = val;
  });
  return args;
}

/**
 * Generate PNGs from an array of HTML strings
 * @param {string[]} htmlSlides - Array of full HTML documents
 * @param {object} opts - { outDir, width, height, retina, formats }
 * @returns {Promise<{pngPaths: string[], pdfPath: string|null}>}
 */
async function generateFromHTML(htmlSlides, opts = {}) {
  const config = loadConfig(opts.cwd || process.cwd());
  const DESIGN = createDesignSystem({
    cwd: opts.cwd || process.cwd(),
    pluginRoot: opts.pluginRoot || path.resolve(__dirname, '..'),
  });

  const slideWidth = opts.width || config.dimensions?.width || DESIGN.width;
  const slideHeight = opts.height || config.dimensions?.height || DESIGN.height;
  const retina = opts.retina ?? config.pipeline?.retina ?? true;
  const formats = opts.formats || config.pipeline?.format || ['png', 'pdf'];
  const outDir = opts.outDir || path.join(process.cwd(), 'output', 'cardnews');

  console.log(`\n🦊 Scopi Card News Generator`);
  console.log(`   Slides: ${htmlSlides.length}`);
  console.log(`   Dimensions: ${slideWidth}x${slideHeight}${retina ? ' @2x' : ''}`);
  console.log(`   Output: ${outDir}\n`);

  // Ensure output directory
  fs.mkdirSync(outDir, { recursive: true });

  // Launch Puppeteer
  const browser = await puppeteer.launch({
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({
    width: slideWidth,
    height: slideHeight,
    deviceScaleFactor: retina ? 2 : 1,
  });

  const pngPaths = [];

  for (let i = 0; i < htmlSlides.length; i++) {
    const slideNum = String(i + 1).padStart(2, '0');
    const html = htmlSlides[i];

    await page.setContent(html, { waitUntil: 'domcontentloaded', timeout: 30000 });

    // Wait for fonts to load
    try {
      await Promise.race([
        page.evaluateHandle('document.fonts.ready'),
        new Promise(r => setTimeout(r, 5000)),
      ]);
    } catch { /* font timeout ok */ }
    await new Promise(r => setTimeout(r, 800));

    // Screenshot
    if (formats.includes('png')) {
      const pngPath = path.join(outDir, `slide-${slideNum}.png`);
      await page.screenshot({
        path: pngPath,
        type: 'png',
        clip: { x: 0, y: 0, width: slideWidth, height: slideHeight },
      });
      pngPaths.push(pngPath);
      console.log(`   ✓ Slide ${slideNum}/${htmlSlides.length} → slide-${slideNum}.png`);
    }
  }

  await browser.close();

  // Generate PDF
  let pdfPath = null;
  if (formats.includes('pdf') && pngPaths.length > 0) {
    console.log(`\n   📄 Assembling PDF...`);
    const pdfDoc = await PDFDocument.create();

    for (const pngFile of pngPaths) {
      const pngBytes = fs.readFileSync(pngFile);
      const pngImage = await pdfDoc.embedPng(pngBytes);
      const pdfPage = pdfDoc.addPage([slideWidth, slideHeight]);
      pdfPage.drawImage(pngImage, {
        x: 0, y: 0, width: slideWidth, height: slideHeight,
      });
    }

    pdfPath = path.join(outDir, 'carousel.pdf');
    const pdfBytes = await pdfDoc.save();
    fs.writeFileSync(pdfPath, pdfBytes);
    console.log(`   ✓ PDF → carousel.pdf`);
  }

  console.log(`\n   🎉 Done! ${pngPaths.length} PNGs${pdfPath ? ' + 1 PDF' : ''} generated.`);
  console.log(`   📁 ${outDir}\n`);

  return { pngPaths, pdfPath };
}

// CLI mode: read HTML files from a directory
async function main() {
  const args = parseArgs();

  if (args.slides) {
    // Load a slide module
    const slideModule = require(path.resolve(args.slides));
    const lang = args.lang || 'en';
    const slides = slideModule.generateSlides(lang);
    await generateFromHTML(slides, {
      outDir: args.out ? path.resolve(args.out) : undefined,
      width: slideModule.SLIDE_WIDTH,
      height: slideModule.SLIDE_HEIGHT,
    });
  } else if (args.html) {
    // Read HTML files from directory
    const htmlDir = path.resolve(args.html);
    const htmlFiles = fs.readdirSync(htmlDir)
      .filter(f => f.endsWith('.html'))
      .sort()
      .map(f => fs.readFileSync(path.join(htmlDir, f), 'utf-8'));

    if (htmlFiles.length === 0) {
      console.error('❌ No HTML files found in', htmlDir);
      process.exit(1);
    }

    await generateFromHTML(htmlFiles, {
      outDir: args.out ? path.resolve(args.out) : undefined,
    });
  } else {
    console.log('Usage:');
    console.log('  node generate.js --slides=path/to/slides.js [--lang=en] [--out=output/dir]');
    console.log('  node generate.js --html=path/to/html/dir [--out=output/dir]');
  }
}

// Run if called directly
if (require.main === module) {
  main().catch(err => {
    console.error('❌ Error:', err.message);
    process.exit(1);
  });
}

module.exports = { generateFromHTML };
