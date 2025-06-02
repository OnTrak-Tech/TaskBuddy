#!/bin/bash
echo "Building TaskBuddy frontend..."
npm run build
echo "Export completed. Copying files..."
mkdir -p out/_next
cp -r .next/static out/_next/
echo "Adding Tailwind CSS to all HTML files..."
node postbuild.js
echo "Build process completed!"