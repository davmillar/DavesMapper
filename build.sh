#!/bin/bash

set -e

echo "Checking for folders and clearing them..."

rm -r ./assets/css/
mkdir -p ./assets/css/
rm -r ./assets/js/
mkdir -p ./assets/js/

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

echo "Converting app LESS and compressing output CSS..."

spritedc="$(md5sum assets-src/icons/sprites.svg | cut -c -5)"
cat \
  assets-src/css/style.less \
  | sed "s/dc=0/dc=${spritedc}/" \
  | yarn run --silent lessc --clean-css - \
  | yarn run cleancss -o ./assets/css/compiled.css

echo "Converting print LESS and compressing output CSS..."

cat \
  assets-src/css/print.less \
  | yarn run --silent lessc --clean-css - \
  | yarn run cleancss -o ./assets/css/compiled_print.css

echo "Combining and compressing global JS..."

yarn run --silent terser --compress --mangle --output ./assets/js/global.js \
  assets-src/js/jquery-3.2.1.min.js \
  assets-src/js/jquery-migrate-3.0.1.min.js \
  assets-src/js/global.js

echo "Combining and compressing app JS..."

yarn run --silent terser --compress --mangle --output ./assets/js/compiled_app.js \
  assets-src/js/Constants.js \
  assets-src/js/TileDeck.js \
  assets-src/js/TileLibrary.js \
  assets-src/js/Mapper.js \
  assets-src/js/GUI.js \
  assets-src/js/mapping.js

echo "Combining and compressing keyboard shortcut JS..."

yarn run --silent terser --compress --mangle --output ./assets/js/keyboard.js \
  assets-src/js/keyboard.js

echo "Updating and compressing service worker JS..."

contentsum="$(tar -cf - content | md5sum | cut -c -10)"
assetssum="$(tar -cf - assets-src | md5sum | cut -c -10)"
indexsum="$(md5sum index.php | cut -c -5)"

cat \
  assets-src/js/service-worker.js \
  | sed "s/my-site-cache-v1/${contentsum}-${assetssum}-${indexsum}/" \
  | yarn run --silent terser --compress --mangle --output ./assets/js/service-worker.js

echo "Build complete!"
