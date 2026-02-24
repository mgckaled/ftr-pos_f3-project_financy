import { GraphQLError } from "graphql";
import type { MercuriusContext } from "mercurius";
import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../middlewares/auth.js";

interface CreateTransactionInput {
  title: string;
  amount: number;
  type: string;
  categoryId: string;
}

interface UpdateTransactionInput {
  title?: string;
  amount?: number;
  type?: string;
  categoryId?: string;
}

function assertValidType(type: string): void {
  if (type !== "income" && type !== "expense") {
    throw new GraphQLError('O tipo da transação deve ser "income" ou "expense"', {
      extensions: { code: "BAD_USER_INPUT" },
    });
  }
}

export const transactionsResolvers = {
  Query: {
    transactions: async (
      root: unknown,
      _args: unknown,
      ctx: MercuriusContext
    ) => {
      requireAuth(ctx);

      return prisma.transaction.findMany({
        where: { userId: ctx.userId },
        orderBy: { createdAt: "desc" },
      });
    },

    transaction: async (
      root: unknown,
      args: { id: string },
      ctx: MercuriusContext
    ) => {
      requireAuth(ctx);

      return prisma.transaction.findFirst({
        where: { id: args.id, userId: ctx.userId },
      });
    },
  },

  Mutation: {
    createTransaction: async (
      root: unknown,
      args: { input: CreateTransactionInput },
      ctx: MercuriusContext
    ) => {
      requireAuth(ctx);

      assertValidType(args.input.type);

      const category = await prisma.category.findFirst({
        where: { id: args.input.categoryId, userId: ctx.userId },
      });

      if (!category) {
        throw new GraphQLError("Categoria não encontrada ou acesso negado", {
          extensions: { code: "NOT_FOUND", http: { status: 404 } },
        });
      }

      return prisma.transaction.create({
        data: {
          title: args.input.title,
          amount: args.input.amount,
          type: args.input.type,
          categoryId: args.input.categoryId,
          userId: ctx.userId,
        },
      });
    },

    updateTransaction: async (
      root: unknown,
      args: { id: string; input: UpdateTransactionInput },
      ctx: MercuriusContext
    ) => {
      requireAuth(ctx);

      const existing = await prisma.transaction.findFirst({
        where: { id: args.id, userId: ctx.userId },
      });

      if (!existing) {
        throw new GraphQLError("Transação não encontrada ou acesso negado", {
          extensions: { code: "NOT_FOUND", http: { status: 404 } },
        });
      }

      if (args.input.type !== undefined) {
        assertValidType(args.input.type);
      }

      if (args.input.categoryId !== undefined) {
        const category = await prisma.category.findFirst({
          where: { id: args.input.categoryId, userId: ctx.userId },
        });

        if (!category) {
          throw new GraphQLError("Categoria não encontrada ou acesso negado", {
            extensions: { code: "NOT_FOUND", http: { status: 404 } },
          });
        }
      }

      return prisma.transaction.update({
        where: { id: args.id },
        data: {
          ...(args.input.title !== undefined && { title: args.input.title }),
          ...(args.input.amount !== undefined && { amount: args.input.amount }),
          ...(args.input.type !== undefined && { type: args.input.type }),
          ...(args.input.categoryId !== undefined && { categoryId: args.input.categoryId }),
        },
      });
    },

    deleteTransaction: async (
      root: unknown,
      args: { id: string },
      ctx: MercuriusContext
    ) => {
      requireAuth(ctx);

      const existing = await prisma.transaction.findFirst({
        where: { id: args.id, userId: ctx.userId },
      });

      if (!existing) {
        throw new GraphQLError("Transação não encontrada ou acesso negado", {
          extensions: { code: "NOT_FOUND", http: { status: 404 } },
        });
      }

      await prisma.transaction.delete({ where: { id: args.id } });
      return true;
    },
  },
};
