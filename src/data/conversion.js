export const CONVERSION_PHASES = [
  { id: "I", label: "JURISDICTIONAL ENGINEERING", color: "#9D4EDD", summary: "Sever domicile from high-tax states and establish residency in a zero-income-tax jurisdiction before the liquidation event." },
  { id: "II", label: "FIDUCIARY ARCHITECTURE", color: "#6450FF", summary: "Structure capital within Domestic Asset Protection Trusts and establish a Single-Family Office with Private Trust Company governance." },
  { id: "III", label: "INSTITUTIONAL LIQUIDATION", color: "#23F0C6", summary: "Execute nine-figure liquidation via institutional OTC desks with locked quotes, bypassing public order books entirely." },
  { id: "IV", label: "CAPITAL PRESERVATION", color: "#F4B728", summary: "Neutralize counterparty banking risk via FDIC sweep networks and deploy into ultra-low-risk preservation instruments." },
  { id: "V", label: "TREASURY & RE-ENTRY", color: "#00B4FF", summary: "Generate risk-free yield via Treasury ladders, maintain liquidity through SBLOCs, and execute rules-based re-entry into subsequent cycles." },
];

export const CONVERSION_STATES = [
  { state: "Nevada", rate: "0%", test: "Domicile / 30-day presence", protections: "Homestead exemption, strongest asset protection trusts, no exception creditors", notes: "Fastest DAPT seasoning (2yr). Explicitly exempts crypto from property tax. Optimal for UHNW." },
  { state: "Texas", rate: "0%", test: "Domicile / 183-day rule", protections: "Homestead exemption (unlimited acreage outside city)", notes: "Business-friendly, vehicle inspection required. Strong for operational SFO base." },
  { state: "Wyoming", rate: "0%", test: "Domicile / minimal", protections: "Privacy protections, SPDI charter for crypto banking", notes: "1,000-year trust duration. Lowest LLC fees. Pro-crypto banking laws (SPDI charter)." },
  { state: "Florida", rate: "0%", test: "Domicile / straightforward", protections: "Homestead exemption (unlimited value), asset protection", notes: "No annual vehicle inspection. Straightforward domicile process. Strong case law." },
];

export const DAPT_JURISDICTIONS = [
  { jurisdiction: "Nevada", statute: "2 Years", exceptionCreditors: "None", stateTax: "0%", advantage: "Fastest seasoning period. Zero exception creditors. Explicitly exempts crypto from property tax." },
  { jurisdiction: "South Dakota", statute: "2 Years", exceptionCreditors: "Few", stateTax: "0%", advantage: "Highest privacy standards. Permanent seal on trust litigation. Excellent for quiet wealth." },
  { jurisdiction: "Wyoming", statute: "4 Years", exceptionCreditors: "Few", stateTax: "0%", advantage: "1,000-year trust duration. Low LLC integration fees. Pro-crypto SPDI banking laws." },
  { jurisdiction: "Delaware", statute: "4 Years", exceptionCreditors: "Yes (Alimony, Support)", stateTax: "0% (trust income)", advantage: "Established Chancery Court system. Highly predictable legal outcomes." },
];

export const SFO_PTC_DOMAINS = [
  { domain: "Primary Mandate", sfo: "Wealth multiplication, tax strategy, asset allocation, and lifestyle management.", ptc: "Fiduciary governance, legal trust compliance, and intergenerational transfer mechanisms.", synergy: "Complete alignment of agile investment operations with strict legal trust mandates." },
  { domain: "Regulatory Status", sfo: "Generally unregulated; exempt from Investment Advisers Act registration.", ptc: "Regulated fiduciary entity operating under specific state banking or trust laws.", synergy: "Combines rapid operational agility with formidable legal defensibility." },
  { domain: "Control Dynamics", sfo: "Directed by family principals and hired executives (CIO, CFO).", ptc: "Directed by a formal board of directors, which can legally include family members.", synergy: "Family retains active control over trust assets without piercing the legal liability veil." },
];

