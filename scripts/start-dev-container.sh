#!/bin/sh

set -eu

DB_FILE="/data/dev.db"
BOOTSTRAP_DATABASE=0

if [ ! -f "$DB_FILE" ]; then
  BOOTSTRAP_DATABASE=1
fi

echo "[modaily-dev] prisma generate"
pnpm run prisma:generate

echo "[modaily-dev] prisma db push"
pnpm run db:push

echo "[modaily-dev] clearing stale .next cache"
rm -rf /app/.next/* 2>/dev/null || true

if [ "$BOOTSTRAP_DATABASE" = "1" ]; then
  echo "[modaily-dev] fresh database detected, running one-time bootstrap"

  if ! pnpm run db:seed; then
    echo "[modaily-dev] db:seed failed; continuing without blocking dev server"
  fi

  if ! node scripts/bootstrap-media.js; then
    echo "[modaily-dev] bootstrap-media failed; continuing without blocking dev server"
  fi

  if ! node scripts/assign-product-images.js; then
    echo "[modaily-dev] assign-product-images failed; continuing without blocking dev server"
  fi
else
  echo "[modaily-dev] existing database detected, skipping seed/media bootstrap"
fi

echo "[modaily-dev] starting Next.js dev server on port ${PORT:-3001}"
exec pnpm exec next dev --hostname 0.0.0.0 --port "${PORT:-3001}"
