import { useMarketData, resolveSignalStatus } from "../hooks/useMarketData.js";
import { PHASES } from "../data/phases.js";
import { SIGNAL_GRID, KEY_THRESHOLDS, PSY_RISKS, NEXT_CYCLE_FOCUS } from "../data/signals.js";
import { GlowDot } from "../components/GlowDot.jsx";

export function SignalsTab() {
  const market = useMarketData();
  const { btcDominance, solRsiWeekly, xrpRsiWeekly, loading, error, lastUpdated, source } = market;

  const statusColor = (s) =>
    s === "TRIGGERED" ? "#9D4EDD" : s === "WATCHING" ? "#F4B728" : s === "MANUAL" ? "rgba(255,255,255,0.35)" : "rgba(255,255,255,0.25)";

  const activeIdx = NEXT_CYCLE_FOCUS.phaseIndex;
  const activePhase = PHASES[activeIdx];
  const activeSignalPhase = SIGNAL_GRID[activeIdx];

  // Month counter relative to next halving (~Apr 2028)
  const NEXT_HALVING = new Date("2028-04-19");
  const monthsToHalving = Math.round((NEXT_HALVING - new Date()) / (1000 * 60 * 60 * 24 * 30.44));
  const monthLabel =
    monthsToHalving > 0 ? `Month -${monthsToHalving}` : `Month +${Math.abs(monthsToHalving)}`;

  return (
    <div>
      <style>{`@keyframes pulse-glow { 0%,100%{opacity:1} 50%{opacity:0.35} }`}</style>

      {/* Cycle Status Banner — data-driven from PHASES + SIGNAL_GRID */}
      <div style={{
        background: `${activePhase.color}08`,
        border: `1px solid ${activePhase.color}25`,
        borderRadius: 10,
        padding: "20px 24px",
        marginBottom: 28,
        display: "flex",
        alignItems: "center",
        gap: 20,
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            display: "inline-block", width: 10, height: 10, borderRadius: "50%",
            background: activePhase.color,
            boxShadow: `0 0 10px ${activePhase.color}, 0 0 20px ${activePhase.color}40`,
            animation: "pulse-glow 2s ease-in-out infinite",
          }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 2 }}>
            NEXT PHASE — 2028 CYCLE
          </span>
        </div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: activePhase.color }}>
          Phase {activeIdx + 1} — {activePhase.asset}
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5 }}>
            TO ~APR 2028 HALVING
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: "#fff" }}>
            {monthLabel}
          </div>
        </div>
      </div>

      {/* Current market metric boxes — MacroContext tile pattern */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        CURRENT WATCH METRICS
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 8 }}>
        {[
          {
            label: "BTC DOMINANCE",
            value: loading && btcDominance == null ? "…" : btcDominance != null ? `${btcDominance.toFixed(1)}%` : "—",
            desc: "Watch for < 57.5% to confirm SOL entry",
            color: "#9D4EDD",
          },
          {
            label: "SOL RSI (WEEKLY)",
            value: loading && solRsiWeekly == null ? "…" : solRsiWeekly != null ? String(solRsiWeekly) : "—",
            desc: "Entry window below 40 — accumulation phase",
            color: "#23F0C6",
          },
          {
            label: "XRP RSI (WEEKLY)",
            value: loading && xrpRsiWeekly == null ? "…" : xrpRsiWeekly != null ? String(xrpRsiWeekly) : "—",
            desc: "Exit watch above 80 — computed from CoinGecko weekly closes",
            color: "#F4B728",
          },
          {
            label: "ENTRY WINDOW",
            value: activeSignalPhase.entryWindow,
            desc: NEXT_CYCLE_FOCUS.note,
            color: activePhase.color,
            highlight: true,
          },
        ].map((m) => (
          <div key={m.label} style={{
            background: m.highlight ? `${m.color}08` : "rgba(255,255,255,0.03)",
            border: m.highlight ? `1px solid ${m.color}25` : "1px solid transparent",
            borderRadius: 6,
            padding: "14px 16px",
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: m.highlight ? m.color : "rgba(255,255,255,0.35)", letterSpacing: 1.5, marginBottom: 6 }}>
              {m.label}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: m.highlight ? 16 : 26, color: m.color, fontWeight: 700, lineHeight: 1.3 }}>{m.value}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{m.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: 1, marginBottom: 28 }}>
        {loading && !lastUpdated
          ? "FETCHING LIVE DATA…"
          : lastUpdated
            ? `LIVE VIA ${source?.toUpperCase() || "COINGECKO"} — ${lastUpdated.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
            : "LIVE DATA UNAVAILABLE"}
        {error && ` — ${error.toUpperCase()} (THRESHOLDS FALL BACK TO MANUAL)`}
        {" · STATUS KEY: TRIGGERED = metric crossed · WATCHING = live & unmet · MANUAL = discretionary"}
      </div>

      {/* Signal Grid */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        SIGNAL GRID — ALL PHASES
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 36 }}>
        {SIGNAL_GRID.map((phase) => (
          <div key={phase.phase} style={{
            background: "rgba(255,255,255,0.02)",
            border: `1px solid ${phase.color}30`,
            borderRadius: 10,
            padding: "18px 20px",
            borderTop: `2px solid ${phase.color}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <GlowDot color={phase.color} size={6} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: phase.color, letterSpacing: 1.5 }}>
                  PHASE {phase.phase} — {phase.asset}
                </span>
              </div>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                color: phase.color, background: `${phase.color}12`,
                border: `1px solid ${phase.color}35`, borderRadius: 4,
                padding: "3px 7px", letterSpacing: 0.8, whiteSpace: "nowrap",
              }}>
                {phase.entryWindow}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {phase.signals.map((sig) => {
                const status = resolveSignalStatus(sig, market);
                return (
                <div key={sig.id} style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8,
                  padding: "10px 12px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 5 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.72)", lineHeight: 1.4 }}>
                      {sig.threshold}
                    </span>
                    <span style={{
                      flexShrink: 0,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 8,
                      color: statusColor(status),
                      letterSpacing: 0.8,
                      border: `1px solid ${statusColor(status)}40`,
                      borderRadius: 4,
                      padding: "2px 6px",
                      whiteSpace: "nowrap",
                    }}>
                      {status}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                    → {sig.action}
                  </div>
                </div>
                );
              })}
            </div>
            {/* Entry condition box */}
            <div style={{
              marginTop: 12,
              background: `${PHASES[phase.phase - 1].color}05`,
              border: `1px solid ${PHASES[phase.phase - 1].color}18`,
              borderRadius: 6,
              padding: "10px 12px",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: PHASES[phase.phase - 1].color, letterSpacing: 1.5, marginBottom: 4, opacity: 0.7 }}>
                ENTRY CONDITION
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, lineHeight: 1.55, color: "rgba(255,255,255,0.45)", margin: 0 }}>
                {PHASES[phase.phase - 1].entrySignal}
              </p>
            </div>
            {/* Exit condition box — PhaseDetail exit-signal box pattern */}
            <div style={{
              marginTop: 12,
              background: `${PHASES[phase.phase - 1].color}08`,
              border: `1px solid ${PHASES[phase.phase - 1].color}20`,
              borderRadius: 6,
              padding: "10px 12px",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: PHASES[phase.phase - 1].color, letterSpacing: 1.5, marginBottom: 4 }}>
                EXIT CONDITION
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, lineHeight: 1.55, color: "rgba(255,255,255,0.55)", margin: 0 }}>
                {PHASES[phase.phase - 1].exitSignal}
              </p>
            </div>
            {/* Historical precedent — PhaseDetail keyInsight style */}
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${phase.color}15` }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.38)", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>
                {phase.historicalPrecedent}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Rotation Decision Tree */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        ROTATION DECISION TREE
      </div>
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10,
        padding: "22px 24px",
        marginBottom: 36,
        overflowX: "auto",
      }}>
        <div style={{ display: "flex", alignItems: "stretch", minWidth: 560 }}>
          {[
            { label: "SOL: EXIT WHEN", detail: "RSI > 78 or BTC.D < 57.5%",       color: "#9D4EDD", flexWeight: 1,   state: "done"   },
            { label: "XRP: EXIT WHEN",  detail: "RSI > 80 or momentum stalls",      color: "#23F0C6", flexWeight: 1.5, state: "active" },
            { label: "ZEC: EXIT WHEN",  detail: "7-day gain > 150% or media peaks", color: "#F4B728", flexWeight: 2,   state: "future" },
            { label: "FIAT",            detail: "No further crypto rotations",       color: "rgba(255,255,255,0.3)", flexWeight: 0.8, state: "future" },
          ].map((node, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: node.flexWeight }}>
              <div style={{
                flex: 1,
                background: node.state === "active"
                  ? `${node.color}18`
                  : node.state === "done"
                  ? "rgba(255,255,255,0.04)"
                  : `${node.color}0a`,
                border: node.state === "active"
                  ? `1px solid ${node.color}60`
                  : `1px solid ${node.color}30`,
                borderRadius: 8,
                padding: "14px 16px",
              }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: node.color, letterSpacing: 1.2, marginBottom: 6 }}>
                  {node.label}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.45 }}>
                  {node.detail}
                </div>
              </div>
              {i < arr.length - 1 && (
                <div style={{ padding: "0 10px", color: "rgba(255,255,255,0.2)", fontSize: 20, flexShrink: 0 }}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Key Threshold Table */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        KEY THRESHOLD TABLE
      </div>
      <div style={{ overflowX: "auto", marginBottom: 36 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.8fr 1.3fr 1.2fr 0.85fr", gap: 0, minWidth: 680 }}>
          {["Signal", "Asset", "Threshold", "Action", "Month Window"].map((h) => (
            <div key={h} style={{
              padding: "10px 12px",
              background: "rgba(255,255,255,0.04)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: 1.2,
            }}>
              {h.toUpperCase()}
            </div>
          ))}
          {KEY_THRESHOLDS.map((row, i) => {
            const ac = row.asset.includes("SOL") ? "#9D4EDD" : row.asset.includes("XRP") ? "#23F0C6" : "#F4B728";
            return [row.signal, row.asset, row.threshold, row.action, row.window].map((cell, j) => (
              <div key={`${i}-${j}`} style={{
                padding: "10px 12px",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                fontFamily: j === 1 ? "'JetBrains Mono', monospace" : "'DM Sans', sans-serif",
                fontSize: j === 1 ? 10 : 12,
                color: j === 1 ? ac : j === 4 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.6)",
              }}>
                {cell}
              </div>
            ));
          })}
        </div>
      </div>

      {/* Psychological Risk Cards */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        PSYCHOLOGICAL RISK VECTORS
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        {PSY_RISKS.map((risk, i) => (
          <div key={i} style={{
            background: "rgba(255,60,60,0.06)",
            border: "1px solid rgba(255,60,60,0.18)",
            borderRadius: 10,
            padding: "18px 20px",
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,80,80,0.8)", letterSpacing: 1.5, marginBottom: 10 }}>
              ⚠ {risk.title.toUpperCase()}
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.65, color: "rgba(255,255,255,0.58)", margin: 0 }}>
              {risk.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
