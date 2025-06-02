#!/bin/bash
echo "Building TaskBuddy frontend..."
npm run build
echo "Export completed. Copying files..."
mkdir -p out/_next
cp -r .next/static out/_next/
echo "Build process completed!"