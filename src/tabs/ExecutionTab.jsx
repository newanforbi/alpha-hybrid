import { useState } from "react";
import { PRE_ENTRY_CHECKLIST, PHASE_PROTOCOLS, POSITION_SIZING, EXECUTION_STEPS, EXECUTION_FAILURES } from "../data/execution.js";
import { PHASES } from "../data/phases.js";
import { formatCurrency } from "../utils/format.js";
import { GlowDot } from "../components/GlowDot.jsx";

export function ExecutionTab() {
  const [checked, setChecked] = useState([false, false, false, false, false]);
  const [activeStep, setActiveStep] = useState(1);
  const doneCount = checked.filter(Boolean).length;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 8 }}>
          OPERATIONAL MANUAL — TRADE EXECUTION
        </div>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 26,
          fontWeight: 700,
          margin: "0 0 12px",
          lineHeight: 1.2,
          background: "linear-gradient(135deg, #9D4EDD, #23F0C6, #F4B728)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          How to Execute the Cascade
        </h2>
        <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.5)", margin: 0, maxWidth: 700 }}>
          Knowing what to do and when is insufficient. The edge is destroyed at the execution layer — wrong venue, wrong order type, unlogged basis, missed custody transfer. This section closes that gap.
        </p>
      </div>

      {/* Pre-Entry Checklist */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2 }}>
          PRE-ENTRY CHECKLIST
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: doneCount === 5 ? "#9D4EDD" : "rgba(255,255,255,0.3)", letterSpacing: 1 }}>
          SETUP PROGRESS — {doneCount} / 5 COMPLETE
        </div>
      </div>
      {/* Progress bar */}
      <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, marginBottom: 14, overflow: "hidden" }}>
        <div style={{ width: `${(doneCount / 5) * 100}%`, height: "100%", background: "linear-gradient(90deg, #9D4EDD, #9D4EDD60)", borderRadius: 2, transition: "width 0.3s ease" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36 }}>
        {PRE_ENTRY_CHECKLIST.map((row, i) => (
          <div key={i}
            role="checkbox"
            aria-checked={checked[i]}
            tabIndex={0}
            onClick={() => setChecked(prev => { const n = [...prev]; n[i] = !n[i]; return n; })}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setChecked(prev => { const n = [...prev]; n[i] = !n[i]; return n; }); } }}
            style={{
              display: "flex",
              gap: 16,
              background: checked[i] ? "rgba(157,78,221,0.04)" : "rgba(255,255,255,0.02)",
              border: checked[i] ? "1px solid rgba(157,78,221,0.2)" : "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8,
              padding: "14px 16px",
              alignItems: "flex-start",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}>
            <div style={{
              flexShrink: 0,
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: checked[i] ? "#9D4EDD" : "transparent",
              border: checked[i] ? "1px solid #9D4EDD" : "1px solid rgba(157,78,221,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              color: checked[i] ? "#000" : "#9D4EDD",
              transition: "all 0.2s ease",
            }}>
              {checked[i] ? "✓" : i + 1}
            </div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: checked[i] ? "rgba(255,255,255,0.5)" : "#fff", marginBottom: 4, transition: "color 0.2s" }}>
                {row.item}
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.45)" }}>
                {row.detail}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Phase Entry Protocols */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        PHASE ENTRY PROTOCOLS
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 36 }}>
        {PHASE_PROTOCOLS.map((p, i) => (
          <div key={p.asset} style={{
            background: p.colorDim,
            border: `1px solid ${p.color}30`,
            borderRadius: 10,
            padding: "18px 20px",
            borderTop: `2px solid ${p.color}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <GlowDot color={p.color} size={6} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: p.color, letterSpacing: 1, fontWeight: 600 }}>
                {p.asset}
              </span>
            </div>
            {/* Phase link mini-metrics — PhaseDetail metrics-grid style */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {[
                ["HISTORICAL MULTIPLE", PHASES[i].multiple, p.color],
                ["CAPITAL OUT", formatCurrency(PHASES[i].capitalOut), p.color],
              ].map(([label, value, color]) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "8px 10px" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: 1.2, marginBottom: 4 }}>
                    {label}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, color, fontWeight: 700 }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
            {[
              ["Venue", p.venue],
              ["Entry Method", p.entryMethod],
              ["Position Type", p.positionType],
              ["Custody", p.custody],
              ["Slippage Risk", p.slippageRisk],
              ["Exit Trigger", p.exitTrigger],
            ].map(([label, value]) => {
              const isSlippage = label === "Slippage Risk";
              const slippageColor = isSlippage ? (value === "HIGH" ? "#23F0C6" : "#9D4EDD") : null;
              return (
                <div key={label} style={{ marginBottom: 9 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: 1.2, marginBottom: 2 }}>
                    {label.toUpperCase()}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      color: slippageColor || "rgba(255,255,255,0.65)",
                      lineHeight: 1.4,
                    }}>
                      {value}
                    </span>
                    {isSlippage && (
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 9,
                        color: slippageColor,
                        background: `${slippageColor}12`,
                        border: `1px solid ${slippageColor}25`,
                        borderRadius: 4,
                        padding: "2px 7px",
                        whiteSpace: "nowrap",
                      }}>
                        {p.slippageBps}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Position Sizing Table */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        POSITION SIZING — ALLOCATION TIERS
      </div>
      <div style={{ overflowX: "auto", marginBottom: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "100px 60px 60px 60px 110px 1fr", gap: 0, minWidth: 580 }}>
          {["Tier", "SOL %", "XRP %", "ZEC %", "Proj. Terminal", "Notes"].map((h) => (
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
          {POSITION_SIZING.map((row) => {
            const BASE = 100000;
            const sol = parseFloat(row.solPct) / 100;
            const xrp = parseFloat(row.xrpPct) / 100;
            const zec = parseFloat(row.zecPct) / 100;
            // Illustrative weighted path through framework multiples (SOL → XRP → ZEC W1)
            const terminal = BASE * sol * 19.66 * xrp * 6.0 * zec * 33.67;
            return [row.tier, row.solPct, row.xrpPct, row.zecPct, formatCurrency(terminal), row.note].map((cell, j) => (
              <div key={`${row.tier}-${j}`} style={{
                padding: "12px 12px",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                background: row.isDefault ? "rgba(35,240,198,0.06)" : "transparent",
                fontFamily: j === 0 || j === 4 ? "'JetBrains Mono', monospace" : "'DM Sans', sans-serif",
                fontSize: j === 0 ? 11 : j === 4 ? 12 : 12,
                fontWeight: j === 4 ? 600 : undefined,
                color: j === 0
                  ? (row.isDefault ? "#23F0C6" : "rgba(255,255,255,0.7)")
                  : j === 1 ? "#9D4EDD"
                  : j === 2 ? "#23F0C6"
                  : j === 3 ? "#F4B728"
                  : j === 4 ? "#F4B728"
                  : "rgba(255,255,255,0.5)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}>
                {cell}
                {j === 0 && row.isDefault && (
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "#23F0C6", border: "1px solid #23F0C640", borderRadius: 3, padding: "1px 4px" }}>
                    DEFAULT
                  </span>
                )}
              </div>
            ));
          })}
        </div>
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: 1, marginBottom: 36 }}>
        ASSUMES $100K ENTRY — ILLUSTRATIVE WEIGHTED PATH AT FRAMEWORK MULTIPLES (19.66x · 6.0x · 33.67x)
      </div>

      {/* Order Execution Steps */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        ORDER EXECUTION — 6-STEP PROTOCOL
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 36 }}>
        {EXECUTION_STEPS.map((s, i) => {
          const isActive = activeStep === s.step;
          const isDone   = s.step < activeStep;
          return (
            <div key={s.step}
              role="button"
              tabIndex={0}
              onClick={() => setActiveStep(s.step)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveStep(s.step); } }}
              style={{ display: "flex", gap: 0, position: "relative", cursor: "pointer" }}>
              {/* Connector line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 16 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: isActive ? "rgba(157,78,221,0.12)" : isDone ? "rgba(157,78,221,0.06)" : "rgba(255,255,255,0.04)",
                  border: isActive ? "1px solid rgba(157,78,221,0.5)" : isDone ? "1px solid rgba(157,78,221,0.25)" : "1px solid rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: isActive ? "#9D4EDD" : isDone ? "rgba(157,78,221,0.5)" : "rgba(255,255,255,0.5)",
                  flexShrink: 0,
                  zIndex: 1,
                  transition: "all 0.2s ease",
                }}>
                  {s.step}
                </div>
                {i < EXECUTION_STEPS.length - 1 && (
                  <div style={{ width: 1, flex: 1, background: isDone ? "rgba(157,78,221,0.2)" : "rgba(255,255,255,0.06)", minHeight: 20, margin: "4px 0", transition: "background 0.2s" }} />
                )}
              </div>
              <div style={{ flex: 1, paddingBottom: i < EXECUTION_STEPS.length - 1 ? 16 : 0 }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: isActive ? "#fff" : "rgba(255,255,255,0.6)", marginBottom: 4, paddingTop: 4, transition: "color 0.2s" }}>
                  {s.title}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.6, color: isActive ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.4)", transition: "color 0.2s" }}>
                  {s.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Common Execution Failures */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        COMMON EXECUTION FAILURES
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {EXECUTION_FAILURES.map((f, i) => (
          <div key={i} style={{
            background: "rgba(255,60,60,0.06)",
            border: "1px solid rgba(255,60,60,0.18)",
            borderRadius: 10,
            padding: "18px 20px",
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,80,80,0.8)", letterSpacing: 1.2, marginBottom: 8 }}>
              ✗ {f.title}
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.65, color: "rgba(255,255,255,0.58)", margin: 0 }}>
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
