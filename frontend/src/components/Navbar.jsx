import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header>
      <div
        className="container-wide"
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          padding: "28px 24px 14px",
        }}
      >
        <Link to="/" style={{ textDecoration: "none" }}>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "28px",
              fontWeight: 700,
              color: "var(--ink)",
            }}
          >
            Fieldnotes
          </span>
        </Link>

        <nav aria-label="Primary" style={{ display: "flex", gap: "18px", alignItems: "center" }}>
          <Link to="/" style={{ fontFamily: "var(--font-mono)", fontSize: "13px", textTransform: "uppercase" }}>
            Read
          </Link>
          {user ? (
            <>
              <Link
                to="/dashboard"
                style={{ fontFamily: "var(--font-mono)", fontSize: "13px", textTransform: "uppercase" }}
              >
                Dashboard
              </Link>
              <Link
                to="/create"
                style={{ fontFamily: "var(--font-mono)", fontSize: "13px", textTransform: "uppercase" }}
              >
                Write
              </Link>
              <button
                onClick={handleLogout}
                className="btn btn-outline"
                style={{ padding: "6px 14px" }}
                aria-label="Log out of your account"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                style={{ fontFamily: "var(--font-mono)", fontSize: "13px", textTransform: "uppercase" }}
              >
                Log in
              </Link>
              <Link to="/register" className="btn" style={{ padding: "6px 14px" }}>
                Join
              </Link>
            </>
          )}
        </nav>
      </div>
      <hr className="rule" />
    </header>
  );
}
