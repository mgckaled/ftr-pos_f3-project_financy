export const categoriesTypeDefs = `#graphql
  type Category {
    id: ID!
    name: String!
    description: String
    icon: String
    color: String
    userId: String!
    createdAt: String!
  }

  extend type Query {
    categories: [Category!]!
    category(id: ID!): Category
  }

  input CreateCategoryInput {
    name: String!
    description: String
    icon: String
    color: String
  }

  input UpdateCategoryInput {
    name: String!
    description: String
    icon: String
    color: String
  }

  extend type Mutation {
    createCategory(input: CreateCategoryInput!): Category!
    updateCategory(id: ID!, input: UpdateCategoryInput!): Category!
    deleteCategory(id: ID!): Boolean!
  }
`;
