import Book from "../models/book.js";

const resolvers = {
  Book: {
    createdAt: (book) => book.createdAt?.toISOString(),
    updatedAt: (book) => book.updatedAt?.toISOString(),
  },

  Query: {
    books: async () => {
      return Book.find().sort({ createdAt: -1 });
    },
    book: async (_, { id }) => {
      return Book.findById(id);
    },
  },

  Mutation: {
    createBook: async (_, { title, author, context }) => {
      const book = new Book({ title, author, context });
      return book.save();
    },
    deleteBook: async (_, { id }) => {
      const deletedBook = await Book.findByIdAndDelete(id);

      if (!deletedBook) {
        throw new Error("Book not found");
      }

      return {
        message: "Book deleted successfully",
        book: deletedBook,
      };
    },
  },
};

export default resolvers;
