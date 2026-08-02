import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import LiquidityCascade from './LiquidityCascade.jsx'
import { MarketDataProvider } from './hooks/useMarketData.jsx'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <MarketDataProvider>
      <LiquidityCascade />
    </MarketDataProvider>
  </StrictMode>
)
