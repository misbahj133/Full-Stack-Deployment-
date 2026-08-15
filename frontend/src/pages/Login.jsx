import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await login(form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't log in. Check your details and try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "420px", paddingTop: "56px", paddingBottom: "80px" }}>
      <SEO title="Log in" description="Log in to your Fieldnotes account to write and manage dispatches." />
      <h1 style={{ fontSize: "32px", marginBottom: "28px" }}>Log in</h1>

      {error && <p className="error-banner">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="email">Email</label>
          <input id="email" name="email" type="email" required autoComplete="email" onChange={handleChange} />
        </div>
        <div className="form-field">
          <label htmlFor="password">Password</label>
          <input
            id="password"
            name="password"
            type="password"
            required
            autoComplete="current-password"
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn" disabled={submitting} style={{ width: "100%" }}>
          {submitting ? "Logging in…" : "Log in"}
        </button>
      </form>

      <p style={{ marginTop: "20px", fontSize: "14px" }}>
        New here? <Link to="/register">Create an account</Link>
      </p>
    </div>
  );
}
