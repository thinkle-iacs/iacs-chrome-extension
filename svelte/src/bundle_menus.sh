#!/bin/bash

# Step 1: Compile TypeScript files
tsc --module ES6 menus/*

# Step 2: Modify the resulting JavaScript files
for file in menus/*.js; do
    echo working on $file
    # Remove import statements
    sed -i '' -E '/^import .*;$/d' "$file"

    # Change 'export const' and 'export let' to 'const' and 'let'
    sed -i '' -E 's/export (const|let|var) /\1 /g' "$file"
done

echo "Processing completed."
