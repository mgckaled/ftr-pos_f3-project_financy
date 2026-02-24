import "dotenv/config";
import { PrismaClient } from "../../generated/prisma/client.js";
import { PrismaLibSql } from "@prisma/adapter-libsql";

declare global {
  // eslint-disable-next-line no-var
  var prisma: PrismaClient | undefined;
}

function createPrismaClient(): PrismaClient {
  const adapter = new PrismaLibSql({
    url: process.env["DATABASE_URL"] ?? "file:dev.db",
  });
  return new PrismaClient({ adapter });
}

export const prisma: PrismaClient =
  process.env["NODE_ENV"] === "production"
    ? createPrismaClient()
    : (global.prisma ??= createPrismaClient());
