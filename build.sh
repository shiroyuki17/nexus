#!/bin/bash
set -e

echo "=== Installing dependencies ==="
npm install

echo "=== Generating Prisma Client ==="
npx prisma generate

echo "=== Building frontend ==="
# Add root node_modules/.bin to PATH so vite is found
export PATH="$(pwd)/node_modules/.bin:$PATH"
cd frontend
vite build
cd ..

echo "=== Moving dist to public ==="
mv frontend/dist public

echo "=== Build complete! ==="
