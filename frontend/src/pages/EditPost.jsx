import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import api from "../api/axios";
import SEO from "../components/SEO";

export default function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api
      .get("/posts/user/mine")
      .then((res) => {
        const post = res.data.posts.find((p) => p._id === id);
        if (!post) {
          setError("Post not found or you don't have access to edit it.");
          return;
        }
        setForm({ ...post, tags: post.tags.join(", ") });
      })
      .catch(() => setError("Couldn't load this dispatch."))
      .finally(() => setLoading(false));
  }, [id]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      const res = await api.put(`/posts/${id}`, form);
      navigate(`/post/${res.data.post.slug}`);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't save changes. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: "60px 24px" }}>
        Loading…
      </div>
    );
  }

  if (error && !form) {
    return (
      <div className="container" style={{ padding: "60px 24px" }}>
        <p className="error-banner">{error}</p>
      </div>
    );
  }

  return (
    <div className="container" style={{ paddingTop: "44px", paddingBottom: "80px" }}>
      <SEO title={`Edit — ${form.title}`} />
      <h1 style={{ fontSize: "34px", marginBottom: "28px" }}>Edit dispatch</h1>

      {error && <p className="error-banner">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" type="text" required value={form.title} onChange={handleChange} />
        </div>

        <div className="form-field">
          <label htmlFor="excerpt">Excerpt</label>
          <textarea id="excerpt" name="excerpt" rows={2} required value={form.excerpt} onChange={handleChange} />
        </div>

        <div className="form-field">
          <label htmlFor="coverImageUrl">Cover image URL</label>
          <input
            id="coverImageUrl"
            name="coverImageUrl"
            type="url"
            value={form.coverImageUrl || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="coverImageAlt">Cover image alt text</label>
          <input
            id="coverImageAlt"
            name="coverImageAlt"
            type="text"
            value={form.coverImageAlt || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="content">Content</label>
          <textarea id="content" name="content" rows={14} required value={form.content} onChange={handleChange} />
        </div>

        <div className="form-field">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input id="tags" name="tags" type="text" value={form.tags} onChange={handleChange} />
        </div>

        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? "Saving…" : "Save changes"}
        </button>
      </form>
    </div>
  );
}
