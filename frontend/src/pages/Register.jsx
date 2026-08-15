import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import SEO from "../components/SEO";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);
    try {
      await register(form.name, form.email, form.password);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Couldn't create your account. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: "420px", paddingTop: "56px", paddingBottom: "80px" }}>
      <SEO title="Join" description="Create a Fieldnotes account to start publishing your own dispatches." />
      <h1 style={{ fontSize: "32px", marginBottom: "28px" }}>Create your account</h1>

      {error && <p className="error-banner">{error}</p>}

      <form onSubmit={handleSubmit}>
        <div className="form-field">
          <label htmlFor="name">Name</label>
          <input id="name" name="name" type="text" required autoComplete="name" onChange={handleChange} />
        </div>
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
            minLength={6}
            autoComplete="new-password"
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn" disabled={submitting} style={{ width: "100%" }}>
          {submitting ? "Creating account…" : "Join Fieldnotes"}
        </button>
      </form>

      <p style={{ marginTop: "20px", fontSize: "14px" }}>
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </div>
  );
}
