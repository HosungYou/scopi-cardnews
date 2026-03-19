#!/bin/bash
# Scopi Card News — One-Click Deploy
# Bumps version, pushes to GitHub, clears cache, reinstalls.
#
# Usage: ./scripts/deploy.sh [patch|minor|major]
#        ./scripts/deploy.sh          → defaults to patch

set -e

BUMP_TYPE="${1:-patch}"
SOURCE_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PLUGIN_NAME="scopi-cardnews"
CACHE_BASE="$HOME/.claude/plugins/cache/$PLUGIN_NAME/$PLUGIN_NAME"
MARKETPLACE_DIR="$HOME/.claude/plugins/marketplaces/$PLUGIN_NAME"
INSTALLED_JSON="$HOME/.claude/plugins/installed_plugins.json"

cd "$SOURCE_DIR"

echo ""
echo "  ╔══════════════════════════════════════╗"
echo "  ║  SCOPI CARD NEWS — DEPLOY            ║"
echo "  ╚══════════════════════════════════════╝"
echo ""

# Step 0: Check dev mode is off
if [ -L "$CACHE_BASE/$(node -p "require('./package.json').version")" ]; then
  echo "  ❌ Dev mode is ON. Run ./scripts/dev-mode.sh off first."
  exit 1
fi

# Step 1: Get current version
OLD_VERSION=$(node -p "require('./package.json').version")
echo "  📌 Current version: $OLD_VERSION"

# Step 2: Bump version
# Parse semver
IFS='.' read -r MAJOR MINOR PATCH <<< "$OLD_VERSION"
case "$BUMP_TYPE" in
  patch) PATCH=$((PATCH + 1)) ;;
  minor) MINOR=$((MINOR + 1)); PATCH=0 ;;
  major) MAJOR=$((MAJOR + 1)); MINOR=0; PATCH=0 ;;
  *) echo "  ❌ Invalid bump type: $BUMP_TYPE (use patch|minor|major)"; exit 1 ;;
esac
NEW_VERSION="$MAJOR.$MINOR.$PATCH"

echo "  📦 Bumping: $OLD_VERSION → $NEW_VERSION ($BUMP_TYPE)"

# Update package.json version
node -e "
const fs = require('fs');
const pkg = JSON.parse(fs.readFileSync('package.json', 'utf-8'));
pkg.version = '$NEW_VERSION';
fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
"

# Update .claude-plugin/plugin.json if exists
if [ -f ".claude-plugin/plugin.json" ]; then
  node -e "
  const fs = require('fs');
  const p = JSON.parse(fs.readFileSync('.claude-plugin/plugin.json', 'utf-8'));
  p.version = '$NEW_VERSION';
  fs.writeFileSync('.claude-plugin/plugin.json', JSON.stringify(p, null, 2) + '\n');
  "
fi

# Update .claude-plugin/marketplace.json if exists
if [ -f ".claude-plugin/marketplace.json" ]; then
  node -e "
  const fs = require('fs');
  const m = JSON.parse(fs.readFileSync('.claude-plugin/marketplace.json', 'utf-8'));
  if (m.plugins && m.plugins[0]) m.plugins[0].version = '$NEW_VERSION';
  fs.writeFileSync('.claude-plugin/marketplace.json', JSON.stringify(m, null, 2) + '\n');
  "
fi

echo "  ✓ Version files updated."

# Step 3: Git commit & push
echo "  📤 Committing and pushing..."
git add -A
git commit -m "v${NEW_VERSION}: plugin upgrade

Changes:
- Version bump $OLD_VERSION → $NEW_VERSION
- $(git diff --cached --stat | tail -1)" 2>/dev/null || true

git push origin main
echo "  ✓ Pushed to GitHub."

# Step 4: Clear old cache
echo "  🧹 Clearing cache..."

# Remove old versioned cache
if [ -d "$CACHE_BASE/$OLD_VERSION" ]; then
  rm -rf "$CACHE_BASE/$OLD_VERSION"
  echo "  ✓ Removed cache: $OLD_VERSION"
fi

# Remove backup if exists
if [ -d "$CACHE_BASE/${OLD_VERSION}.bak" ]; then
  rm -rf "$CACHE_BASE/${OLD_VERSION}.bak"
fi

# Step 5: Update marketplace clone
echo "  📥 Updating marketplace clone..."
if [ -d "$MARKETPLACE_DIR" ]; then
  cd "$MARKETPLACE_DIR"
  git pull origin main --ff-only
  cd "$SOURCE_DIR"
  echo "  ✓ Marketplace updated."
else
  echo "  ⚠️  Marketplace dir not found. Manual reinstall may be needed."
fi

# Step 6: Create new cache from source
echo "  📋 Creating new cache: $NEW_VERSION"
mkdir -p "$CACHE_BASE/$NEW_VERSION"
# Copy all plugin files to cache (excluding .git, node_modules, output)
rsync -a --exclude='.git' --exclude='node_modules' --exclude='output' --exclude='assets/captures' \
  "$SOURCE_DIR/" "$CACHE_BASE/$NEW_VERSION/"

# Install dependencies in cache
cd "$CACHE_BASE/$NEW_VERSION"
npm install --production --ignore-scripts 2>/dev/null || true
cd "$SOURCE_DIR"
echo "  ✓ Cache created with dependencies."

# Step 7: Update installed_plugins.json
NEW_SHA=$(git rev-parse HEAD)
echo "  📝 Updating registry..."
node -e "
const fs = require('fs');
const p = '$INSTALLED_JSON';
const data = JSON.parse(fs.readFileSync(p, 'utf-8'));
const plugins = data.plugins || data;
const key = Object.keys(plugins).find(k => k.includes('$PLUGIN_NAME'));
if (key) {
  const entry = Array.isArray(plugins[key]) ? plugins[key][0] : plugins[key];
  entry.installPath = '$CACHE_BASE/$NEW_VERSION';
  entry.version = '$NEW_VERSION';
  entry.gitCommitSha = '$NEW_SHA';
  entry.lastUpdated = new Date().toISOString();
  fs.writeFileSync(p, JSON.stringify(data, null, 4) + '\n');
  console.log('  ✓ Registry updated: ' + key + ' → v$NEW_VERSION');
} else {
  console.log('  ⚠️  Plugin key not found in registry. Manual reinstall needed.');
  console.log('  Available keys:', Object.keys(plugins).join(', '));
}
"

echo ""
echo "  ✅ Deploy complete!"
echo ""
echo "  📌 Version: $NEW_VERSION"
echo "  📁 Cache: $CACHE_BASE/$NEW_VERSION"
echo "  🔗 SHA: $NEW_SHA"
echo ""
echo "  ⚠️  Restart Claude Code to load the new version."
echo ""
