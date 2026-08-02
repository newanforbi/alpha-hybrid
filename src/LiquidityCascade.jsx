import { useState } from "react";
import { useMarketData } from "./hooks/useMarketData.js";
import { PHASES } from "./data/phases.js";
import { GalaxyBackground } from "./effects/GalaxyBackground.jsx";
import { ShootingStars } from "./effects/ShootingStars.jsx";
import { PhaseCard } from "./components/PhaseCard.jsx";
import { CapitalFlowBar } from "./components/CapitalFlowBar.jsx";
import { Timeline } from "./components/Timeline.jsx";
import { PhaseDetail } from "./components/PhaseDetail.jsx";
import { MacroTab } from "./tabs/MacroTab.jsx";
import { SignalsTab } from "./tabs/SignalsTab.jsx";
import { CyclesTab } from "./tabs/CyclesTab.jsx";
import { ExecutionTab } from "./tabs/ExecutionTab.jsx";
import { CalculatorSection } from "./tabs/CalculatorSection.jsx";
import { Predictions2028 } from "./tabs/Predictions2028.jsx";
import { Blackpaper } from "./tabs/Blackpaper.jsx";
import { ConversionTab } from "./tabs/ConversionTab.jsx";

const PRIMARY_NAV = [
  { key: "overview", label: "OVERVIEW" },
  { key: "now", label: "NOW" },
  { key: "framework", label: "FRAMEWORK" },
];

const SECONDARY_NAV = [
  { key: "macro", label: "MACRO" },
  { key: "cycles", label: "CYCLES" },
  { key: "execution", label: "EXECUTION" },
  { key: "calculator", label: "CALCULATOR" },
  { key: "predict", label: "2028" },
  { key: "conversion", label: "CONVERSION" },
];

function priceForPhase(phase, market) {
  if (phase.coingeckoId === "solana") return market.solPrice;
  if (phase.coingeckoId === "ripple") return market.xrpPrice;
  if (phase.coingeckoId === "zcash") return market.zecPrice;
  return null;
}

