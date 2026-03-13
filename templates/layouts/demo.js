/**
 * Demo Layout — Slide 4: Terminal/prompt demonstration
 * Shows a realistic terminal mockup with command + output.
 * Ideal for tool demos, CLI walkthroughs, code examples.
 */

/**
 * @param {object} renderer - createRenderer() instance
 * @param {object} data - { title, terminalTitle, lines: [{type, text, highlight?}], pageNum, totalPages }
 * @returns {string} Full HTML slide
 */
function demoSlide(renderer, data) {
  const { DESIGN, seriesTag, footer, slideWrapper, terminal } = renderer;
  const D = DESIGN.colors;
  const F = DESIGN.fonts;

  const content = `
    ${seriesTag('warm')}

    ${data.title ? `
      <h2 style="
        font-size: ${DESIGN.fontSize.subtitle};
        font-weight: 700;
        color: ${D.textPrimary};
        font-family: ${F.heading};
        margin-bottom: ${DESIGN.spacing.gap};
        line-height: 1.2;
      ">${data.title}</h2>
    ` : ''}

    <div style="flex:1; display:flex; flex-direction:column; justify-content:center;">
      ${terminal(data.terminalTitle || 'Terminal', data.lines || [], { fullHeight: !data.title })}
    </div>

    ${footer('warm', data.pageNum || 4, data.totalPages || 8)}
  `;

  return slideWrapper('warm', content);
}

module.exports = { demoSlide };
