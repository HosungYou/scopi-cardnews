/**
 * Slide Renderer — Config-Aware Component Library
 * Warm-only with terracotta accent blocks.
 * 2x typography, Source Serif 4, composite emoji icon + fox mascot.
 */

const { createDesignSystem } = require('./design-system');

/**
 * Create a renderer instance bound to the current design system
 * @param {object} opts - { cwd, pluginRoot }
 * @returns {object} All rendering functions + DESIGN reference
 */
function createRenderer(opts = {}) {
  const DESIGN = createDesignSystem(opts);
  const D = DESIGN.colors;
  const F = DESIGN.fonts;
  const S = DESIGN.spacing;

  const fontLink = `<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin><link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Noto+Sans+KR:wght@400;500;600;700;800;900&family=Noto+Serif+KR:wght@400;700&family=Source+Serif+4:wght@400;600;700&family=Fira+Code:wght@400;500;600&display=swap" rel="stylesheet">`;

  const baseCSS = `
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      width: ${DESIGN.width}px;
      height: ${DESIGN.height}px;
      overflow: hidden;
      font-family: ${F.heading};
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      word-break: keep-all;
      overflow-wrap: break-word;
    }
  `;

  /** Composite emoji icon — 🎓 + 🧭 merged */
  function compositeIcon(size = 64) {
    const half = Math.round(size * 0.65);
    return `<div style="
      position: relative;
      width: ${size}px; height: ${size}px;
      display: inline-flex; align-items: center; justify-content: center;
      flex-shrink: 0;
    ">
      <span style="font-size: ${half}px; position: absolute; bottom: 0; left: 0; line-height: 1;">🧭</span>
      <span style="font-size: ${half}px; position: absolute; top: -2px; right: 0; line-height: 1;">🎓</span>
    </div>`;
  }

  /** Fox mascot SVG — terracotta fox with graduation cap */
  function foxMascot(size = 64) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="60" cy="68" rx="32" ry="30" fill="${D.accent}"/>
        <path d="M28 52 L38 20 L52 48 Z" fill="${D.accent}"/>
        <path d="M33 46 L39 26 L48 44 Z" fill="#EBDBBC"/>
        <path d="M92 52 L82 20 L68 48 Z" fill="${D.accent}"/>
        <path d="M87 46 L81 26 L72 44 Z" fill="#EBDBBC"/>
        <ellipse cx="60" cy="76" rx="20" ry="18" fill="${D.warmBg}"/>
        <ellipse cx="48" cy="64" rx="4.5" ry="5" fill="${D.textPrimary}"/>
        <ellipse cx="72" cy="64" rx="4.5" ry="5" fill="${D.textPrimary}"/>
        <circle cx="49.5" cy="62.5" r="1.8" fill="white"/>
        <circle cx="73.5" cy="62.5" r="1.8" fill="white"/>
        <ellipse cx="60" cy="74" rx="4" ry="3" fill="${D.textPrimary}"/>
        <path d="M56 77 Q60 81 64 77" stroke="${D.textPrimary}" stroke-width="1.5" fill="none" stroke-linecap="round"/>
        <polygon points="26,34 60,18 94,34 60,44" fill="${D.textPrimary}"/>
        <polygon points="30,33 60,20 90,33 60,42" fill="#262624"/>
        <line x1="76" y1="33" x2="92" y2="48" stroke="#C4923D" stroke-width="2" stroke-linecap="round"/>
        <circle cx="92" cy="50" r="3.5" fill="#C4923D"/>
        <rect x="90" y="50" width="4" height="6" rx="1" fill="#C4923D"/>
      </svg>
    `;
  }

  /** Small fox icon */
  function foxIcon(size = 36) {
    return `
      <svg width="${size}" height="${size}" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <ellipse cx="18" cy="21" rx="10" ry="9.5" fill="${D.accent}"/>
        <path d="M8 17 L11 6 L16 15 Z" fill="${D.accent}"/>
        <path d="M28 17 L25 6 L20 15 Z" fill="${D.accent}"/>
        <ellipse cx="18" cy="24" rx="6.5" ry="6" fill="${D.warmBg}"/>
        <circle cx="14.5" cy="20" r="1.5" fill="${D.textPrimary}"/>
        <circle cx="21.5" cy="20" r="1.5" fill="${D.textPrimary}"/>
        <ellipse cx="18" cy="23.5" rx="1.3" ry="1" fill="${D.textPrimary}"/>
        <polygon points="7,11 18,5 29,11 18,14.5" fill="#262624"/>
      </svg>
    `;
  }

  /** Series tag — minimal editorial badge */
  function seriesTag(mode = 'warm', opts = {}) {
    const isAccent = mode === 'accent';
    const label = opts.label || DESIGN.brand.tag;
    const color = opts.color || null;
    // opts.icon: custom HTML string for icon; opts.noIcon: true to hide icon entirely
    const iconHTML = opts.noIcon ? '' : (opts.icon || compositeIcon(40));
    return `
      <div style="
        display: inline-flex; align-items: center; gap: 12px;
        border-bottom: 3px solid ${isAccent ? 'rgba(255,255,255,0.3)' : (color || D.accent)};
        padding-bottom: 10px;
        margin-bottom: 20px;
      ">
        ${iconHTML}
        <span style="
          font-size: ${DESIGN.fontSize.tag}; font-weight: 700;
          letter-spacing: 2px; text-transform: uppercase;
          color: ${isAccent ? 'rgba(255,255,255,0.7)' : (color || D.accent)};
          font-family: ${F.heading};
        ">${label}</span>
      </div>
    `;
  }

  /** Footer — clean, larger for 2x design */
  function footer(mode = 'warm', pageNum = 1, totalPages = 10, opts = {}) {
    const isAccent = mode === 'accent';
    const textColor = isAccent ? 'rgba(255,255,255,0.5)' : D.textTertiary;
    const dotActive = isAccent ? '#FFFFFF' : D.accent;
    const dotInactive = isAccent ? 'rgba(255,255,255,0.2)' : 'rgba(20,20,19,0.12)';

    const dots = Array.from({ length: totalPages }, (_, i) => {
      const isActive = i === pageNum - 1;
      return `<div style="
        width: ${isActive ? '36px' : '12px'}; height: 12px;
        border-radius: 6px;
        background: ${isActive ? dotActive : dotInactive};
      "></div>`;
    }).join('');

    // opts.icon: custom HTML string for icon; opts.noIcon: true to hide icon
    // opts.label: custom label text (overrides brand.author)
    const iconHTML = opts.noIcon ? '' : (opts.icon || compositeIcon(48));
    const labelText = opts.label || DESIGN.brand.author;

    return `
      <div style="
        display: flex; justify-content: space-between; align-items: center;
        margin-top: auto; padding-top: 16px;
      ">
        <div style="display: flex; align-items: center; gap: 12px;">
          ${iconHTML}
          <span style="color: ${textColor}; font-size: ${DESIGN.fontSize.small}; font-weight: 600; font-family: ${F.heading};">
            ${labelText}
          </span>
        </div>
        <div style="display: flex; gap: 6px; align-items: center;">${dots}</div>
      </div>
    `;
  }

  /** Terminal mockup — realistic Claude Code terminal */
  function terminal(title, lines, opts = {}) {
    const width = opts.width || '100%';
    const fullHeight = opts.fullHeight || false;
    const fontSize = opts.fontSize || DESIGN.fontSize.code;
    const lineHeight = opts.lineHeight || '1.8';
    const lineHTML = lines.map(l => {
      if (l.type === 'prompt') return `<div style="margin-bottom:8px;"><span style="color:${D.termPrompt};font-weight:600;">❯</span> <span style="color:${D.termText};font-weight:600;">${l.text}</span></div>`;
      if (l.type === 'input') return `<div style="margin-bottom:4px;"><span style="color:${D.termComment};">  </span><span style="color:${D.termText};">${l.text}</span></div>`;
      if (l.type === 'output') return `<div style="margin-bottom:4px;"><span style="color:${D.termGreen};">  ✓</span> <span style="color:${D.termYellow};font-weight:600;">${l.highlight || ''}</span> <span style="color:${D.termComment};">${l.text}</span></div>`;
      if (l.type === 'comment') return `<div style="color:${D.termComment};margin-bottom:4px;">  # ${l.text}</div>`;
      if (l.type === 'blank') return '<div style="height:16px;"></div>';
      if (l.type === 'progress') return `<div style="margin-bottom:4px;"><span style="color:${D.termGreen};">  ●</span> <span style="color:${D.termText};">${l.text}</span></div>`;
      if (l.type === 'divider') return `<div style="height:1px;background:${D.termHeader};margin:12px 0;"></div>`;
      return `<div style="color:${D.termText};margin-bottom:4px;">${l.text}</div>`;
    }).join('');

    const height = opts.height || null;
    const flexStyle = fullHeight ? 'flex:1;display:flex;flex-direction:column;' : '';
    const heightStyle = height ? `height:${height};` : '';
    const contentFlexStyle = fullHeight ? 'flex:1;' : '';

    return `
      <div style="
        background: ${D.termBg};
        border-radius: ${S.borderRadius};
        overflow: hidden;
        width: ${width};
        box-shadow: 0 12px 40px rgba(0,0,0,0.15);
        ${flexStyle}${heightStyle}
      ">
        <div style="
          background: ${D.termHeader};
          padding: 18px 24px;
          display: flex; align-items: center; gap: 10px;
          flex-shrink: 0;
        ">
          <div style="width:16px;height:16px;border-radius:50%;background:${D.termDotRed};"></div>
          <div style="width:16px;height:16px;border-radius:50%;background:${D.termDotYellow};"></div>
          <div style="width:16px;height:16px;border-radius:50%;background:${D.termDotGreen};"></div>
          <span style="color:${D.termComment};font-size:24px;margin-left:10px;font-family:${F.code};">${title}</span>
        </div>
        <div style="
          padding: 32px 36px;
          font-family: ${F.code};
          font-size: ${fontSize};
          line-height: ${lineHeight};
          ${contentFlexStyle}
        ">${lineHTML}</div>
      </div>
    `;
  }

  /** Accent block — terracotta highlighted section */
  function accentBlock(content, opts = {}) {
    const padding = opts.padding || '36px 40px';
    const radius = opts.radius || S.borderRadius;
    return `
      <div style="
        background: ${D.accent};
        border-radius: ${radius};
        padding: ${padding};
        color: ${D.accentText};
      ">${content}</div>
    `;
  }

  /** Card — white elevated card */
  function card(content, opts = {}) {
    const padding = opts.padding || '36px';
    return `
      <div style="
        background: ${D.cardBg};
        border-radius: ${S.borderRadius};
        padding: ${padding};
        box-shadow: 0 4px 16px rgba(0,0,0,0.05);
        border: 1px solid rgba(0,0,0,0.04);
      ">${content}</div>
    `;
  }

  /** Number badge — for step indicators */
  function numberBadge(num, mode = 'warm') {
    const isAccent = mode === 'accent';
    return `
      <div style="
        width: 72px; height: 72px; border-radius: 50%;
        background: ${isAccent ? 'rgba(255,255,255,0.2)' : D.accent};
        display: flex; align-items: center; justify-content: center;
        color: #FFFFFF;
        font-weight: 800; font-size: 36px;
        font-family: ${F.heading};
        flex-shrink: 0;
      ">${num}</div>
    `;
  }

  /** Slide wrapper — full HTML document
   *  opts.backgroundImage — base64 data URI or file path
   *  opts.overlay — 'dark-gradient' | 'bright-blur' | 'none' (default: 'dark-gradient')
   *  opts.overlayOpacity — 0-1 (default: 0.55)
   *  opts.contentAlign — 'center' (default) | 'space-between'
   */
  function slideWrapper(mode, content, opts = {}) {
    const isAccent = mode === 'accent';
    const bg = opts.bg || (isAccent ? D.accentBg : D.warmBg);
    const padding = opts.padding || S.padding;
    const contentAlign = opts.contentAlign || 'center';
    const justifyContent = contentAlign === 'space-between' ? 'space-between' : 'center';

    // Background image layers
    let bgImageCSS = '';
    let overlayHTML = '';
    if (opts.backgroundImage) {
      const imgSrc = opts.backgroundImage;
      bgImageCSS = `background-image: url('${imgSrc}'); background-size: cover; background-position: center;`;

      const overlayType = opts.overlay || 'dark-gradient';
      const overlayOpacity = opts.overlayOpacity != null ? opts.overlayOpacity : 0.55;

      if (overlayType === 'dark-gradient') {
        const opTop = overlayOpacity;
        const opBottom = Math.min(overlayOpacity * 1.3, 1);
        overlayHTML = `<div style="
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          background: linear-gradient(to bottom, rgba(0,0,0,${opTop}), rgba(0,0,0,${opBottom}));
          z-index: 1;
        "></div>`;
      } else if (overlayType === 'bright-blur') {
        overlayHTML = `<div style="
          position: absolute; top: 0; left: 0; right: 0; bottom: 0;
          backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px);
          background: rgba(255,255,255,0.7);
          z-index: 1;
        "></div>`;
      }
      // overlayType === 'none' → no overlay
    }

    return `<!DOCTYPE html><html><head><meta charset="UTF-8">${fontLink}<style>${baseCSS}
      .slide-root > * { min-height: 0; }
    </style></head><body>
      <div class="slide-root" style="
        width: ${DESIGN.width}px; height: ${DESIGN.height}px;
        background: ${bg}; ${bgImageCSS}
        display: flex; flex-direction: column;
        padding: ${padding};
        position: relative;
        overflow: hidden;
      ">
        ${overlayHTML}
        <div style="
          position: relative; z-index: 2;
          display: flex; flex-direction: column;
          justify-content: ${justifyContent}; gap: 24px;
          flex: 1; min-height: 0;
        ">
          ${content}
        </div>
      </div>
    </body></html>`;
  }

  /** Horizontal bar chart — data visualization component */
  function horizontalBarChart(items, opts = {}) {
    // items: [{label, sublabel, value, maxValue, color, count}]
    const maxVal = opts.maxValue || Math.max(...items.map(i => i.value));
    const barHeight = opts.barHeight || '44px';
    const labelWidth = opts.labelWidth || '180px';
    const showCount = opts.showCount !== false;

    return items.map(item => {
      const pct = maxVal > 0 ? (item.value / maxVal * 100) : 0;
      const barColor = item.color || D.accent;
      const isEmpty = item.value === 0;

      return `
        <div style="
          display: flex; align-items: center; gap: 16px;
          margin-bottom: ${opts.gap || '12px'};
        ">
          <div style="
            width: ${labelWidth}; flex-shrink: 0;
            font-size: ${opts.labelSize || '36px'};
            font-weight: 600;
            color: ${D.textSecondary};
            font-family: ${F.heading};
            text-align: right;
            line-height: 1.2;
          ">
            <div>${item.label}</div>
            ${item.sublabel ? `<div style="font-size:${opts.sublabelSize || '28px'};color:${D.textTertiary};font-weight:500;">${item.sublabel}</div>` : ''}
          </div>
          <div style="
            flex: 1; height: ${barHeight};
            background: rgba(0,0,0,0.06);
            border-radius: 22px;
            overflow: hidden;
            position: relative;
          ">
            ${isEmpty ? '' : `
              <div style="
                width: ${pct}%;
                height: 100%;
                background: ${barColor};
                border-radius: 22px;
                transition: width 0.3s;
              "></div>
            `}
            ${isEmpty ? `
              <div style="
                position: absolute; top: 50%; left: 16px; transform: translateY(-50%);
                font-size: 28px; color: ${D.textTertiary}; font-family: ${F.heading};
              ">—</div>
            ` : ''}
          </div>
          <div style="
            width: ${opts.valueWidth || '120px'}; flex-shrink: 0;
            text-align: right;
          ">
            <span style="
              font-size: ${opts.valueSize || '40px'};
              font-weight: 800;
              color: ${item.color || D.accent};
              font-family: ${F.heading};
            ">${isEmpty ? '0%' : item.value + '%'}</span>
            ${showCount && item.count ? `
              <span style="
                font-size: ${opts.countSize || '28px'};
                font-weight: 600;
                color: ${D.textSecondary};
                font-family: ${F.heading};
                margin-left: 8px;
              ">${item.count}</span>
            ` : ''}
          </div>
        </div>
      `;
    }).join('');
  }

  /** Stat comparison — two or more big numbers side by side */
  function statComparison(stats, opts = {}) {
    // stats: [{value, label, color, bgColor}]
    const gap = opts.gap || '24px';
    const labelFontSize = parseInt(opts.labelSize || '32', 10);
    const labelLH = labelFontSize >= 36 ? '1.4' : '1.5';
    // opts.noBorder: true to remove border; opts.noBg: true to remove background
    const showBorder = !opts.noBorder;
    const showBg = !opts.noBg;

    return `
      <div style="display: flex; gap: ${gap}; flex-wrap: wrap; ${opts.style || ''}">
        ${stats.map(s => `
          <div style="
            flex: 1;
            min-width: 0;
            text-align: center;
            padding: ${opts.padding || '24px 16px'};
            ${showBg ? `background: ${s.bgColor || D.accentSoft};` : ''}
            ${showBorder ? `border: 1px solid ${s.borderColor || D.accentBorder};` : ''}
            border-radius: ${opts.radius || '12px'};
          ">
            <div style="
              font-size: ${opts.valueSize || '80px'};
              font-weight: 900;
              color: ${s.color || D.accent};
              font-family: ${F.heading};
              line-height: 1;
              letter-spacing: -2px;
            ">${s.value}</div>
            <div style="
              font-size: ${opts.labelSize || '32px'};
              font-weight: 600;
              color: ${s.labelColor || D.textSecondary};
              font-family: ${F.heading};
              margin-top: 12px;
              line-height: ${labelLH};
            ">${s.label}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /** Three-column cards — for comparison layouts */
  function threeColumnCards(cards, opts = {}) {
    // cards: [{header, headerColor, headerBg, title, body, icon}]
    const gap = opts.gap || '20px';
    const bodyFontSize = parseInt(opts.bodySize || '36', 10);
    const bodyLineHeight = bodyFontSize >= 40 ? '1.5' : '1.65';

    return `
      <div style="display: flex; flex-direction: ${opts.direction || 'column'}; gap: ${gap};">
        ${cards.map(c => `
          <div style="
            flex: 1;
            min-height: auto;
            background: ${c.bg || D.cardBg};
            border-radius: ${opts.radius || '20px'};
            overflow: hidden;
            border: 1.5px solid ${c.borderColor || 'rgba(0,0,0,0.06)'};
          ">
            <div style="
              background: ${c.headerBg || D.accentSoft};
              padding: 16px 28px;
              display: flex; align-items: center; gap: 12px;
              flex-wrap: wrap;
              border-bottom: 1.5px solid ${c.borderColor || 'rgba(0,0,0,0.06)'};
            ">
              ${c.icon ? `<span style="font-size:24px;">${c.icon}</span>` : ''}
              <span style="
                font-size: ${opts.headerSize || '30px'};
                font-weight: 700;
                color: ${c.headerColor || D.accent};
                font-family: ${F.heading};
                letter-spacing: 1px;
                text-transform: uppercase;
              ">${c.header}</span>
              ${c.title ? `
                <span style="
                  font-size: ${opts.titleSize || '30px'};
                  font-weight: 600;
                  color: ${D.textSecondary};
                  font-family: ${F.heading};
                  margin-left: 4px;
                ">/ ${c.title}</span>
              ` : ''}
            </div>
            <div style="padding: ${Math.round(bodyFontSize * 0.7)}px 28px;">
              <p style="
                font-size: ${opts.bodySize || '36px'};
                color: ${D.textSecondary};
                font-family: ${F.body};
                line-height: ${bodyLineHeight};
              ">${c.body}</p>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  /** Editorial badge — marks content as editorial interpretation vs cited data */
  function editorialBadge(label, mode = 'warm') {
    const isAccent = mode === 'accent';
    return `
      <div style="
        display: inline-flex; align-items: center; gap: 8px;
        background: ${isAccent ? 'rgba(255,255,255,0.12)' : D.accentSoft};
        border: 1.5px solid ${isAccent ? 'rgba(255,255,255,0.22)' : D.accentBorder};
        border-radius: 40px;
        padding: 8px 20px;
      ">
        <span style="
          font-size: 26px; font-weight: 700;
          color: ${isAccent ? 'rgba(255,255,255,0.7)' : D.accent};
          font-family: ${F.heading};
          letter-spacing: 1px;
        ">${label || '스코피 해석'}</span>
      </div>
    `;
  }

  /** Data stamp — temporal attribution for data-driven slides */
  function dataStamp(text, mode = 'warm') {
    const isAccent = mode === 'accent';
    const color = isAccent ? 'rgba(255,255,255,0.4)' : D.textTertiary;
    return `
      <p style="
        font-size: 28px;
        color: ${color};
        font-family: ${F.heading};
        font-weight: 500;
        margin-top: ${S.gap};
      ">${text}</p>
    `;
  }

  /** Source citation block — for referencing papers/articles */
  function sourceCitation(opts = {}) {
    // opts: {doi, authors, journal, volume, year, mode}
    const isAccent = (opts.mode || 'warm') === 'accent';
    const bgColor = isAccent ? 'rgba(0,0,0,0.20)' : D.accentSoft;
    const borderColor = isAccent ? 'rgba(255,255,255,0.12)' : D.accentBorder;
    const textColor = isAccent ? 'rgba(255,255,255,0.55)' : D.textTertiary;
    const doiColor = isAccent ? 'rgba(255,255,255,0.80)' : D.textSecondary;

    return `
      <div style="
        padding: 24px 32px;
        background: ${bgColor};
        border-radius: ${S.borderRadiusSmall};
        border: 1px solid ${borderColor};
      ">
        ${opts.doi ? `
          <p style="font-size:28px;color:${textColor};font-family:${F.heading};font-weight:600;letter-spacing:1px;text-transform:uppercase;margin-bottom:8px;">DOI</p>
          <p style="font-size:32px;color:${doiColor};font-family:${F.code};letter-spacing:0.5px;margin-bottom:12px;">${opts.doi}</p>
        ` : ''}
        ${opts.authors ? `
          <p style="font-size:30px;color:${textColor};font-family:${F.heading};font-weight:500;">
            ${opts.authors}${opts.year ? ` (${opts.year})` : ''}${opts.journal ? `. ${opts.journal}` : ''}${opts.volume ? `, Vol. ${opts.volume}` : ''}.
          </p>
        ` : ''}
      </div>
    `;
  }

  /** Progress bars — for showing proportional data without axes */
  function progressBars(items, opts = {}) {
    // items: [{label, value, color, sublabel}]
    const maxVal = opts.maxValue || 100;
    const labelFontSize = parseInt(opts.labelSize || '38', 10);
    const labelLH = labelFontSize >= 40 ? '1.3' : '1.5';

    return items.map(item => `
      <div style="margin-bottom: ${opts.gap || '16px'};">
        <div style="
          display: flex; justify-content: space-between; align-items: flex-start;
          margin-bottom: 8px;
          flex-wrap: wrap;
        ">
          <span style="
            font-size: ${opts.labelSize || '38px'};
            font-weight: 700;
            color: ${opts.labelColor || D.textPrimary};
            font-family: ${F.heading};
            line-height: ${labelLH};
          ">${item.label}</span>
          <span style="
            font-size: ${opts.valueSize || '38px'};
            font-weight: 800;
            color: ${item.color || D.accent};
            font-family: ${F.heading};
            line-height: ${labelLH};
          ">${item.value}%</span>
        </div>
        <div style="
          width: 100%; height: ${opts.barHeight || '16px'};
          background: rgba(0,0,0,0.06);
          border-radius: 8px;
          overflow: hidden;
        ">
          <div style="
            width: ${(item.value / maxVal) * 100}%;
            height: 100%;
            background: ${item.color || D.accent};
            border-radius: 8px;
            opacity: ${item.opacity || 1};
          "></div>
        </div>
        ${item.sublabel ? `
          <p style="
            font-size: 28px; color: ${D.textTertiary};
            font-family: ${F.heading}; font-weight: 500;
            margin-top: 6px;
            line-height: 1.5;
          ">${item.sublabel}</p>
        ` : ''}
      </div>
    `).join('');
  }

  return {
    DESIGN,
    compositeIcon,
    foxMascot,
    foxIcon,
    seriesTag,
    footer,
    terminal,
    accentBlock,
    card,
    numberBadge,
    slideWrapper,
    // New P0 components:
    horizontalBarChart,
    statComparison,
    threeColumnCards,
    editorialBadge,
    dataStamp,
    sourceCitation,
    progressBars,
  };
}

module.exports = { createRenderer };
