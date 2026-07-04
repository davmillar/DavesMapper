#!/bin/bash

if [ -n $ICONS ]; then
  echo "Clearing and remaking icon folder..."
  rm -r ./assets/icons/
  mkdir -p ./assets/icons/
  echo "Exporting icon Inkscape SVG to PNG and plain SVG..."
  inkscape \
    -y 0 \
    --vacuum-defs \
    -f assets-src/icons/sprites.svg \
    --export-plain-svg assets/icons/sprites.svg \
    --export-png assets/icons/sprites.png
else
  echo "Skipping icon build section..."
fi

echo "Using Gulp..."

gulp

echo "Build complete!"
