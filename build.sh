#!/bin/bash

echo "Checking for folders and clearing them...";

rm -r ./assets/css/
mkdir -p ./assets/css/
rm -r ./assets/js/
mkdir -p ./assets/js/

echo "Combining and compressing main CSS...";

cat \
  style/style.less \
  | lessc --clean-css - \
  | yui-compressor --type=css \
  > ./assets/css/compiled.css;

echo "Combining and compressing JS...";

cat \
  scripts/global.js \
  | yui-compressor --type=js \
  > ./assets/js/compiled.js;

echo "Build complete!";