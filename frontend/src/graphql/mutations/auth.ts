import { gql, type TypedDocumentNode } from "@apollo/client";
import type { AuthPayload } from "../types";

// ── Register ──────────────────────────────────────────────────────────────────

interface RegisterVariables {
  name: string;
  email: string;
  password: string;
}

interface RegisterData {
  register: AuthPayload;
}

export const REGISTER: TypedDocumentNode<RegisterData, RegisterVariables> = gql`
  mutation Register($name: String!, $email: String!, $password: String!) {
    register(name: $name, email: $email, password: $password) {
      token
      user {
        id
        name
        email
        createdAt
      }
    }
  }
`;

// ── Login ─────────────────────────────────────────────────────────────────────

interface LoginVariables {
  email: string;
  password: string;
}

interface LoginData {
  login: AuthPayload;
}

export const LOGIN: TypedDocumentNode<LoginData, LoginVariables> = gql`
  mutation Login($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
      user {
        id
        name
        email
        createdAt
      }
    }
  }
`;
