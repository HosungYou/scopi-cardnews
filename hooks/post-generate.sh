#!/bin/bash
# Post-generate hook — runs after card news generation completes
# Customize this script to fit your workflow.
#
# Available environment variables:
#   $SCOPI_OUTPUT_DIR — Path to the generated output directory
#   $SCOPI_SLIDE_COUNT — Number of slides generated
#   $SCOPI_FORMAT — Output formats (png, pdf)

OUTPUT_DIR="${SCOPI_OUTPUT_DIR:-output}"

# Open the output directory (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
  open "$OUTPUT_DIR"
fi

# Uncomment to copy to clipboard (macOS, first slide)
# FIRST_SLIDE="$OUTPUT_DIR/slide-01.png"
# if [[ -f "$FIRST_SLIDE" ]]; then
#   osascript -e "set the clipboard to (read (POSIX file \"$FIRST_SLIDE\") as «class PNGf»)"
#   echo "📋 First slide copied to clipboard"
# fi

echo "✅ Post-generate hook complete: $OUTPUT_DIR"
