import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../api/axios";
import SEO from "../components/SEO";

export default function CreatePost() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    excerpt: "",
    content: "",
    coverImageUrl: "",
    coverImageAlt: "",
    tags: "",
  });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.coverImageUrl && !form.coverImageAlt) {
      setError("Please add alt text describing the cover image for accessibility and SEO.");
      return;
    }

    setSubmitting(true);
    try {
      const res = await api.post("/posts", form);
      navigate(`/post/${res.data.post.slug}`);
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't publish this dispatch. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ paddingTop: "44px", paddingBottom: "80px" }}>
      <SEO title="Write a new dispatch" description="Publish a new post to Fieldnotes." />
      <h1 style={{ fontSize: "34px", marginBottom: "28px" }}>Write a new dispatch</h1>

      {error && <p className="error-banner">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="title">Title</label>
          <input id="title" name="title" type="text" required maxLength={140} onChange={handleChange} />
        </div>

        <div className="form-field">
          <label htmlFor="excerpt">Excerpt (shows on the homepage)</label>
          <textarea id="excerpt" name="excerpt" rows={2} required maxLength={220} onChange={handleChange} />
        </div>

        <div className="form-field">
          <label htmlFor="coverImageUrl">Cover image URL (optional)</label>
          <input id="coverImageUrl" name="coverImageUrl" type="url" onChange={handleChange} />
        </div>

        <div className="form-field">
          <label htmlFor="coverImageAlt">Cover image alt text (required if using an image)</label>
          <input
            id="coverImageAlt"
            name="coverImageAlt"
            type="text"
            placeholder="Describe what's in the image, for screen readers and search engines"
            onChange={handleChange}
          />
        </div>

        <div className="form-field">
          <label htmlFor="content">Content (separate paragraphs with a blank line)</label>
          <textarea id="content" name="content" rows={14} required onChange={handleChange} />
        </div>

        <div className="form-field">
          <label htmlFor="tags">Tags (comma-separated)</label>
          <input id="tags" name="tags" type="text" placeholder="travel, essays, notes" onChange={handleChange} />
        </div>

        <button type="submit" className="btn" disabled={submitting}>
          {submitting ? "Publishing…" : "Publish dispatch"}
        </button>
      </form>
    </div>
  );
}
