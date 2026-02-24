import { GraphQLError } from "graphql";
import { prisma } from "../../lib/prisma.js";
import { requireAuth, type GraphQLContext } from "../../middlewares/auth.js";

export const categoriesResolvers = {
  Query: {
    categories: async (
      _parent: unknown,
      _args: unknown,
      context: GraphQLContext
    ) => {
      requireAuth(context);

      return prisma.category.findMany({
        where: { userId: context.userId },
        orderBy: { createdAt: "desc" },
      });
    },

    category: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      return prisma.category.findFirst({
        where: { id: args.id, userId: context.userId },
      });
    },
  },

  Mutation: {
    createCategory: async (
      _parent: unknown,
      args: { input: { name: string } },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      return prisma.category.create({
        data: { name: args.input.name, userId: context.userId },
      });
    },

    updateCategory: async (
      _parent: unknown,
      args: { id: string; input: { name: string } },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      const existing = await prisma.category.findFirst({
        where: { id: args.id, userId: context.userId },
      });

      if (!existing) {
        throw new GraphQLError("Categoria não encontrada ou acesso negado", {
          extensions: { code: "NOT_FOUND", http: { status: 404 } },
        });
      }

      return prisma.category.update({
        where: { id: args.id },
        data: { name: args.input.name },
      });
    },

    deleteCategory: async (
      _parent: unknown,
      args: { id: string },
      context: GraphQLContext
    ) => {
      requireAuth(context);

      const existing = await prisma.category.findFirst({
        where: { id: args.id, userId: context.userId },
      });

      if (!existing) {
        throw new GraphQLError("Categoria não encontrada ou acesso negado", {
          extensions: { code: "NOT_FOUND", http: { status: 404 } },
        });
      }

      await prisma.category.delete({ where: { id: args.id } });
      return true;
    },
  },
};
