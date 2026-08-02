import { createContext, useContext, useEffect, useState } from "react";

const CG = "https://api.coingecko.com/api/v3";
const REFRESH_MS = 120_000;
const MarketDataContext = createContext(null);

function rsi(closes, period = 14) {
  if (!closes || closes.length < period + 1) return null;
  let gains = 0;
  let losses = 0;
  for (let i = closes.length - period; i < closes.length; i++) {
    const diff = closes[i] - closes[i - 1];
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }
  const avgGain = gains / period;
  const avgLoss = losses / period;
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return Math.round(100 - 100 / (1 + rs));
}

/** Resample daily closes into weekly closes (last print of each ISO week). */
function weeklyClosesFromDaily(prices) {
  const byWeek = new Map();
  for (const [ts, price] of prices) {
    const d = new Date(ts);
    const week = `${d.getUTCFullYear()}-W${getUTCWeek(d)}`;
    byWeek.set(week, price);
  }
  return [...byWeek.values()];
}

function getUTCWeek(d) {
  const date = new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate()));
  const dayNum = date.getUTCDay() || 7;
  date.setUTCDate(date.getUTCDate() + 4 - dayNum);
  const yearStart = new Date(Date.UTC(date.getUTCFullYear(), 0, 1));
  return Math.ceil(((date - yearStart) / 86400000 + 1) / 7);
}

async function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchJson(url, { retries = 2 } = {}) {
  let lastErr;
  for (let attempt = 0; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url);
      if (res.status === 429) {
        lastErr = new Error("CoinGecko rate limited (429)");
        await sleep(1200 * (attempt + 1));
        continue;
      }
      if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
      return res.json();
    } catch (err) {
      lastErr = err;
      await sleep(600 * (attempt + 1));
    }
  }
  throw lastErr || new Error("Market data unavailable");
}

const EMPTY = {
  solPrice: null,
  xrpPrice: null,
  zecPrice: null,
  btcDominance: null,
  solRsiWeekly: null,
  xrpRsiWeekly: null,
  loading: true,
  error: null,
  lastUpdated: null,
  source: "CoinGecko",
};

// Module-level cache so React StrictMode remounts don't double-hit CoinGecko.
let sharedCache = null;
let sharedPromise = null;
let sharedFetchedAt = 0;

async function loadMarketSnapshot() {
  const now = Date.now();
  if (sharedCache && now - sharedFetchedAt < REFRESH_MS) return sharedCache;
  if (sharedPromise) return sharedPromise;

  sharedPromise = (async () => {
    const warnings = [];

    // Core metrics first — enough for honest watch UI even if RSI charts fail.
    const prices = await fetchJson(`${CG}/simple/price?ids=solana,ripple,zcash&vs_currencies=usd`);
    await sleep(400);
    const global = await fetchJson(`${CG}/global`);

    let solRsiWeekly = null;
    let xrpRsiWeekly = null;
    try {
      await sleep(400);
      const solChart = await fetchJson(`${CG}/coins/solana/market_chart?vs_currency=usd&days=365`, { retries: 1 });
      solRsiWeekly = rsi(weeklyClosesFromDaily(solChart.prices || []), 14);
      await sleep(400);
      const xrpChart = await fetchJson(`${CG}/coins/ripple/market_chart?vs_currency=usd&days=365`, { retries: 1 });
      xrpRsiWeekly = rsi(weeklyClosesFromDaily(xrpChart.prices || []), 14);
    } catch (err) {
      warnings.push(`RSI offline (${err.message || "chart fetch failed"})`);
    }

    sharedCache = {
      solPrice: prices.solana?.usd ?? null,
      xrpPrice: prices.ripple?.usd ?? null,
      zecPrice: prices.zcash?.usd ?? null,
      btcDominance: global.data?.market_cap_percentage?.btc ?? null,
      solRsiWeekly,
      xrpRsiWeekly,
      loading: false,
      error: warnings.length ? warnings.join(" · ") : null,
      lastUpdated: new Date(),
      source: "CoinGecko",
    };
    sharedFetchedAt = Date.now();
    return sharedCache;
  })().finally(() => {
    sharedPromise = null;
  });

  return sharedPromise;
}

export function MarketDataProvider({ children }) {
  const [state, setState] = useState(EMPTY);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setState((prev) => ({ ...prev, loading: prev.lastUpdated == null, error: null }));
      try {
        const snap = await loadMarketSnapshot();
        if (cancelled) return;
        setState(snap);
      } catch (err) {
        if (cancelled) return;
        setState((prev) => ({
          ...prev,
          loading: false,
          error: err.message || "Market data unavailable",
        }));
      }
    }

    load();
    const id = setInterval(load, REFRESH_MS);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, []);

  return <MarketDataContext.Provider value={state}>{children}</MarketDataContext.Provider>;
}

export function useMarketData() {
  const ctx = useContext(MarketDataContext);
  if (!ctx) {
    return EMPTY;
  }
  return ctx;
}

/** Derive signal statuses from live metrics where possible; otherwise MANUAL. */
export function resolveSignalStatus(signal, metrics) {
  const { btcDominance, solRsiWeekly, xrpRsiWeekly } = metrics;
  switch (signal.metric) {
    case "btc_dom_below":
      if (btcDominance == null) return "MANUAL";
      return btcDominance < signal.value ? "TRIGGERED" : "WATCHING";
    case "sol_rsi_above":
      if (solRsiWeekly == null) return "MANUAL";
      return solRsiWeekly > signal.value ? "TRIGGERED" : "WATCHING";
    case "xrp_rsi_above":
      if (xrpRsiWeekly == null) return "MANUAL";
      return xrpRsiWeekly > signal.value ? "TRIGGERED" : "WATCHING";
    default:
      return "MANUAL";
  }
}
