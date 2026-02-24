import { GraphQLError } from "graphql";
import { prisma } from "../../lib/prisma.js";
import { requireAuth, type GraphQLContext } from "../../middlewares/auth.js";

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
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext
    ) => {
      requireAuth(context);

      return prisma.transaction.findMany({
        where: { userId: context.userId },
        orderBy: { createdAt: "desc" },
      });
    },

    transaction: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      return prisma.transaction.findFirst({
        where: { id: args.id, userId: context.userId },
      });
    },
  },

  Mutation: {
    createTransaction: async (
      _parent: unknown,
      args: { input: CreateTransactionInput },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      assertValidType(args.input.type);

      const category = await prisma.category.findFirst({
        where: { id: args.input.categoryId, userId: context.userId },
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
          userId: context.userId,
        },
      });
    },

    updateTransaction: async (
      _parent: unknown,
      args: { id: string; input: UpdateTransactionInput },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      const existing = await prisma.transaction.findFirst({
        where: { id: args.id, userId: context.userId },
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
          where: { id: args.input.categoryId, userId: context.userId },
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
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      const existing = await prisma.transaction.findFirst({
        where: { id: args.id, userId: context.userId },
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
