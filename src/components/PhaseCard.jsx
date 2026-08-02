import { GlowDot } from "./GlowDot.jsx";
import { STATUS_META } from "../data/phases.js";

export function PhaseCard({ phase, isActive, onClick, currentPrice }) {
  const status = STATUS_META[phase.status] || STATUS_META.framework;

  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      style={{
        flex: 1,
        minWidth: 220,
        padding: "20px 18px",
        borderRadius: 10,
        cursor: "pointer",
        background: isActive ? phase.colorDim : "rgba(255,255,255,0.03)",
        border: isActive ? `1.5px solid ${phase.color}50` : "1.5px solid rgba(255,255,255,0.06)",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isActive && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${phase.color}, transparent)`,
          }}
        />
      )}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 8, marginBottom: 10 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <GlowDot color={phase.color} />
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 11,
              color: phase.color,
              letterSpacing: 2,
              textTransform: "uppercase",
            }}
          >
            Phase {phase.id}
          </span>
        </div>
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 8,
            letterSpacing: 1,
            color: status.color,
            border: `1px solid ${status.color}40`,
            borderRadius: 4,
            padding: "2px 6px",
          }}
        >
          {status.label.toUpperCase()}
        </span>
      </div>
      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 28,
          fontWeight: 700,
          color: "#fff",
          lineHeight: 1.1,
        }}
      >
        {phase.asset}
      </div>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          color: "rgba(255,255,255,0.5)",
          marginTop: 4,
        }}
      >
        {phase.role}
      </div>
      <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, color: phase.color, fontWeight: 600 }}>
          {phase.multiple}
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
          {phase.entryDate} → {phase.exitDate}
        </span>
      </div>
      {phase.biaPrice && (
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: 1.2,
            }}
          >
            BIA
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: phase.color, fontWeight: 600 }}>
            {phase.biaPrice}
          </span>
        </div>
      )}
      {currentPrice != null && (
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <span
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              color: "rgba(255,255,255,0.3)",
              letterSpacing: 1.2,
            }}
          >
            NOW
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: phase.color, fontWeight: 600 }}>
            ${currentPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}
          </span>
        </div>
      )}
    </div>
  );
}
