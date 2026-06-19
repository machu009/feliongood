#!/usr/bin/env bash
set -e

# Usage: ./deploy.sh "optional commit message"
# Stages everything, commits, and pushes to trigger a Vercel deploy.

MESSAGE="${1:-Update $(date '+%Y-%m-%d %H:%M')}"

cd "$(dirname "$0")"

if [ -z "$(git status --porcelain)" ]; then
  echo "Nothing to deploy — no changes since the last commit."
  exit 0
fi

echo "Staging changes..."
git add -A

echo "Committing: $MESSAGE"
git commit -m "$MESSAGE"

echo "Pushing to GitHub..."
git push

echo ""
echo "Pushed. Vercel will pick this up and redeploy automatically —"
echo "check progress at https://vercel.com/dashboard"
