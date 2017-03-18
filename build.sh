#!/bin/bash

echo "Checking for folders and clearing them..."

rm -r ./assets/css/
mkdir -p ./assets/css/
rm -r ./assets/js/
mkdir -p ./assets/js/
# rm -r ./assets/icons/
# mkdir -p ./assets/icons/

# echo "Exporting icon Inkscape SVG to PNG and plain SVG..."
echo "PLEASE MANUALLY EXPORT/COPY SPRITE SHEET CHANGES."

# inkscape \
#   -y 0 \
#   --vacuum-defs \
#   -f images/sprites.svg \
#   --export-plain-svg assets/icons/sprites.svg \
#   --export-png assets/icons/sprites.png

# cp images/sprites.svg assets/icons/sprites.svg

echo "Converting app LESS and compressing output CSS..."

spritedc="$(md5sum images/sprites.svg | cut -c -5)"

cat \
  assets-src/css/style.less \
  | sed "s/dc=0/dc=${spritedc}/" \
  | lessc --clean-css - \
  | java -jar bin/yuicompressor-2.4.8.jar --type=css \
  > ./assets/css/compiled.css

echo "Converting print LESS and compressing output CSS..."

cat \
  assets-src/css/print.less \
  | lessc --clean-css - \
  | java -jar bin/yuicompressor-2.4.8.jar --type=css \
  > ./assets/css/compiled_print.css

echo "Combining and compressing global JS..."

cat \
  assets-src/js/global.js \
  | java -jar bin/yuicompressor-2.4.8.jar --type=js \
  > ./assets/js/global.js

echo "Combining and compressing service worker JS..."

cat \
  assets-src/js/service-worker.js \
  | java -jar bin/yuicompressor-2.4.8.jar --type=js \
  > ./assets/js/service-worker.js

echo "Combining and compressing app JS..."

cat \
  scripts/base64_encode.js \
  scripts/jquery.hotkeys.js \
  scripts/json2.js \
  scripts/utf8_encode.js \
  scripts/mapping.js \
  | java -jar bin/yuicompressor-2.4.8.jar --type=js \
  > ./assets/js/compiled_app.js

echo "Build complete!"
