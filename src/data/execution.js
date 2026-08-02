export const PRE_ENTRY_CHECKLIST = [
  { item: "Exchange Tier 3 Verification", detail: "Complete KYC/AML for institutional-level withdrawal limits ($500K+/day). Use Coinbase Advanced, Kraken Pro, or Binance Institutional. Required for ZEC OTC desk access." },
  { item: "Hardware Wallet Setup", detail: "Ledger or Trezor configured with a fresh seed phrase. Test a small withdrawal before transferring phase capital. Never store the seed digitally." },
  { item: "Position Size Decision", detail: "Determine Conservative / Moderate / Aggressive tier allocation before touching the market. Pre-commit in writing. Do not adjust mid-phase." },
  { item: "Exit Pre-Commitment", detail: "Write down exact exit thresholds for each phase on paper. Sign and date. This physical record prevents in-the-moment deviation when prices are euphoric." },
  { item: "Tax Basis Tracking Active", detail: "Configure CoinTracker or Koinly with exchange API keys before the first trade. Every entry must be logged immediately — retroactive reconstruction is costly and inaccurate." },
];

export const PHASE_PROTOCOLS = [
  {
    asset: "SOL",
    color: "#9D4EDD",
    colorDim: "rgba(157,78,221,0.12)",
    venue: "Coinbase Advanced / Kraken Pro",
    entryMethod: "DCA over 4–8 weeks",
    positionType: "Spot only",
    custody: "Self-custody (Phantom wallet or Ledger)",
    slippageRisk: "LOW",
    slippageBps: "< 50 bps",
    exitTrigger: "Pre-halving RSI > 78 or BTC.D < 57.5%",
  },
  {
    asset: "XRP",
    color: "#23F0C6",
    colorDim: "rgba(35,240,198,0.12)",
    venue: "Interactive Brokers / Fidelity",
    entryMethod: "Single entry at confirmed breakout",
    positionType: "Equity — common shares",
    custody: "Brokerage account",
    slippageRisk: "LOW",
    slippageBps: "< 30 bps (NYSE listed)",
    exitTrigger: "XRP RSI > 80 or BTC momentum stall",
  },
  {
    asset: "ZEC",
    color: "#F4B728",
    colorDim: "rgba(244,183,40,0.12)",
    venue: "Kraken / OTC desk (large orders)",
    entryMethod: "Limit orders only, 3–5 tranches",
    positionType: "Spot only",
    custody: "Zcash native wallet (shielded)",
    slippageRisk: "HIGH",
    slippageBps: "150–400 bps on orders > $100K",
    exitTrigger: "7-day gain > 150% or media saturation",
  },
];

export const POSITION_SIZING = [
  { tier: "Conservative", solPct: "20%", xrpPct: "60%", zecPct: "20%", note: "Preserves most capital; reduced ZEC exposure", isDefault: false },
  { tier: "Moderate",     solPct: "33%", xrpPct: "33%", zecPct: "34%", note: "Balanced phase rotation — recommended default", isDefault: true },
  { tier: "Aggressive",   solPct: "40%", xrpPct: "25%", zecPct: "35%", note: "Maximum ZEC exposure; highest theoretical return", isDefault: false },
];

export const EXECUTION_STEPS = [
  { step: 1, title: "Check Spread", detail: "Before any order, verify bid/ask spread is < 0.5% for SOL/XRP, < 2% for ZEC. Wide spreads signal thin liquidity — delay entry or use OTC." },
  { step: 2, title: "Tranche Entry", detail: "Never deploy full position in one order. Split into 3–5 equal tranches deployed over 24–72 hours. Reduces timing risk and average entry price." },
  { step: 3, title: "Limit Orders Only", detail: "Market orders on illiquid assets (especially ZEC) result in catastrophic slippage. Always place limit orders at or slightly above the current ask for entries." },
  { step: 4, title: "OTC Desk for Large ZEC", detail: "Orders above $500K in ZEC must go through an OTC desk (Cumberland, Genesis Trading, or Kraken OTC). Direct market impact would move the price against you." },
  { step: 5, title: "Transfer to Self-Custody", detail: "Within 24 hours of any acquisition, transfer to a hardware wallet. Exchange insolvency risk is real. ZEC transfers to shielded addresses only." },
  { step: 6, title: "Log Basis Immediately", detail: "Record exact entry price, quantity, timestamp, and exchange within 1 hour of each trade. Cost basis disputes are impossible to resolve retroactively from memory." },
];

export const EXECUTION_FAILURES = [
  { title: '"I\'ll buy more when it dips"', description: "DCA entry exists precisely because the dip often never comes. In parabolic phases, waiting for a 10% retracement means missing 300% gains. Tranching is the discipline — execute the plan." },
  { title: "Market Orders on ZEC", description: "A $1M market order on ZEC in a thin order book will consume every ask from $20 to $45 before filling. The slippage alone can exceed 30%. This is not hypothetical — it is arithmetic." },
  { title: "Holding XRP into Phase 3", description: "XRP's momentum-driven beta amplifies downside as violently as upside. When ZEC begins its terminal spike, XRP is simultaneously beginning a drawdown. Every day of delay costs compounded capital." },
];
