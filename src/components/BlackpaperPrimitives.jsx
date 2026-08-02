export function BlackpaperSection({ color, label, children }) {
  return (
    <div style={{ marginBottom: 48 }}>
      {label && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: color || "rgba(255,255,255,0.3)", boxShadow: color ? `0 0 8px ${color}` : "none" }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: color || "rgba(255,255,255,0.35)", letterSpacing: 2 }}>
            {label}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}

export function BlackpaperPara({ children, indent }) {
  return (
    <p style={{
      fontFamily: "'Source Serif 4', Georgia, serif",
      fontSize: 16,
      lineHeight: 1.9,
      color: "rgba(255,255,255,0.62)",
      margin: "0 0 18px",
      textIndent: indent ? 28 : 0,
    }}>
      {children}
    </p>
  );
}

export function BlackpaperHeading({ children, sub }) {
  return (
    <div style={{ marginBottom: sub ? 10 : 20, marginTop: sub ? 28 : 44 }}>
      <h2 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: sub ? 20 : 26,
        fontWeight: 700,
        color: "#fff",
        margin: 0,
        lineHeight: 1.2,
      }}>
        {children}
      </h2>
      <div style={{ width: sub ? 30 : 50, height: 1, background: "rgba(255,255,255,0.12)", marginTop: 10 }} />
    </div>
  );
}

export function BlackpaperQuote({ children, color }) {
  return (
    <div style={{
      borderLeft: `2px solid ${color || "rgba(255,255,255,0.15)"}`,
      paddingLeft: 20,
      margin: "24px 0",
    }}>
      <p style={{
        fontFamily: "'Source Serif 4', Georgia, serif",
        fontSize: 17,
        lineHeight: 1.7,
        color: color || "rgba(255,255,255,0.5)",
        fontWeight: 500,
        fontStyle: "italic",
        margin: 0,
      }}>
        {children}
      </p>
    </div>
  );
}

export function BlackpaperDatum({ label, value, color }) {
  return (
    <span style={{
      display: "inline-block",
      background: `${color || "rgba(255,255,255,0.1)"}12`,
      border: `1px solid ${color || "rgba(255,255,255,0.1)"}25`,
      borderRadius: 4,
      padding: "2px 8px",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 12,
      color: color || "rgba(255,255,255,0.6)",
      margin: "0 2px",
    }}>
      {label && <span style={{ color: "rgba(255,255,255,0.3)", marginRight: 4 }}>{label}</span>}
      {value}
    </span>
  );
}
