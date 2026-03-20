#!/bin/bash
# Pre-generate hook -- runs before card news generation starts
# Validates that checkpoint infrastructure is in place.
#
# Available environment variables:
#   $SCOPI_EPISODE_DIR -- Path to the episode directory
#   $SCOPI_CONFIG -- Path to scopi.config.json

EPISODE_DIR="${SCOPI_EPISODE_DIR:-$(pwd)}"
CONFIG="${SCOPI_CONFIG:-$EPISODE_DIR/scopi.config.json}"

# Check config exists
if [[ ! -f "$CONFIG" ]]; then
  echo "No scopi.config.json found. Run /scopi:setup first."
  exit 1
fi

# Check plan.md exists (episode directory)
PLAN="$EPISODE_DIR/plan.md"
if [[ -f "$PLAN" ]]; then
  # Check if Episode Log section exists, add if missing
  if ! grep -q "## Episode Log" "$PLAN" 2>/dev/null; then
    echo ""
    echo "Note: plan.md exists but has no Episode Log section."
    echo "The generate pipeline will append it after completion."
  fi
fi

# Report previous episode T-Score drift (if episodes directory exists)
EPISODES_DIR="$(dirname "$EPISODE_DIR")"
if [[ -d "$EPISODES_DIR" ]]; then
  EPISODE_COUNT=$(find "$EPISODES_DIR" -maxdepth 1 -type d -name "ep*" | wc -l | tr -d ' ')
  if [[ "$EPISODE_COUNT" -gt 1 ]]; then
    echo "Episodes found: $EPISODE_COUNT"
    echo "Check previous T-Scores for drift before generating."
  fi
fi

echo "Pre-generate check complete."
