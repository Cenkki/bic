#!/bin/bash

# Script to create a ZIP file of the Pyörävahti project
# Run this script from the project root directory

echo "Creating ZIP file for Pyörävahti project..."

# Create a zip file excluding node_modules and other unnecessary files
zip -r pyoravahti.zip \
  .env.example \
  docker-compose.yml \
  Dockerfile \
  package.json \
  yarn.lock \
  README.md \
  next.config.ts \
  tsconfig.json \
  prisma/ \
  src/ \
  public/ \
  -x "*/node_modules/*" \
  -x "*/.next/*" \
  -x "*/dist/*" \
  -x "*/public/uploads/*" \
  -x "*.log" \
  -x "*/.git/*" \
  -x "*/tmp/*"

echo "ZIP file 'pyoravahti.zip' created successfully!"
echo "This ZIP contains all necessary files to deploy the application."