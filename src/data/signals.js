/**
 * Signal statuses are derived live when `metric` is set.
 * Narrative / discretionary thresholds use MANUAL — never fake ARMED/TRIGGERED.
 */
export const SIGNAL_GRID = [
  {
    phase: 1,
    asset: "SOL",
    color: "#9D4EDD",
    entryWindow: "Sep 2026 – Aug 2027",
    historicalPrecedent:
      "2022–2024 precedent: SOL entered at $9.88 post-FTX collapse (Dec 2022), peaked at $194.31 pre-halving (Mar 2024), confirming the speculative vanguard front-run thesis. 19.66x return from maximum despair.",
    signals: [
      {
        id: "S1-1",
        threshold: "BTC.D < 57.5%",
        action: "CONFIRM ALT ROTATION WINDOW",
        metric: "btc_dom_below",
        value: 57.5,
      },
      {
        id: "S1-2",
        threshold: "SOL RSI > 78 weekly",
        action: "REDUCE 50% POSITION",
        metric: "sol_rsi_above",
        value: 78,
      },
      {
        id: "S1-3",
        threshold: "Pre-halving narrative peak",
        action: "EXIT REMAINING SOL",
        metric: "manual",
      },
    ],
  },
  {
    phase: 2,
    asset: "XRP",
    color: "#23F0C6",
    entryWindow: "Mar 2028",
    historicalPrecedent:
      "In 2024 XRP peaked at $3.40 before retracing 60% — positions held too long surrendered the institutional settlement premium.",
    signals: [
      {
        id: "S2-1",
        threshold: "XRP RSI > 80 weekly",
        action: "BEGIN XRP EXIT",
        metric: "xrp_rsi_above",
        value: 80,
      },
      {
        id: "S2-2",
        threshold: "BTC 30-day momentum stalls",
        action: "ACCELERATE EXIT",
        metric: "manual",
      },
      {
        id: "S2-3",
        threshold: "ZEC/BTC ratio breaks up",
        action: "CONFIRM ZEC ENTRY",
        metric: "manual",
      },
    ],
  },
  {
    phase: 3,
    asset: "ZEC (W1)",
    color: "#F4B728",
    entryWindow: "Nov 2028 – Nov 2029",
    historicalPrecedent:
      "Framework window: ZEC entered ~$20, peaked near $674 (≈33.7x). Pattern template — vertical blow-off = terminal peak. Verify prints before treating as settled history.",
    signals: [
      {
        id: "S3-1",
        threshold: "ZEC 7-day gain > 150%",
        action: "EXIT 50% IMMEDIATELY",
        metric: "manual",
      },
      {
        id: "S3-2",
        threshold: "Mainstream media coverage",
        action: "EXIT REMAINING ZEC",
        metric: "manual",
      },
      {
        id: "S3-3",
        threshold: "Reserve capital for W2",
        action: "HOLD 20–30% CASH",
        metric: "manual",
      },
    ],
  },
  {
    phase: 4,
    asset: "ZEC (W2)",
    color: "#F4B728",
    entryWindow: "Mar 2030 (2028-cycle analog)",
    historicalPrecedent:
      "Discipline template: ~71% retracement from W1 peak, then retest of prior highs (~3.4x). Forward window for next cycle is projected — not a live armed trade.",
    signals: [
      {
        id: "S4-1",
        threshold: "Retracement to 70%+ loss",
        action: "DEPLOY RESERVED CAPITAL",
        metric: "manual",
      },
      {
        id: "S4-2",
        threshold: "Capitulation sentiment + volume spike",
        action: "ADD TO POSITION",
        metric: "manual",
      },
      {
        id: "S4-3",
        threshold: "Prior highs approached",
        action: "EXIT 100% TO FIAT",
        metric: "manual",
      },
    ],
  },
];

export const KEY_THRESHOLDS = [
  { signal: "BTC Dominance Break", asset: "SOL → XRP", threshold: "BTC.D < 57.5%", action: "Rotate to XRP", window: "Month −2 to +3" },
  { signal: "Pre-Halving Saturation", asset: "SOL", threshold: "SOL RSI > 78 weekly + retail euphoria", action: "Exit SOL entirely", window: "Month −1 to 0" },
  { signal: "XRP RSI Extreme", asset: "XRP", threshold: "XRP RSI > 80 weekly", action: "Begin XRP exit", window: "Month +6 to +9" },
  { signal: "BTC Momentum Stall", asset: "XRP", threshold: "30-day price momentum < 0", action: "Accelerate XRP exit", window: "Month +7 to +10" },
  { signal: "ZEC Blow-Off Top (W1)", asset: "ZEC → Fiat", threshold: "7-day gain > 150%", action: "Exit 50% immediately", window: "Month +17 to +19" },
  { signal: "Terminal Media Spike (W1)", asset: "ZEC (W1)", threshold: "Mainstream coverage + euphoria", action: "Exit remaining ZEC, reserve cash for W2", window: "Month +19 to +21" },
  { signal: "Capitulation Retracement (W2)", asset: "ZEC (W2)", threshold: "70%+ loss from peak ($674 → $197)", action: "Deploy reserved capital", window: "Month +23 to +24" },
  { signal: "W2 Peak Approach", asset: "ZEC (W2) → Fiat", threshold: "Price approaches prior highs ($673)", action: "Exit 100% to fiat", window: "Month +25" },
];

export const PSY_RISKS = [
  {
    title: "FOMO Risk",
    description:
      "Watching ZEC reach 50x while still holding SOL induces premature rotation. The signal grid exists precisely to counter this. Each phase has an irreversible exit trigger — honor it regardless of apparent upside remaining.",
  },
  {
    title: "Premature Rotation Risk",
    description:
      "Rotating from SOL to XRP before BTC.D crosses 57.5% means abandoning a live expansion for an unconfirmed one. Confirmation criteria are not suggestions — they are the mechanism separating disciplined execution from speculative guessing.",
  },
];

/** Next actionable phase for the 2028 cycle — SOL accumulation window. */
export const NEXT_CYCLE_FOCUS = {
  phaseIndex: 0,
  label: "2028-cycle SOL accumulation",
  note: "Watch metrics are live; narrative triggers stay MANUAL until confirmed by you.",
};
