import { useEffect, useState } from "react";

const CG = "https://api.coingecko.com/api/v3";
const REFRESH_MS = 60_000;

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

async function fetchJson(url) {
  const res = await fetch(url);
  if (!res.ok) throw new Error(`CoinGecko ${res.status}`);
  return res.json();
}

export function useMarketData() {
  const [state, setState] = useState({
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
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      try {
        const [prices, global, solChart, xrpChart] = await Promise.all([
          fetchJson(`${CG}/simple/price?ids=solana,ripple,zcash&vs_currencies=usd`),
          fetchJson(`${CG}/global`),
          fetchJson(`${CG}/coins/solana/market_chart?vs_currency=usd&days=365`),
          fetchJson(`${CG}/coins/ripple/market_chart?vs_currency=usd&days=365`),
        ]);

        if (cancelled) return;

        const solWeekly = weeklyClosesFromDaily(solChart.prices || []);
        const xrpWeekly = weeklyClosesFromDaily(xrpChart.prices || []);

        setState({
          solPrice: prices.solana?.usd ?? null,
          xrpPrice: prices.ripple?.usd ?? null,
          zecPrice: prices.zcash?.usd ?? null,
          btcDominance: global.data?.market_cap_percentage?.btc ?? null,
          solRsiWeekly: rsi(solWeekly, 14),
          xrpRsiWeekly: rsi(xrpWeekly, 14),
          loading: false,
          error: null,
          lastUpdated: new Date(),
          source: "CoinGecko",
        });
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

  return state;
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
