const typeDefs = `#graphql
  type Book {
    id: ID!
    title: String!
    author: String!
    context: String!
    createdAt: String
    updatedAt: String
  }

  type DeleteBookResponse {
    message: String!
    book: Book
  }

  type Query {
    books: [Book!]!
    book(id: ID!): Book
  }

  type Mutation {
    createBook(title: String!, author: String!, context: String!): Book!
    deleteBook(id: ID!): DeleteBookResponse!
  }
`;

export default typeDefs;
