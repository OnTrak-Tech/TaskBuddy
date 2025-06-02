#!/bin/bash
echo "Building TaskBuddy frontend..."

# Check if package-lock.json exists, if not use npm install instead of npm ci
if [ -f "package-lock.json" ]; then
  echo "Found package-lock.json, using npm ci..."
  npm ci
else
  echo "No package-lock.json found, using npm install..."
  npm install
fi

# Build the application
npm run build

echo "Export completed. Copying files..."
mkdir -p out/_next
cp -r .next/static out/_next/

# Check if postbuild.js exists before running it
if [ -f "postbuild.js" ]; then
  echo "Adding Tailwind CSS to all HTML files..."
  node postbuild.js
else
  echo "Warning: postbuild.js not found, skipping post-build processing."
fi

echo "Build process completed!"