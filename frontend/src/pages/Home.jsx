import { useEffect, useState, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import api from "../api/axios";
import PostCard from "../components/PostCard";
import SEO from "../components/SEO";

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [pagination, setPagination] = useState({ page: 1, pages: 1 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchParams, setSearchParams] = useSearchParams();
  const search = searchParams.get("search") || "";
  const page = parseInt(searchParams.get("page")) || 1;

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.get("/posts", { params: { page, search: search || undefined } });
      setPosts(res.data.posts);
      setPagination(res.data.pagination);
    } catch (err) {
      setError("Couldn't load dispatches right now. Please try again shortly.");
    } finally {
      setLoading(false);
    }
  }, [page, search]);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const handleSearch = (e) => {
    e.preventDefault();
    const value = e.target.elements.search.value.trim();
    setSearchParams(value ? { search: value } : {});
  };

  return (
    <div className="container" style={{ paddingTop: "36px", paddingBottom: "60px" }}>
      <SEO />

      <p style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--ink-soft)", marginBottom: "6px" }}>
        Dispatches, essays, and field notes
      </p>
      <h1 style={{ fontSize: "40px", marginBottom: "24px" }}>Latest from the field</h1>

      <form onSubmit={handleSearch} style={{ marginBottom: "36px", display: "flex", gap: "8px" }}>
        <label htmlFor="search" className="visually-hidden">
          Search posts
        </label>
        <input id="search" name="search" type="search" placeholder="Search dispatches…" defaultValue={search} />
        <button type="submit" className="btn" style={{ flexShrink: 0 }}>
          Search
        </button>
      </form>

      {loading && <p>Loading dispatches…</p>}
      {error && <p className="error-banner">{error}</p>}

      {!loading && !error && posts.length === 0 && (
        <p style={{ color: "var(--ink-soft)" }}>
          No dispatches found{search ? ` for "${search}"` : ""}. Check back soon.
        </p>
      )}

      {posts.map((post) => (
        <PostCard key={post._id} post={post} />
      ))}

      {pagination.pages > 1 && (
        <nav aria-label="Pagination" style={{ display: "flex", gap: "10px", marginTop: "20px" }}>
          {Array.from({ length: pagination.pages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              onClick={() => setSearchParams({ ...(search ? { search } : {}), page: p })}
              className={p === pagination.page ? "btn" : "btn btn-outline"}
              style={{ padding: "6px 12px" }}
              aria-current={p === pagination.page ? "page" : undefined}
            >
              {p}
            </button>
          ))}
        </nav>
      )}
    </div>
  );
}
