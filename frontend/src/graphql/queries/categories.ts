import { gql, type TypedDocumentNode } from "@apollo/client";
import type { Category } from "../types";

// ── List ──────────────────────────────────────────────────────────────────────

interface GetCategoriesData {
  categories: Category[];
}

export const GET_CATEGORIES: TypedDocumentNode<
  GetCategoriesData,
  Record<string, never>
> = gql`
  query GetCategories {
    categories {
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

// ── Single ────────────────────────────────────────────────────────────────────

interface GetCategoryVariables {
  id: string;
}

interface GetCategoryData {
  category: Category | null;
}

export const GET_CATEGORY: TypedDocumentNode<
  GetCategoryData,
  GetCategoryVariables
> = gql`
  query GetCategory($id: ID!) {
    category(id: $id) {
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
