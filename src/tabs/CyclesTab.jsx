import { useState } from "react";
import { CYCLE_DATA, ALTCOIN_WINDOWS } from "../data/cycles.js";
import { PHASES } from "../data/phases.js";
import { GlowDot } from "../components/GlowDot.jsx";

export function CyclesTab() {
  const [activeCycle, setActiveCycle] = useState(null);
  const maxMultiple = 96;
  const cycleColors = ["#9D4EDD", "#23F0C6", "#F4B728", "#6450FF"];
  const maxMonths = 24;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 8 }}>
          EMPIRICAL FOUNDATION — FOUR-CYCLE ANALYSIS
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
          Historical Halving Cycles
        </h2>
        <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.5)", margin: 0, maxWidth: 700 }}>
          The cascade thesis is not speculation — it is pattern recognition across four complete cycles. Each halving has produced a measurable sequence: BTC expansion, dominance break, altcoin overflow. The asset names rotate; the structure does not.
        </p>
      </div>

      {/* 4-Cycle Comparison Grid */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        4-CYCLE COMPARISON
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 36 }}>
        {CYCLE_DATA.map((c, i) => (
          <div key={c.year}
            role="button"
            tabIndex={0}
            aria-expanded={activeCycle === i}
            onClick={() => setActiveCycle(activeCycle === i ? null : i)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveCycle(activeCycle === i ? null : i); } }}
            style={{
              background: activeCycle === i ? `${cycleColors[i]}10` : "rgba(255,255,255,0.02)",
              border: activeCycle === i ? `1.5px solid ${cycleColors[i]}55` : `1px solid ${cycleColors[i]}30`,
              borderRadius: 10,
              padding: "18px 20px",
              borderTop: `2px solid ${cycleColors[i]}`,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <GlowDot color={cycleColors[i]} size={6} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: cycleColors[i], letterSpacing: 1.5 }}>
                {c.year} HALVING
              </span>
            </div>
            {/* Altcoin hero stat — PhaseCard large-ticker pattern */}
            <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${cycleColors[i]}20` }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: cycleColors[i], letterSpacing: 1.2, marginBottom: 4, opacity: 0.7 }}>
                {c.leadAltcoin} — LEAD ALTCOIN
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: cycleColors[i], lineHeight: 1 }}>
                {c.altcoinMultiple}
              </div>
            </div>
            {[
              ["Halving Price", c.halvingPrice],
              ["Peak Price", c.peakPrice],
              ["BTC Multiple", c.multiple],
              ["Months to Peak", `${c.monthsToPeak} mo`],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{label}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>
        ))}

        {/* 2028 Projection card — uses PREDICTIONS_2028 data, dashed PROJECTION badge */}
        {(() => {
          const proj2028Color = "#6450FF";
          return (
            <div style={{
              background: "rgba(100,80,255,0.03)",
              border: `1px solid ${proj2028Color}25`,
              borderRadius: 10,
              padding: "18px 20px",
              borderTop: `2px dashed ${proj2028Color}`,
              opacity: 0.85,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <GlowDot color={proj2028Color} size={6} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: proj2028Color, letterSpacing: 1.5 }}>
                  ~2028 HALVING
                </span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: proj2028Color,
                  border: `1px dashed ${proj2028Color}50`, borderRadius: 3, padding: "1px 5px", marginLeft: 2,
                }}>
                  PROJECTION
                </span>
              </div>
              <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${proj2028Color}15` }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: proj2028Color, letterSpacing: 1.2, marginBottom: 4, opacity: 0.7 }}>
                  ZEC — LEAD ALTCOIN
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: proj2028Color, lineHeight: 1 }}>
                  ~33x (est.)
                </div>
              </div>
              {[
                ["Halving Price", "~$90,000"],
                ["Peak Price", "~$450,000"],
                ["BTC Multiple", "~4–5x (est.)"],
                ["Months to Peak", "~19 mo"],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{label}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* Expanded cycle detail panel — PhaseDetail structure */}
      {activeCycle !== null && (() => {
        const c = CYCLE_DATA[activeCycle];
        const color = cycleColors[activeCycle];
        // Map cycle index to PHASES: 2020=SOL(0), 2024=ZEC(2); others use generic narrative
        const phaseMap = { 2: PHASES[0], 3: PHASES[2] };
        const ph = phaseMap[activeCycle];
        return (
          <div style={{
            background: `${color}08`,
            border: `1px solid ${color}30`,
            borderRadius: 10,
            padding: "22px 24px",
            marginBottom: 28,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <GlowDot color={color} size={7} />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color }}>
                {c.year} — {c.leadAltcoin} Cycle
              </span>
            </div>
            {ph && (
              <>
                <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.6)", margin: "0 0 16px" }}>
                  {ph.description}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                  {ph.mechanics.map((m, mi) => (
                    <div key={mi} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ color, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, flexShrink: 0 }}>→</span>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }}>{m}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: `${color}08`, border: `1px solid ${color}20`, borderRadius: 6, padding: "10px 14px" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color, letterSpacing: 1.5, marginBottom: 4 }}>CYCLE EXIT SIGNAL</div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.55)", margin: 0 }}>{ph.exitSignal}</p>
                </div>
              </>
            )}
            {!ph && (
              <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                The {c.year} cycle preceded the current cascade instrument set. {c.leadAltcoin} served as the terminal liquidity vehicle, peaking approximately {c.monthsToPeak} months after the halving with a {c.altcoinMultiple} multiple — establishing the structural precedent this cascade replicates.
              </p>
            )}
          </div>
        );
      })()}

      {/* Diminishing Returns Bar Chart */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        BTC CYCLE MULTIPLES — DIMINISHING RETURNS
      </div>
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10,
        padding: "22px 24px",
        marginBottom: 14,
      }}>
        {CYCLE_DATA.map((c, i) => (
          <div key={c.year} style={{ marginBottom: i < CYCLE_DATA.length - 1 ? 16 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: cycleColors[i], width: 36 }}>{c.year}</span>
              <div style={{ flex: 1, height: 20, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  width: `${(c.multipleNum / maxMultiple) * 100}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${cycleColors[i]}cc, ${cycleColors[i]}55)`,
                  borderRadius: 4,
                  transition: "width 0.6s ease",
                }} />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.7)", width: 44, textAlign: "right" }}>
                {c.multiple}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 8,
        padding: "12px 16px",
        marginBottom: 36,
      }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.45)", margin: 0 }}>
          BTC cycle multiples are compressing — 96x → 30x → 7.85x → ~5x. Yet altcoin rotation remains viable precisely because the <span style={{ color: "#F4B728" }}>liquidity overflow dynamic</span> amplifies diminishing BTC gains through sequenced leverage. A 5x BTC move routed through XRP (institutional settlement layer) and then into a thin-order-book privacy coin produces outsized terminal returns despite a lower headline BTC multiple.
        </p>
      </div>

      {/* Multi-Cycle Timeline Overlay */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        ALTCOIN ROTATION WINDOW — MULTI-CYCLE OVERLAY
      </div>
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10,
        padding: "22px 24px",
        marginBottom: 36,
        overflowX: "auto",
      }}>
        <div style={{ minWidth: 500 }}>
          {/* Month axis labels — absolute-positioned within bar area (matches Timeline technique) */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 36, flexShrink: 0 }} />
            <div style={{ flex: 1, position: "relative", height: 14 }}>
              {[0, 4, 8, 12, 16, 20, 24].map((m) => (
                <div key={m} style={{
                  position: "absolute",
                  left: `${(m / maxMonths) * 100}%`,
                  transform: "translateX(-50%)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 8,
                  color: "rgba(255,255,255,0.2)",
                  whiteSpace: "nowrap",
                }}>
                  +{m}m
                </div>
              ))}
            </div>
          </div>
          {ALTCOIN_WINDOWS.map((w) => (
            <div key={w.year} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: w.color, width: 36, flexShrink: 0 }}>{w.year}</span>
              <div style={{ flex: 1, position: "relative", height: 28, background: "rgba(255,255,255,0.03)", borderRadius: 4 }}>
                <div style={{
                  position: "absolute",
                  left: `${(w.start / maxMonths) * 100}%`,
                  width: `${((w.end - w.start) / maxMonths) * 100}%`,
                  top: 0,
                  height: "100%",
                  background: `${w.color}30`,
                  border: `1px solid ${w.color}60`,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: w.color, whiteSpace: "nowrap" }}>
                    {w.label}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div style={{ paddingLeft: 48, marginTop: 6 }}>
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 6 }}>
              Months after halving. Bars indicate peak altcoin rotation window.
            </div>
          </div>
        </div>
      </div>

      {/* M2 Correlation Table */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        M2 CORRELATION — CYCLE MAPPING
      </div>
      <div style={{ overflowX: "auto", marginBottom: 36 }}>
        <div style={{ display: "grid", gridTemplateColumns: "60px 80px 100px 1fr", gap: 0, minWidth: 500 }}>
          {["Cycle", "BTC Multiple", "Lead Alt", "Concurrent M2 Event"].map((h) => (
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
          {CYCLE_DATA.map((c, i) => (
            [c.year, c.multiple, c.leadAltcoin, c.m2Event].map((cell, j) => (
              <div key={`${i}-${j}`} style={{
                padding: "10px 12px",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                fontFamily: j === 0 ? "'JetBrains Mono', monospace" : "'DM Sans', sans-serif",
                fontSize: 12,
                color: j === 0 ? cycleColors[i] : j === 2 ? cycleColors[i] : "rgba(255,255,255,0.55)",
                display: j === 0 ? "flex" : undefined,
                alignItems: j === 0 ? "center" : undefined,
                gap: j === 0 ? 6 : undefined,
              }}>
                {j === 0 && <GlowDot color={cycleColors[i]} size={5} />}
                {cell}
              </div>
            ))
          ))}
        </div>
      </div>

      {/* Pattern Validation */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        PATTERN VALIDATION
      </div>
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10,
        padding: "24px 26px",
      }}>
        <BlackpaperPara>
          Across every completed halving cycle, a structurally identical sequence has repeated: Bitcoin consolidates supply shock gains, dominance peaks, capital rotates into the cycle's vanguard altcoin, and finally overflows into legacy assets with thin liquidity and outsized volatility. The instruments differ per cycle — LTC in 2013, ETH in 2017, SOL in 2021 and 2024, ZEC in 2025 — but the mechanism is invariant.
        </BlackpaperPara>
        <BlackpaperPara indent>
          Diminishing BTC multiples do not invalidate the cascade. They are a feature of increasing market capitalization, not a failure of the pattern. A market that is ten times larger requires ten times more capital to move — but the <span style={{ color: "#F4B728" }}>rotation sequence itself</span> concentrates that capital into increasingly narrow windows, producing terminal volatility that exceeds earlier cycles in absolute dollar terms even as percentage multiples compress.
        </BlackpaperPara>
        <BlackpaperPara indent>
          The ZEC Month +17–19 window does not appear in isolation. It appears at the same relative position across every cycle in which a terminal privacy or legacy asset participated. The 2018 and 2021 precedents are not anecdotes. They are data points in a statistically consistent distribution.
        </BlackpaperPara>
        <BlackpaperQuote color="#F4B728">
          "The asset names change. The timing tightens. The sequence does not."
        </BlackpaperQuote>
      </div>
    </div>
  );
}
