#!/bin/bash

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
  assets-src/js/jquery-3.2.1.min.js \
  assets-src/js/jquery-migrate-3.0.1.min.js \
  assets-src/js/global.js \
  | java -jar bin/yuicompressor-2.4.8.jar --type=js \
  > ./assets/js/global.js

echo "Combining and compressing app JS..."

cat \
  assets-src/js/base64_encode.js \
  assets-src/js/json2.js \
  assets-src/js/utf8_encode.js \
  assets-src/js/mapping.js \
  | java -jar bin/yuicompressor-2.4.8.jar --type=js \
  > ./assets/js/compiled_app.js

echo "Combining and compressing keyboard shortcut JS..."

cat \
  assets-src/js/keyboard.js \
  | java -jar bin/yuicompressor-2.4.8.jar --type=js \
  > ./assets/js/keyboard.js

echo "Updating and compressing service worker JS..."

contentsum="$(tar -cf - content | md5sum | cut -c -10)"
assetssum="$(tar -cf - assets-src | md5sum | cut -c -10)"
indexsum="$(md5sum index.php | cut -c -5)"

cat \
  assets-src/js/service-worker.js \
  | sed "s/my-site-cache-v1/${contentsum}-${assetssum}-${indexsum}/" \
  | java -jar bin/yuicompressor-2.4.8.jar --type=js \
  > ./assets/js/service-worker.js

echo "Build complete!"
