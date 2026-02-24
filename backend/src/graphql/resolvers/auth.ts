import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
import { GraphQLError } from "graphql";
import { prisma } from "../../lib/prisma.js";
import type { GraphQLContext } from "../../middlewares/auth.js";

export const authResolvers = {
  Mutation: {
    register: async (
      _parent: unknown,
      args: { name: string; email: string; password: string }
    ) => {
      const existing = await prisma.user.findUnique({
        where: { email: args.email },
      });

      if (existing) {
        throw new GraphQLError("E-mail já cadastrado", {
          extensions: { code: "BAD_USER_INPUT" },
        });
      }

      const hashedPassword = await bcrypt.hash(args.password, 10);

      const user = await prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: hashedPassword,
        },
      });

      const secret = process.env["JWT_SECRET"];
      if (!secret) throw new Error("JWT_SECRET não configurado");

      const token = jwt.sign({ userId: user.id, email: user.email }, secret, {
        expiresIn: "7d",
      });

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
        },
      };
    },

    login: async (
      _parent: unknown,
      args: { email: string; password: string },
      _context: GraphQLContext
    ) => {
      const user = await prisma.user.findUnique({
        where: { email: args.email },
      });

      const passwordMatch = user
        ? await bcrypt.compare(args.password, user.password)
        : false;

      if (!user || !passwordMatch) {
        throw new GraphQLError("Credenciais inválidas", {
          extensions: { code: "UNAUTHENTICATED", http: { status: 401 } },
        });
      }

      const secret = process.env["JWT_SECRET"];
      if (!secret) throw new Error("JWT_SECRET não configurado");

      const token = jwt.sign({ userId: user.id, email: user.email }, secret, {
        expiresIn: "7d",
      });

      return {
        token,
        user: {
          id: user.id,
          name: user.name,
          email: user.email,
          createdAt: user.createdAt.toISOString(),
        },
      };
    },
  },
};
