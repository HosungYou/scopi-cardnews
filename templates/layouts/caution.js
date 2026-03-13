/**
 * Caution Layout — Slide 7: Ethics/limitations warning
 * Presents important caveats, ethical considerations, or limitations.
 * Uses a distinct visual treatment to signal caution.
 */

/**
 * @param {object} renderer - createRenderer() instance
 * @param {object} data - { title, warnings: [{icon, text}], note, pageNum, totalPages }
 * @returns {string} Full HTML slide
 */
function cautionSlide(renderer, data) {
  const { DESIGN, seriesTag, footer, slideWrapper } = renderer;
  const D = DESIGN.colors;
  const F = DESIGN.fonts;
  const S = DESIGN.spacing;

  const warningsHTML = (data.warnings || []).map(w => `
    <div style="
      display: flex; align-items: flex-start; gap: 20px;
      padding: 24px 28px;
      background: ${D.accentSoft};
      border-radius: ${S.borderRadiusSmall};
      border-left: 5px solid ${D.accent};
    ">
      <span style="font-size: 48px; flex-shrink:0; line-height:1;">${w.icon || '⚠️'}</span>
      <p style="
        font-size: ${DESIGN.fontSize.body};
        color: ${D.textSecondary};
        font-family: ${F.body};
        line-height: 1.5;
        flex:1;
      ">${w.text}</p>
    </div>
  `).join('');

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

    <div style="flex:1; display:flex; flex-direction:column; justify-content:center; gap:${DESIGN.spacing.gap};">
      ${warningsHTML}
    </div>

    ${data.note ? `
      <p style="
        font-size: ${DESIGN.fontSize.caption};
        color: ${D.textTertiary};
        font-family: ${F.body};
        font-style: italic;
        text-align: center;
        padding-top: 12px;
      ">${data.note}</p>
    ` : ''}

    ${footer('warm', data.pageNum || 7, data.totalPages || 8)}
  `;

  return slideWrapper('warm', content);
}

module.exports = { cautionSlide };
