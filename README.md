# alpha-hybrid

### https://newanforbi.github.io/alpha-hybrid/

---

A capital rotation dashboard tracking the **SOL → XRP → ZEC (W1) → ZEC (W2)** sequence — anchored to the April 2024 Bitcoin halving as the definitive temporal fulcrum.

---

## The Sequence

| Phase | Asset | Role | Multiple | Window |
|-------|-------|------|----------|--------|
| 1 | SOL | Speculative Vanguard | 19.66x | Dec 2022 – Mar 2024 |
| 2 | XRP | Institutional Settlement Bridge | 6.0x | Oct 2024 – Jan 2025 |
| 3 | ZEC (W1) | Privacy Detonation | 33.67x | Apr 2025 – Nov 2025 |
| 4 | ZEC (W2) | Discipline Trade | 3.4x | Mar 2026 – May 2026 |

**$100K → $1.97M → $9.44M → $304.9M**

---

## What It Is

An interactive React dashboard built around a single thesis: that post-halving capital rotation follows a structurally repeatable sequence — vanguard speculative asset, institutional settlement layer, terminal privacy overflow — and that the timing of each phase is deterministic enough to trade systematically.

The framework uses the Bitcoin halving as Month 0 and maps every entry/exit trigger to halving-relative months rather than calendar dates.

---

## Dashboard Sections

- **Overview** — Phase cards, halving-relative timeline, capital flow bar
- **Macro** — Global M2 correlation, BTC dominance triggers, macroeconomic preconditions
- **Phases** — Entry/exit mechanics, signals, and key insights per phase
- **Signals** — Live signal grid with BTC dominance and SOL RSI watch metrics
- **Cycles** — Historical halving cycle comparison (2012–2024) with altcoin multiples
- **Execution** — Pre-entry checklist, position sizing tiers, order execution protocol
- **Calculator** — Interactive rotation calculator with adjustable risk split
- **2028** — Next-cycle predictions using the same framework
- **Blackpaper** — Full narrative of each phase with philosophical and psychological context
- **Conversion** — Post-liquidation wealth preservation architecture

---

## Stack

- React 18
- Vite 5
- Deployed via GitHub Actions → GitHub Pages

---

## Local Development

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

---

## Deploy

Deployment triggers automatically on push to `main` via `.github/workflows/deploy.yml`.

Requires **Settings → Pages → Source → GitHub Actions** to be enabled in the repository.
