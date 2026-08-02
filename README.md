# alpha-hybrid

### https://newanforbi.github.io/alpha-hybrid/

---

A capital rotation framework tracking the **SOL → XRP → ZEC (W1) → ZEC (W2)** sequence — anchored to the April 2024 Bitcoin halving as the temporal fulcrum.

---

## The Sequence

| Phase | Asset | Role | Multiple | Window | Status |
|-------|-------|------|----------|--------|--------|
| 1 | SOL | Speculative Vanguard | 19.66x | Dec 2022 – Mar 2024 | Realized (public spot) |
| 2 | XRP | Institutional Settlement Bridge | 6.0x | Oct 2024 – Jan 2025 | Realized (public spot) |
| 3 | ZEC (W1) | Privacy Detonation | 33.67x | Apr 2025 – Nov 2025 | Framework reconstruction |
| 4 | ZEC (W2) | Discipline Trade | 3.4x | Mar 2026 – May 2026 | Framework reconstruction |

Compound capital paths in the UI are **illustrative**, not a claimed track record. Each phase lists verification sources.

---

## What It Is

An interactive React site built around a single thesis: post-halving capital rotation follows a structurally repeatable sequence — vanguard speculative asset, institutional settlement layer, terminal privacy overflow — with timing measured in halving-relative months.

Primary surface:

- **Overview** — Phase cards, timeline, sourced phase detail, illustrative compound path
- **Now** — Live CoinGecko watch metrics (prices, BTC dominance, weekly RSI) + honest signal statuses
- **Framework** — Blackpaper narrative

Secondary tools (under **More**): Macro, Cycles, Execution, Calculator, 2028 projections, Conversion.

---

## Stack

- React 18
- Vite 5
- CoinGecko public API (client-side)
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
