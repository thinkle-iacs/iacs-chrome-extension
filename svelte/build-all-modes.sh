#!/usr/bin/env bash
# Build all 4 dashboard modes for testing
set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

MODES=("Staff" "HS" "MS" "Family")

echo "Building all dashboard modes for testing..."

for mode in "${MODES[@]}"; do
  echo "Building mode: $mode"
  MODE=$mode npx rollup -c 2>&1 | tail -1
  
  # Copy built files to test-builds/<mode>/
  mkdir -p "test-builds/$mode"
  cp -r public/* "test-builds/$mode/"
  echo "  -> test-builds/$mode/"
done

echo "All modes built successfully."
