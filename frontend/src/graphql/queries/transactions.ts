import { gql, type TypedDocumentNode } from "@apollo/client";
import type { Transaction } from "../types";

// ── List ──────────────────────────────────────────────────────────────────────

interface GetTransactionsData {
  transactions: Transaction[];
}

export const GET_TRANSACTIONS: TypedDocumentNode<
  GetTransactionsData,
  Record<string, never>
> = gql`
  query GetTransactions {
    transactions {
      id
      title
      amount
      type
      categoryId
      userId
      createdAt
    }
  }
`;

// ── Single ────────────────────────────────────────────────────────────────────

interface GetTransactionVariables {
  id: string;
}

interface GetTransactionData {
  transaction: Transaction | null;
}

export const GET_TRANSACTION: TypedDocumentNode<
  GetTransactionData,
  GetTransactionVariables
> = gql`
  query GetTransaction($id: ID!) {
    transaction(id: $id) {
      id
      title
      amount
      type
      categoryId
      userId
      createdAt
    }
  }
`;
