#!/bin/bash

# Deployment script for BicyAI

echo "Preparing deployment..."

# Check if git is initialized
if [ ! -d ".git" ]; then
  echo "Initializing git repository..."
  git init
  git add .
  git commit -m "Initial commit for deployment"
fi

# Add remote if not exists
git remote get-url origin > /dev/null 2>&1
if [ $? -ne 0 ]; then
  echo "Adding GitHub remote..."
  git remote add origin https://github.com/cenkki/bicyai.git
fi

# Push to GitHub
echo "Pushing code to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
  echo "Code successfully pushed to GitHub!"
  echo "Now go to https://vercel.com to deploy your application"
  echo "Remember to set the environment variables in Vercel dashboard"
  echo "Add your custom domain bicai.voon.fi in Vercel settings"
else
  echo "Failed to push to GitHub. Please check your credentials and repository settings."
fi