export const transactionsTypeDefs = `#graphql
  type Transaction {
    id: ID!
    title: String!
    amount: Float!
    type: String!
    categoryId: String!
    userId: String!
    createdAt: String!
  }

  extend type Query {
    transactions: [Transaction!]!
    transaction(id: ID!): Transaction
  }

  input CreateTransactionInput {
    title: String!
    amount: Float!
    type: String!
    categoryId: String!
  }

  input UpdateTransactionInput {
    title: String
    amount: Float
    type: String
    categoryId: String
  }

  extend type Mutation {
    createTransaction(input: CreateTransactionInput!): Transaction!
    updateTransaction(id: ID!, input: UpdateTransactionInput!): Transaction!
    deleteTransaction(id: ID!): Boolean!
  }
`;
