/**
 * CTA Layout — Slide 8: Call to action + next episode teaser
 * Final slide with strong CTA, social handles, and series teaser.
 * Uses accent background for impact.
 */

/**
 * @param {object} renderer - createRenderer() instance
 * @param {object} data - { title, subtitle, cta, handles: [{platform, handle}], nextEpisode, pageNum, totalPages }
 * @returns {string} Full HTML slide
 */
function ctaSlide(renderer, data) {
  const { DESIGN, foxMascot, footer, slideWrapper } = renderer;
  const D = DESIGN.colors;
  const F = DESIGN.fonts;

  const handlesHTML = (data.handles || []).map(h => `
    <div style="
      font-size: ${DESIGN.fontSize.body};
      color: ${D.accentTextSoft};
      font-family: ${F.heading};
    ">${h.platform}: <strong>${h.handle}</strong></div>
  `).join('');

  const content = `
    <div style="flex:1; display:flex; flex-direction:column; align-items:center; justify-content:center; text-align:center; gap:${DESIGN.spacing.gapLarge};">
      ${foxMascot(120)}

      <h2 style="
        font-size: ${DESIGN.fontSize.hero};
        font-weight: 900;
        color: ${D.accentText};
        font-family: ${F.heading};
        line-height: 1.1;
        letter-spacing: -2px;
      ">${data.title}</h2>

      ${data.subtitle ? `
        <p style="
          font-size: ${DESIGN.fontSize.subtitle};
          color: ${D.accentTextSoft};
          font-family: ${F.body};
          line-height: 1.4;
        ">${data.subtitle}</p>
      ` : ''}

      ${data.cta ? `
        <div style="
          margin-top: 16px;
          padding: 20px 48px;
          background: rgba(255,255,255,0.15);
          border-radius: 60px;
          border: 2px solid rgba(255,255,255,0.3);
        ">
          <span style="
            font-size: ${DESIGN.fontSize.bodyLarge};
            font-weight: 700;
            color: ${D.accentText};
            font-family: ${F.heading};
          ">${data.cta}</span>
        </div>
      ` : ''}

      ${handlesHTML ? `
        <div style="display:flex; flex-direction:column; gap:8px; margin-top:12px;">
          ${handlesHTML}
        </div>
      ` : ''}

      ${data.nextEpisode ? `
        <p style="
          font-size: ${DESIGN.fontSize.caption};
          color: rgba(255,255,255,0.5);
          font-family: ${F.body};
          margin-top: 20px;
        ">Next → ${data.nextEpisode}</p>
      ` : ''}
    </div>

    ${footer('accent', data.pageNum || 8, data.totalPages || 8)}
  `;

  return slideWrapper('accent', content);
}

module.exports = { ctaSlide };
