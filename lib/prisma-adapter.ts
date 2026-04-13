import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

export const databaseUrl = process.env.DATABASE_URL || "file:./dev.db";

export function createSqliteAdapter() {
  return new PrismaBetterSqlite3(
    {
      url: databaseUrl
    },
    {
      // Preserve compatibility with databases created by Prisma's native SQLite driver.
      timestampFormat: "unixepoch-ms"
    }
  );
}
