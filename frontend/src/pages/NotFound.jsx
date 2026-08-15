import { Link } from "react-router-dom";
import SEO from "../components/SEO";

export default function NotFound() {
  return (
    <div className="container" style={{ padding: "100px 24px", textAlign: "center" }}>
      <SEO title="Page not found" description="The page you're looking for doesn't exist." />
      <h1 style={{ fontSize: "48px" }}>404</h1>
      <p style={{ marginBottom: "24px", color: "var(--ink-soft)" }}>
        This dispatch seems to have gone missing.
      </p>
      <Link to="/" className="btn">
        Back to Fieldnotes
      </Link>
    </div>
  );
}
