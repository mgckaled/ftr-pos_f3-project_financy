// Tipos espelhando o schema do backend (Mercurius/Fastify)

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: string;
}

export interface AuthPayload {
  token: string;
  user: User;
}

export interface Category {
  id: string;
  name: string;
  userId: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  title: string;
  amount: number;
  type: "income" | "expense";
  categoryId: string;
  userId: string;
  createdAt: string;
}
