import { GraphQLError } from "graphql";
import type { MercuriusContext } from "mercurius";
import { prisma } from "../../lib/prisma.js";
import { requireAuth } from "../../middlewares/auth.js";

export const categoriesResolvers = {
  Query: {
    categories: async (
      root: unknown,
      _args: unknown,
      ctx: MercuriusContext
    ) => {
      requireAuth(ctx);

      return prisma.category.findMany({
        where: { userId: ctx.userId },
        orderBy: { createdAt: "desc" },
      });
    },

    category: async (
      root: unknown,
      args: { id: string },
      ctx: MercuriusContext
    ) => {
      requireAuth(ctx);

      return prisma.category.findFirst({
        where: { id: args.id, userId: ctx.userId },
      });
    },
  },

  Mutation: {
    createCategory: async (
      root: unknown,
      args: {
        input: { name: string; description?: string; icon?: string; color?: string };
      },
      ctx: MercuriusContext
    ) => {
      requireAuth(ctx);

      return prisma.category.create({
        data: {
          name: args.input.name,
          description: args.input.description ?? null,
          icon: args.input.icon ?? null,
          color: args.input.color ?? null,
          userId: ctx.userId,
        },
      });
    },

    updateCategory: async (
      root: unknown,
      args: {
        id: string;
        input: { name: string; description?: string; icon?: string; color?: string };
      },
      ctx: MercuriusContext
    ) => {
      requireAuth(ctx);

      const existing = await prisma.category.findFirst({
        where: { id: args.id, userId: ctx.userId },
      });

      if (!existing) {
        throw new GraphQLError("Categoria não encontrada ou acesso negado", {
          extensions: { code: "NOT_FOUND", http: { status: 404 } },
        });
      }

      return prisma.category.update({
        where: { id: args.id },
        data: {
          name: args.input.name,
          description: args.input.description != null ? args.input.description : undefined,
          icon: args.input.icon != null ? args.input.icon : undefined,
          color: args.input.color != null ? args.input.color : undefined,
        },
      });
    },

    deleteCategory: async (
      root: unknown,
      args: { id: string },
      ctx: MercuriusContext
    ) => {
      requireAuth(ctx);

      const existing = await prisma.category.findFirst({
        where: { id: args.id, userId: ctx.userId },
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
