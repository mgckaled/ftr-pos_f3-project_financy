import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaBetterSqlite3 } from "@prisma/adapter-better-sqlite3";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaBetterSqlite3({
    url: process.env["DATABASE_URL"] ?? "file:./prisma/dev.db",
  });
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient =
  process.env["NODE_ENV"] === "production"
    ? createPrismaClient()
    : (global.prisma ??= createPrismaClient());
