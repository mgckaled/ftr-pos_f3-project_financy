import { gql, type TypedDocumentNode } from "@apollo/client";
import type { Transaction } from "../types";

// ── Create ────────────────────────────────────────────────────────────────────

interface CreateTransactionVariables {
  input: {
    title: string;
    amount: number;
    type: string;
    categoryId: string;
  };
}

interface CreateTransactionData {
  createTransaction: Transaction;
}

export const CREATE_TRANSACTION: TypedDocumentNode<
  CreateTransactionData,
  CreateTransactionVariables
> = gql`
  mutation CreateTransaction($input: CreateTransactionInput!) {
    createTransaction(input: $input) {
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

// ── Update ────────────────────────────────────────────────────────────────────

interface UpdateTransactionVariables {
  id: string;
  input: {
    title?: string;
    amount?: number;
    type?: string;
    categoryId?: string;
  };
}

interface UpdateTransactionData {
  updateTransaction: Transaction;
}

export const UPDATE_TRANSACTION: TypedDocumentNode<
  UpdateTransactionData,
  UpdateTransactionVariables
> = gql`
  mutation UpdateTransaction($id: ID!, $input: UpdateTransactionInput!) {
    updateTransaction(id: $id, input: $input) {
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

// ── Delete ────────────────────────────────────────────────────────────────────

interface DeleteTransactionVariables {
  id: string;
}

interface DeleteTransactionData {
  deleteTransaction: boolean;
}

export const DELETE_TRANSACTION: TypedDocumentNode<
  DeleteTransactionData,
  DeleteTransactionVariables
> = gql`
  mutation DeleteTransaction($id: ID!) {
    deleteTransaction(id: $id)
  }
`;
