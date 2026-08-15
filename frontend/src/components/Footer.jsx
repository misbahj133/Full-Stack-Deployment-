export default function Footer() {
  return (
    <footer style={{ marginTop: "80px", padding: "28px 24px 40px" }}>
      <hr className="rule-thin" style={{ marginBottom: "20px" }} />
      <div
        className="container-wide"
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexWrap: "wrap",
          gap: "10px",
          fontFamily: "var(--font-mono)",
          fontSize: "12px",
          color: "var(--ink-soft)",
          padding: 0,
        }}
      >
        <span>Fieldnotes — dispatches worth reading</span>
        <span>Built with the MERN stack</span>
      </div>
    </footer>
  );
}
