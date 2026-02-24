export const categoriesTypeDefs = `#graphql
  type Category {
    id: ID!
    name: String!
    userId: String!
    createdAt: String!
  }

  extend type Query {
    categories: [Category!]!
    category(id: ID!): Category
  }

  input CreateCategoryInput {
    name: String!
  }

  input UpdateCategoryInput {
    name: String!
  }

  extend type Mutation {
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!
  }
`;
