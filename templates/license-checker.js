/**
 * License Checker for External Content
 * Validates copyright status before embedding figures, images, or screenshots.
 */

const KNOWN_LICENSES = {
  'cc-by': { embed: true, requireAttribution: true, label: 'CC BY' },
  'cc-by-sa': { embed: true, requireAttribution: true, label: 'CC BY-SA' },
  'cc-by-nc': { embed: true, requireAttribution: true, commercial: false, label: 'CC BY-NC' },
  'cc0': { embed: true, requireAttribution: false, label: 'CC0 Public Domain' },
  'unsplash': { embed: true, requireAttribution: false, label: 'Unsplash License' },
  'pexels': { embed: true, requireAttribution: false, label: 'Pexels License' },
  'arxiv-default': { embed: false, requirePermission: true, label: 'arXiv (author retains copyright, no third-party redistribution)' },
  'elsevier': { embed: false, requirePermission: true, label: 'Elsevier (publisher copyright)' },
  'springer': { embed: false, requirePermission: true, label: 'Springer (publisher copyright)' },
  'wiley': { embed: false, requirePermission: true, label: 'Wiley (publisher copyright)' },
  'self-created': { embed: true, requireAttribution: false, label: 'Self-created content' },
  'fair-use': { embed: true, requireAttribution: true, requireJustification: true, label: 'Fair Use (requires justification)' },
};

/**
 * Check if an external resource can be embedded
 * @param {object} resource - { type, source, license, url, description }
 * @returns {object} { allowed, license, warnings, attribution }
 */
function checkLicense(resource) {
  const { type, source, license, url, description } = resource;
  const warnings = [];
  const result = {
    allowed: false,
    license: null,
    warnings: [],
    attribution: null,
    recommendation: '',
  };

  // Determine license
  let licenseKey = (license || '').toLowerCase().replace(/\s+/g, '-');

  // Auto-detect from source
  if (!licenseKey && source) {
    const s = source.toLowerCase();
    if (s.includes('unsplash')) licenseKey = 'unsplash';
    else if (s.includes('pexels')) licenseKey = 'pexels';
    else if (s.includes('arxiv')) licenseKey = 'arxiv-default';
    else if (s.includes('elsevier') || s.includes('sciencedirect')) licenseKey = 'elsevier';
    else if (s.includes('springer') || s.includes('nature.com')) licenseKey = 'springer';
    else if (s.includes('wiley')) licenseKey = 'wiley';
  }

  const knownLicense = KNOWN_LICENSES[licenseKey];

  if (!knownLicense) {
    result.warnings.push(`Unknown license: "${license || 'none specified'}". Cannot determine embedding rights.`);
    result.recommendation = 'Verify copyright status before embedding. Consider creating original content.';
    return result;
  }

  result.license = knownLicense;

  if (knownLicense.embed) {
    result.allowed = true;

    if (knownLicense.requireAttribution) {
      result.attribution = `Source: ${source || url || description}`;
      if (knownLicense.label.startsWith('CC')) {
        result.attribution += ` (${knownLicense.label})`;
      }
    }

    if (knownLicense.requireJustification) {
      result.warnings.push('Fair use requires justification. Document why this use qualifies (educational, commentary, criticism, etc.).');
    }

    if (knownLicense.commercial === false) {
      result.warnings.push('Non-commercial license. If this card news has commercial purpose (brand building, marketing), use may not be permitted.');
    }
  } else {
    result.allowed = false;
    result.warnings.push(`${knownLicense.label}: Direct embedding not permitted without permission.`);
    result.recommendation = knownLicense.requirePermission
      ? 'Options: (1) Contact authors for written permission, (2) Recreate the visualization using the published data (data is not copyrightable), (3) Use fair-use justification with proper attribution.'
      : 'Do not embed. Create original content instead.';
  }

  return result;
}

/**
 * Batch check all resources in a slide deck
 * @param {object[]} resources - Array of resources to check
 * @returns {object} { allAllowed, results, blockers }
 */
function checkAllResources(resources) {
  const results = resources.map(r => ({
    resource: r,
    check: checkLicense(r),
  }));

  const blockers = results.filter(r => !r.check.allowed);

  return {
    allAllowed: blockers.length === 0,
    total: resources.length,
    allowed: results.filter(r => r.check.allowed).length,
    blocked: blockers.length,
    results,
    blockers,
    summary: blockers.length === 0
      ? '✅ All resources cleared for embedding.'
      : `⚠️ ${blockers.length}/${resources.length} resources blocked. See recommendations.`,
  };
}

module.exports = { checkLicense, checkAllResources, KNOWN_LICENSES };
