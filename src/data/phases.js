/**
 * Phase multiples are framework reconstructions of public spot history.
 * `status` marks how settled each leg is; `sources` point to verification paths.
 * Compound capital path ($100K → …) is illustrative — not a claimed track record.
 */

export const PHASES = [
  {
    id: 1,
    asset: "SOL",
    coingeckoId: "solana",
    name: "Solana",
    role: "Speculative Vanguard",
    color: "#9D4EDD",
    colorDim: "rgba(157,78,221,0.12)",
    entryDate: "Dec 22, 2022",
    exitDate: "Mar 18, 2024",
    entryPrice: "$9.88",
    exitPrice: "$194.31",
    multiple: "19.66x",
    multipleNum: 19.66,
    biaPrice: "$73.64",
    capitalIn: 100000,
    capitalOut: 1966000,
    halvingDistance: "16 months before",
    monthsFromHalving: -16,
    entryMonths: "-16 to -1",
    status: "realized",
    statusLabel: "Realized (public spot)",
    sources: [
      {
        label: "CoinGecko — Solana",
        url: "https://www.coingecko.com/en/coins/solana",
        note: "Cross-check daily closes around Dec 2022 lows and Mar 2024 local highs",
      },
      {
        label: "Bitcoin 2024 halving",
        url: "https://www.coingecko.com/en/coins/bitcoin",
        note: "Month 0 anchor ≈ Apr 19–20, 2024",
      },
    ],
    description:
      "Solana emerges from the FTX catastrophe at a generational cycle low. Network resilience, Firedancer upgrade narrative, and SOL ETF speculation drive speculative expansion as BTC dominance peaks and retail capital seeks leverage amplification in the pre-halving period.",
    mechanics: [
      "FTX collapse creates maximum despair at $9.88 — institutional accumulation begins at generational lows",
      "Network survives $7B FTX SOL overhang, proving architectural resilience",
      "Firedancer upgrade and developer migration from Ethereum drive renewed institutional narrative",
      "SOL ETF speculation and perpetual futures funding rate explosion amplify parabolic expansion",
    ],
    exitSignal:
      "When SOL RSI > 78 on weekly timeframe, pre-halving euphoria peaks, BTC dominance begins breaking below 58%. Retail saturation evident — exit remaining position.",
    entrySignal:
      "Post-FTX collapse, SOL at generational lows near $9.88. BTC dominance elevated, fear maximum — ideal conditions for vanguard accumulation. RSI oversold on weekly.",
    keyInsight:
      "SOL achieved 19.66x by surviving the collapse of its largest institutional backer. The vanguard is defined by the moment when the correct thesis is most hated — SOL at $9.88 was maximum hate.",
  },
  {
    id: 2,
    asset: "XRP",
    coingeckoId: "ripple",
    name: "Ripple",
    role: "Institutional Settlement Bridge",
    color: "#23F0C6",
    colorDim: "rgba(35,240,198,0.12)",
    entryDate: "Oct 2, 2024",
    exitDate: "Jan 8, 2025",
    entryPrice: "$0.5241",
    exitPrice: "$3.14",
    multiple: "6.0x",
    multipleNum: 6.0,
    capitalIn: 1966000,
    capitalOut: 9437000,
    halvingDistance: "+6 months",
    monthsFromHalving: 6,
    entryMonths: "+4 to +7",
    status: "realized",
    statusLabel: "Realized (public spot)",
    sources: [
      {
        label: "CoinGecko — XRP",
        url: "https://www.coingecko.com/en/coins/ripple",
        note: "Verify Oct 2024 support region and Jan 2025 local peak near prior ATH zone",
      },
      {
        label: "SEC v. Ripple (case context)",
        url: "https://www.sec.gov/newsroom/press-releases/2020-338",
        note: "Regulatory overhang / clarity narrative for institutional settlement rotation",
      },
    ],
    description:
      "Institutional settlement layer powered by regulatory clarity and CBDC integration. XRP emerges from SEC lawsuit overhang as institutional capital floods into cross-border settlement infrastructure.",
    mechanics: [
      "Regulatory clarity: SEC case resolved (July 2023), XRP reclassified",
      "Institutional capital rotates from SOL into settlement layer",
      "CBDC pilots (UK, Singapore, UAE) accelerate ODL adoption globally",
      "Institutional proxies reach 2.0-3.0x premium before exhaustion",
    ],
    exitSignal:
      "When institutional adoption plateaus or regulatory compromise emerges. XRP RSI > 80 weekly, price approaching prior ATH with decelerating momentum.",
    entrySignal:
      "Post-SOL exit, XRP at support levels ($0.52), regulatory tailwinds confirmed. BTC Dominance breaks below 57.5%.",
    keyInsight:
      "XRP 6x was modest vs SOL 19.66x, but proved institutional capital rotates in predictable waves. Regulatory permission triggers FOMO, not fundamentals.",
  },
  {
    id: 3,
    asset: "ZEC (W1)",
    coingeckoId: "zcash",
    name: "Zcash Wave 1",
    role: "Privacy Detonation",
    color: "#F4B728",
    colorDim: "rgba(244,183,40,0.12)",
    entryDate: "Apr 9, 2025",
    exitDate: "Nov 12, 2025",
    entryPrice: "$20",
    exitPrice: "$674",
    multiple: "33.67x",
    multipleNum: 33.67,
    capitalIn: 9437000,
    capitalOut: 304900000,
    halvingDistance: "+7 months",
    monthsFromHalving: 7,
    entryMonths: "+9 to +19",
    status: "framework",
    statusLabel: "Framework reconstruction",
    sources: [
      {
        label: "CoinGecko — Zcash",
        url: "https://www.coingecko.com/en/coins/zcash",
        note: "Entry/exit prints are thesis windows — confirm against daily history; do not treat as audited fills",
      },
      {
        label: "DOJ BTC seizure (surveillance narrative)",
        url: "https://www.justice.gov/",
        note: "Cited as privacy-demand catalyst; verify primary DOJ releases independently",
      },
    ],
    description:
      "Terminal liquidity overflow into despised privacy assets. CBDC rollout triggers financial surveillance anxiety. Privacy becomes non-negotiable hedge as DOJ seizure of 127K BTC validates on-chain transparency risk.",
    mechanics: [
      "CBDC anxiety drives demand for privacy-native infrastructure",
      "DOJ seizure of 127,271 BTC proved Bitcoin is traceable and seizable",
      "Regulatory pressure on transaction surveillance globally",
      "Supply dynamics shift as privacy gains systemic importance",
    ],
    exitSignal:
      "When institutional adoption plateaus or regulatory compromise emerges. ZEC 7-day gain > 150%, media peaks, terminal euphoria evident.",
    entrySignal:
      "Post-XRP exit, global privacy concerns peak, geopolitical tensions high. ZEC delisted, despised, order books thin — ideal conditions for doomsday overflow.",
    keyInsight:
      "ZEC W1 achieved 33.67x via the doomsday premium — late-stage capital paying exponentially more for assets perceived as final hedge against government seizure.",
  },
  {
    id: 4,
    asset: "ZEC (W2)",
    coingeckoId: "zcash",
    name: "Zcash Wave 2",
    role: "Discipline Trade",
    color: "#F4B728",
    colorDim: "rgba(244,183,40,0.12)",
    entryDate: "Mar 7, 2026",
    exitDate: "May 19, 2026",
    entryPrice: "$197.82",
    exitPrice: "$673.46",
    multiple: "3.4x",
    multipleNum: 3.4,
    capitalIn: 40839000,
    capitalOut: 138852000,
    halvingDistance: "+13 months",
    monthsFromHalving: 13,
    entryMonths: "+23 to +25",
    status: "framework",
    statusLabel: "Framework reconstruction",
    sources: [
      {
        label: "CoinGecko — Zcash",
        url: "https://www.coingecko.com/en/coins/zcash",
        note: "71% retracement / retest path is a discipline template — validate prints before treating as realized",
      },
    ],
    description:
      "Discipline trade proving framework repeats. After W1 blow-off exhaustion and 71% capitulation retracement, reserved capital re-deploys on weakness. Smaller 3.4x multiple proves execution discipline, not luck.",
    mechanics: [
      "W1 peak at $674 retraces 71% to $197.82 on capitulation",
      "Weak hands liquidated; strong hands reload at maximum pessimism",
      "Privacy demand renewed; regulatory pressure persists",
      "Low volume rallies off support precede violent reversals to prior highs",
    ],
    exitSignal:
      "Exit when ZEC reassaults prior W1 highs ($673+). This is psychological re-test, not new narrative. Allocate profits immediately.",
    entrySignal:
      "Retracement entry after blow-off exhaustion. Deploy reserved capital on capitulation candles. Position sizing reflects lower conviction: 3.4x vs 33.67x on W1.",
    keyInsight:
      "Markets never move straight. They exhaust, retrace, test prior peaks. Discipline separates professionals from retail. W2 is reward for holding dry powder through chaos.",
  },
];

export const STATUS_META = {
  realized: { label: "Realized", color: "#23F0C6" },
  framework: { label: "Framework", color: "#F4B728" },
  projected: { label: "Projected", color: "#9D4EDD" },
};
