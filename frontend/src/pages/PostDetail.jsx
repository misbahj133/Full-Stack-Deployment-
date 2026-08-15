import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import SEO from "../components/SEO";

export default function PostDetail() {
  const { slug } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    api
      .get(`/posts/${slug}`)
      .then((res) => setPost(res.data.post))
      .catch(() => setError("This dispatch couldn't be found."))
      .finally(() => setLoading(false));
  }, [slug]);

  if (loading) {
    return (
      <div className="container" style={{ padding: "60px 24px" }}>
        Loading…
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container" style={{ padding: "60px 24px" }}>
        <p className="error-banner">{error || "Dispatch not found."}</p>
        <Link to="/">← Back to all dispatches</Link>
      </div>
    );
  }

  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article className="container" style={{ paddingTop: "36px", paddingBottom: "80px" }}>
      <SEO title={post.title} description={post.excerpt} image={post.coverImageUrl} />

      <div className="field-stamp" style={{ marginBottom: "16px" }}>
        <time dateTime={post.createdAt}>{date}</time>
        <span aria-hidden="true">·</span>
        <span>{post.readTimeMinutes} min read</span>
      </div>

      <h1 style={{ fontSize: "42px", marginBottom: "10px" }}>{post.title}</h1>
      <p style={{ fontFamily: "var(--font-mono)", fontSize: "13px", color: "var(--ink-soft)", marginBottom: "28px" }}>
        By {post.author?.name || "Unknown"}
      </p>

      {post.coverImageUrl && (
        <img
          src={post.coverImageUrl}
          alt={post.coverImageAlt || `Cover image for ${post.title}`}
          width="760"
          height="420"
          decoding="async"
          style={{
            width: "100%",
            height: "auto",
            aspectRatio: "16 / 9",
            objectFit: "cover",
            borderRadius: "3px",
            marginBottom: "32px",
          }}
        />
      )}

      <div className="post-body" style={{ fontSize: "19px", lineHeight: 1.75 }}>
        {post.content.split("\n\n").map((paragraph, i) => (
          <p
            key={i}
            style={
              i === 0
                ? {
                    marginBottom: "1.4em",
                  }
                : { marginBottom: "1.4em" }
            }
            className={i === 0 ? "drop-cap" : undefined}
          >
            {paragraph}
          </p>
        ))}
      </div>

      {post.tags?.length > 0 && (
        <div style={{ marginTop: "36px", display: "flex", gap: "8px", flexWrap: "wrap" }}>
          {post.tags.map((tag) => (
            <Link key={tag} to={`/?search=${encodeURIComponent(tag)}`} className="field-stamp">
              #{tag}
            </Link>
          ))}
        </div>
      )}

      <hr className="rule-thin" style={{ margin: "48px 0 24px" }} />
      <Link to="/" style={{ fontFamily: "var(--font-mono)", fontSize: "13px" }}>
        ← Back to all dispatches
      </Link>
    </article>
  );
}
