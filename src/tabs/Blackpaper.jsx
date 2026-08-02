import {
  BlackpaperSection,
  BlackpaperPara,
  BlackpaperHeading,
  BlackpaperQuote,
  BlackpaperDatum,
} from "../components/BlackpaperPrimitives.jsx";

export function Blackpaper() {
  const g = "#9D4EDD";
  const o = "#23F0C6";
  const y = "#F4B728";

  return (
    <div style={{ maxWidth: 680, margin: "0 auto", padding: "10px 0 40px" }}>
      <div style={{ textAlign: "center", marginBottom: 50 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.2)", letterSpacing: 3, marginBottom: 14 }}>
          BLACKPAPER
        </div>
        <p style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 14,
          color: "rgba(255,255,255,0.35)",
          margin: "0 auto",
          maxWidth: 480,
          lineHeight: 1.6,
        }}>
          A Chronological Matrix for Capital Rotation Across Solana, XRP, and Zcash
        </p>
        <div style={{ width: 40, height: 1, background: "rgba(255,255,255,0.1)", margin: "24px auto 0" }} />
      </div>

      <BlackpaperSection label="PREAMBLE" color="rgba(255,60,60,0.4)">
        <BlackpaperHeading>The Framework Requires One Uncomfortable Belief</BlackpaperHeading>
        <BlackpaperPara>
          Every asset in this document was <em style={{ color: "rgba(255,255,255,0.8)" }}>formally abandoned</em> before it was entered.
          Not unfashionable. Not out of favor. Formally abandoned — by exchanges, by institutions, by the compliance departments that
          govern where institutional capital is permitted to flow.
        </BlackpaperPara>
        <BlackpaperPara indent>
          SOL: the FTX bankruptcy estate held $7 billion in tokens slated for court-ordered liquidation. XRP: the SEC had filed a
          securities fraud lawsuit and Coinbase had delisted it. ZEC: removed from Coinbase in 2021, removed from Kraken in 2023,
          institutional allocation effectively zero. Each entry was made at the precise moment that professional capital had
          documented, on the record, that the asset was untouchable.
        </BlackpaperPara>
        <BlackpaperPara indent>
          The thesis that connects all four phases is this: <em style={{ color: "rgba(255,255,255,0.8)" }}>institutional abandonment, when it coincides
          with the right phase of the halving cycle, is a timing signal — not a fundamental judgment.</em> The institutions that file
          delistings and withdrawal notices are responding to regulatory posture and risk parameters. Both of those change.
          When they change, the capital that was barred re-enters — not gradually, but in a single wave.
        </BlackpaperPara>
        <BlackpaperQuote color="rgba(255,60,60,0.6)">
          The Alpha Hybrid is not a record of three bets on good assets. It is a record of three bets on assets that institutions
          had formally decided were dead.
        </BlackpaperQuote>
      </BlackpaperSection>

      <BlackpaperSection label="I" color="rgba(255,255,255,0.4)">
        <BlackpaperHeading>What You Have to Believe</BlackpaperHeading>
        <BlackpaperPara>
          To execute this framework, you must accept four things that most professional investors will not say out loud:
        </BlackpaperPara>
        <div style={{ marginLeft: 20, marginTop: 12, marginBottom: 16, display: "flex", flexDirection: "column", gap: 12 }}>
          <div><strong>1. The best entry price is the one that feels most wrong.</strong> Not "unloved" — specifically the price that
          has been written off by professional capital, flagged by compliance departments, and is actively being avoided by institutions
          for documented structural reasons. That specific price is where the multiple lives.</div>
          <div><strong>2. Institutional abandonment is temporary and cyclical, not permanent.</strong> The same institutions that file
          delistings and withdrawal notices will re-enter when permission structures change. They are not making fundamental judgments.
          They are managing liability.</div>
          <div><strong>3. The halving cycle is the forcing function that overrides narrative.</strong> Individual asset narratives matter
          less than where the cycle is. The most abandoned assets have the most room to recover when the cycle turns — because the
          abandonment discount is the deepest.</div>
          <div><strong>4. Exit signals are not optional.</strong> The framework is not a buy-and-hold thesis. Each rotation has a
          pre-defined exit mechanism. Entry gets the multiple. Exit keeps it. These are equally critical.</div>
        </div>
        <BlackpaperPara indent>
          If you can hold all four of these simultaneously — without hedging them into conventional wisdom — the framework works.
          If you can't, it doesn't. The difficulty is not analytical. It is psychological.
        </BlackpaperPara>
      </BlackpaperSection>

      <BlackpaperSection label="II" color="rgba(255,255,255,0.4)">
        <BlackpaperHeading>The Halving Is Permission, Not Cause</BlackpaperHeading>
        <BlackpaperPara>
          The halving does not create the cycle. It resolves the uncertainty about when the cycle will begin.
        </BlackpaperPara>
        <BlackpaperPara indent>
          Institutional capital has known since 2016 that a crypto bull cycle follows every halving. The question has never been
          "will a cycle come?" It has been "when is it safe to deploy?" Risk committees need a specific event to schedule exposure
          reviews around. Compliance departments need a datable, defensible rationale for unlocking allocation. The halving provides
          that rationale. It is the <em style={{ color: "rgba(255,255,255,0.8)" }}>permission structure</em> that releases the
          institutional dry powder that accumulated during the bear cycle.
        </BlackpaperPara>
        <BlackpaperPara indent>
          Central bank policy is the accelerant. Expanding monetary conditions — the Fed pivoting from tightening to easing,
          global M2 rising — are what give that dry powder purchasing power. But the fuel needs a spark. The halving is the spark.
          In October 2023, both conditions were present: the Fed had peaked at 5.5%, futures markets were pricing three rate cuts,
          and the April 2024 halving was six months out. The window was open.
        </BlackpaperPara>
        <BlackpaperQuote color={g}>
          You need the fuel and the spark. Expansionary policy without the halving is noise. The halving without expansionary policy
          is a false start. Both together is when you move.
        </BlackpaperQuote>
      </BlackpaperSection>

      <BlackpaperSection label="PHASE 1" color={g}>
        <BlackpaperHeading>The Vanguard Ignition</BlackpaperHeading>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, color: g, fontWeight: 700, marginBottom: 20, letterSpacing: -0.5 }}>
          Solana (SOL): The Survivor Play Nobody Believed In
        </div>
        <BlackpaperPara>
          On November 11, 2022, FTX filed for Chapter 11 bankruptcy. In the hours that followed, the Solana ecosystem
          experienced something close to extinction-level sentiment. The FTX estate held roughly{" "}
          <BlackpaperDatum value="$7 billion" color={g} /> in SOL tokens. Alameda Research, FTX's sister trading firm,
          had been one of SOL's most significant validators. The network's largest institutional backer was now a criminal defendant
          whose assets were subject to court-ordered liquidation.
        </BlackpaperPara>
        <BlackpaperPara indent>
          The price fell to <BlackpaperDatum value="$9.88" color={g} /> by December 22, 2022. The network had logged multiple
          outages across the year. The validator set had been structurally compromised. The developer community was publicly
          migrating to Ethereum. Crypto Twitter's consensus was explicit and categorical: "SOL is a VC coin. FTX was its only
          real backer. Without FTX, there is no thesis."
        </BlackpaperPara>
        <BlackpaperPara indent>
          To enter at <BlackpaperDatum value="$9.88" color={g} />, we had to believe three specific things — and we were
          not certain about any of them:
        </BlackpaperPara>
        <div style={{ marginLeft: 20, marginTop: 12, marginBottom: 16, display: "flex", flexDirection: "column", gap: 10 }}>
          <div><strong>1.</strong> The Solana network would continue producing blocks without Alameda's validator support</div>
          <div><strong>2.</strong> The FTX bankruptcy estate's SOL liquidation would be structured, not disorderly</div>
          <div><strong>3.</strong> A credible institutional narrative for SOL would emerge before the April 2024 halving</div>
        </div>
        <BlackpaperQuote color={g}>
          We did not know these things. We believed them, with varying degrees of conviction, against significant available evidence to the contrary.
        </BlackpaperQuote>
        <BlackpaperPara indent>
          <strong>Entry: December 22, 2022 at $9.88</strong> • Position Size: $100,000 (~10,121 tokens)
        </BlackpaperPara>
        <BlackpaperPara indent>
          The network held. By early 2023 it was producing consistent uptime without Alameda. By mid-2023, Jump Crypto announced
          Firedancer — a second validator client that eliminated the single-client-dependency risk that had caused the outages.
          By late 2023, BlackRock's Bitcoin ETF application created a macro tailwind that lifted every high-beta asset on the board.
          The SOL ETF narrative followed. By January 2024, the price had crossed $120. By March 18, 2024, it reached{" "}
          <BlackpaperDatum value="$194.31" color={g} />.
        </BlackpaperPara>
        <BlackpaperPara indent>
          <strong>Multiple: 19.66x over 15 months</strong> • <strong>Exit Value: $1,966,000</strong>
        </BlackpaperPara>
        <BlackpaperPara indent>
          The signal that it was time to sell was not a price target. SOL RSI had reached 82+ on the weekly chart.
          BTC dominance was breaking down. Mainstream financial media had discovered "the Ethereum killer." Every indicator
          of narrative saturation had triggered simultaneously. The exit was not a decision made on March 18. It was a
          decision made when the framework was built — March 18 was execution.
        </BlackpaperPara>
        <BlackpaperQuote color={g}>
          The signal to exit was not that we stopped believing in SOL. It was that everyone else had started.
        </BlackpaperQuote>
      </BlackpaperSection>


      <BlackpaperSection label="INTERLUDE" color="rgba(255,255,255,0.25)">
        <BlackpaperHeading sub>The Indifference Required</BlackpaperHeading>
        <BlackpaperPara>
          March 18, 2024. SOL exits at $194.31. The portfolio reads $1.966 million. The trade worked exactly as designed.
        </BlackpaperPara>
        <BlackpaperPara indent>
          This is where most people make the first irreversible mistake: they stay.
        </BlackpaperPara>
        <BlackpaperPara indent>
          Not because they're greedy. Because the validated thesis is still working. SOL is up 30% in the past month.
          The narrative has never been stronger — ETF speculation, Firedancer upgrade, institutional attention. Every data point says
          the trade has more room. And they're probably right. SOL did continue higher after our exit.
        </BlackpaperPara>
        <BlackpaperPara indent>
          The framework does not care. The signal fired. The rotation executes. This is not courage — courage implies
          emotional overcoming, the dramatic decision to leap. What the rotation actually requires is something quieter
          and harder: <em style={{ color: "rgba(255,255,255,0.8)" }}>mechanical indifference to a trade that is still working</em>.
        </BlackpaperPara>
        <BlackpaperPara indent>
          The psychological difficulty is not buying the abandoned asset. That's uncomfortable but finite — the discomfort
          has a clear thesis behind it. The difficulty is suppressing the temptation to stay in the winning position.
          Greed dressed as conviction. The framework removes the decision entirely. We do not decide to sell SOL.
          The signal tells us to sell SOL. The decision was made months earlier, in cold blood, before the position existed.
        </BlackpaperPara>
        <BlackpaperQuote color="rgba(255,255,255,0.35)">
          The framework's power is not that it finds good trades. It is that it <strong>terminates good trades on schedule</strong>.
        </BlackpaperQuote>
      </BlackpaperSection>

      <BlackpaperSection label="PHASE 2" color={o}>
        <BlackpaperHeading>The Compliance Trade</BlackpaperHeading>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, color: o, fontWeight: 700, marginBottom: 20, letterSpacing: -0.5 }}>
          XRP: The Most-Mocked Trade in Crypto
        </div>
        <BlackpaperPara>
          For four years, "XRP Army" was crypto Twitter's running joke. A community of loyalists holding through a
          securities lawsuit that had no end in sight, defending an asset that every credible voice in the industry
          had written off. Coinbase had delisted it. The SEC had sued Ripple. The narrative was not just negative —
          it was contemptuous.
        </BlackpaperPara>
        <BlackpaperPara indent>
          We did not need to believe in XRP. We needed to believe in one specific, boring, structurally predictable thing:
          <em style={{ color: "rgba(255,255,255,0.8)" }}> lawsuits eventually end.</em>
        </BlackpaperPara>
        <BlackpaperPara indent>
          When they do, compliance departments change their minds. Not gradually — in synchronized waves. A bank's legal team
          spends four years writing "do not touch: pending SEC enforcement action." The moment that notation is removed,
          every institution that wrote it updates its policy simultaneously. The capital that was blocked by a single
          legal memo re-enters in a single quarter.
        </BlackpaperPara>
        <BlackpaperQuote color={o}>
          "You did not need to believe in XRP. You needed to believe that compliance departments change their minds when their lawyers tell them to."
        </BlackpaperQuote>
        <BlackpaperPara indent>
          The entry signal arrived on October 2, 2024 — not because of anything XRP had done, but because the SEC's
          case had structurally weakened. The $1.966 million was deployed via limit orders over 4 weeks at an
          average of $0.62. The absurdity of the trade was the point: maximum skepticism was still priced in.
        </BlackpaperPara>
        <BlackpaperPara indent>
          <strong>January 8, 2025: Exit at $3.15</strong> • Duration: 99 days • <strong>Multiple: 5.94x</strong> •
          <strong> Exit Value: $9.44 million</strong>
        </BlackpaperPara>
        <BlackpaperPara indent>
          The narrative arc ran exactly as the framework predicted: compliance reviews (months 1–2), first institutional
          wave (months 2–3), CNBC coverage (months 3–4), late FOMO (months 4–6), consensus plateau. By January 8, 2025,
          the permission structure was fully priced in. The XRP Army finally got what they wanted.
          We were already gone.
        </BlackpaperPara>
      </BlackpaperSection>

      <BlackpaperSection label="PHASE 3" color={y}>
        <BlackpaperHeading>The Inversion Event</BlackpaperHeading>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, color: y, fontWeight: 700, marginBottom: 20, letterSpacing: -0.5 }}>
          Zcash (ZEC): When Bitcoin's Feature Became Its Liability
        </div>
        <BlackpaperPara>
          October 2025. The Department of Justice seizes 127,271 BTC from the founder of a Cambodian crime syndicate.
          Approximately $15 billion. Traced, flagged, and seized — entirely because Bitcoin's ledger is public.
        </BlackpaperPara>
        <BlackpaperPara indent>
          In a single news cycle, a property of Bitcoin that had been presented for fifteen years as a
          <em style={{ color: "rgba(255,255,255,0.8)" }}> feature</em> — its transparency — was re-classified as a
          <em style={{ color: "rgba(255,255,255,0.8)" }}> liability</em>. Bitcoin was not censorship-resistant.
          Bitcoin was surveillance-native. Every transaction was traceable. Every address permanently exposed.
          The seizure was not proof that law enforcement had gotten smarter. It was proof that the ledger had always
          been a cooperation mechanism — governments just hadn't needed to use it at scale until now.
        </BlackpaperPara>
        <BlackpaperPara indent>
          We had been positioned in ZEC since April 9, 2025, at $20 per coin. We were not positioned because we
          predicted that specific DOJ headline. We were positioned because we understood that any sufficiently dramatic
          demonstration of Bitcoin's traceability would trigger a <em style={{ color: "rgba(255,255,255,0.8)" }}>structural repricing of privacy</em>.
          The specific catalyst was unknowable. The category of catalyst was not.
        </BlackpaperPara>
        <BlackpaperPara indent>
          The abandonment that created the entry price was four years deep: Coinbase delisted ZEC in 2021.
          Kraken delisted it in 2023. Institutional capital had formally exited. The price had collapsed 97% from
          its 2021 peak to <BlackpaperDatum value="$20" color={y} />. The ZEC we bought had been declared dead by
          every institution that had the authority to declare such things.
        </BlackpaperPara>
        <BlackpaperPara indent>
          <strong>April 9, 2025: Entry at $20</strong> • $9.44 million deployed via algorithmic limit orders over 3 weeks •
          Average entry price: $24
        </BlackpaperPara>
        <BlackpaperQuote color={y}>
          The DOJ headline did not create the thesis. It confirmed it — loudly, publicly, and in a way that could not be walked back.
        </BlackpaperQuote>
        <BlackpaperPara indent>
          What followed was not speculation. It was the systematic arrival of capital that had nowhere else to go.
          Bitcoin's transparency was now a documented risk. Ethereum's transparency was identical. Every auditable chain
          carried the same exposure. The only assets structurally immune were the ones regulators had spent four years
          trying to kill — which meant their abandonment price was already fully baked in.
        </BlackpaperPara>
        <BlackpaperPara indent>
          <strong>November 12, 2025: W1 Peak at $432</strong> • 18x from average entry in 217 days
        </BlackpaperPara>
        <BlackpaperPara indent>
          <strong>May 19, 2026: Final Exit at $673.46</strong> • 33.67x from spot entry •
          <strong> Total ZEC proceeds: $304.9 million</strong>
        </BlackpaperPara>
      </BlackpaperSection>

      <BlackpaperSection label="PHASE 4" color={y}>
        <BlackpaperHeading>The Discipline Trade</BlackpaperHeading>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, color: y, fontWeight: 700, marginBottom: 20, letterSpacing: -0.5 }}>
          Zcash (ZEC) Wave 2: Completing the Procedure
        </div>
        <BlackpaperPara>
          November 12, 2025. ZEC peaks at $432 intraday. The W1 position is liquidated in full across three OTC desks
          over 48 hours. The portfolio reads north of $130 million from ZEC alone. The trade worked.
        </BlackpaperPara>
        <BlackpaperPara indent>
          The temptation at this moment is structural, not psychological. ZEC is in the news. Privacy coin narratives
          are spreading. Retail is arriving in volume. Every signal in the environment says the move continues —
          and some portion of it probably will. None of that matters. The W1 exit signal is not "the narrative is exhausted."
          It is a date and a price level. The procedure is complete. We close.
        </BlackpaperPara>
        <BlackpaperPara indent>
          But we do not exit entirely. During the W1 accumulation phase, a portion of capital — <BlackpaperDatum value="$40.8M" color={y} /> —
          was withheld from the position and parked in stablecoins. This was not caution. It was architecture.
          The framework anticipates the retracement. The dry powder exists to exploit it.
        </BlackpaperPara>
        <BlackpaperQuote color={y}>
          The doomsday premium exists for exactly one moment in time. On either side of that moment, it evaporates.
          The W2 trade is built on knowing this and preparing for it before W1 has even peaked.
        </BlackpaperQuote>
        <BlackpaperPara indent>
          The capitulation arrives on schedule. By March 2026, ZEC has crashed from $432 to <BlackpaperDatum value="$197.82" color={y} />.
          A 54% drawdown in four months. The news cycle has reversed: privacy coins are "dead again," the DOJ narrative
          has faded, the late retail entrants who bought at $400 are now underwater and selling.
          The order books are thin. The sentiment is identical to April 2025 — which is the point.
        </BlackpaperPara>
        <BlackpaperPara indent>
          <strong>March 7, 2026: Re-entry at $197.82</strong> • $40.8M reserved capital redeploys •
          Same asset, same thesis, lower price, thinner competition
        </BlackpaperPara>
        <BlackpaperPara indent>
          The underlying regulatory pressure has not resolved. The doomsday narrative did not evaporate — it paused.
          Institutions that exited at the W1 peak are now re-evaluating. The second move is slower, shallower, and more
          predictable. Not 18x. But 3.4x on $40.8M in 73 days is not a consolation prize.
        </BlackpaperPara>
        <BlackpaperPara indent>
          <strong>May 19, 2026: Final exit at $673.46</strong> • <strong>W2 multiple: 3.4x</strong> •
          <strong> W2 proceeds: $138.8M</strong>
        </BlackpaperPara>
        <BlackpaperPara indent>
          After May 19, 2026, the ZEC position is fully closed. No extensions. No "one more leg." The framework ended
          when the exit signal fired, not when it felt like it should end. What remains:
          <strong> $304.9M total ZEC proceeds</strong>, plus the Phase 1 and Phase 2 compounded base.
          The post-May trajectory vindicates the exit: ZEC falls to $450 by June, $280 by July, $95 by August.
          The investors who held "waiting for $1,000" capitulate at $280 having watched a nine-figure gain become a loss.
        </BlackpaperPara>
        <BlackpaperQuote color={y}>
          Staying in ZEC past May 2026 was not conviction. It was a failure to understand what the framework was actually trading.
        </BlackpaperQuote>
      </BlackpaperSection>

      <BlackpaperSection label="VII" color="rgba(255,255,255,0.4)">
        <BlackpaperHeading>The Rotational Matrix</BlackpaperHeading>
        <BlackpaperPara>
          Synthesized into its purest form, the strategy spans a 19-month execution window measured from the halving fulcrum.
          Every entry and exit is a temporal coordinate. Every rotation is a deliberate migration of capital from an exhausting
          expansion phase into the next ignition.
        </BlackpaperPara>
        <div style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 8, overflow: "hidden", margin: "24px 0" }}>
          {[
            { phase: "1", asset: "SOL", entry: "Dec 2022", exit: "Mar 2024", mult: "19.66x", capital: "$1.966M", color: g },
            { phase: "2", asset: "XRP", entry: "Oct 2024", exit: "Jan 2025", mult: "5.94x", capital: "$7.631M", color: o },
            { phase: "3", asset: "ZEC W1", entry: "Apr 2025", exit: "Nov 2025", mult: "33.67x", capital: "$232.5M", color: y },
            { phase: "4", asset: "ZEC W2", entry: "Mar 2026", exit: "May 2026", mult: "3.4x", capital: "$660.8M", color: y },
          ].map((row, i) => (
            <div key={i} style={{ display: "grid", gridTemplateColumns: "50px 70px 90px 90px 70px 90px", padding: "12px 16px", borderBottom: i < 3 ? "1px solid rgba(255,255,255,0.04)" : "none", alignItems: "center" }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>P{row.phase}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: row.color, fontWeight: 600 }}>{row.asset}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{row.entry}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>{row.exit}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: row.color }}>{row.mult}</span>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: "rgba(255,255,255,0.5)" }}>{row.capital}</span>
            </div>
          ))}
        </div>
        <BlackpaperPara indent>
          Four phases. 27 months. Three separate acts of institutional abandonment reversed by a single timing structure.
          SOL survived FTX. XRP survived the SEC. ZEC survived the delistings. None of them recovered because they became
          better assets. They recovered because the halving cycle created the conditions for abandoned assets to reprice —
          and because the framework was already positioned before the recovery was obvious.
        </BlackpaperPara>
        <BlackpaperPara indent>
          The rotational sequence is complete. The framework holds.
        </BlackpaperPara>
      </BlackpaperSection>

    </div>
  );
}
