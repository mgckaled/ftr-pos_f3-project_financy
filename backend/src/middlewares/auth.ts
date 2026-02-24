import jwt from "jsonwebtoken";
import { GraphQLError } from "graphql";

export interface GraphQLContext {
  userId?: string;
  email?: string;
}

interface JwtUserPayload {
  userId: string;
  email: string;
}

export function getContextFromRequest(req: {
  headers: { authorization?: string };
}): GraphQLContext {
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
  context: GraphQLContext
): asserts context is Required<GraphQLContext> {
  if (!context.userId) {
    throw new GraphQLError("Não autorizado: faça login para continuar", {
      extensions: {
        code: "UNAUTHENTICATED",
        http: { status: 401 },
      },
    });
  }
}
