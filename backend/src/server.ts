import "dotenv/config";
import Fastify from "fastify";
import cors from "@fastify/cors";
import mercurius from "mercurius";
import { authTypeDefs } from "./graphql/typeDefs/auth.js";
import { categoriesTypeDefs } from "./graphql/typeDefs/categories.js";
import { transactionsTypeDefs } from "./graphql/typeDefs/transactions.js";
import { authResolvers } from "./graphql/resolvers/auth.js";
import { categoriesResolvers } from "./graphql/resolvers/categories.js";
import { transactionsResolvers } from "./graphql/resolvers/transactions.js";
import { buildContext } from "./middlewares/auth.js";

const schema = [authTypeDefs, categoriesTypeDefs, transactionsTypeDefs].join(
  "\n"
);

function toISO(value: unknown): string {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "number") return new Date(value).toISOString();
  return String(value);
}

const resolvers = {
  Query: {
    ...categoriesResolvers.Query,
    ...transactionsResolvers.Query,
  },
  Mutation: {
    ...authResolvers.Mutation,
    ...categoriesResolvers.Mutation,
    ...transactionsResolvers.Mutation,
  },
  User: {
    createdAt: (parent: { createdAt: unknown }) => toISO(parent.createdAt),
  },
  Category: {
    createdAt: (parent: { createdAt: unknown }) => toISO(parent.createdAt),
  },
  Transaction: {
    createdAt: (parent: { createdAt: unknown }) => toISO(parent.createdAt),
  },
};

const app = Fastify({
  logger: true,
  forceCloseConnections: "idle",
});

const allowedOrigins = (process.env["CORS_ORIGIN"] ?? "http://localhost:5173")
  .split(",")
  .map((o) => o.trim());

await app.register(cors, {
  origin: allowedOrigins,
  credentials: true,
});

await app.register(mercurius, {
  schema,
  resolvers,
  context: buildContext,
  graphiql: process.env["NODE_ENV"] !== "production",
});

const shutdown = async (signal: string) => {
  app.log.info(`Sinal ${signal} recebido — encerrando servidor`);
  try {
    await app.close();
    app.log.info("Servidor encerrado com sucesso");
    process.exit(0);
  } catch (err) {
    app.log.error(err, "Erro ao encerrar o servidor");
    process.exit(1);
  }
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

try {
  await app.listen({ port: 4000, host: "0.0.0.0" });
  console.log("Servidor pronto em http://localhost:4000/graphql");
  console.log("GraphiQL disponível em http://localhost:4000/graphiql");
} catch (err) {
  app.log.error(err);
  process.exit(1);
}
