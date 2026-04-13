FROM node:24-bookworm-slim

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL=file:/data/dev.db
ENV PORT=3000
ENV HOSTNAME=0.0.0.0
ENV ENABLE_DEMO_MEDIA_SYNC=false

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*
RUN corepack enable

COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./
RUN pnpm install --frozen-lockfile
RUN pnpm approve-builds --all
RUN pnpm rebuild better-sqlite3 prisma @prisma/engines

COPY . .

RUN mkdir -p /data

RUN pnpm run prisma:generate
RUN pnpm run db:push
RUN pnpm run build
RUN mkdir -p .next/standalone/.next && cp -r .next/static .next/standalone/.next/static
RUN cp -r public .next/standalone/public

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-c", "pnpm run db:push && pnpm run db:seed && if [ \"${ENABLE_DEMO_MEDIA_SYNC}\" = \"true\" ]; then node scripts/bootstrap-media.js && node scripts/assign-product-images.js; fi && cd .next/standalone && PORT=${PORT:-3000} HOSTNAME=0.0.0.0 node server.js"]
