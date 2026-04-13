const { PrismaBetterSqlite3 } = require("@prisma/adapter-better-sqlite3");
const { PrismaClient } = require("@prisma/client");

function createPrismaClient() {
  const adapter = new PrismaBetterSqlite3(
    {
      url: process.env.DATABASE_URL || "file:./dev.db"
    },
    {
      timestampFormat: "unixepoch-ms"
    }
  );

  return new PrismaClient({ adapter });
}

module.exports = {
  createPrismaClient
};
