import { Link } from "react-router-dom";

export default function PostCard({ post }) {
  const date = new Date(post.createdAt).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <article style={{ marginBottom: "40px" }}>
      {post.coverImageUrl && (
        <Link to={`/post/${post.slug}`}>
          <img
            src={post.coverImageUrl}
            alt={post.coverImageAlt || `Cover image for ${post.title}`}
            width="760"
            height="380"
            loading="lazy"
            decoding="async"
            style={{
              width: "100%",
              height: "auto",
              aspectRatio: "2 / 1",
              objectFit: "cover",
              borderRadius: "3px",
              marginBottom: "14px",
            }}
          />
        </Link>
      )}

      <div className="field-stamp" style={{ marginBottom: "10px" }}>
        <time dateTime={post.createdAt}>{date}</time>
        <span aria-hidden="true">·</span>
        <span>{post.readTimeMinutes} min read</span>
      </div>

      <h2 style={{ fontSize: "26px", marginBottom: "8px" }}>
        <Link to={`/post/${post.slug}`} style={{ color: "var(--ink)", textDecoration: "none" }}>
          {post.title}
        </Link>
      </h2>

      <p style={{ color: "var(--ink-soft)", marginBottom: "10px" }}>{post.excerpt}</p>

      <div style={{ fontFamily: "var(--font-mono)", fontSize: "12px", color: "var(--ink-soft)" }}>
        By {post.author?.name || "Unknown"}
      </div>
    </article>
  );
}
