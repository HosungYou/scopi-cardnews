/**
 * QA Gate — Enforces quality checks in the generation pipeline.
 * When strictMode is enabled, blocks output until JURI/MARU pass.
 */

/**
 * QA Gate configuration
 * @param {object} config - scopi.config.json contents
 * @returns {object} QA gate settings
 */
function createQAGate(config = {}) {
  const pipeline = config.pipeline || {};
  const strictMode = pipeline.strictQA !== false; // default: true
  const minMARUScore = pipeline.minQAScore || 3.0;

  return {
    strictMode,
    minMARUScore,

    /**
     * Check if QA is required before proceeding
     * @returns {boolean}
     */
    isRequired() {
      return strictMode;
    },

    /**
     * Evaluate JURI results
     * @param {object} juriResult - { verdict, mustFix, shouldFix, consider }
     * @returns {object} { pass, blockers }
     */
    evaluateJURI(juriResult) {
      const mustFix = juriResult.mustFix || [];
      const shouldFix = juriResult.shouldFix || [];

      if (mustFix.length > 0) {
        return {
          pass: false,
          blockers: mustFix,
          message: `❌ JURI: ${mustFix.length} MUST FIX item(s). Cannot proceed.`,
        };
      }

      if (strictMode && shouldFix.length > 0) {
        return {
          pass: false,
          blockers: shouldFix,
          message: `⚠️ JURI: ${shouldFix.length} SHOULD FIX item(s). Strict mode requires resolution.`,
        };
      }

      return {
        pass: true,
        blockers: [],
        message: '✅ JURI: All checks passed.',
      };
    },

    /**
     * Evaluate MARU results
     * @param {object} maruResult - { overallScore, weakestSlide, suggestions }
     * @returns {object} { pass, score, message }
     */
    evaluateMARU(maruResult) {
      const score = maruResult.overallScore || 0;

      if (score < minMARUScore) {
        return {
          pass: false,
          score,
          message: `⚠️ MARU: Score ${score}/5.0 below threshold (${minMARUScore}). Revision needed.`,
          weakestSlide: maruResult.weakestSlide,
          suggestions: maruResult.suggestions || [],
        };
      }

      return {
        pass: true,
        score,
        message: `✅ MARU: Score ${score}/5.0 — meets quality threshold.`,
      };
    },

    /**
     * Combined gate check
     * @param {object} juriResult
     * @param {object} maruResult
     * @returns {object} { pass, message, details }
     */
    evaluate(juriResult, maruResult) {
      const juri = this.evaluateJURI(juriResult);
      const maru = this.evaluateMARU(maruResult);

      return {
        pass: juri.pass && maru.pass,
        juri,
        maru,
        message: juri.pass && maru.pass
          ? '✅ QA Gate: PASSED. Ready for output.'
          : '❌ QA Gate: BLOCKED. See details below.',
      };
    },
  };
}

module.exports = { createQAGate };
