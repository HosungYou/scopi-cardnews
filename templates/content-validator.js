/**
 * Content Depth Validator
 * Ensures card news has substantive content, not just surface-level platitudes.
 * Called during NARA's content strategy phase.
 */

/**
 * Validate content depth of a slide arc
 * @param {object[]} slides - Array of slide descriptions
 * @param {object} opts - { minDataPoints, minSpecificFindings, minFigures }
 * @returns {object} { pass, score, warnings, suggestions }
 */
function validateContentDepth(slides, opts = {}) {
  const minDataPoints = opts.minDataPoints || 5;
  const minSpecificFindings = opts.minSpecificFindings || 3;
  const minFigures = opts.minFigures || 0;

  const warnings = [];
  const suggestions = [];
  let dataPoints = 0;
  let specificFindings = 0;
  let figures = 0;
  let genericPhrases = 0;

  // Generic phrases that indicate surface-level content
  const GENERIC_PATTERNS = [
    /기회와 도전/,
    /장점과 단점/,
    /빠르게 변화/,
    /미래를 바꿀/,
    /혁신적인 기술/,
    /opportunities and challenges/i,
    /pros and cons/i,
    /game.?changer/i,
    /transform(ing|ative)/i,
  ];

  // Patterns that indicate specific data
  const DATA_PATTERNS = [
    /\d+(\.\d+)?%/,           // percentages
    /\d+개(교|국|명|건)/,      // Korean counters
    /n\s*=\s*\d+/i,           // sample sizes
    /p\s*[<>=]\s*[\d.]+/i,    // p-values
    /\d{4}년/,                 // years
  ];

  for (const slide of slides) {
    const text = JSON.stringify(slide).toLowerCase();

    // Count data points
    for (const pattern of DATA_PATTERNS) {
      const matches = text.match(new RegExp(pattern.source, 'gi'));
      if (matches) dataPoints += matches.length;
    }

    // Count generic phrases
    for (const pattern of GENERIC_PATTERNS) {
      if (pattern.test(text)) {
        genericPhrases++;
        warnings.push(`Generic phrase detected: "${text.match(pattern)?.[0]}"`);
      }
    }

    // Check for specific findings (contains both a subject and a number)
    if (/\d+(\.\d+)?%/.test(text) && text.length > 30) {
      specificFindings++;
    }

    // Check for figures
    if (slide.figure || slide.chart || slide.embed) {
      figures++;
    }
  }

  // Scoring
  const dataScore = Math.min(dataPoints / minDataPoints, 1) * 40;
  const findingsScore = Math.min(specificFindings / minSpecificFindings, 1) * 30;
  const genericPenalty = Math.min(genericPhrases * 5, 20);
  const figureBonus = Math.min(figures * 5, 10);
  const totalScore = Math.max(0, dataScore + findingsScore + figureBonus - genericPenalty);

  // Generate suggestions
  if (dataPoints < minDataPoints) {
    suggestions.push(`Add ${minDataPoints - dataPoints} more specific data points (percentages, counts, years).`);
  }
  if (specificFindings < minSpecificFindings) {
    suggestions.push(`Include ${minSpecificFindings - specificFindings} more specific research findings with evidence.`);
  }
  if (genericPhrases > 2) {
    suggestions.push(`Replace ${genericPhrases} generic phrases with specific claims backed by data.`);
  }
  if (figures === 0) {
    suggestions.push(`Consider adding at least one data visualization (chart, comparison, or figure).`);
  }

  const pass = totalScore >= 60;

  return {
    pass,
    score: Math.round(totalScore),
    maxScore: 80,
    metrics: {
      dataPoints,
      specificFindings,
      genericPhrases,
      figures,
    },
    warnings,
    suggestions,
    verdict: pass
      ? `✅ Content depth: ${Math.round(totalScore)}/80 — substantive`
      : `⚠️ Content depth: ${Math.round(totalScore)}/80 — needs more substance`,
  };
}

module.exports = { validateContentDepth };
