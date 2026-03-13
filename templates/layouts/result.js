/**
 * Result Layout — Slide 5: Before/after output comparison
 * Shows a side-by-side or stacked comparison of before and after states.
 * Uses cards for visual separation.
 */

/**
 * @param {object} renderer - createRenderer() instance
 * @param {object} data - { title, before: {label, items}, after: {label, items}, pageNum, totalPages }
 * @returns {string} Full HTML slide
 */
function resultSlide(renderer, data) {
  const { DESIGN, seriesTag, footer, slideWrapper, card } = renderer;
  const D = DESIGN.colors;
  const F = DESIGN.fonts;

  function comparisonCard(label, items, isAfter) {
    const itemsHTML = items.map(item => `
      <div style="
        display: flex; align-items: center; gap: 16px;
        font-size: ${DESIGN.fontSize.body};
        color: ${D.textSecondary};
        font-family: ${F.body};
        line-height: 1.4;
      ">
        <span style="font-size: 36px;">${isAfter ? '✓' : '✗'}</span>
        <span>${item}</span>
      </div>
    `).join('');

    return card(`
      <div style="
        font-size: ${DESIGN.fontSize.caption};
        font-weight: 700;
        color: ${isAfter ? D.accent : D.textTertiary};
        font-family: ${F.heading};
        text-transform: uppercase;
        letter-spacing: 2px;
        margin-bottom: 20px;
      ">${label}</div>
      <div style="display:flex; flex-direction:column; gap:16px;">
        ${itemsHTML}
      </div>
    `);
  }

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
      ${data.before ? comparisonCard(data.before.label || 'Before', data.before.items || [], false) : ''}
      ${data.after ? comparisonCard(data.after.label || 'After', data.after.items || [], true) : ''}
    </div>

    ${footer('warm', data.pageNum || 5, data.totalPages || 8)}
  `;

  return slideWrapper('warm', content);
}

module.exports = { resultSlide };
