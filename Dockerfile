FROM node:20-bookworm-slim

WORKDIR /app

ENV NEXT_TELEMETRY_DISABLED=1
ENV DATABASE_URL=file:/data/dev.db
ENV PORT=3000
ENV HOSTNAME=0.0.0.0

RUN apt-get update -y && apt-get install -y openssl && rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
RUN npm ci

COPY . .

RUN mkdir -p /data

RUN npm run prisma:generate
RUN npm run db:push
RUN npm run build
RUN mkdir -p .next/standalone/.next && cp -r .next/static .next/standalone/.next/static
RUN cp -r public .next/standalone/public

ENV NODE_ENV=production

EXPOSE 3000

CMD ["sh", "-c", "npm run db:push && npm run db:seed && node scripts/bootstrap-media.js && node scripts/assign-product-images.js && cd .next/standalone && PORT=${PORT:-3000} HOSTNAME=0.0.0.0 node server.js"]
