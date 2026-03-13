/**
 * Tip Layout — Slide 6: Power-user tip
 * Shares an advanced tip or pro insight with an icon and card.
 */

/**
 * @param {object} renderer - createRenderer() instance
 * @param {object} data - { title, tipIcon, tipText, details, pageNum, totalPages }
 * @returns {string} Full HTML slide
 */
function tipSlide(renderer, data) {
  const { DESIGN, seriesTag, footer, slideWrapper, card } = renderer;
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
      ${card(`
        <div style="display:flex; align-items:flex-start; gap:24px;">
          <span style="font-size:72px; flex-shrink:0; line-height:1;">${data.tipIcon || '💡'}</span>
          <div style="flex:1;">
            <p style="
              font-size: ${DESIGN.fontSize.bodyLarge};
              font-weight: 700;
              color: ${D.textPrimary};
              font-family: ${F.heading};
              margin-bottom: 16px;
              line-height: 1.3;
            ">${data.tipText}</p>
            ${data.details ? `
              <p style="
                font-size: ${DESIGN.fontSize.body};
                color: ${D.textSecondary};
                font-family: ${F.body};
                line-height: 1.5;
              ">${data.details}</p>
            ` : ''}
          </div>
        </div>
      `)}
    </div>

    ${footer('warm', data.pageNum || 6, data.totalPages || 8)}
  `;

  return slideWrapper('warm', content);
}

module.exports = { tipSlide };
