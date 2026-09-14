#!/usr/bin/env bash
# Builds the fully static site for shared hosting and packs it into jimon-site.zip
# Usage: NEXT_PUBLIC_SITE_URL=https://your-domain.uz ./scripts/build-static.sh
set -euo pipefail
cd "$(dirname "$0")/.."

: "${NEXT_PUBLIC_SITE_URL:?Set NEXT_PUBLIC_SITE_URL, e.g. https://jimon.uz}"
export STATIC_EXPORT=1
export NEXT_PUBLIC_LEAD_ENDPOINT="/api/lead.php"

# The Node lead route cannot be part of a static export — park it during the build.
mv src/app/api "$TMPDIR/jimon-api-$$"
trap 'mv "$TMPDIR/jimon-api-$$" src/app/api' EXIT

rm -rf out .next
npx next build

mkdir -p out/api
cp deploy/lead.php deploy/lead.config.example.php out/api/
cp deploy/.htaccess out/.htaccess
cp deploy/404.html out/404.html

rm -f jimon-site.zip
(cd out && zip -qr ../jimon-site.zip . -x '.DS_Store')
echo
echo "✓ Static site built in ./out  →  ./jimon-site.zip ($(du -h jimon-site.zip | cut -f1))"
echo "  Upload the CONTENTS of ./out into public_html, then copy api/lead.config.example.php → api/lead.config.php and fill in the bot token."
