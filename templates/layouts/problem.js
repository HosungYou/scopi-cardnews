/**
 * Problem Layout — Slide 2: Pain points
 * Lists 3-4 relatable pain points with number badges.
 * Warm background, empathy-driven copy.
 */

/**
 * @param {object} renderer - createRenderer() instance
 * @param {object} data - { title, points: [{num, text}], pageNum, totalPages }
 * @returns {string} Full HTML slide
 */
function problemSlide(renderer, data) {
  const { DESIGN, seriesTag, footer, slideWrapper, numberBadge } = renderer;
  const D = DESIGN.colors;
  const F = DESIGN.fonts;

  const pointsHTML = (data.points || []).map(p => `
    <div style="display:flex; align-items:center; gap:24px;">
      ${numberBadge(p.num)}
      <span style="
        font-size: ${DESIGN.fontSize.body};
        color: ${D.textSecondary};
        font-family: ${F.body};
        line-height: 1.5;
        flex:1;
      ">${p.text}</span>
    </div>
  `).join('');

  const content = `
    ${seriesTag('warm')}

    <h2 style="
      font-size: ${DESIGN.fontSize.title};
      font-weight: 800;
      color: ${D.textPrimary};
      font-family: ${F.heading};
      margin-bottom: ${DESIGN.spacing.gapLarge};
      line-height: 1.15;
    ">${data.title}</h2>

    <div style="flex:1; display:flex; flex-direction:column; justify-content:center; gap:${DESIGN.spacing.gapLarge};">
      ${pointsHTML}
    </div>

    ${footer('warm', data.pageNum || 2, data.totalPages || 8)}
  `;

  return slideWrapper('warm', content);
}

module.exports = { problemSlide };
