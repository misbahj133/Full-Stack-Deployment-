import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";

export default function Dashboard() {
  const { user } = useAuth();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchMine = () => {
    setLoading(true);
    api
      .get("/posts/user/mine")
      .then((res) => setPosts(res.data.posts))
      .catch(() => setError("Couldn't load your dispatches."))
      .finally(() => setLoading(false));
  };

  useEffect(fetchMine, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this dispatch? This can't be undone.")) return;
    try {
      await api.delete(`/posts/${id}`);
      setPosts((prev) => prev.filter((p) => p._id !== id));
    } catch {
      setError("Couldn't delete this dispatch.");
    }
  };

  return (
    <div className="container" style={{ paddingTop: "44px", paddingBottom: "80px" }}>
      <SEO title="Your dashboard" description="Manage the dispatches you've written on Fieldnotes." />
      <h1 style={{ fontSize: "34px", marginBottom: "6px" }}>Welcome back, {user?.name?.split(" ")[0]}</h1>
      <p style={{ color: "var(--ink-soft)", marginBottom: "32px" }}>Manage what you've published.</p>

      {error && <p className="error-banner">{error}</p>}
      {loading && <p>Loading…</p>}

      {!loading && posts.length === 0 && (
        <p>
          You haven't written anything yet. <Link to="/create">Write your first dispatch →</Link>
        </p>
      )}

      {posts.map((post) => (
        <div
          key={post._id}
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "16px 0",
            borderBottom: "1px solid var(--rule)",
          }}
        >
          <div>
            <Link to={`/post/${post.slug}`} style={{ fontWeight: 600, color: "var(--ink)" }}>
              {post.title}
            </Link>
            <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--ink-soft)" }}>
              {post.published ? "Published" : "Draft"} · {new Date(post.createdAt).toLocaleDateString()}
            </div>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <Link to={`/edit/${post._id}`} className="btn btn-outline" style={{ padding: "6px 12px" }}>
              Edit
            </Link>
            <button onClick={() => handleDelete(post._id)} className="btn btn-danger" style={{ padding: "6px 12px" }}>
              Delete
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
