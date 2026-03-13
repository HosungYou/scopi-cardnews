/**
 * Hook Layout — Slide 1: Crisis hook with accent background
 * Grabs attention with a provocative question or crisis scenario.
 * Uses accent (terracotta) background for maximum visual impact.
 */

/**
 * @param {object} renderer - createRenderer() instance
 * @param {object} data - { title, subtitle, seriesLabel, pageNum, totalPages }
 * @returns {string} Full HTML slide
 */
function hookSlide(renderer, data) {
  const { DESIGN, seriesTag, footer, slideWrapper, compositeIcon } = renderer;
  const D = DESIGN.colors;
  const F = DESIGN.fonts;

  const content = `
    ${seriesTag('accent', { label: data.seriesLabel })}

    <div style="flex:1; display:flex; flex-direction:column; justify-content:center; gap:${DESIGN.spacing.gapLarge};">
      <h1 style="
        font-size: ${DESIGN.fontSize.hero};
        font-weight: 900;
        line-height: 1.1;
        color: ${D.accentText};
        font-family: ${F.heading};
        letter-spacing: -2px;
      ">${data.title}</h1>

      ${data.subtitle ? `
        <p style="
          font-size: ${DESIGN.fontSize.subtitle};
          color: ${D.accentTextSoft};
          font-family: ${F.body};
          line-height: 1.4;
        ">${data.subtitle}</p>
      ` : ''}
    </div>

    ${footer('accent', data.pageNum || 1, data.totalPages || 8)}
  `;

  return slideWrapper('accent', content);
}

module.exports = { hookSlide };
