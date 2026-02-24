import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";
import type { FastifyReply, FastifyRequest } from "fastify";

export interface AppContext {
  userId?: string;
  email?: string;
}

declare module "mercurius" {
  interface MercuriusContext extends AppContext {}
}

interface JwtUserPayload {
  userId: string;
  email: string;
}

export async function buildContext(
  req: FastifyRequest,
  _reply: FastifyReply
): Promise<AppContext> {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    return {};
  }

  const token = authHeader.replace("Bearer ", "");

  try {
    const secret = process.env["JWT_SECRET"];
    if (!secret) throw new Error("JWT_SECRET não configurado");

    const payload = jwt.verify(token, secret) as JwtUserPayload;
    return { userId: payload.userId, email: payload.email };
  } catch (err) {
    if (err instanceof jwt.TokenExpiredError) {
      return {};
    }
    if (err instanceof jwt.JsonWebTokenError) {
      return {};
    }
    return {};
  }
}

export function requireAuth(
  context: AppContext
): asserts context is Required<AppContext> {
  if (!context.userId) {
    throw new GraphQLError("Não autorizado: faça login para continuar", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }
}
