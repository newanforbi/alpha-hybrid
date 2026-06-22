export function useMarketData() {
  return {
    solPrice: null,
    zecPrice: null,
    btcDominance: null,
    solRsiWeekly: null,
    loading: false,
    error: null,
    lastUpdated: null,
  };
}
