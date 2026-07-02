import { useEffect, useState, useCallback, useMemo } from "react";

const API_URL = "http://localhost:5000/api/users";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({ name: "", email: "", id: Date.now()});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  /* ---------------- FETCH USERS ---------------- */
  const fetchUsers = useCallback(async (signal) => {
    setLoading(true);
    setError(null);

    try {
      const res = await fetch(API_URL, { signal });
      if (!res.ok) throw new Error("Failed to fetch users");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      if (err.name !== "AbortError") setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    fetchUsers(controller.signal);

    return () => controller.abort();
  }, [fetchUsers]);

  /* ---------------- CREATE USER ---------------- */
  const createUser = useCallback(async (e) => {
    e.preventDefault();
    if (!form.name || !form.email) return;

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) throw new Error("Failed to create user");

      const newUser = await res.json();
      setUsers((prev) => [...prev, newUser]);
      setForm({ name: "", email: "" });
    } catch (err) {
      setError(err.message);
    }
  }, [form]);

  /* ---------------- DELETE USER ---------------- */
  const deleteUser = useCallback(async (id) => {
    try {
      const res = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete user");

      setUsers((prev) => prev.filter((u) => u.id !== id));
    } catch (err) {
      setError(err.message);
    }
  }, []);

  /* ---------------- MEMOIZED LIST ---------------- */
  const renderedUsers = useMemo(() => {
    return users.map((user) => (
      <li key={user.id} style={{ display: "flex", gap: "10px" }}>
        <span>{user.name} ({user.email})</span>
        <button onClick={() => deleteUser(user.id)}>❌</button>
      </li>
    ));
  }, [users, deleteUser]);

  /* ---------------- UI ---------------- */
  return (
    <div style={{ maxWidth: 400 }}>
      <h2>Users</h2>

      <form onSubmit={createUser}>
        <input
          placeholder="Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
        />
        <input
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
        />
        <button type="submit">Add</button>
      </form>

      {loading && <p>Loading...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>{renderedUsers}</ul>
    </div>
  );
}