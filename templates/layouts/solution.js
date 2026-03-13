/**
 * Solution Layout — Slide 3: Solution reveal
 * Introduces the solution with a bold headline and supporting description.
 * Uses an accent block to highlight the key message.
 */

/**
 * @param {object} renderer - createRenderer() instance
 * @param {object} data - { title, description, highlight, pageNum, totalPages }
 * @returns {string} Full HTML slide
 */
function solutionSlide(renderer, data) {
  const { DESIGN, seriesTag, footer, slideWrapper, accentBlock } = renderer;
  const D = DESIGN.colors;
  const F = DESIGN.fonts;

  const content = `
    ${seriesTag('warm')}

    <h2 style="
      font-size: ${DESIGN.fontSize.title};
      font-weight: 800;
      color: ${D.textPrimary};
      font-family: ${F.heading};
      margin-bottom: ${DESIGN.spacing.gap};
      line-height: 1.15;
    ">${data.title}</h2>

    <div style="flex:1; display:flex; flex-direction:column; justify-content:center; gap:${DESIGN.spacing.gapLarge};">
      ${data.description ? `
        <p style="
          font-size: ${DESIGN.fontSize.bodyLarge};
          color: ${D.textSecondary};
          font-family: ${F.body};
          line-height: 1.5;
        ">${data.description}</p>
      ` : ''}

      ${data.highlight ? accentBlock(`
        <p style="
          font-size: ${DESIGN.fontSize.bodyLarge};
          font-weight: 700;
          font-family: ${F.heading};
          line-height: 1.4;
        ">${data.highlight}</p>
      `) : ''}
    </div>

    ${footer('warm', data.pageNum || 3, data.totalPages || 8)}
  `;

  return slideWrapper('warm', content);
}

module.exports = { solutionSlide };
