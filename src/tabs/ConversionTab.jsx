import {
  CONVERSION_PHASES,
  CONVERSION_STATES,
  DAPT_JURISDICTIONS,
  SFO_PTC_DOMAINS,
  OTC_DESKS,
  CUSTODIANS,
  PRESERVATION_INSTRUMENTS,
  ALLOCATION_SHIFT,
  REENTRY_CHECKLIST,
} from "../data/conversion.js";
import { GlowDot } from "../components/GlowDot.jsx";
import {
  BlackpaperSection,
  BlackpaperPara,
  BlackpaperHeading,
} from "../components/BlackpaperPrimitives.jsx";

export function ConversionTab() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 8 }}>
          POST-CYCLE CONVERSION — WEALTH PRESERVATION ARCHITECTURE
        </div>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 26,
          fontWeight: 700,
          margin: "0 0 12px",
          lineHeight: 1.2,
          background: "linear-gradient(135deg, #9D4EDD, #6450FF, #00B4FF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Strategic Wealth Preservation
        </h2>
        <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.55)", margin: 0, maxWidth: 720 }}>
          The realization of a highly appreciated cryptocurrency portfolio at the apex of a projected market cycle presents a multifaceted financial, legal, and operational challenge. At this echelon of wealth, traditional retail banking frameworks are fundamentally inadequate. The transition of nine-figure digital asset wealth into preserved, liquid, and tax-optimized fiat currency requires an institutional-grade architecture — executed simultaneously across jurisdictional, fiduciary, and operational domains.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 12,
        marginBottom: 40,
      }}>
        {CONVERSION_PHASES.map((phase) => (
          <div key={phase.id} style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 10,
            padding: "18px 20px",
            borderLeft: `3px solid ${phase.color}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <GlowDot color={phase.color} size={6} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: phase.color, letterSpacing: 1.5 }}>
                PHASE {phase.id}
              </span>
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 8 }}>
              {phase.label}
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.45)", margin: 0 }}>
              {phase.summary}
            </p>
          </div>
        ))}
      </div>

      {/* PHASE I: JURISDICTIONAL ENGINEERING */}
      <BlackpaperSection color="#9D4EDD" label="PHASE I — JURISDICTIONAL ENGINEERING & DOMICILE SEVERANCE">
        <BlackpaperHeading>Tax-Optimal Domicile Selection</BlackpaperHeading>
        <BlackpaperPara>
          The geographic location of an individual at the exact moment a highly appreciated asset is liquidated dictates the baseline erosion of that capital. Under both federal IRS guidelines and state-level tax codes, cryptocurrency is treated as <span style={{ color: "#9D4EDD" }}>intangible personal property</span>. The gain realized from its sale is sourced to the taxpayer's state of residence at the time of the sale. For a $232 million liquidation in a state like California (13.3% top rate), the state tax liability alone would exceed $30 million.
        </BlackpaperPara>
        <BlackpaperPara indent>
          The foundational step in wealth preservation is the legal and absolute severance of domicile from a high-tax state and the establishment of residency in a zero-income-tax jurisdiction. This must be completed well before the 2029 cycle peak — not during it. A mere change of driver's license or voter registration is catastrophically insufficient. Courts have repeatedly upheld tax agency determinations against taxpayers who failed to genuinely sever economic, social, and physical ties.
        </BlackpaperPara>

        <BlackpaperHeading sub>Zero-Tax State Comparison</BlackpaperHeading>
        <div style={{ overflowX: "auto", marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "100px 50px 1fr 1fr 1fr", gap: 0, minWidth: 700 }}>
            {["State", "Rate", "Residency Test", "Key Protections", "Notes"].map((h) => (
              <div key={h} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1.2 }}>
                {h.toUpperCase()}
              </div>
            ))}
            {CONVERSION_STATES.map((s) => (
              [s.state, s.rate, s.test, s.protections, s.notes].map((val, i) => (
                <div key={`${s.state}-${i}`} style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: i === 0 ? "#fff" : i === 1 ? "#9D4EDD" : "rgba(255,255,255,0.5)", lineHeight: 1.5, background: i === 1 ? "rgba(157,78,221,0.04)" : "transparent" }}>
                  {i === 0 ? <span style={{ fontWeight: 600 }}>{val}</span> : val}
                </div>
              ))
            ))}
          </div>
        </div>

        <div style={{
          padding: "16px 18px",
          background: "rgba(255,60,60,0.05)",
          border: "1px solid rgba(255,60,60,0.1)",
          borderRadius: 8,
          marginBottom: 20,
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,60,60,0.6)", letterSpacing: 1.5, marginBottom: 8 }}>
            AUDIT RISK — CALIFORNIA FTB & NEW YORK DTF
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.65, color: "rgba(255,255,255,0.5)", margin: "0 0 8px" }}>
            <strong style={{ color: "rgba(255,255,255,0.7)" }}>California</strong> utilizes a subjective "facts-and-circumstances" test — not a strict 183-day rule. The FTB will subpoena cell phone tower pings, ATM withdrawals, credit card locations, and EZ-Pass data. The burden of proof rests entirely on the taxpayer.
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.65, color: "rgba(255,255,255,0.5)", margin: 0 }}>
            <strong style={{ color: "rgba(255,255,255,0.7)" }}>New York</strong> enforces strict statutory residency: maintaining a "permanent place of abode" for &gt;10 months combined with 184+ days triggers full residency taxation — even if domicile was legally changed.
          </p>
        </div>

        <div style={{
          padding: "14px 18px",
          background: "rgba(157,78,221,0.03)",
          border: "1px solid rgba(157,78,221,0.08)",
          borderRadius: 8,
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(157,78,221,0.5)", letterSpacing: 1.5, marginBottom: 6 }}>
            CRITICAL TIMELINE
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.5)", margin: 0 }}>
            Domicile severance must be surgically complete <strong style={{ color: "#9D4EDD" }}>12–24 months before</strong> the liquidation event. Physical relocation, property sale in the former state, purchase of primary residence in the new state, migration of banking/professional services, and meticulous presence tracking are all required to survive an audit.
          </p>
        </div>
      </BlackpaperSection>

      {/* PHASE II: FIDUCIARY ARCHITECTURE */}
      <BlackpaperSection color="#6450FF" label="PHASE II — FIDUCIARY ARCHITECTURE & ASSET PROTECTION">
        <BlackpaperHeading>Beyond the LLC Fortress Fallacy</BlackpaperHeading>

        <div style={{
          padding: "16px 18px",
          background: "rgba(255,60,60,0.05)",
          border: "1px solid rgba(255,60,60,0.1)",
          borderRadius: 8,
          marginBottom: 24,
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,60,60,0.6)", letterSpacing: 1.5, marginBottom: 8 }}>
            THE LLC FORTRESS FALLACY
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.65, color: "rgba(255,255,255,0.5)", margin: 0 }}>
            The belief that a Wyoming single-member LLC provides absolute protection is a dangerous misconception. In <em>Olmstead v. FTC</em>, the Florida Supreme Court demonstrated that courts can pierce single-member LLC protections, bypassing charging orders entirely to compel surrender of the underlying membership interest. True institutional-grade protection requires the absolute bifurcation of legal ownership from beneficial enjoyment via an <span style={{ color: "#6450FF" }}>irrevocable trust</span>.
          </p>
        </div>

        <BlackpaperPara>
          To construct an impenetrable firewall around the capital, assets must be structured within a Domestic Asset Protection Trust (DAPT). Among the 17 U.S. states permitting DAPTs, Nevada dominates for three reasons: an aggressively short 2-year statute of limitations, zero exception creditors (ensuring seasoned assets are shielded from all civil litigation), and explicit exemption of cryptocurrencies from taxation as intangible personal property.
        </BlackpaperPara>

        <BlackpaperHeading sub>DAPT Jurisdiction Comparison</BlackpaperHeading>
        <div style={{ overflowX: "auto", marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "100px 80px 1fr 80px 1fr", gap: 0, minWidth: 700 }}>
            {["Jurisdiction", "Statute", "Exception Creditors", "State Tax", "Strategic Advantage"].map((h) => (
              <div key={h} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1.2 }}>
                {h.toUpperCase()}
              </div>
            ))}
            {DAPT_JURISDICTIONS.map((d) => (
              [d.jurisdiction, d.statute, d.exceptionCreditors, d.stateTax, d.advantage].map((val, i) => (
                <div key={`${d.jurisdiction}-${i}`} style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)", lineHeight: 1.5, background: i === 1 && val === "2 Years" ? "rgba(100,80,255,0.05)" : "transparent" }}>
                  {i === 0 ? <span style={{ fontWeight: 600 }}>{val}</span> : val}
                </div>
              ))
            ))}
          </div>
        </div>

        <div style={{
          padding: "14px 18px",
          background: "rgba(100,80,255,0.04)",
          border: "1px solid rgba(100,80,255,0.1)",
          borderRadius: 8,
          marginBottom: 28,
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(100,80,255,0.6)", letterSpacing: 1.5, marginBottom: 6 }}>
            ESTATE TAX EXEMPTION SUNSET
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.65, color: "rgba(255,255,255,0.5)", margin: 0 }}>
            Transfer crypto <strong style={{ color: "#6450FF" }}>in-kind during bear market troughs</strong> to consume minimal lifetime exemption ($13.99M per individual in 2025, reverting to ~$7M in 2026). All subsequent appreciation to $232M occurs inside the trust — permanently excluded from the taxable estate, neutralizing the 40% federal estate tax. An Intentionally Defective Grantor Trust (IDGT) structure allows the grantor to pay income taxes from personal assets, enabling the trust principal to compound tax-free.
          </p>
        </div>

        <BlackpaperHeading sub>Single-Family Office + Private Trust Company</BlackpaperHeading>
        <BlackpaperPara indent>
          A liquid net worth approaching a quarter-billion dollars warrants a dedicated Single-Family Office (SFO) paired with a Private Trust Company (PTC). The SFO handles execution and research; the PTC handles legal authorization and fiduciary oversight. This dual structure allows the family to actively participate in governance without compromising the trust's spendthrift protections.
        </BlackpaperPara>

        <div style={{ overflowX: "auto", marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr 1fr", gap: 0, minWidth: 600 }}>
            {["Domain", "SFO Role", "PTC Role", "Integration Synergy"].map((h) => (
              <div key={h} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1.2 }}>
                {h.toUpperCase()}
              </div>
            ))}
            {SFO_PTC_DOMAINS.map((d) => (
              [d.domain, d.sfo, d.ptc, d.synergy].map((val, i) => (
                <div key={`${d.domain}-${i}`} style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                  {i === 0 ? <span style={{ fontWeight: 600 }}>{val}</span> : val}
                </div>
              ))
            ))}
          </div>
        </div>
      </BlackpaperSection>

      {/* PHASE III: INSTITUTIONAL LIQUIDATION */}
      <BlackpaperSection color="#23F0C6" label="PHASE III — INSTITUTIONAL LIQUIDATION MECHANICS">
        <BlackpaperHeading>The OTC Desk Imperative</BlackpaperHeading>
        <BlackpaperPara>
          Executing a market order of $232 million on a public centralized exchange will trigger <span style={{ color: "#23F0C6" }}>catastrophic market slippage</span>. Public order books rarely possess the localized liquidity depth to absorb a nine-figure sell order without collapsing the asset's price. Institutional OTC desks bypass the public order book entirely — sourcing liquidity through proprietary matching engines, dark pools, and direct capital relationships with institutional buyers.
        </BlackpaperPara>
        <BlackpaperPara indent>
          The OTC desk provides a "locked quote" — a guaranteed, flat execution price for the entire block of assets, typically valid for 30 seconds to a few minutes. By accepting the quote, the seller offloads execution risk and price volatility entirely onto the provider. The market remains blind to the transaction until post-trade settlement, preventing predatory HFT algorithms from front-running the liquidation.
        </BlackpaperPara>

        <BlackpaperHeading sub>OTC Desk Comparison</BlackpaperHeading>
        <div style={{ overflowX: "auto", marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "130px 80px 1fr 1fr", gap: 0, minWidth: 650 }}>
            {["Desk", "Min Trade", "Regulatory Status", "Key Strength"].map((h) => (
              <div key={h} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1.2 }}>
                {h.toUpperCase()}
              </div>
            ))}
            {OTC_DESKS.map((d) => (
              [d.desk, d.minTrade, d.regulatory, d.strength].map((val, i) => (
                <div key={`${d.desk}-${i}`} style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                  {i === 0 ? <span style={{ fontWeight: 600 }}>{val}</span> : val}
                </div>
              ))
            ))}
          </div>
        </div>

        <div style={{
          padding: "14px 18px",
          background: "rgba(35,240,198,0.04)",
          border: "1px solid rgba(35,240,198,0.1)",
          borderRadius: 8,
          marginBottom: 28,
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(35,240,198,0.6)", letterSpacing: 1.5, marginBottom: 6 }}>
            TEST TRANSACTION PROTOCOL
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.65, color: "rgba(255,255,255,0.5)", margin: 0 }}>
            Before executing the full transaction, run a <strong style={{ color: "#23F0C6" }}>$50K–$100K test</strong> through the entire OTC pipeline. Verify that digital assets move securely to the desk and that resulting fiat clears the banking system without triggering automated AML freezes — which are extremely common when sudden massive wire transfers hit standard retail bank accounts.
          </p>
        </div>

        <BlackpaperHeading sub>Crypto-Native Institutional Custodians</BlackpaperHeading>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10, marginBottom: 20 }}>
          {CUSTODIANS.map((c) => (
            <div key={c.name} style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8,
              padding: "14px 16px",
            }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 6 }}>
                {c.name}
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, lineHeight: 1.55, color: "rgba(255,255,255,0.45)", margin: 0 }}>
                {c.detail}
              </p>
            </div>
          ))}
        </div>
      </BlackpaperSection>

      {/* PHASE IV: CAPITAL PRESERVATION */}
      <BlackpaperSection color="#F4B728" label="PHASE IV — CAPITAL PRESERVATION & RISK MITIGATION">
        <BlackpaperHeading>Neutralizing Counterparty Banking Risk</BlackpaperHeading>
        <BlackpaperPara>
          Once $232 million is secured in fiat, the risk profile shifts from crypto volatility to <span style={{ color: "#F4B728" }}>traditional counterparty banking risk</span>. The FDIC limits insurance to $250,000 per depositor, per institution. Depositing $200M into a single bank means $199.75M becomes an unsecured claim in insolvency — potentially tied up in receivership for years. The collapses of Silicon Valley Bank, Credit Suisse, and First Republic are stark reminders that "too big to fail" does not guarantee uninsured deposit protection.
        </BlackpaperPara>

        <BlackpaperHeading sub>The IntraFi Sweep Solution</BlackpaperHeading>
        <BlackpaperPara indent>
          The IntraFi Network's Insured Cash Sweep (ICS) and CDARS programs solve this without manually opening hundreds of bank accounts. When $200M is deposited into an ICS-participating bank, proprietary software automatically fragments the capital into sub-$250K increments, sweeping them across thousands of participating FDIC-insured banks nationwide. The result: absolute multi-million-dollar FDIC protection on the entire principal, with a single banking relationship, single consolidated statement, and daily liquidity.
        </BlackpaperPara>

        <BlackpaperHeading sub>Preservation Instruments Comparison</BlackpaperHeading>
        <div style={{ overflowX: "auto", marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "150px 80px 80px 80px 1fr 1fr", gap: 0, minWidth: 750 }}>
            {["Instrument", "Return", "Drawdown", "Liquidity", "Protection", "Notes"].map((h) => (
              <div key={h} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1.2 }}>
                {h.toUpperCase()}
              </div>
            ))}
            {PRESERVATION_INSTRUMENTS.map((p) => (
              [p.instrument, p.annReturn, p.maxDrawdown, p.liquidity, p.protection, p.notes].map((val, i) => (
                <div key={`${p.instrument}-${i}`} style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                  {i === 0 ? <span style={{ fontWeight: 600 }}>{val}</span> : val}
                </div>
              ))
            ))}
          </div>
        </div>

        <div style={{
          padding: "14px 18px",
          background: "rgba(244,183,40,0.04)",
          border: "1px solid rgba(244,183,40,0.1)",
          borderRadius: 8,
          marginBottom: 20,
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(244,183,40,0.6)", letterSpacing: 1.5, marginBottom: 6 }}>
            BOND LADDER VS. MONEY MARKET — DECISION FRAMEWORK
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.65, color: "rgba(255,255,255,0.5)", margin: "0 0 8px" }}>
            <strong style={{ color: "rgba(255,255,255,0.7)" }}>Rate-cutting environment:</strong> MMF yields drop synchronously with benchmark rates. Construct a distributing Treasury bond ladder (1–3yr staggered maturities) to lock in the current yield curve, rendering returns immune to subsequent Fed rate cuts.
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.65, color: "rgba(255,255,255,0.5)", margin: 0 }}>
            <strong style={{ color: "rgba(255,255,255,0.7)" }}>Rate-holding/rising environment:</strong> MMFs automatically capture rising rates daily. Favor short-duration MMFs for maximum flexibility and immediate liquidity, with each rung of the ladder returning principal available for re-entry deployment.
          </p>
        </div>
      </BlackpaperSection>

      {/* PHASE V: TREASURY MANAGEMENT & RE-ENTRY */}
      <BlackpaperSection color="#00B4FF" label="PHASE V — TREASURY MANAGEMENT & NEXT-CYCLE PREPAREDNESS">
        <BlackpaperHeading>Generational Shifts in Asset Allocation</BlackpaperHeading>
        <BlackpaperPara>
          With capital protected and generating baseline yield, the SFO mandate shifts from preservation to tactical deployment. The Next-Gen UHNW cohort aggressively allocates toward private equity, direct business ownership, and venture capital — where capital compounds tax-deferred for a decade or more. Digital assets are no longer fringe speculation but a <span style={{ color: "#00B4FF" }}>core portfolio pillar</span>.
        </BlackpaperPara>

        <BlackpaperHeading sub>UHNW Allocation: Previous Gen vs. Next Gen</BlackpaperHeading>
        <div style={{ overflowX: "auto", marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "150px 90px 90px 1fr", gap: 0, minWidth: 550 }}>
            {["Asset Class", "Previous Gen", "Next Gen", "Strategic Rationale"].map((h) => (
              <div key={h} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1.2 }}>
                {h.toUpperCase()}
              </div>
            ))}
            {ALLOCATION_SHIFT.map((a) => (
              [a.asset, a.prevGen, a.nextGen, a.rationale].map((val, i) => (
                <div key={`${a.asset}-${i}`} style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)", lineHeight: 1.5, background: i === 2 ? "rgba(0,180,255,0.04)" : "transparent" }}>
                  {i === 0 ? <span style={{ fontWeight: 600 }}>{val}</span> : val}
                </div>
              ))
            ))}
          </div>
        </div>

        <BlackpaperHeading sub>Securities-Backed Lines of Credit (SBLOC)</BlackpaperHeading>
        <BlackpaperPara indent>
          A core tenet of UHNW wealth management is the strict avoidance of unnecessary asset liquidation. Selling an appreciated asset triggers immediate capital gains tax, breaking the compounding curve. Instead, the SFO facilitates liquidity through SBLOCs — borrowing cash against the portfolio at 50–70% LTV ratios. Because debt is not taxable income, capital is accessed <span style={{ color: "#00B4FF" }}>entirely tax-free</span> while underlying assets continue to appreciate. The SBLOC interest rate (6–8%, often lower for institutional SFO clients) is eclipsed by retained market gains plus avoidance of the 23.8% federal capital gains rate.
        </BlackpaperPara>

        <BlackpaperHeading sub>Re-Entry Execution Checklist</BlackpaperHeading>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {REENTRY_CHECKLIST.map((item, idx) => (
            <div key={idx} style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8,
              padding: "14px 18px",
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: "#00B4FF",
                background: "rgba(0,180,255,0.08)",
                borderRadius: 4,
                padding: "3px 8px",
                flexShrink: 0,
                marginTop: 2,
              }}>
                {String(idx + 1).padStart(2, "0")}
              </div>
              <div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 4 }}>
                  {item.label}
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.55, color: "rgba(255,255,255,0.45)", margin: 0 }}>
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </BlackpaperSection>
    </div>
  );
}
