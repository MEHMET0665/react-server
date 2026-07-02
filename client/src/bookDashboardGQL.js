import React, { useEffect, useState } from "react";

const GRAPHQL_URL = "http://localhost:5000/graphql";
const GET_BOOKS = `
  query GetBooks {
    books {
      id
      title
      author
      context
    }
  }
`;
const CREATE_BOOK = `
  mutation CreateBook($title: String!, $author: String!, $context: String!) {
    createBook(title: $title, author: $author, context: $context) {
      id
      title
      author
      context
    }
  }
`;
const DELETE_BOOK = `
  mutation DeleteBook($id: ID!) {
    deleteBook(id: $id) {
      message
      book {
        id
      }
    }
  }
`;

async function graphqlRequest(query, variables = {}) {
  const response = await fetch(GRAPHQL_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query, variables }),
  });

  const result = await response.json();

  if (!response.ok || result.errors) {
    throw new Error(result.errors?.[0]?.message || "GraphQL request failed");
  }

  return result.data;
}

export default function BookDashboardGQL() {
  const [books, setBooks] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    author: "",
    context: "",
  });
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [error, setError] = useState("");

  const fetchBooks = async () => {
    setLoading(true);
    setError("");

    try {
      const data = await graphqlRequest(GET_BOOKS);
      setBooks(data.books);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;

    setFormData((currentFormData) => ({
      ...currentFormData,
      [name]: value,
    }));
  };

  const handleCreateBook = async (event) => {
    event.preventDefault();
    setSaving(true);
    setError("");

    try {
      const data = await graphqlRequest(CREATE_BOOK, formData);
      setBooks((currentBooks) => [data.createBook, ...currentBooks]);
      setFormData({ title: "", author: "", context: "" });
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteBook = async (id) => {
    setDeletingId(id);
    setError("");

    try {
      await graphqlRequest(DELETE_BOOK, { id });
      setBooks((currentBooks) => currentBooks.filter((book) => book.id !== id));
    } catch (err) {
      setError(err.message);
    } finally {
      setDeletingId("");
    }
  };

  useEffect(() => {
    fetchBooks();
  }, []);

  if (loading) {
    return <div className="book-dashboard-status">Loading books...</div>;
  }

  if (error) {
    return <div className="book-dashboard-status">Error: {error}</div>;
  }

  return (
    <main className="book-dashboard">
      <header className="book-dashboard-header">
        <h1>Books Dashboard</h1>
        <button type="button" onClick={fetchBooks}>
          Refresh
        </button>
      </header>

      <form className="book-form" onSubmit={handleCreateBook}>
        <input
          name="title"
          type="text"
          value={formData.title}
          onChange={handleInputChange}
          placeholder="Book title"
          required
        />
        <input
          name="author"
          type="text"
          value={formData.author}
          onChange={handleInputChange}
          placeholder="Author"
          required
        />
        <textarea
          name="context"
          value={formData.context}
          onChange={handleInputChange}
          placeholder="Book context"
          required
        />
        <button type="submit" disabled={saving}>
          {saving ? "Creating..." : "Create Book"}
        </button>
      </form>

      {error && <div className="book-dashboard-error">Error: {error}</div>}

      <section className="book-grid">
        {books.map((book) => (
          <article className="book-card" key={book.id}>
            <h2>{book.title}</h2>
            <p className="book-author">{book.author}</p>
            <p className="book-context">{book.context}</p>
            <button
              className="book-delete-button"
              type="button"
              onClick={() => handleDeleteBook(book.id)}
              disabled={deletingId === book.id}
            >
              {deletingId === book.id ? "Deleting..." : "Delete"}
            </button>
          </article>
        ))}
      </section>
    </main>
  );
}
