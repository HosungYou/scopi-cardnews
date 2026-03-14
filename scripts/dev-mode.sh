#!/bin/bash
# Scopi Card News — Development Mode
# Symlinks cache to source for instant updates during development.
#
# Usage: ./scripts/dev-mode.sh [on|off]

set -e

PLUGIN_NAME="scopi-cardnews"
CACHE_BASE="$HOME/.claude/plugins/cache/$PLUGIN_NAME/$PLUGIN_NAME"
SOURCE_DIR="/Volumes/External SSD/Projects/scopi-cardnews"
VERSION=$(node -p "require('$SOURCE_DIR/package.json').version")
CACHE_DIR="$CACHE_BASE/$VERSION"
BACKUP_DIR="$CACHE_BASE/${VERSION}.bak"

case "${1:-on}" in
  on)
    echo "🔧 Scopi Dev Mode: ON"
    echo "   Source: $SOURCE_DIR"
    echo "   Cache:  $CACHE_DIR"
    echo ""

    # Check if already a symlink
    if [ -L "$CACHE_DIR" ]; then
      echo "   ✓ Already in dev mode."
      exit 0
    fi

    # Backup existing cache
    if [ -d "$CACHE_DIR" ]; then
      echo "   📦 Backing up cache → ${VERSION}.bak"
      mv "$CACHE_DIR" "$BACKUP_DIR"
    fi

    # Create symlink
    ln -s "$SOURCE_DIR" "$CACHE_DIR"
    echo "   ✓ Symlink created. Changes are now instant."
    echo ""
    echo "   ⚠️  Remember: run ./scripts/dev-mode.sh off before deploying."
    ;;

  off)
    echo "🔧 Scopi Dev Mode: OFF"

    # Remove symlink
    if [ -L "$CACHE_DIR" ]; then
      rm "$CACHE_DIR"
      echo "   ✓ Symlink removed."
    fi

    # Restore backup
    if [ -d "$BACKUP_DIR" ]; then
      mv "$BACKUP_DIR" "$CACHE_DIR"
      echo "   ✓ Cache restored from backup."
    else
      echo "   ⚠️  No backup found. Run deploy to reinstall."
    fi
    ;;

  *)
    echo "Usage: ./scripts/dev-mode.sh [on|off]"
    exit 1
    ;;
esac
