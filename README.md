# Modaily

Modaily is a multilingual skincare e-commerce storefront built with Next.js, Prisma, and SQLite. It includes:

- storefront pages in `UZ / RU / EN`
- admin CRUD for `User`, `Product`, and `Category`
- Prisma-backed API routes
- Docker support for local testing

## Local run

```bash
npm install
npm run prisma:generate
npm run db:push
npm run db:seed
npm run dev
```

## Docker run

```bash
docker compose up --build
```

The app will be available at `http://localhost:3000`.

On container startup it will:

1. apply the Prisma schema with `db push`
2. seed initial data if the database is empty
3. start the Next.js server

## Admin

- `/uz/admin`
- `/ru/admin`
- `/en/admin`

## API

- `GET/POST /api/users`
- `GET/PATCH/DELETE /api/users/:id`
- `GET/POST /api/categories`
- `GET/PATCH/DELETE /api/categories/:id`
- `GET/POST /api/products`
- `GET/PATCH/DELETE /api/products/:id`
