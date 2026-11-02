#!/bin/bash
# =============================================================
# SCENARIO REPLICA — ONE-CLICK GITHUB UPLOAD & DEPLOY SCRIPT
# 100% Free - GitHub Pages / Vercel / Netlify
# =============================================================

echo "=========================================================="
echo "  Scenario AI Website Replica — GitHub & Deployment Setup"
echo "=========================================================="
echo ""

if [ -z "$1" ]; then
  echo "Usage: ./deploy-to-github.sh <your-github-repo-url>"
  echo ""
  echo "Example:"
  echo "  ./deploy-to-github.sh https://github.com/your-username/scenario-replica.git"
  echo ""
  echo "If you haven't created a GitHub repository yet:"
  echo "1. Go to https://github.com/new"
  echo "2. Repository name: 'scenario-replica'"
  echo "3. Choose 'Public' (so free GitHub Pages hosting works)"
  echo "4. Do NOT initialize with README, .gitignore, or license"
  echo "5. Click 'Create repository'"
  echo "6. Copy the URL and run: ./deploy-to-github.sh <copied-url>"
  echo ""
  read -p "Enter your GitHub repository URL: " REPO_URL
else
  REPO_URL="$1"
fi

if [ -z "$REPO_URL" ]; then
  echo "Error: No repository URL provided."
  exit 1
fi

echo ""
echo "Setting remote origin to $REPO_URL..."
git remote remove origin 2>/dev/null
git remote add origin "$REPO_URL"
git branch -M main

echo "Pushing code to GitHub..."
git push -u origin main

if [ $? -eq 0 ]; then
  echo ""
  echo "=========================================================="
  echo "  Successfully pushed to GitHub! 🎉"
  echo "=========================================================="
  echo ""
  echo "To activate free 100% automated GitHub Pages hosting:"
  echo "1. Open your repository on GitHub"
  echo "2. Go to: Settings -> Pages"
  echo "3. Under 'Build and deployment' -> 'Source', select:"
  echo "   'GitHub Actions' (or 'Deploy from a branch' -> 'main' -> '/ root')"
  echo "4. Your live website will be launched in ~60 seconds at:"
  echo "   https://<your-username>.github.io/scenario-replica"
  echo ""
  echo "Enjoy your full Scenario replica!"
else
  echo ""
  echo "Push failed. Please ensure you have authenticated with GitHub (e.g., via SSH key or personal access token)."
fi
