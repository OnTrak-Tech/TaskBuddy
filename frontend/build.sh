#!/bin/bash
npm ci
npm run build
mkdir -p out
cp -r .next/static out/
cp -r public/* out/
echo '<!DOCTYPE html><html><head><meta http-equiv="refresh" content="0;url=/_next/static/index.html"></head></html>' > out/index.html