export const OTC_DESKS = [
  { desk: "Coinbase Prime", minTrade: "$1M+", regulatory: "NY Trust Charter, SEC, FINRA", strength: "Regulated custody integration. Seamless fiat off-ramp. Institutional-grade compliance." },
  { desk: "FalconX", minTrade: "$1M+", regulatory: "CFTC Swap Dealer, EU VFA (Malta)", strength: "Unified margin accounts (no pre-funding). Deep liquidity across 200+ pairs." },
  { desk: "Galaxy Digital", minTrade: "$1M+", regulatory: "SEC, FINRA (publicly traded)", strength: "Principal desk using own balance sheet. OTC proceeds deployable into yield programs." },
  { desk: "Wintermute", minTrade: "$500K+", regulatory: "Global compliance", strength: "Algorithmic principal dealer. 24/7 trading. Extremely tight spreads on majors." },
  { desk: "Cumberland (DRW)", minTrade: "$1M+", regulatory: "SEC, FINRA", strength: "Backed by DRW's institutional trading infrastructure. Deep BTC/ETH liquidity." },
];

export const CUSTODIANS = [
  { name: "Kraken Bank (WY)", detail: "SPDI charter. Bridges digital asset liquidation to institutional fiat custody." },
  { name: "BNY Mellon", detail: "World's largest custodian bank. Active digital assets division for institutional clients." },
  { name: "Anchorage Digital", detail: "OCC-chartered national trust bank. SOC 2 Type II. Federal regulatory framework." },
  { name: "Fidelity Digital Assets", detail: "Backed by Fidelity Investments. Cold-storage custody with institutional insurance." },
  { name: "Northern Trust", detail: "Institutional-grade crypto custody integrated with traditional wealth management." },
];

export const PRESERVATION_INSTRUMENTS = [
  { instrument: "Short-Term U.S. Treasury Bills", annReturn: "4.0–5.5%", maxDrawdown: "Near-zero", liquidity: "T+0 to T+1", protection: "U.S. government backing", notes: "Lowest risk. Exempt from state/local tax. 4-week to 1-year maturities." },
  { instrument: "Government Money Market Funds", annReturn: "4.0–5.2%", maxDrawdown: "Low", liquidity: "T+0 to T+1", protection: "SIPC up to $500K", notes: "Stable $1 NAV. Slightly higher yield than savings. Daily liquidity." },
  { instrument: "FDIC-Insured Cash Sweeps (ICS)", annReturn: "3.5–4.5%", maxDrawdown: "Near-zero", liquidity: "T+0", protection: "FDIC up to $250K per bank", notes: "Auto-fragments across 1000s of banks. Single statement. Full FDIC on entire balance." },
];

export const ALLOCATION_SHIFT = [
  { asset: "Public Equities", prevGen: "45–50%", nextGen: "30–35%", rationale: "Shift from correlated public markets to illiquid private markets for illiquidity premium and higher alpha." },
  { asset: "Private Equity / VC", prevGen: "25–30%", nextGen: "30–35%", rationale: "Preference for operational control, direct investments, and long-term tax-deferred compounding." },
  { asset: "Digital Assets / Crypto", prevGen: "< 10%", nextGen: "10–15%", rationale: "Core portfolio pillar — actively managed via hedge funds or direct custody as store of value and growth engine." },
  { asset: "Fixed Income / Cash", prevGen: "10–15%", nextGen: "5–8%", rationale: "Conservative buffers minimized. Yield sought via private credit rather than standard bonds." },
];

export const REENTRY_CHECKLIST = [
  { label: "Dry Powder Reserve", detail: "Maintain 10–20% of proceeds in stable assets (USD, USDC). Ensures liquidity for opportunistic buys, taxes, or emergencies." },
  { label: "Staged Re-Entry Ladder", detail: "Deploy capital in tranches at predetermined drawdown levels — e.g., 25% at 60% market drop, 25% at 70%, 25% at 80%. Buys at progressively cheaper prices." },
  { label: "Rules-Based Allocation", detail: "No single crypto > 30% of portfolio. No ecosystem > 15%. Cap speculative tokens. Avoid projects with audit failures or key-person risks." },
  { label: "DCA Automation", detail: "Automate dollar-cost averaging for core assets during accumulation phases. Remove emotional decision-making from systematic re-entry." },
  { label: "Quarterly Review Cadence", detail: "Audit allocation drift, reassess counterparty risks, review market signals, update watchlists. Maintain documented what-if scenarios and emergency procedures." },
];
