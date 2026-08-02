import { PHASES } from "../data/phases.js";

export function Timeline({ activePhase, setActivePhase }) {
  const months = [];
  for (let m = -18; m <= 22; m++) months.push(m);

  const phaseRanges = [
    { start: -16, end: -1, phase: 0 },
    { start: 2, end: 7, phase: 1 },
    { start: 9, end: 19, phase: 2 },
  ];

  return (
    <div style={{ margin: "30px 0 10px", position: "relative" }}>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1, marginBottom: 12 }}>
        HALVING-RELATIVE TIMELINE (MONTHS)
      </div>
      <div style={{ position: "relative", height: 70, marginTop: 8 }}>
        <div style={{ position: "absolute", top: 30, left: 0, right: 0, height: 1, background: "rgba(255,255,255,0.08)" }} />
        <div
          style={{
            position: "absolute",
            left: `${((0 + 18) / 40) * 100}%`,
            top: 0,
            transform: "translateX(-50%)",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              color: "#fff",
              background: "rgba(255,255,255,0.12)",
              padding: "2px 6px",
              borderRadius: 3,
              whiteSpace: "nowrap",
            }}
          >
            HALVING
          </div>
          <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.3)" }} />
          <div style={{ width: 8, height: 8, borderRadius: "50%", background: "#fff", boxShadow: "0 0 10px #fff" }} />
          <div style={{ width: 1, height: 14, background: "rgba(255,255,255,0.3)" }} />
        </div>
        {phaseRanges.map((r, i) => {
          const leftPct = ((r.start + 18) / 40) * 100;
          const widthPct = ((r.end - r.start) / 40) * 100;
          const p = PHASES[r.phase];
          return (
            <div
              key={i}
              role="button"
              tabIndex={0}
              aria-label={`Phase ${r.phase + 1} — ${PHASES[r.phase].asset}`}
              onClick={() => setActivePhase(r.phase)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActivePhase(r.phase); } }}
              style={{
                position: "absolute",
                top: 24,
                left: `${leftPct}%`,
                width: `${widthPct}%`,
                height: 12,
                background: activePhase === r.phase ? `${p.color}35` : `${p.color}15`,
                borderRadius: 3,
                cursor: "pointer",
                border: activePhase === r.phase ? `1px solid ${p.color}60` : `1px solid ${p.color}20`,
                transition: "all 0.3s ease",
              }}
            />
          );
        })}
        {PHASES.map((p, i) => {
          const peakMonth = p.monthsFromHalving;
          const leftPct = ((peakMonth + 18) / 40) * 100;
          return (
            <div
              key={i}
              style={{
                position: "absolute",
                top: 18,
                left: `${leftPct}%`,
                transform: "translateX(-50%)",
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
              }}
            >
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: p.color, boxShadow: `0 0 8px ${p.color}` }} />
              <div
                style={{
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 8,
                  color: p.color,
                  marginTop: 18,
                  whiteSpace: "nowrap",
                }}
              >
                {p.asset}
              </div>
            </div>
          );
        })}
        {[-18, -12, -6, 0, 6, 12, 18].map((m) => (
          <div
            key={m}
            style={{
              position: "absolute",
              top: 44,
              left: `${((m + 18) / 40) * 100}%`,
              transform: "translateX(-50%)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              color: m === 0 ? "#fff" : "rgba(255,255,255,0.25)",
            }}
          >
            {m > 0 ? `+${m}` : m}
          </div>
        ))}
      </div>
    </div>
  );
}