export default function LiquidityCascade() {
  const [activePhase, setActivePhase] = useState(0);
  const [activeNav, setActiveNav] = useState("overview");
  const [toolsOpen, setToolsOpen] = useState(false);
  const market = useMarketData();

  const isSecondary = SECONDARY_NAV.some((n) => n.key === activeNav);
  const secondaryLabel = SECONDARY_NAV.find((n) => n.key === activeNav)?.label;

  return (
    <>
      <GalaxyBackground />
      <ShootingStars />
      <div
        style={{
          minHeight: "100vh",
          background: "transparent",
          color: "#fff",
          fontFamily: "'DM Sans', sans-serif",
          position: "relative",
          zIndex: 2,
        }}
      >
        <div style={{ padding: "32px 28px 0", maxWidth: 960, margin: "0 auto" }}>
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              color: "rgba(255,255,255,0.25)",
              letterSpacing: 2,
              marginBottom: 8,
            }}
          >
            CAPITAL ROTATION FRAMEWORK — HALVING-ANCHORED
          </div>
          <h1
            style={{
              fontFamily: "'Space Grotesk', sans-serif",
              fontSize: 32,
              fontWeight: 700,
              margin: "0 0 6px",
              lineHeight: 1.15,
              background: "linear-gradient(135deg, #9D4EDD, #23F0C6, #F4B728)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            Alpha Hybrid
          </h1>
          <p
            style={{
              fontSize: 14,
              color: "rgba(255,255,255,0.45)",
              margin: "0 0 10px",
              maxWidth: 620,
              lineHeight: 1.55,
            }}
          >
            A chronological matrix for capital rotation across Solana, XRP, and Zcash — anchored to the Bitcoin
            halving as the temporal fulcrum. Multiples are sourced reconstructions; compound paths are illustrative.
          </p>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 10,
              alignItems: "center",
              marginBottom: 22,
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 10,
              letterSpacing: 1.2,
              color: "rgba(255,255,255,0.4)",
            }}
          >
            <span style={{ color: "#23F0C6" }}>NOW</span>
            <span>Watch 2028-cycle SOL window · BTC.D & weekly RSI live via CoinGecko</span>
            {market.lastUpdated && (
              <span style={{ color: "rgba(255,255,255,0.25)" }}>
                · updated {market.lastUpdated.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })}
              </span>
            )}
            {market.error && <span style={{ color: "rgba(255,120,120,0.8)" }}>· {market.error}</span>}
          </div>

          <nav aria-label="Dashboard sections">
            <div
              role="tablist"
              style={{
                display: "flex",
                gap: 4,
                borderBottom: "1px solid rgba(255,255,255,0.06)",
                marginBottom: 4,
                overflowX: "auto",
                scrollbarWidth: "none",
                alignItems: "center",
              }}
            >
              {PRIMARY_NAV.map((n) => (
                <button
                  key={n.key}
                  role="tab"
                  aria-selected={activeNav === n.key}
                  aria-controls={`panel-${n.key}`}
                  id={`tab-${n.key}`}
                  onClick={() => {
                    setActiveNav(n.key);
                    setToolsOpen(false);
                  }}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    letterSpacing: 1.5,
                    padding: "8px 14px",
                    background: "none",
                    border: "none",
                    color: activeNav === n.key ? "#fff" : "rgba(255,255,255,0.3)",
                    borderBottom: activeNav === n.key ? "2px solid #fff" : "2px solid transparent",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                  }}
                >
                  {n.label}
                </button>
              ))}

              <div style={{ position: "relative", marginLeft: 4 }}>
                <button
                  type="button"
                  aria-expanded={toolsOpen || isSecondary}
                  aria-haspopup="true"
                  onClick={() => setToolsOpen((v) => !v)}
                  style={{
                    fontFamily: "'JetBrains Mono', monospace",
                    fontSize: 10,
                    letterSpacing: 1.5,
                    padding: "8px 14px",
                    background: "none",
                    border: "none",
                    color: isSecondary ? "#fff" : "rgba(255,255,255,0.3)",
                    borderBottom: isSecondary ? "2px solid #fff" : "2px solid transparent",
                    cursor: "pointer",
                  }}
                >
                  {isSecondary ? secondaryLabel : "MORE"} ▾
                </button>
                {toolsOpen && (
                  <div
                    style={{
                      position: "absolute",
                      top: "100%",
                      left: 0,
                      zIndex: 20,
                      minWidth: 160,
                      background: "#12141C",
                      border: "1px solid rgba(255,255,255,0.1)",
                      borderRadius: 8,
                      padding: 6,
                      boxShadow: "0 12px 40px rgba(0,0,0,0.45)",
                    }}
                  >
                    {SECONDARY_NAV.map((n) => (
                      <button
                        key={n.key}
                        type="button"
                        onClick={() => {
                          setActiveNav(n.key);
                          setToolsOpen(false);
                        }}
                        style={{
                          display: "block",
                          width: "100%",
                          textAlign: "left",
                          fontFamily: "'JetBrains Mono', monospace",
                          fontSize: 10,
                          letterSpacing: 1.2,
                          padding: "8px 10px",
                          background: activeNav === n.key ? "rgba(255,255,255,0.06)" : "transparent",
                          border: "none",
                          borderRadius: 6,
                          color: activeNav === n.key ? "#fff" : "rgba(255,255,255,0.45)",
                          cursor: "pointer",
                        }}
                      >
                        {n.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </nav>
        </div>

        <main
          role="tabpanel"
          id={`panel-${activeNav}`}
          aria-labelledby={`tab-${PRIMARY_NAV.some((n) => n.key === activeNav) ? activeNav : "overview"}`}
          style={{ padding: "20px 28px 60px", maxWidth: 960, margin: "0 auto" }}
          onClick={() => toolsOpen && setToolsOpen(false)}
        >
          {activeNav === "overview" && (
            <>
              <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                {PHASES.map((p, i) => (
                  <PhaseCard
                    key={p.id}
                    phase={p}
                    isActive={activePhase === i}
                    onClick={() => setActivePhase(i)}
                    currentPrice={priceForPhase(p, market)}
                  />
                ))}
              </div>
              <Timeline activePhase={activePhase} setActivePhase={setActivePhase} />
              <PhaseDetail phase={PHASES[activePhase]} />
              <CapitalFlowBar phases={PHASES} />
            </>
          )}

          {activeNav === "now" && <SignalsTab />}
          {activeNav === "framework" && <Blackpaper />}
          {activeNav === "macro" && <MacroTab />}
          {activeNav === "cycles" && <CyclesTab />}
          {activeNav === "execution" && <ExecutionTab />}
          {activeNav === "calculator" && <CalculatorSection />}
          {activeNav === "predict" && <Predictions2028 />}
          {activeNav === "conversion" && <ConversionTab />}

          <div
            style={{
              marginTop: 30,
              padding: "14px 16px",
              background: "rgba(255,60,60,0.06)",
              border: "1px solid rgba(255,60,60,0.12)",
              borderRadius: 8,
            }}
          >
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 9,
                color: "rgba(255,60,60,0.6)",
                letterSpacing: 1.5,
                marginBottom: 4,
              }}
            >
              RISK DISCLOSURE
            </div>
            <p
              style={{
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 11,
                color: "rgba(255,255,255,0.35)",
                lineHeight: 1.55,
                margin: 0,
              }}
            >
              This is a theoretical analysis based on historical and reconstructed data. Cryptocurrency investments
              carry extreme risk including total loss of capital. Past performance does not guarantee future results.
              Framework multiples are not audited trade fills. Executing large orders in illiquid assets carries
              significant slippage risk. Privacy coins face ongoing regulatory scrutiny and potential delistings. This
              is not financial advice.
            </p>
          </div>
        </main>
      </div>
    </>
  );
}
