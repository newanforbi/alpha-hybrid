import { formatCurrency } from "../utils/format.js";

export function CapitalFlowBar({ phases }) {
  const total = phases[phases.length - 1].capitalOut;
  const maxLog = Math.log10(total);
  const minLog = Math.log10(phases[0].capitalIn);
  const logRange = maxLog - minLog;

  return (
    <div style={{ marginTop: 30 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>
          ILLUSTRATIVE COMPOUND PATH
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.25)", letterSpacing: 1 }}>
          — not a claimed track record
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {phases.map((p, i) => {
          const barIn = ((Math.log10(p.capitalIn) - minLog) / logRange) * 100;
          const barOut = ((Math.log10(p.capitalOut) - minLog) / logRange) * 100;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 44,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: p.color,
                  fontWeight: 600,
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {p.asset}
              </div>
              <div
                style={{
                  flex: 1,
                  height: 28,
                  position: "relative",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 4,
                  border: "1px solid rgba(255,255,255,0.05)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: `${barIn}%`,
                    width: `${barOut - barIn}%`,
                    top: 0,
                    bottom: 0,
                    background: `linear-gradient(90deg, ${p.color}20, ${p.color}40)`,
                    borderRight: `2px solid ${p.color}`,
                    transition: "all 0.5s ease",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: `${Math.min(barOut + 1, 70)}%`,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    paddingLeft: 6,
                  }}
                >
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>
                    {formatCurrency(p.capitalIn)}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.color, whiteSpace: "nowrap" }}>→</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: p.color, fontWeight: 600, whiteSpace: "nowrap" }}>
                    {formatCurrency(p.capitalOut)}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }}>
                    ({p.multiple})
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>log scale</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#F4B728" }}>
          Total: {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
}
