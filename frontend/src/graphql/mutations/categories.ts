import { gql, type TypedDocumentNode } from "@apollo/client";
import type { Category } from "../types";

// ── Create ────────────────────────────────────────────────────────────────────

interface CreateCategoryVariables {
  input: { name: string; description?: string; icon?: string; color?: string };
}

interface CreateCategoryData {
  createCategory: Category;
}

export const CREATE_CATEGORY: TypedDocumentNode<
  CreateCategoryData,
  CreateCategoryVariables
> = gql`
  mutation CreateCategory($input: CreateCategoryInput!) {
    createCategory(input: $input) {
      id
      name
      description
      icon
      color
      userId
      createdAt
    }
  }
`;

// ── Update ────────────────────────────────────────────────────────────────────

interface UpdateCategoryVariables {
  id: string;
  input: { name: string; description?: string; icon?: string; color?: string };
}

interface UpdateCategoryData {
  updateCategory: Category;
}

export const UPDATE_CATEGORY: TypedDocumentNode<
  UpdateCategoryData,
  UpdateCategoryVariables
> = gql`
  mutation UpdateCategory($id: ID!, $input: UpdateCategoryInput!) {
    updateCategory(id: $id, input: $input) {
      id
      name
      description
      icon
      color
      userId
      createdAt
    }
  }
`;

// ── Delete ────────────────────────────────────────────────────────────────────

interface DeleteCategoryVariables {
  id: string;
}

interface DeleteCategoryData {
  deleteCategory: boolean;
}

export const DELETE_CATEGORY: TypedDocumentNode<
  DeleteCategoryData,
  DeleteCategoryVariables
> = gql`
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id)
  }
`;
