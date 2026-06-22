import { useState, useEffect, useRef, useCallback } from "react";
import { useMarketData } from "./hooks/useMarketData.js";

function GalaxyBackground() {
  const canvasRef = useRef(null);

  const draw = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const W = canvas.width;
    const H = canvas.height;

    ctx.clearRect(0, 0, W, H);

    // Deep space base
    ctx.fillStyle = "#0A0B0F";
    ctx.fillRect(0, 0, W, H);

    // Nebula clouds
    const nebulae = [
      { x: W * 0.2, y: H * 0.3, r: W * 0.35, color: "rgba(157,78,221,0.028)" },
      { x: W * 0.75, y: H * 0.55, r: W * 0.3, color: "rgba(100,80,255,0.032)" },
      { x: W * 0.5, y: H * 0.15, r: W * 0.25, color: "rgba(35,240,198,0.022)" },
      { x: W * 0.85, y: H * 0.2, r: W * 0.2, color: "rgba(0,180,255,0.02)" },
    ];
    nebulae.forEach(({ x, y, r, color }) => {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r);
      g.addColorStop(0, color);
      g.addColorStop(1, "transparent");
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, W, H);
    });

    // Stars
    const rng = (seed) => {
      let s = seed;
      return () => { s = (s * 16807 + 0) % 2147483647; return (s - 1) / 2147483646; };
    };
    const rand = rng(42);
    const starCount = Math.floor((W * H) / 2800);

    for (let i = 0; i < starCount; i++) {
      const x = rand() * W;
      const y = rand() * H;
      const size = rand() * rand() * 1.8 + 0.2;
      const brightness = rand() * 0.7 + 0.3;
      const hue = rand() < 0.15 ? (rand() < 0.5 ? "180,255,255" : "255,200,150") : "255,255,255";
      ctx.beginPath();
      ctx.arc(x, y, size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${hue},${brightness})`;
      ctx.fill();

      // Occasional soft glow on brighter stars
      if (size > 1.2) {
        const glow = ctx.createRadialGradient(x, y, 0, x, y, size * 4);
        glow.addColorStop(0, `rgba(${hue},${brightness * 0.3})`);
        glow.addColorStop(1, "transparent");
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(x, y, size * 4, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = document.documentElement.scrollHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      draw();
    };
    resize();
    window.addEventListener("resize", resize);
    return () => window.removeEventListener("resize", resize);
  }, [draw]);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 0 }}
    />
  );
}

function ShootingStars() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const starsRef = useRef([]);
  const rafRef = useRef(null);
  const lastSpawnRef = useRef(0);
  const nextSpawnDelayRef = useRef(30000);
  const MAX_STARS = 3;

  function spawnStar(W, H) {
    const edge = Math.floor(Math.random() * 4);
    let x, y;
    if      (edge === 0) { x = Math.random() * W; y = 0; }
    else if (edge === 1) { x = W;                 y = Math.random() * H; }
    else if (edge === 2) { x = Math.random() * W; y = H; }
    else                 { x = 0;                 y = Math.random() * H; }

    const baseAngles = [Math.PI / 2, Math.PI, Math.PI * 3 / 2, 0];
    const angle = baseAngles[edge] + (Math.random() - 0.5) * (Math.PI * 5 / 9);
    const speed = 6 + Math.random() * 8;

    return {
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      age: 0,
      lifetime: 60 + Math.floor(Math.random() * 60),
      tailLen: 80 + Math.random() * 120,
      hue: Math.random() * 60 - 30,
    };
  }

  function drawStar(ctx, star) {
    const progress = star.age / star.lifetime;
    const alpha = 1 - progress;
    const speed = Math.hypot(star.vx, star.vy);
    const tdx = -star.vx / speed;
    const tdy = -star.vy / speed;
    const tx = star.x + tdx * star.tailLen;
    const ty = star.y + tdy * star.tailLen;

    const h = 200 + star.hue;
    const grad = ctx.createLinearGradient(star.x, star.y, tx, ty);
    grad.addColorStop(0,   `hsla(${h},80%,95%,${alpha})`);
    grad.addColorStop(0.3, `hsla(${h},60%,85%,${alpha * 0.4})`);
    grad.addColorStop(1,   `hsla(${h},40%,75%,0)`);

    ctx.save();
    ctx.strokeStyle = grad;
    ctx.lineWidth = 1.5;
    ctx.lineCap = "round";
    ctx.beginPath();
    ctx.moveTo(star.x, star.y);
    ctx.lineTo(tx, ty);
    ctx.stroke();

    const gr = 3 + (1 - progress) * 3;
    const glow = ctx.createRadialGradient(star.x, star.y, 0, star.x, star.y, gr * 4);
    glow.addColorStop(0,   `hsla(${h},90%,100%,${alpha})`);
    glow.addColorStop(0.4, `hsla(${h},80%,95%,${alpha * 0.5})`);
    glow.addColorStop(1,   `hsla(${h},70%,90%,0)`);
    ctx.fillStyle = glow;
    ctx.beginPath();
    ctx.arc(star.x, star.y, gr * 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctxRef.current = canvas.getContext("2d");

    const sizeRef = { w: 0, h: 0 };
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      sizeRef.w = w;
      sizeRef.h = h;
      ctxRef.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = (timestamp) => {
      const ctx = ctxRef.current;
      ctx.clearRect(0, 0, sizeRef.w, sizeRef.h);

      if (timestamp - lastSpawnRef.current >= nextSpawnDelayRef.current) {
        if (starsRef.current.length < MAX_STARS) {
          starsRef.current.push(spawnStar(sizeRef.w, sizeRef.h));
        }
        lastSpawnRef.current = timestamp;
        nextSpawnDelayRef.current = 30000;
      }

      starsRef.current = starsRef.current.filter((star) => {
        star.age += 1;
        star.x   += star.vx;
        star.y   += star.vy;
        if (star.age >= star.lifetime) return false;
        drawStar(ctx, star);
        return true;
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
    />
  );
}

function AlienSaucer() {
  const canvasRef = useRef(null);
  const ctxRef = useRef(null);
  const saucerRef = useRef(null);
  const rafRef = useRef(null);
  const lastSpawnRef = useRef(0);
  const nextSpawnDelayRef = useRef(60000);

  function spawnSaucer(W, H) {
    const edge = Math.floor(Math.random() * 4);
    let startX, startY;
    if      (edge === 0) { startX = Math.random() * W; startY = -80; }
    else if (edge === 1) { startX = W + 80;             startY = Math.random() * H; }
    else if (edge === 2) { startX = Math.random() * W; startY = H + 80; }
    else                 { startX = -80;                startY = Math.random() * H; }

    const targetX = W * 0.3 + Math.random() * W * 0.4;
    const targetY = H * 0.25 + Math.random() * H * 0.35;

    const dx = targetX - startX;
    const dy = targetY - startY;
    const baseDepart = Math.atan2(dy, dx) + Math.PI;
    const departAngle = baseDepart + (Math.random() - 0.5) * (Math.PI * 0.8);

    return {
      x: startX, y: startY,
      startX, startY,
      targetX, targetY,
      phase: "entering",
      enterAge: 0,
      enterDuration: 90,
      hoverAge: 0,
      hoverDuration: 480,
      departAngle,
      departSpeed: 0,
    };
  }

  function drawSaucer(ctx, s) {
    let drawX = s.x;
    let drawY = s.y;
    let alpha = 1;

    if (s.phase === "entering") {
      alpha = Math.min(1, s.enterAge / s.enterDuration);
    } else if (s.phase === "hovering") {
      drawY += Math.sin(s.hoverAge * 0.05) * 6;
      alpha = 1;
    } else {
      alpha = Math.max(0, 1 - s.departSpeed / 60);
    }

    ctx.save();
    ctx.globalAlpha = alpha;

    // Glow aura
    const aura = ctx.createRadialGradient(drawX, drawY, 0, drawX, drawY, 70);
    aura.addColorStop(0, "rgba(100,255,150,0.15)");
    aura.addColorStop(1, "rgba(100,255,150,0)");
    ctx.fillStyle = aura;
    ctx.beginPath();
    ctx.arc(drawX, drawY, 70, 0, Math.PI * 2);
    ctx.fill();

    // Tractor beam (hover phase only)
    if (s.phase === "hovering") {
      const beamGrad = ctx.createLinearGradient(drawX, drawY + 8, drawX, drawY + 70);
      beamGrad.addColorStop(0, "rgba(100,255,150,0.18)");
      beamGrad.addColorStop(1, "rgba(100,255,150,0)");
      ctx.fillStyle = beamGrad;
      ctx.beginPath();
      ctx.moveTo(drawX - 15, drawY + 8);
      ctx.lineTo(drawX + 15, drawY + 8);
      ctx.lineTo(drawX + 38, drawY + 70);
      ctx.lineTo(drawX - 38, drawY + 70);
      ctx.closePath();
      ctx.fill();
    }

    // Body disc
    const bodyGrad = ctx.createRadialGradient(drawX - 10, drawY - 4, 2, drawX, drawY, 50);
    bodyGrad.addColorStop(0, "#d8ead8");
    bodyGrad.addColorStop(0.6, "#9ab89a");
    bodyGrad.addColorStop(1, "#5a7a5a");
    ctx.fillStyle = bodyGrad;
    ctx.beginPath();
    ctx.ellipse(drawX, drawY, 48, 13, 0, 0, Math.PI * 2);
    ctx.fill();

    // Rim highlight
    ctx.strokeStyle = "rgba(180,255,200,0.5)";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.ellipse(drawX, drawY, 48, 13, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Dome
    const domeGrad = ctx.createRadialGradient(drawX - 6, drawY - 16, 1, drawX, drawY - 10, 22);
    domeGrad.addColorStop(0, "rgba(200,240,255,0.85)");
    domeGrad.addColorStop(0.5, "rgba(120,200,255,0.55)");
    domeGrad.addColorStop(1, "rgba(60,130,200,0.25)");
    ctx.fillStyle = domeGrad;
    ctx.beginPath();
    ctx.ellipse(drawX, drawY - 10, 20, 14, 0, Math.PI, 0);
    ctx.closePath();
    ctx.fill();

    // Rim lights
    const lightColors = ["#00ff88", "#00ddff", "#4488ff", "#ffffff", "#00ff88", "#00ddff", "#88ffcc"];
    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const lx = drawX + Math.cos(angle) * 38;
      const ly = drawY + Math.sin(angle) * 10;
      const blink = Math.sin(s.hoverAge * 0.15 + i * 0.9) > 0.2;
      const lightAlpha = s.phase === "hovering" ? (blink ? 1 : 0.3) : 0.7;
      const color = lightColors[i];
      ctx.globalAlpha = alpha * lightAlpha;
      const lg = ctx.createRadialGradient(lx, ly, 0, lx, ly, 5);
      lg.addColorStop(0, color);
      lg.addColorStop(1, "transparent");
      ctx.fillStyle = lg;
      ctx.beginPath();
      ctx.arc(lx, ly, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.globalAlpha = alpha * lightAlpha * 0.9;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(lx, ly, 2.5, 0, Math.PI * 2);
      ctx.fill();
    }

    // Departure streak
    if (s.phase === "departing" && s.departSpeed > 4) {
      ctx.globalAlpha = alpha * 0.7;
      const streakLen = s.departSpeed * 4;
      const tx = drawX - Math.cos(s.departAngle) * streakLen;
      const ty = drawY - Math.sin(s.departAngle) * streakLen;
      const sg = ctx.createLinearGradient(drawX, drawY, tx, ty);
      sg.addColorStop(0, `rgba(150,255,180,${alpha})`);
      sg.addColorStop(0.4, `rgba(100,220,150,${alpha * 0.3})`);
      sg.addColorStop(1, "rgba(100,220,150,0)");
      ctx.strokeStyle = sg;
      ctx.lineWidth = 2;
      ctx.lineCap = "round";
      ctx.beginPath();
      ctx.moveTo(drawX, drawY);
      ctx.lineTo(tx, ty);
      ctx.stroke();
    }

    ctx.restore();
  }

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    ctxRef.current = canvas.getContext("2d");

    const sizeRef = { w: 0, h: 0 };
    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      const w = window.innerWidth;
      const h = window.innerHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      sizeRef.w = w;
      sizeRef.h = h;
      ctxRef.current.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    const tick = (timestamp) => {
      const ctx = ctxRef.current;
      ctx.clearRect(0, 0, sizeRef.w, sizeRef.h);

      // Spawn
      if (!saucerRef.current && timestamp - lastSpawnRef.current >= nextSpawnDelayRef.current) {
        saucerRef.current = spawnSaucer(sizeRef.w, sizeRef.h);
        lastSpawnRef.current = timestamp;
      }

      const s = saucerRef.current;
      if (s) {
        if (s.phase === "entering") {
          s.enterAge += 1;
          const progress = s.enterAge / s.enterDuration;
          const t = 1 - Math.pow(1 - Math.min(progress, 1), 3);
          s.x = s.startX + (s.targetX - s.startX) * t;
          s.y = s.startY + (s.targetY - s.startY) * t;
          if (s.enterAge >= s.enterDuration) {
            s.x = s.targetX;
            s.y = s.targetY;
            s.phase = "hovering";
          }
        } else if (s.phase === "hovering") {
          s.hoverAge += 1;
          if (s.hoverAge >= s.hoverDuration) s.phase = "departing";
        } else {
          s.departSpeed = s.departSpeed === 0 ? 3 : s.departSpeed * 1.12;
          s.x += Math.cos(s.departAngle) * s.departSpeed;
          s.y += Math.sin(s.departAngle) * s.departSpeed;
          const W = sizeRef.w, H = sizeRef.h;
          if (s.x < -200 || s.x > W + 200 || s.y < -200 || s.y > H + 200) {
            saucerRef.current = null;
            nextSpawnDelayRef.current = 45000 + Math.random() * 30000;
          }
        }
        if (saucerRef.current) drawSaucer(ctx, s);
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("resize", resize);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{ position: "fixed", top: 0, left: 0, width: "100%", height: "100%", pointerEvents: "none", zIndex: 1 }}
    />
  );
}

const PHASES = [
  {
    id: 1,
    asset: "SOL",
    name: "Solana",
    role: "Speculative Vanguard",
    color: "#9D4EDD",
    colorDim: "rgba(157,78,221,0.12)",
    entryDate: "Dec 22, 2022",
    exitDate: "Mar 18, 2024",
    entryPrice: "$9.88",
    exitPrice: "$194.31",
    multiple: "19.66x",
    biaPrice: "$73.64",
    capitalIn: 100000,
    capitalOut: 1966000,
    halvingDistance: "16 months before",
    monthsFromHalving: -16,
    entryMonths: "-16 to -1",
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
    name: "Ripple",
    role: "Institutional Settlement Bridge",
    color: "#23F0C6",
    colorDim: "rgba(35,240,198,0.12)",
    entryDate: "Oct 2, 2024",
    exitDate: "Jan 8, 2025",
    entryPrice: "$0.5241",
    exitPrice: "$3.14",
    multiple: "6.0x",
    capitalIn: 1966000,
    capitalOut: 9437000,
    halvingDistance: "+6 months",
    monthsFromHalving: 6,
    entryMonths: "+4 to +7",
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
    name: "Zcash Wave 1",
    role: "Privacy Detonation",
    color: "#F4B728",
    colorDim: "rgba(244,183,40,0.12)",
    entryDate: "Apr 9, 2025",
    exitDate: "Nov 12, 2025",
    entryPrice: "$20",
    exitPrice: "$674",
    multiple: "33.67x",
    capitalIn: 9437000,
    capitalOut: 304900000,
    halvingDistance: "+7 months",
    monthsFromHalving: 7,
    entryMonths: "+9 to +19",
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
    name: "Zcash Wave 2",
    role: "Discipline Trade",
    color: "#F4B728",
    colorDim: "rgba(244,183,40,0.12)",
    entryDate: "Mar 7, 2026",
    exitDate: "May 19, 2026",
    entryPrice: "$197.82",
    exitPrice: "$673.46",
    multiple: "3.4x",
    capitalIn: 40839000,
    capitalOut: 138852000,
    halvingDistance: "+13 months",
    monthsFromHalving: 13,
    entryMonths: "+23 to +25",
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

const HALVINGS = [
  { date: "Nov 2012", reward: "50 → 25 BTC" },
  { date: "Jul 2016", reward: "25 → 12.5 BTC" },
  { date: "May 2020", reward: "12.5 → 6.25 BTC" },
  { date: "Apr 2024", reward: "6.25 → 3.125 BTC" },
  { date: "~Apr 2028", reward: "3.125 → 1.5625 BTC" },
];

const PREDICTIONS_2028 = [
  { phase: 1, asset: "SOL", action: "Entry Window", timing: "Sep 2026 – Aug 2027", note: "Bear market accumulation. SOL RSI < 40, BTC dominance > 58%." },
  { phase: 1, asset: "SOL", action: "Exit → XRP Entry", timing: "Mar 2028", note: "Month -1: Front-run 2028 halving. SOL euphoria peaks." },
  { phase: 2, asset: "XRP", action: "Institutional Rotation", timing: "Mar 2028 – Nov 2028", note: "Month 0–7: Regulatory clarity → FOMO. XRP RSI peak ~80." },
  { phase: 2, asset: "XRP", action: "Exit → ZEC Entry", timing: "Nov 2028", note: "Month +7: Institutional premium exhaustion. Deploy to privacy." },
  { phase: 3, asset: "ZEC (W1)", action: "Terminal Blow-Off", timing: "Nov 2028 – Nov 2029", note: "Month +7 to +19: Doomsday premium explodes. Exit all to fiat." },
  { phase: 4, asset: "ZEC (W2)", action: "Re-entry (Discipline)", timing: "Mar 2030", note: "Month +23: 71% retracement. Buy capitulation with dry powder." },
  { phase: 4, asset: "ZEC (W2)", action: "Final Exit to Fiat", timing: "May 2030", note: "Month +25: ZEC re-tests prior highs. Complete cycle, preserve capital." },
];

// ── SIGNALS data ──────────────────────────────────────────────────────────────

const SIGNAL_GRID = [
  {
    phase: 1,
    asset: "SOL",
    color: "#9D4EDD",
    entryWindow: "Sep 2026 – Aug 2027",
    historicalPrecedent: "2022–2024 precedent: SOL entered at $9.88 post-FTX collapse (Dec 2022), peaked at $194.31 pre-halving (Mar 2024), confirming the speculative vanguard front-run thesis. 19.66x return from maximum despair.",
    signals: [
      { id: "S1-1", threshold: "BTC.D < 57.5%", action: "CONFIRM XRP ENTRY", status: "ARMED" },
      { id: "S1-2", threshold: "SOL RSI > 78 weekly", action: "REDUCE 50% POSITION", status: "ARMED" },
      { id: "S1-3", threshold: "Pre-halving narrative peak", action: "EXIT REMAINING SOL", status: "ARMED" },
    ],
  },
  {
    phase: 2,
    asset: "XRP",
    color: "#23F0C6",
    entryWindow: "Mar 2028",
    historicalPrecedent: "In 2024 XRP peaked at $3.40 before retracing 60% — positions held too long surrendered the institutional settlement premium.",
    signals: [
      { id: "S2-1", threshold: "XRP RSI > 80 weekly", action: "BEGIN XRP EXIT", status: "ARMED" },
      { id: "S2-2", threshold: "BTC 30-day momentum stalls", action: "ACCELERATE EXIT", status: "ARMED" },
      { id: "S2-3", threshold: "ZEC/BTC ratio breaks up", action: "CONFIRM ZEC ENTRY", status: "ARMED" },
    ],
  },
  {
    phase: 3,
    asset: "ZEC (W1)",
    color: "#F4B728",
    entryWindow: "Nov 2028 – Nov 2029",
    historicalPrecedent: "Early 2025: ZEC entered at $20. Nov 12, 2025: peaked at $674 (33.7x). Pattern repeats — vertical blow-off = terminal peak.",
    signals: [
      { id: "S3-1", threshold: "ZEC 7-day gain > 150%", action: "EXIT 50% IMMEDIATELY", status: "ARMED" },
      { id: "S3-2", threshold: "Mainstream media coverage", action: "EXIT REMAINING ZEC", status: "ARMED" },
      { id: "S3-3", threshold: "Reserve capital for W2", action: "HOLD 20–30% CASH", status: "ARMED" },
    ],
  },
  {
    phase: 4,
    asset: "ZEC (W2)",
    color: "#F4B728",
    entryWindow: "Mar 2026 – May 2026",
    historicalPrecedent: "Mar 7, 2026: ZEC retraced 71% to $197.82 (from $674 peak). Mar–May 2026 second leg: $197.82 → $673.46 (3.4x). Discipline = profit.",
    signals: [
      { id: "S4-1", threshold: "Retracement to 70%+ loss", action: "DEPLOY RESERVED CAPITAL", status: "ARMED" },
      { id: "S4-2", threshold: "Capitulation sentiment + volume spike", action: "ADD TO POSITION", status: "ARMED" },
      { id: "S4-3", threshold: "Prior highs approached", action: "EXIT 100% TO FIAT", status: "ARMED" },
    ],
  },
];

const KEY_THRESHOLDS = [
  { signal: "BTC Dominance Break", asset: "SOL → XRP", threshold: "BTC.D < 57.5%", action: "Rotate to XRP", window: "Month −2 to +3" },
  { signal: "Pre-Halving Saturation", asset: "SOL", threshold: "SOL RSI > 78 weekly + retail euphoria", action: "Exit SOL entirely", window: "Month −1 to 0" },
  { signal: "XRP RSI Extreme", asset: "XRP", threshold: "XRP RSI > 80 weekly", action: "Begin XRP exit", window: "Month +6 to +9" },
  { signal: "BTC Momentum Stall", asset: "XRP", threshold: "30-day price momentum < 0", action: "Accelerate XRP exit", window: "Month +7 to +10" },
  { signal: "ZEC Blow-Off Top (W1)", asset: "ZEC → Fiat", threshold: "7-day gain > 150%", action: "Exit 50% immediately", window: "Month +17 to +19" },
  { signal: "Terminal Media Spike (W1)", asset: "ZEC (W1)", threshold: "Mainstream coverage + euphoria", action: "Exit remaining ZEC, reserve cash for W2", window: "Month +19 to +21" },
  { signal: "Capitulation Retracement (W2)", asset: "ZEC (W2)", threshold: "70%+ loss from peak ($674 → $197)", action: "Deploy reserved capital", window: "Month +23 to +24" },
  { signal: "W2 Peak Approach", asset: "ZEC (W2) → Fiat", threshold: "Price approaches prior highs ($673)", action: "Exit 100% to fiat", window: "Month +25" },
];

const PSY_RISKS = [
  {
    title: "FOMO Risk",
    description: "Watching ZEC reach 50x while still holding SOL induces premature rotation. The signal grid exists precisely to counter this. Each phase has an irreversible exit trigger — honor it regardless of apparent upside remaining.",
  },
  {
    title: "Premature Rotation Risk",
    description: "Rotating from SOL to XRP before BTC.D crosses 57.5% means abandoning a live expansion for an unconfirmed one. Confirmation criteria are not suggestions — they are the mechanism separating disciplined execution from speculative guessing.",
  },
];

// ── CYCLES data ───────────────────────────────────────────────────────────────

const CYCLE_DATA = [
  { year: "2012", halvingPrice: "$12", peakPrice: "$1,160", multiple: "96x", multipleNum: 96, monthsToPeak: 12, leadAltcoin: "LTC", altcoinMultiple: "54x", m2Event: "Post-QE3 liquidity expansion" },
  { year: "2016", halvingPrice: "$650", peakPrice: "$19,800", multiple: "30x", multipleNum: 30, monthsToPeak: 17, leadAltcoin: "ETH", altcoinMultiple: "84x", m2Event: "Global M2 +5.4% YoY" },
  { year: "2020", halvingPrice: "$8,600", peakPrice: "$67,500", multiple: "7.85x", multipleNum: 7.85, monthsToPeak: 18, leadAltcoin: "SOL", altcoinMultiple: "140x", m2Event: "COVID fiscal stimulus, M2 +26%" },
  { year: "2024", halvingPrice: "$63,800", peakPrice: "~$120,000", multiple: "~5x", multipleNum: 5, monthsToPeak: 19, leadAltcoin: "ZEC", altcoinMultiple: "~33x", m2Event: "Post-rate-cut M2 expansion" },
];

const ALTCOIN_WINDOWS = [
  { year: "2012", start: 8,  end: 12, label: "LTC +54x",       color: "#9D4EDD" },
  { year: "2016", start: 10, end: 17, label: "ETH +84x",       color: "#23F0C6" },
  { year: "2020", start: 12, end: 18, label: "SOL +140x",      color: "#F4B728" },
  { year: "2024", start: 17, end: 19, label: "ZEC ~33x (proj.)", color: "#6450FF" },
];

// ── EXECUTION data ────────────────────────────────────────────────────────────

const PRE_ENTRY_CHECKLIST = [
  { item: "Exchange Tier 3 Verification", detail: "Complete KYC/AML for institutional-level withdrawal limits ($500K+/day). Use Coinbase Advanced, Kraken Pro, or Binance Institutional. Required for ZEC OTC desk access." },
  { item: "Hardware Wallet Setup", detail: "Ledger or Trezor configured with a fresh seed phrase. Test a small withdrawal before transferring phase capital. Never store the seed digitally." },
  { item: "Position Size Decision", detail: "Determine Conservative / Moderate / Aggressive tier allocation before touching the market. Pre-commit in writing. Do not adjust mid-phase." },
  { item: "Exit Pre-Commitment", detail: "Write down exact exit thresholds for each phase on paper. Sign and date. This physical record prevents in-the-moment deviation when prices are euphoric." },
  { item: "Tax Basis Tracking Active", detail: "Configure CoinTracker or Koinly with exchange API keys before the first trade. Every entry must be logged immediately — retroactive reconstruction is costly and inaccurate." },
];

const PHASE_PROTOCOLS = [
  {
    asset: "SOL",
    color: "#9D4EDD",
    colorDim: "rgba(157,78,221,0.12)",
    venue: "Coinbase Advanced / Kraken Pro",
    entryMethod: "DCA over 4–8 weeks",
    positionType: "Spot only",
    custody: "Self-custody (Phantom wallet or Ledger)",
    slippageRisk: "LOW",
    slippageBps: "< 50 bps",
    exitTrigger: "Pre-halving RSI > 78 or BTC.D < 57.5%",
  },
  {
    asset: "XRP",
    color: "#23F0C6",
    colorDim: "rgba(35,240,198,0.12)",
    venue: "Interactive Brokers / Fidelity",
    entryMethod: "Single entry at confirmed breakout",
    positionType: "Equity — common shares",
    custody: "Brokerage account",
    slippageRisk: "LOW",
    slippageBps: "< 30 bps (NYSE listed)",
    exitTrigger: "XRP RSI > 80 or BTC momentum stall",
  },
  {
    asset: "ZEC",
    color: "#F4B728",
    colorDim: "rgba(244,183,40,0.12)",
    venue: "Kraken / OTC desk (large orders)",
    entryMethod: "Limit orders only, 3–5 tranches",
    positionType: "Spot only",
    custody: "Zcash native wallet (shielded)",
    slippageRisk: "HIGH",
    slippageBps: "150–400 bps on orders > $100K",
    exitTrigger: "7-day gain > 150% or media saturation",
  },
];

const POSITION_SIZING = [
  { tier: "Conservative", solPct: "20%", xrpPct: "60%", zecPct: "20%", note: "Preserves most capital; reduced ZEC exposure", isDefault: false },
  { tier: "Moderate",     solPct: "33%", xrpPct: "33%", zecPct: "34%", note: "Balanced phase rotation — recommended default", isDefault: true },
  { tier: "Aggressive",   solPct: "40%", xrpPct: "25%", zecPct: "35%", note: "Maximum ZEC exposure; highest theoretical return", isDefault: false },
];

const EXECUTION_STEPS = [
  { step: 1, title: "Check Spread", detail: "Before any order, verify bid/ask spread is < 0.5% for SOL/XRP, < 2% for ZEC. Wide spreads signal thin liquidity — delay entry or use OTC." },
  { step: 2, title: "Tranche Entry", detail: "Never deploy full position in one order. Split into 3–5 equal tranches deployed over 24–72 hours. Reduces timing risk and average entry price." },
  { step: 3, title: "Limit Orders Only", detail: "Market orders on illiquid assets (especially ZEC) result in catastrophic slippage. Always place limit orders at or slightly above the current ask for entries." },
  { step: 4, title: "OTC Desk for Large ZEC", detail: "Orders above $500K in ZEC must go through an OTC desk (Cumberland, Genesis Trading, or Kraken OTC). Direct market impact would move the price against you." },
  { step: 5, title: "Transfer to Self-Custody", detail: "Within 24 hours of any acquisition, transfer to a hardware wallet. Exchange insolvency risk is real. ZEC transfers to shielded addresses only." },
  { step: 6, title: "Log Basis Immediately", detail: "Record exact entry price, quantity, timestamp, and exchange within 1 hour of each trade. Cost basis disputes are impossible to resolve retroactively from memory." },
];

const EXECUTION_FAILURES = [
  { title: '"I\'ll buy more when it dips"', description: "DCA entry exists precisely because the dip often never comes. In parabolic phases, waiting for a 10% retracement means missing 300% gains. Tranching is the discipline — execute the plan." },
  { title: "Market Orders on ZEC", description: "A $1M market order on ZEC in a thin order book will consume every ask from $20 to $45 before filling. The slippage alone can exceed 30%. This is not hypothetical — it is arithmetic." },
  { title: "Holding XRP into Phase 3", description: "XRP's momentum-driven beta amplifies downside as violently as upside. When ZEC begins its terminal spike, XRP is simultaneously beginning a drawdown. Every day of delay costs compounded capital." },
];

function formatCurrency(n) {
  if (n >= 1e9) return "$" + (n / 1e9).toFixed(2) + "B";
  if (n >= 1e6) return "$" + (n / 1e6).toFixed(2) + "M";
  if (n >= 1e3) return "$" + (n / 1e3).toFixed(0) + "K";
  return "$" + n.toFixed(0);
}

function GlowDot({ color, size = 8 }) {
  return (
    <span
      style={{
        display: "inline-block",
        width: size,
        height: size,
        borderRadius: "50%",
        background: color,
        boxShadow: `0 0 ${size}px ${color}, 0 0 ${size * 2}px ${color}40`,
      }}
    />
  );
}

function PhaseCard({ phase, isActive, onClick, currentPrice }) {
  return (
    <div
      role="button"
      tabIndex={0}
      aria-pressed={isActive}
      onClick={onClick}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); onClick(); } }}
      style={{
        flex: 1,
        minWidth: 220,
        padding: "20px 18px",
        borderRadius: 10,
        cursor: "pointer",
        background: isActive ? phase.colorDim : "rgba(255,255,255,0.03)",
        border: isActive ? `1.5px solid ${phase.color}50` : "1.5px solid rgba(255,255,255,0.06)",
        transition: "all 0.3s ease",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {isActive && (
        <div
          style={{
            position: "absolute",
            top: 0,
            left: 0,
            right: 0,
            height: 2,
            background: `linear-gradient(90deg, transparent, ${phase.color}, transparent)`,
          }}
        />
      )}
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <GlowDot color={phase.color} />
        <span
          style={{
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 11,
            color: phase.color,
            letterSpacing: 2,
            textTransform: "uppercase",
          }}
        >
          Phase {phase.id}
        </span>
      </div>
      <div
        style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 28,
          fontWeight: 700,
          color: "#fff",
          lineHeight: 1.1,
        }}
      >
        {phase.asset}
      </div>
      <div
        style={{
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 12,
          color: "rgba(255,255,255,0.5)",
          marginTop: 4,
        }}
      >
        {phase.role}
      </div>
      <div style={{ marginTop: 14, display: "flex", justifyContent: "space-between", alignItems: "baseline" }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 22, color: phase.color, fontWeight: 600 }}>
          {phase.multiple}
        </span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>
          {phase.entryDate} → {phase.exitDate}
        </span>
      </div>
      {phase.biaPrice && (
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 1.2 }}>
            BIA
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: phase.color, fontWeight: 600 }}>
            {phase.biaPrice}
          </span>
        </div>
      )}
      {currentPrice != null && (
        <div style={{ marginTop: 8, display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 1.2 }}>
            NOW
          </span>
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 14, color: phase.color, fontWeight: 600 }}>
            ${currentPrice.toLocaleString("en-US", { maximumFractionDigits: 2 })}
          </span>
        </div>
      )}
    </div>
  );
}

function CapitalFlowBar({ phases }) {
  const total = phases[phases.length - 1].capitalOut;
  const maxLog = Math.log10(total);
  const minLog = Math.log10(phases[0].capitalIn);
  const logRange = maxLog - minLog;

  return (
    <div style={{ marginTop: 30 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 6, marginBottom: 14 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1 }}>
          CAPITAL GROWTH TRAJECTORY
        </span>
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {phases.map((p, i) => {
          const barIn = ((Math.log10(p.capitalIn) - minLog) / logRange) * 100;
          const barOut = ((Math.log10(p.capitalOut) - minLog) / logRange) * 100;
          return (
            <div key={i} style={{ display: "flex", alignItems: "center", gap: 10 }}>
              <div
                style={{
                  width: 44,
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 11,
                  color: p.color,
                  fontWeight: 600,
                  textAlign: "right",
                  flexShrink: 0,
                }}
              >
                {p.asset}
              </div>
              <div
                style={{
                  flex: 1,
                  height: 28,
                  position: "relative",
                  background: "rgba(255,255,255,0.03)",
                  borderRadius: 4,
                  border: "1px solid rgba(255,255,255,0.05)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    left: `${barIn}%`,
                    width: `${barOut - barIn}%`,
                    top: 0,
                    bottom: 0,
                    background: `linear-gradient(90deg, ${p.color}20, ${p.color}40)`,
                    borderRight: `2px solid ${p.color}`,
                    transition: "all 0.5s ease",
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: `${Math.min(barOut + 1, 70)}%`,
                    display: "flex",
                    alignItems: "center",
                    gap: 6,
                    paddingLeft: 6,
                  }}
                >
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>
                    {formatCurrency(p.capitalIn)}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: p.color, whiteSpace: "nowrap" }}>→</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: p.color, fontWeight: 600, whiteSpace: "nowrap" }}>
                    {formatCurrency(p.capitalOut)}
                  </span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.25)", whiteSpace: "nowrap" }}>
                    ({p.multiple})
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      <div style={{ display: "flex", justifyContent: "space-between", marginTop: 8 }}>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.2)" }}>log scale</span>
        <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "#F4B728" }}>
          Total: {formatCurrency(total)}
        </span>
      </div>
    </div>
  );
}

function Timeline({ activePhase, setActivePhase }) {
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

function PhaseDetail({ phase }) {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10,
        padding: "24px 22px",
        marginTop: 20,
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
        <div
          style={{
            width: 32,
            height: 32,
            borderRadius: 8,
            background: phase.colorDim,
            border: `1px solid ${phase.color}40`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: "'JetBrains Mono', monospace",
            fontSize: 13,
            color: phase.color,
            fontWeight: 700,
          }}
        >
          {phase.id}
        </div>
        <div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 18, fontWeight: 600, color: "#fff" }}>
            {phase.name} ({phase.asset})
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: phase.color, letterSpacing: 1 }}>
            {phase.role.toUpperCase()}
          </div>
        </div>
      </div>

      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, lineHeight: 1.65, color: "rgba(255,255,255,0.7)", margin: "0 0 20px" }}>
        {phase.description}
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))", gap: 10, marginBottom: 20 }}>
        {[
          { label: "ENTRY", value: phase.entryPrice, sub: phase.entryDate },
          { label: "EXIT", value: phase.exitPrice, sub: phase.exitDate },
          { label: "MULTIPLE", value: phase.multiple, sub: phase.halvingDistance },
          { label: "CAPITAL OUT", value: formatCurrency(phase.capitalOut), sub: `from ${formatCurrency(phase.capitalIn)}` },
        ].map((item, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: 6,
              padding: "12px 14px",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, marginBottom: 4 }}>
              {item.label}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, color: phase.color, fontWeight: 600 }}>
              {item.value}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 2 }}>
              {item.sub}
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginBottom: 18 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.4)", letterSpacing: 1.5, marginBottom: 8 }}>
          STRUCTURAL MECHANICS
        </div>
        {phase.mechanics.map((m, i) => (
          <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 6 }}>
            <span style={{ color: phase.color, fontFamily: "'JetBrains Mono', monospace", fontSize: 11, marginTop: 1 }}>→</span>
            <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.5 }}>
              {m}
            </span>
          </div>
        ))}
      </div>

      <div
        style={{
          background: `${phase.color}08`,
          border: `1px solid ${phase.color}20`,
          borderRadius: 6,
          padding: "12px 14px",
          marginBottom: 14,
        }}
      >
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: phase.color, letterSpacing: 1.5, marginBottom: 4 }}>
          EXIT SIGNAL
        </div>
        <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.65)", lineHeight: 1.55 }}>
          {phase.exitSignal}
        </div>
      </div>

      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.5)", fontStyle: "italic", lineHeight: 1.55 }}>
        {phase.keyInsight}
      </div>
    </div>
  );
}

function CalculatorSection() {
  const [initial, setInitial] = useState(100000);
  const [riskSplit, setRiskSplit] = useState(100);

  const phase1Out = initial * 19.66;
  const phase2In = phase1Out * (riskSplit / 100);
  const phase2Reserve = phase1Out - phase2In;
  const phase2Out = phase2In * 6.0;
  const phase3In = phase2Out * (riskSplit / 100);
  const phase3Reserve = phase2Out - phase3In + phase2Reserve;
  const phase3Out = phase3In * 33.67;
  const phase4In = phase3Out * (riskSplit / 100);
  const phase4Reserve = phase3Out - phase4In + phase3Reserve;
  const phase4Out = phase4In * 3.4;
  const totalFinal = phase4Out + phase4Reserve;

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10,
        padding: "24px 22px",
        marginTop: 20,
      }}
    >
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1.5, marginBottom: 16 }}>
        ROTATION CALCULATOR
      </div>
      <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 20 }}>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>
            Initial Capital
          </label>
          <input
            type="range"
            min={10000}
            max={1000000}
            step={10000}
            value={initial}
            onChange={(e) => setInitial(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#9D4EDD" }}
          />
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 20, color: "#fff", marginTop: 4 }}>
            {formatCurrency(initial)}
          </div>
        </div>
        <div style={{ flex: 1, minWidth: 200 }}>
          <label style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.5)", display: "block", marginBottom: 6 }}>
            Rotation Commitment ({riskSplit}% forward / {100 - riskSplit}% reserved)
          </label>
          <input
            type="range"
            min={50}
            max={100}
            step={5}
            value={riskSplit}
            onChange={(e) => setRiskSplit(Number(e.target.value))}
            style={{ width: "100%", accentColor: "#23F0C6" }}
          />
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 13, color: "rgba(255,255,255,0.5)", marginTop: 4 }}>
            {riskSplit === 100 ? "Full rotation (maximum risk/reward)" : `${riskSplit}/${100 - riskSplit} split (risk-mitigated)`}
          </div>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 10 }}>
        {[
          { label: "AFTER SOL (Phase 1)", value: phase1Out, color: "#9D4EDD" },
          { label: "AFTER XRP (Phase 2)", value: phase2Out + phase2Reserve, color: "#23F0C6" },
          { label: "AFTER ZEC W1 (Phase 3)", value: phase3Out + phase3Reserve, color: "#F4B728" },
          { label: "AFTER ZEC W2 (Phase 4)", value: phase4Out + phase4Reserve, color: "#F4B728" },
          { label: "RESERVED IN FIAT", value: phase4Reserve, color: "rgba(255,255,255,0.5)" },
          { label: "FINAL PORTFOLIO", value: totalFinal, color: "#F4B728" },
        ].map((r, i) => (
          <div
            key={i}
            style={{
              background: "rgba(255,255,255,0.03)",
              borderRadius: 6,
              padding: "12px 14px",
              border: "1px solid rgba(255,255,255,0.05)",
            }}
          >
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, marginBottom: 4 }}>
              {r.label}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 18, color: r.color, fontWeight: 600 }}>
              {formatCurrency(r.value)}
            </div>
          </div>
        ))}
      </div>
      <div style={{ marginTop: 14, fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.25)", lineHeight: 1.6 }}>
        * Theoretical returns based on historical 2022–2025 cycle multiples. Past performance does not guarantee future results.
        {riskSplit < 100 && ` Reserved capital earns 0% in this model — real yield-bearing fiat instruments would increase total.`}
      </div>
    </div>
  );
}

function Predictions2028() {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10,
        padding: "24px 22px",
        marginTop: 20,
      }}
    >
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1.5, marginBottom: 6 }}>
        2028 CYCLE PROJECTION
      </div>
      <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.45)", marginBottom: 18 }}>
        Projected rotation dates using the ~April 2028 halving as Month 0
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
        {PREDICTIONS_2028.map((p, i) => (
          <div
            key={i}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 14,
              padding: "12px 0",
              borderBottom: i < PREDICTIONS_2028.length - 1 ? "1px solid rgba(255,255,255,0.05)" : "none",
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                borderRadius: 8,
                background: PHASES[p.phase - 1].colorDim,
                border: `1px solid ${PHASES[p.phase - 1].color}30`,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 12,
                color: PHASES[p.phase - 1].color,
                fontWeight: 700,
                flexShrink: 0,
              }}
            >
              {p.asset}
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "#fff" }}>{p.action}</div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{p.note}</div>
            </div>
            <div
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 13,
                color: PHASES[p.phase - 1].color,
                fontWeight: 600,
                whiteSpace: "nowrap",
              }}
            >
              {p.timing}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function MacroContext() {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10,
        padding: "24px 22px",
        marginTop: 20,
      }}
    >
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1.5, marginBottom: 14 }}>
        MACROECONOMIC PRECONDITIONS
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 18 }}>
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "14px" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, marginBottom: 6 }}>
            M2 CORRELATION
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 26, color: "#9D4EDD", fontWeight: 700 }}>84%+</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
            Global M2 to crypto price correlation
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "14px" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, marginBottom: 6 }}>
            LIQUIDITY LAG
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 26, color: "#23F0C6", fontWeight: 700 }}>56–60d</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
            M2 expansion → crypto price action delay
          </div>
        </div>
        <div style={{ background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "14px" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, marginBottom: 6 }}>
            GLOBAL M2 (Q1 2026)
          </div>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 26, color: "#F4B728", fontWeight: 700 }}>$140T+</div>
          <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>
            Continued expansion providing structural tailwind
          </div>
        </div>
      </div>

      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 1.5, marginBottom: 10, marginTop: 20 }}>
        BITCOIN HALVING HISTORY
      </div>
      <div style={{ display: "flex", gap: 0, flexWrap: "wrap" }}>
        {HALVINGS.map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              minWidth: 100,
              padding: "10px 12px",
              borderLeft: i > 0 ? "1px solid rgba(255,255,255,0.06)" : "none",
              background: i === 3 ? "rgba(255,255,255,0.04)" : "transparent",
            }}
          >
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 12, color: i === 3 ? "#fff" : "rgba(255,255,255,0.5)", fontWeight: i === 3 ? 700 : 400 }}>
              {h.date}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", marginTop: 3 }}>
              {h.reward}
            </div>
            {i === 3 && (
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "#9D4EDD", marginTop: 3, letterSpacing: 1 }}>
                MONTH 0
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

function BtcDominanceNote() {
  return (
    <div
      style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10,
        padding: "20px 22px",
        marginTop: 20,
      }}
    >
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1.5, marginBottom: 10 }}>
        TRANSITORY SIGNAL — BTC.D
      </div>
      <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.65, color: "rgba(255,255,255,0.55)", margin: 0 }}>
        Bitcoin Dominance (BTC.D) serves as the technical trigger for rotation timing. During accumulation and early post-halving expansion,
        dominance rises as capital seeks the benchmark asset. When BTC.D breaks below the 57–58.8% threshold after establishing new
        all-time highs, capital systemically rotates into altcoins. In the 2021 cycle, BTC.D collapsed roughly 35 days after Bitcoin's initial
        momentum peak. Monitoring this metric prevents premature rotation and ensures deployment exactly when the market is primed for expansion.
      </p>
    </div>
  );
}

// ── SIGNALS component ─────────────────────────────────────────────────────────

function SignalsTab() {
  const { btcDominance, solRsiWeekly, loading, error, lastUpdated } = useMarketData();

  const statusColor = (s) =>
    s === "TRIGGERED" ? "#9D4EDD" : s === "ARMED" ? "#F4B728" : "rgba(255,255,255,0.25)";

  // Derive active phase from SIGNAL_GRID — first phase with any ARMED signal
  const activeIdx        = SIGNAL_GRID.findIndex(g => g.signals.some(s => s.status === "ARMED"));
  const activePhase      = PHASES[activeIdx];
  const activeSignalPhase = SIGNAL_GRID[activeIdx];

  // Month counter relative to next halving (~Apr 2028), not the 2024 cycle PHASES data
  const NEXT_HALVING    = new Date('2028-04-19');
  const monthsToHalving = Math.round((NEXT_HALVING - new Date()) / (1000 * 60 * 60 * 24 * 30.44));
  const monthLabel      = monthsToHalving > 0
    ? `Month -${monthsToHalving}`
    : `Month +${Math.abs(monthsToHalving)}`;

  return (
    <div>
      <style>{`@keyframes pulse-glow { 0%,100%{opacity:1} 50%{opacity:0.35} }`}</style>

      {/* Cycle Status Banner — data-driven from PHASES + SIGNAL_GRID */}
      <div style={{
        background: `${activePhase.color}08`,
        border: `1px solid ${activePhase.color}25`,
        borderRadius: 10,
        padding: "20px 24px",
        marginBottom: 28,
        display: "flex",
        alignItems: "center",
        gap: 20,
        flexWrap: "wrap",
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{
            display: "inline-block", width: 10, height: 10, borderRadius: "50%",
            background: activePhase.color,
            boxShadow: `0 0 10px ${activePhase.color}, 0 0 20px ${activePhase.color}40`,
            animation: "pulse-glow 2s ease-in-out infinite",
          }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.35)", letterSpacing: 2 }}>
            NEXT PHASE — 2028 CYCLE
          </span>
        </div>
        <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: activePhase.color }}>
          Phase {activeIdx + 1} — {activePhase.asset}
        </div>
        <div style={{ marginLeft: "auto", textAlign: "right" }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.3)", letterSpacing: 1.5 }}>
            TO ~MAR 2028 HALVING
          </div>
          <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 24, fontWeight: 700, color: "#fff" }}>
            {monthLabel}
          </div>
        </div>
      </div>

      {/* Current market metric boxes — MacroContext tile pattern */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        CURRENT WATCH METRICS
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))", gap: 12, marginBottom: 8 }}>
        {[
          {
            label: "BTC DOMINANCE",
            value: loading && btcDominance == null ? "…" : btcDominance != null ? `${btcDominance.toFixed(1)}%` : "—",
            desc: "Watch for < 57.5% to confirm SOL entry",
            color: "#9D4EDD",
          },
          {
            label: "SOL RSI (WEEKLY)",
            value: loading && solRsiWeekly == null ? "…" : solRsiWeekly != null ? String(solRsiWeekly) : "—",
            desc: "Entry window below 40 — accumulation phase",
            color: "#23F0C6",
          },
          {
            label: "XRP RSI",
            value: "—",
            desc: "Live data unavailable — verify manually",
            color: "#F4B728",
          },
          {
            label: "ENTRY WINDOW",
            value: activeSignalPhase.entryWindow,
            desc: `Active accumulation window — Phase ${activeSignalPhase.phase} ${activeSignalPhase.asset}`,
            color: activePhase.color,
            highlight: true,
          },
        ].map((m) => (
          <div key={m.label} style={{
            background: m.highlight ? `${m.color}08` : "rgba(255,255,255,0.03)",
            border: m.highlight ? `1px solid ${m.color}25` : "1px solid transparent",
            borderRadius: 6,
            padding: "14px 16px",
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: m.highlight ? m.color : "rgba(255,255,255,0.35)", letterSpacing: 1.5, marginBottom: 6 }}>
              {m.label}
            </div>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: m.highlight ? 16 : 26, color: m.color, fontWeight: 700, lineHeight: 1.3 }}>{m.value}</div>
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)", marginTop: 2 }}>{m.desc}</div>
          </div>
        ))}
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: 1, marginBottom: 28 }}>
        {lastUpdated
          ? `LIVE — LAST UPDATED ${lastUpdated.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit", second: "2-digit" })}`
          : "FETCHING LIVE DATA…"}
        {error && ` — ${error.toUpperCase()}`}
      </div>

      {/* Signal Grid */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        SIGNAL GRID — ALL PHASES
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 16, marginBottom: 36 }}>
        {SIGNAL_GRID.map((phase) => (
          <div key={phase.phase} style={{
            background: "rgba(255,255,255,0.02)",
            border: `1px solid ${phase.color}30`,
            borderRadius: 10,
            padding: "18px 20px",
            borderTop: `2px solid ${phase.color}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 14 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                <GlowDot color={phase.color} size={6} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: phase.color, letterSpacing: 1.5 }}>
                  PHASE {phase.phase} — {phase.asset}
                </span>
              </div>
              <span style={{
                fontFamily: "'JetBrains Mono', monospace", fontSize: 9,
                color: phase.color, background: `${phase.color}12`,
                border: `1px solid ${phase.color}35`, borderRadius: 4,
                padding: "3px 7px", letterSpacing: 0.8, whiteSpace: "nowrap",
              }}>
                {phase.entryWindow}
              </span>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
              {phase.signals.map((sig) => (
                <div key={sig.id} style={{
                  background: "rgba(255,255,255,0.02)",
                  border: "1px solid rgba(255,255,255,0.06)",
                  borderRadius: 8,
                  padding: "10px 12px",
                }}>
                  <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: 8, marginBottom: 5 }}>
                    <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.72)", lineHeight: 1.4 }}>
                      {sig.threshold}
                    </span>
                    <span style={{
                      flexShrink: 0,
                      fontFamily: "'JetBrains Mono', monospace",
                      fontSize: 8,
                      color: statusColor(sig.status),
                      letterSpacing: 0.8,
                      border: `1px solid ${statusColor(sig.status)}40`,
                      borderRadius: 4,
                      padding: "2px 6px",
                      whiteSpace: "nowrap",
                    }}>
                      {sig.status}
                    </span>
                  </div>
                  <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.4)" }}>
                    → {sig.action}
                  </div>
                </div>
              ))}
            </div>
            {/* Entry condition box */}
            <div style={{
              marginTop: 12,
              background: `${PHASES[phase.phase - 1].color}05`,
              border: `1px solid ${PHASES[phase.phase - 1].color}18`,
              borderRadius: 6,
              padding: "10px 12px",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: PHASES[phase.phase - 1].color, letterSpacing: 1.5, marginBottom: 4, opacity: 0.7 }}>
                ENTRY CONDITION
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, lineHeight: 1.55, color: "rgba(255,255,255,0.45)", margin: 0 }}>
                {PHASES[phase.phase - 1].entrySignal}
              </p>
            </div>
            {/* Exit condition box — PhaseDetail exit-signal box pattern */}
            <div style={{
              marginTop: 12,
              background: `${PHASES[phase.phase - 1].color}08`,
              border: `1px solid ${PHASES[phase.phase - 1].color}20`,
              borderRadius: 6,
              padding: "10px 12px",
            }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: PHASES[phase.phase - 1].color, letterSpacing: 1.5, marginBottom: 4 }}>
                EXIT CONDITION
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, lineHeight: 1.55, color: "rgba(255,255,255,0.55)", margin: 0 }}>
                {PHASES[phase.phase - 1].exitSignal}
              </p>
            </div>
            {/* Historical precedent — PhaseDetail keyInsight style */}
            <div style={{ marginTop: 10, paddingTop: 10, borderTop: `1px solid ${phase.color}15` }}>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.38)", fontStyle: "italic", lineHeight: 1.5, margin: 0 }}>
                {phase.historicalPrecedent}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Rotation Decision Tree */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        ROTATION DECISION TREE
      </div>
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10,
        padding: "22px 24px",
        marginBottom: 36,
        overflowX: "auto",
      }}>
        <div style={{ display: "flex", alignItems: "stretch", minWidth: 560 }}>
          {[
            { label: "SOL: EXIT WHEN", detail: "RSI > 78 or BTC.D < 57.5%",       color: "#9D4EDD", flexWeight: 1,   state: "done"   },
            { label: "XRP: EXIT WHEN",  detail: "RSI > 80 or momentum stalls",      color: "#23F0C6", flexWeight: 1.5, state: "active" },
            { label: "ZEC: EXIT WHEN",  detail: "7-day gain > 150% or media peaks", color: "#F4B728", flexWeight: 2,   state: "future" },
            { label: "FIAT",            detail: "No further crypto rotations",       color: "rgba(255,255,255,0.3)", flexWeight: 0.8, state: "future" },
          ].map((node, i, arr) => (
            <div key={i} style={{ display: "flex", alignItems: "center", flex: node.flexWeight }}>
              <div style={{
                flex: 1,
                background: node.state === "active"
                  ? `${node.color}18`
                  : node.state === "done"
                  ? "rgba(255,255,255,0.04)"
                  : `${node.color}0a`,
                border: node.state === "active"
                  ? `1px solid ${node.color}60`
                  : `1px solid ${node.color}30`,
                borderRadius: 8,
                padding: "14px 16px",
              }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: node.color, letterSpacing: 1.2, marginBottom: 6 }}>
                  {node.label}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.5)", lineHeight: 1.45 }}>
                  {node.detail}
                </div>
              </div>
              {i < arr.length - 1 && (
                <div style={{ padding: "0 10px", color: "rgba(255,255,255,0.2)", fontSize: 20, flexShrink: 0 }}>→</div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Key Threshold Table */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        KEY THRESHOLD TABLE
      </div>
      <div style={{ overflowX: "auto", marginBottom: 36 }}>
        <div style={{ display: "grid", gridTemplateColumns: "1.3fr 0.8fr 1.3fr 1.2fr 0.85fr", gap: 0, minWidth: 680 }}>
          {["Signal", "Asset", "Threshold", "Action", "Month Window"].map((h) => (
            <div key={h} style={{
              padding: "10px 12px",
              background: "rgba(255,255,255,0.04)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: 1.2,
            }}>
              {h.toUpperCase()}
            </div>
          ))}
          {KEY_THRESHOLDS.map((row, i) => {
            const ac = row.asset.includes("SOL") ? "#9D4EDD" : row.asset.includes("XRP") ? "#23F0C6" : "#F4B728";
            return [row.signal, row.asset, row.threshold, row.action, row.window].map((cell, j) => (
              <div key={`${i}-${j}`} style={{
                padding: "10px 12px",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                fontFamily: j === 1 ? "'JetBrains Mono', monospace" : "'DM Sans', sans-serif",
                fontSize: j === 1 ? 10 : 12,
                color: j === 1 ? ac : j === 4 ? "rgba(255,255,255,0.4)" : "rgba(255,255,255,0.6)",
              }}>
                {cell}
              </div>
            ));
          })}
        </div>
      </div>

      {/* Psychological Risk Cards */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        PSYCHOLOGICAL RISK VECTORS
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 14 }}>
        {PSY_RISKS.map((risk, i) => (
          <div key={i} style={{
            background: "rgba(255,60,60,0.06)",
            border: "1px solid rgba(255,60,60,0.18)",
            borderRadius: 10,
            padding: "18px 20px",
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,80,80,0.8)", letterSpacing: 1.5, marginBottom: 10 }}>
              ⚠ {risk.title.toUpperCase()}
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.65, color: "rgba(255,255,255,0.58)", margin: 0 }}>
              {risk.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── CYCLES component ──────────────────────────────────────────────────────────

function CyclesTab() {
  const [activeCycle, setActiveCycle] = useState(null);
  const maxMultiple = 96;
  const cycleColors = ["#9D4EDD", "#23F0C6", "#F4B728", "#6450FF"];
  const maxMonths = 24;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 8 }}>
          EMPIRICAL FOUNDATION — FOUR-CYCLE ANALYSIS
        </div>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 26,
          fontWeight: 700,
          margin: "0 0 12px",
          lineHeight: 1.2,
          background: "linear-gradient(135deg, #9D4EDD, #23F0C6, #F4B728)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Historical Halving Cycles
        </h2>
        <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.5)", margin: 0, maxWidth: 700 }}>
          The cascade thesis is not speculation — it is pattern recognition across four complete cycles. Each halving has produced a measurable sequence: BTC expansion, dominance break, altcoin overflow. The asset names rotate; the structure does not.
        </p>
      </div>

      {/* 4-Cycle Comparison Grid */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        4-CYCLE COMPARISON
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 14, marginBottom: 36 }}>
        {CYCLE_DATA.map((c, i) => (
          <div key={c.year}
            role="button"
            tabIndex={0}
            aria-expanded={activeCycle === i}
            onClick={() => setActiveCycle(activeCycle === i ? null : i)}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveCycle(activeCycle === i ? null : i); } }}
            style={{
              background: activeCycle === i ? `${cycleColors[i]}10` : "rgba(255,255,255,0.02)",
              border: activeCycle === i ? `1.5px solid ${cycleColors[i]}55` : `1px solid ${cycleColors[i]}30`,
              borderRadius: 10,
              padding: "18px 20px",
              borderTop: `2px solid ${cycleColors[i]}`,
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 14 }}>
              <GlowDot color={cycleColors[i]} size={6} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: cycleColors[i], letterSpacing: 1.5 }}>
                {c.year} HALVING
              </span>
            </div>
            {/* Altcoin hero stat — PhaseCard large-ticker pattern */}
            <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${cycleColors[i]}20` }}>
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: cycleColors[i], letterSpacing: 1.2, marginBottom: 4, opacity: 0.7 }}>
                {c.leadAltcoin} — LEAD ALTCOIN
              </div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: cycleColors[i], lineHeight: 1 }}>
                {c.altcoinMultiple}
              </div>
            </div>
            {[
              ["Halving Price", c.halvingPrice],
              ["Peak Price", c.peakPrice],
              ["BTC Multiple", c.multiple],
              ["Months to Peak", `${c.monthsToPeak} mo`],
            ].map(([label, value]) => (
              <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)" }}>{label}</span>
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.8)", fontWeight: 600 }}>{value}</span>
              </div>
            ))}
          </div>
        ))}

        {/* 2028 Projection card — uses PREDICTIONS_2028 data, dashed PROJECTION badge */}
        {(() => {
          const proj2028Color = "#6450FF";
          return (
            <div style={{
              background: "rgba(100,80,255,0.03)",
              border: `1px solid ${proj2028Color}25`,
              borderRadius: 10,
              padding: "18px 20px",
              borderTop: `2px dashed ${proj2028Color}`,
              opacity: 0.85,
            }}>
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
                <GlowDot color={proj2028Color} size={6} />
                <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: proj2028Color, letterSpacing: 1.5 }}>
                  ~2028 HALVING
                </span>
                <span style={{
                  fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: proj2028Color,
                  border: `1px dashed ${proj2028Color}50`, borderRadius: 3, padding: "1px 5px", marginLeft: 2,
                }}>
                  PROJECTION
                </span>
              </div>
              <div style={{ marginBottom: 14, paddingBottom: 14, borderBottom: `1px solid ${proj2028Color}15` }}>
                <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: proj2028Color, letterSpacing: 1.2, marginBottom: 4, opacity: 0.7 }}>
                  ZEC — LEAD ALTCOIN
                </div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 22, fontWeight: 700, color: proj2028Color, lineHeight: 1 }}>
                  ~33x (est.)
                </div>
              </div>
              {[
                ["Halving Price", "~$90,000"],
                ["Peak Price", "~$450,000"],
                ["BTC Multiple", "~4–5x (est.)"],
                ["Months to Peak", "~19 mo"],
              ].map(([label, value]) => (
                <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: 8 }}>
                  <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.3)" }}>{label}</span>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.55)", fontWeight: 600 }}>{value}</span>
                </div>
              ))}
            </div>
          );
        })()}
      </div>

      {/* Expanded cycle detail panel — PhaseDetail structure */}
      {activeCycle !== null && (() => {
        const c = CYCLE_DATA[activeCycle];
        const color = cycleColors[activeCycle];
        // Map cycle index to PHASES: 2020=SOL(0), 2024=ZEC(2); others use generic narrative
        const phaseMap = { 2: PHASES[0], 3: PHASES[2] };
        const ph = phaseMap[activeCycle];
        return (
          <div style={{
            background: `${color}08`,
            border: `1px solid ${color}30`,
            borderRadius: 10,
            padding: "22px 24px",
            marginBottom: 28,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 16 }}>
              <GlowDot color={color} size={7} />
              <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 18, fontWeight: 700, color }}>
                {c.year} — {c.leadAltcoin} Cycle
              </span>
            </div>
            {ph && (
              <>
                <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.6)", margin: "0 0 16px" }}>
                  {ph.description}
                </p>
                <div style={{ display: "flex", flexDirection: "column", gap: 6, marginBottom: 16 }}>
                  {ph.mechanics.map((m, mi) => (
                    <div key={mi} style={{ display: "flex", gap: 10, alignItems: "flex-start" }}>
                      <span style={{ color, fontFamily: "'JetBrains Mono', monospace", fontSize: 12, flexShrink: 0 }}>→</span>
                      <span style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, color: "rgba(255,255,255,0.6)", lineHeight: 1.55 }}>{m}</span>
                    </div>
                  ))}
                </div>
                <div style={{ background: `${color}08`, border: `1px solid ${color}20`, borderRadius: 6, padding: "10px 14px" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color, letterSpacing: 1.5, marginBottom: 4 }}>CYCLE EXIT SIGNAL</div>
                  <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.55)", margin: 0 }}>{ph.exitSignal}</p>
                </div>
              </>
            )}
            {!ph && (
              <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 14, lineHeight: 1.8, color: "rgba(255,255,255,0.5)", margin: 0 }}>
                The {c.year} cycle preceded the current cascade instrument set. {c.leadAltcoin} served as the terminal liquidity vehicle, peaking approximately {c.monthsToPeak} months after the halving with a {c.altcoinMultiple} multiple — establishing the structural precedent this cascade replicates.
              </p>
            )}
          </div>
        );
      })()}

      {/* Diminishing Returns Bar Chart */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        BTC CYCLE MULTIPLES — DIMINISHING RETURNS
      </div>
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10,
        padding: "22px 24px",
        marginBottom: 14,
      }}>
        {CYCLE_DATA.map((c, i) => (
          <div key={c.year} style={{ marginBottom: i < CYCLE_DATA.length - 1 ? 16 : 0 }}>
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 6 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: cycleColors[i], width: 36 }}>{c.year}</span>
              <div style={{ flex: 1, height: 20, background: "rgba(255,255,255,0.04)", borderRadius: 4, overflow: "hidden" }}>
                <div style={{
                  width: `${(c.multipleNum / maxMultiple) * 100}%`,
                  height: "100%",
                  background: `linear-gradient(90deg, ${cycleColors[i]}cc, ${cycleColors[i]}55)`,
                  borderRadius: 4,
                  transition: "width 0.6s ease",
                }} />
              </div>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.7)", width: 44, textAlign: "right" }}>
                {c.multiple}
              </span>
            </div>
          </div>
        ))}
      </div>
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 8,
        padding: "12px 16px",
        marginBottom: 36,
      }}>
        <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.45)", margin: 0 }}>
          BTC cycle multiples are compressing — 96x → 30x → 7.85x → ~5x. Yet altcoin rotation remains viable precisely because the <span style={{ color: "#F4B728" }}>liquidity overflow dynamic</span> amplifies diminishing BTC gains through sequenced leverage. A 5x BTC move routed through XRP (institutional settlement layer) and then into a thin-order-book privacy coin produces outsized terminal returns despite a lower headline BTC multiple.
        </p>
      </div>

      {/* Multi-Cycle Timeline Overlay */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        ALTCOIN ROTATION WINDOW — MULTI-CYCLE OVERLAY
      </div>
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10,
        padding: "22px 24px",
        marginBottom: 36,
        overflowX: "auto",
      }}>
        <div style={{ minWidth: 500 }}>
          {/* Month axis labels — absolute-positioned within bar area (matches Timeline technique) */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
            <div style={{ width: 36, flexShrink: 0 }} />
            <div style={{ flex: 1, position: "relative", height: 14 }}>
              {[0, 4, 8, 12, 16, 20, 24].map((m) => (
                <div key={m} style={{
                  position: "absolute",
                  left: `${(m / maxMonths) * 100}%`,
                  transform: "translateX(-50%)",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 8,
                  color: "rgba(255,255,255,0.2)",
                  whiteSpace: "nowrap",
                }}>
                  +{m}m
                </div>
              ))}
            </div>
          </div>
          {ALTCOIN_WINDOWS.map((w) => (
            <div key={w.year} style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 10 }}>
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: w.color, width: 36, flexShrink: 0 }}>{w.year}</span>
              <div style={{ flex: 1, position: "relative", height: 28, background: "rgba(255,255,255,0.03)", borderRadius: 4 }}>
                <div style={{
                  position: "absolute",
                  left: `${(w.start / maxMonths) * 100}%`,
                  width: `${((w.end - w.start) / maxMonths) * 100}%`,
                  top: 0,
                  height: "100%",
                  background: `${w.color}30`,
                  border: `1px solid ${w.color}60`,
                  borderRadius: 4,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}>
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: w.color, whiteSpace: "nowrap" }}>
                    {w.label}
                  </span>
                </div>
              </div>
            </div>
          ))}
          <div style={{ paddingLeft: 48, marginTop: 6 }}>
            <div style={{ height: 1, background: "rgba(255,255,255,0.06)" }} />
            <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 10, color: "rgba(255,255,255,0.25)", marginTop: 6 }}>
              Months after halving. Bars indicate peak altcoin rotation window.
            </div>
          </div>
        </div>
      </div>

      {/* M2 Correlation Table */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        M2 CORRELATION — CYCLE MAPPING
      </div>
      <div style={{ overflowX: "auto", marginBottom: 36 }}>
        <div style={{ display: "grid", gridTemplateColumns: "60px 80px 100px 1fr", gap: 0, minWidth: 500 }}>
          {["Cycle", "BTC Multiple", "Lead Alt", "Concurrent M2 Event"].map((h) => (
            <div key={h} style={{
              padding: "10px 12px",
              background: "rgba(255,255,255,0.04)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: 1.2,
            }}>
              {h.toUpperCase()}
            </div>
          ))}
          {CYCLE_DATA.map((c, i) => (
            [c.year, c.multiple, c.leadAltcoin, c.m2Event].map((cell, j) => (
              <div key={`${i}-${j}`} style={{
                padding: "10px 12px",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                fontFamily: j === 0 ? "'JetBrains Mono', monospace" : "'DM Sans', sans-serif",
                fontSize: 12,
                color: j === 0 ? cycleColors[i] : j === 2 ? cycleColors[i] : "rgba(255,255,255,0.55)",
                display: j === 0 ? "flex" : undefined,
                alignItems: j === 0 ? "center" : undefined,
                gap: j === 0 ? 6 : undefined,
              }}>
                {j === 0 && <GlowDot color={cycleColors[i]} size={5} />}
                {cell}
              </div>
            ))
          ))}
        </div>
      </div>

      {/* Pattern Validation */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        PATTERN VALIDATION
      </div>
      <div style={{
        background: "rgba(255,255,255,0.02)",
        border: "1px solid rgba(255,255,255,0.06)",
        borderRadius: 10,
        padding: "24px 26px",
      }}>
        <BlackpaperPara>
          Across every completed halving cycle, a structurally identical sequence has repeated: Bitcoin consolidates supply shock gains, dominance peaks, capital rotates into the cycle's vanguard altcoin, and finally overflows into legacy assets with thin liquidity and outsized volatility. The instruments differ per cycle — LTC in 2013, ETH in 2017, SOL in 2021 and 2024, ZEC in 2025 — but the mechanism is invariant.
        </BlackpaperPara>
        <BlackpaperPara indent>
          Diminishing BTC multiples do not invalidate the cascade. They are a feature of increasing market capitalization, not a failure of the pattern. A market that is ten times larger requires ten times more capital to move — but the <span style={{ color: "#F4B728" }}>rotation sequence itself</span> concentrates that capital into increasingly narrow windows, producing terminal volatility that exceeds earlier cycles in absolute dollar terms even as percentage multiples compress.
        </BlackpaperPara>
        <BlackpaperPara indent>
          The ZEC Month +17–19 window does not appear in isolation. It appears at the same relative position across every cycle in which a terminal privacy or legacy asset participated. The 2018 and 2021 precedents are not anecdotes. They are data points in a statistically consistent distribution.
        </BlackpaperPara>
        <BlackpaperQuote color="#F4B728">
          "The asset names change. The timing tightens. The sequence does not."
        </BlackpaperQuote>
      </div>
    </div>
  );
}

// ── EXECUTION component ───────────────────────────────────────────────────────

function ExecutionTab() {
  const [checked, setChecked] = useState([false, false, false, false, false]);
  const [activeStep, setActiveStep] = useState(1);
  const doneCount = checked.filter(Boolean).length;

  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 8 }}>
          OPERATIONAL MANUAL — TRADE EXECUTION
        </div>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 26,
          fontWeight: 700,
          margin: "0 0 12px",
          lineHeight: 1.2,
          background: "linear-gradient(135deg, #9D4EDD, #23F0C6, #F4B728)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          How to Execute the Cascade
        </h2>
        <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.5)", margin: 0, maxWidth: 700 }}>
          Knowing what to do and when is insufficient. The edge is destroyed at the execution layer — wrong venue, wrong order type, unlogged basis, missed custody transfer. This section closes that gap.
        </p>
      </div>

      {/* Pre-Entry Checklist */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 10, flexWrap: "wrap", gap: 8 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2 }}>
          PRE-ENTRY CHECKLIST
        </div>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: doneCount === 5 ? "#9D4EDD" : "rgba(255,255,255,0.3)", letterSpacing: 1 }}>
          SETUP PROGRESS — {doneCount} / 5 COMPLETE
        </div>
      </div>
      {/* Progress bar */}
      <div style={{ height: 3, background: "rgba(255,255,255,0.06)", borderRadius: 2, marginBottom: 14, overflow: "hidden" }}>
        <div style={{ width: `${(doneCount / 5) * 100}%`, height: "100%", background: "linear-gradient(90deg, #9D4EDD, #9D4EDD60)", borderRadius: 2, transition: "width 0.3s ease" }} />
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 10, marginBottom: 36 }}>
        {PRE_ENTRY_CHECKLIST.map((row, i) => (
          <div key={i}
            role="checkbox"
            aria-checked={checked[i]}
            tabIndex={0}
            onClick={() => setChecked(prev => { const n = [...prev]; n[i] = !n[i]; return n; })}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setChecked(prev => { const n = [...prev]; n[i] = !n[i]; return n; }); } }}
            style={{
              display: "flex",
              gap: 16,
              background: checked[i] ? "rgba(157,78,221,0.04)" : "rgba(255,255,255,0.02)",
              border: checked[i] ? "1px solid rgba(157,78,221,0.2)" : "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8,
              padding: "14px 16px",
              alignItems: "flex-start",
              cursor: "pointer",
              transition: "all 0.2s ease",
            }}>
            <div style={{
              flexShrink: 0,
              width: 22,
              height: 22,
              borderRadius: "50%",
              background: checked[i] ? "#9D4EDD" : "transparent",
              border: checked[i] ? "1px solid #9D4EDD" : "1px solid rgba(157,78,221,0.4)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              color: checked[i] ? "#000" : "#9D4EDD",
              transition: "all 0.2s ease",
            }}>
              {checked[i] ? "✓" : i + 1}
            </div>
            <div>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: checked[i] ? "rgba(255,255,255,0.5)" : "#fff", marginBottom: 4, transition: "color 0.2s" }}>
                {row.item}
              </div>
              <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.45)" }}>
                {row.detail}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Phase Entry Protocols */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        PHASE ENTRY PROTOCOLS
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: 14, marginBottom: 36 }}>
        {PHASE_PROTOCOLS.map((p, i) => (
          <div key={p.asset} style={{
            background: p.colorDim,
            border: `1px solid ${p.color}30`,
            borderRadius: 10,
            padding: "18px 20px",
            borderTop: `2px solid ${p.color}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 12 }}>
              <GlowDot color={p.color} size={6} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: p.color, letterSpacing: 1, fontWeight: 600 }}>
                {p.asset}
              </span>
            </div>
            {/* Phase link mini-metrics — PhaseDetail metrics-grid style */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8, marginBottom: 14 }}>
              {[
                ["HISTORICAL MULTIPLE", PHASES[i].multiple, p.color],
                ["CAPITAL OUT", formatCurrency(PHASES[i].capitalOut), p.color],
              ].map(([label, value, color]) => (
                <div key={label} style={{ background: "rgba(255,255,255,0.03)", borderRadius: 6, padding: "8px 10px" }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: 1.2, marginBottom: 4 }}>
                    {label}
                  </div>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 16, color, fontWeight: 700 }}>
                    {value}
                  </div>
                </div>
              ))}
            </div>
            {[
              ["Venue", p.venue],
              ["Entry Method", p.entryMethod],
              ["Position Type", p.positionType],
              ["Custody", p.custody],
              ["Slippage Risk", p.slippageRisk],
              ["Exit Trigger", p.exitTrigger],
            ].map(([label, value]) => {
              const isSlippage = label === "Slippage Risk";
              const slippageColor = isSlippage ? (value === "HIGH" ? "#23F0C6" : "#9D4EDD") : null;
              return (
                <div key={label} style={{ marginBottom: 9 }}>
                  <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 8, color: "rgba(255,255,255,0.3)", letterSpacing: 1.2, marginBottom: 2 }}>
                    {label.toUpperCase()}
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, flexWrap: "wrap" }}>
                    <span style={{
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 12,
                      color: slippageColor || "rgba(255,255,255,0.65)",
                      lineHeight: 1.4,
                    }}>
                      {value}
                    </span>
                    {isSlippage && (
                      <span style={{
                        fontFamily: "'JetBrains Mono', monospace",
                        fontSize: 9,
                        color: slippageColor,
                        background: `${slippageColor}12`,
                        border: `1px solid ${slippageColor}25`,
                        borderRadius: 4,
                        padding: "2px 7px",
                        whiteSpace: "nowrap",
                      }}>
                        {p.slippageBps}
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ))}
      </div>

      {/* Position Sizing Table */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        POSITION SIZING — ALLOCATION TIERS
      </div>
      <div style={{ overflowX: "auto", marginBottom: 8 }}>
        <div style={{ display: "grid", gridTemplateColumns: "100px 60px 60px 60px 110px 1fr", gap: 0, minWidth: 580 }}>
          {["Tier", "SOL %", "XRP %", "ZEC %", "Proj. Terminal", "Notes"].map((h) => (
            <div key={h} style={{
              padding: "10px 12px",
              background: "rgba(255,255,255,0.04)",
              borderBottom: "1px solid rgba(255,255,255,0.08)",
              fontFamily: "'JetBrains Mono', monospace",
              fontSize: 9,
              color: "rgba(255,255,255,0.4)",
              letterSpacing: 1.2,
            }}>
              {h.toUpperCase()}
            </div>
          ))}
          {POSITION_SIZING.map((row) => {
            const BASE = 100000;
            const tao  = parseFloat(row.solPct)  / 100;
            const xrp  = parseFloat(row.xrpPct) / 100;
            const zec  = parseFloat(row.zecPct)  / 100;
            const terminal = BASE * sol * 19.66 * mstr * 3.51 * zec * 33.7;
            return [row.tier, row.solPct, row.xrpPct, row.zecPct, formatCurrency(terminal), row.note].map((cell, j) => (
              <div key={`${row.tier}-${j}`} style={{
                padding: "12px 12px",
                borderBottom: "1px solid rgba(255,255,255,0.04)",
                background: row.isDefault ? "rgba(35,240,198,0.06)" : "transparent",
                fontFamily: j === 0 || j === 4 ? "'JetBrains Mono', monospace" : "'DM Sans', sans-serif",
                fontSize: j === 0 ? 11 : j === 4 ? 12 : 12,
                fontWeight: j === 4 ? 600 : undefined,
                color: j === 0
                  ? (row.isDefault ? "#23F0C6" : "rgba(255,255,255,0.7)")
                  : j === 1 ? "#9D4EDD"
                  : j === 2 ? "#23F0C6"
                  : j === 3 ? "#F4B728"
                  : j === 4 ? "#F4B728"
                  : "rgba(255,255,255,0.5)",
                display: "flex",
                alignItems: "center",
                gap: 6,
              }}>
                {cell}
                {j === 0 && row.isDefault && (
                  <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 7, color: "#23F0C6", border: "1px solid #23F0C640", borderRadius: 3, padding: "1px 4px" }}>
                    DEFAULT
                  </span>
                )}
              </div>
            ));
          })}
        </div>
      </div>
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.2)", letterSpacing: 1, marginBottom: 36 }}>
        ASSUMES $100K ENTRY — FULL 3-PHASE ROTATION AT HISTORICAL MULTIPLES (19.66x · 3.51x · 33.7x)
      </div>

      {/* Order Execution Steps */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        ORDER EXECUTION — 6-STEP PROTOCOL
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 0, marginBottom: 36 }}>
        {EXECUTION_STEPS.map((s, i) => {
          const isActive = activeStep === s.step;
          const isDone   = s.step < activeStep;
          return (
            <div key={s.step}
              role="button"
              tabIndex={0}
              onClick={() => setActiveStep(s.step)}
              onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); setActiveStep(s.step); } }}
              style={{ display: "flex", gap: 0, position: "relative", cursor: "pointer" }}>
              {/* Connector line */}
              <div style={{ display: "flex", flexDirection: "column", alignItems: "center", marginRight: 16 }}>
                <div style={{
                  width: 28,
                  height: 28,
                  borderRadius: "50%",
                  background: isActive ? "rgba(157,78,221,0.12)" : isDone ? "rgba(157,78,221,0.06)" : "rgba(255,255,255,0.04)",
                  border: isActive ? "1px solid rgba(157,78,221,0.5)" : isDone ? "1px solid rgba(157,78,221,0.25)" : "1px solid rgba(255,255,255,0.12)",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontFamily: "'JetBrains Mono', monospace",
                  fontSize: 10,
                  color: isActive ? "#9D4EDD" : isDone ? "rgba(157,78,221,0.5)" : "rgba(255,255,255,0.5)",
                  flexShrink: 0,
                  zIndex: 1,
                  transition: "all 0.2s ease",
                }}>
                  {s.step}
                </div>
                {i < EXECUTION_STEPS.length - 1 && (
                  <div style={{ width: 1, flex: 1, background: isDone ? "rgba(157,78,221,0.2)" : "rgba(255,255,255,0.06)", minHeight: 20, margin: "4px 0", transition: "background 0.2s" }} />
                )}
              </div>
              <div style={{ flex: 1, paddingBottom: i < EXECUTION_STEPS.length - 1 ? 16 : 0 }}>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: isActive ? "#fff" : "rgba(255,255,255,0.6)", marginBottom: 4, paddingTop: 4, transition: "color 0.2s" }}>
                  {s.title}
                </div>
                <div style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.6, color: isActive ? "rgba(255,255,255,0.75)" : "rgba(255,255,255,0.4)", transition: "color 0.2s" }}>
                  {s.detail}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Common Execution Failures */}
      <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 14 }}>
        COMMON EXECUTION FAILURES
      </div>
      <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {EXECUTION_FAILURES.map((f, i) => (
          <div key={i} style={{
            background: "rgba(255,60,60,0.06)",
            border: "1px solid rgba(255,60,60,0.18)",
            borderRadius: 10,
            padding: "18px 20px",
          }}>
            <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,80,80,0.8)", letterSpacing: 1.2, marginBottom: 8 }}>
              ✗ {f.title}
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.65, color: "rgba(255,255,255,0.58)", margin: 0 }}>
              {f.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

const NAV_ITEMS = [
  { key: "overview",   label: "OVERVIEW"   },
  { key: "macro",      label: "MACRO"      },
  { key: "phases",     label: "PHASES"     },
  { key: "signals",    label: "SIGNALS"    },
  { key: "cycles",     label: "CYCLES"     },
  { key: "execution",  label: "EXECUTION"  },
  { key: "calculator", label: "CALCULATOR" },
  { key: "predict",    label: "2028"       },
  { key: "blackpaper", label: "BLACKPAPER" },
  { key: "conversion", label: "CONVERSION" },
];

function BlackpaperSection({ color, label, children }) {
  return (
    <div style={{ marginBottom: 48 }}>
      {label && (
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 18 }}>
          <div style={{ width: 6, height: 6, borderRadius: "50%", background: color || "rgba(255,255,255,0.3)", boxShadow: color ? `0 0 8px ${color}` : "none" }} />
          <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: color || "rgba(255,255,255,0.35)", letterSpacing: 2 }}>
            {label}
          </span>
        </div>
      )}
      {children}
    </div>
  );
}

function BlackpaperPara({ children, indent }) {
  return (
    <p style={{
      fontFamily: "'Source Serif 4', Georgia, serif",
      fontSize: 16,
      lineHeight: 1.9,
      color: "rgba(255,255,255,0.62)",
      margin: "0 0 18px",
      textIndent: indent ? 28 : 0,
    }}>
      {children}
    </p>
  );
}

function BlackpaperHeading({ children, sub }) {
  return (
    <div style={{ marginBottom: sub ? 10 : 20, marginTop: sub ? 28 : 44 }}>
      <h2 style={{
        fontFamily: "'Space Grotesk', sans-serif",
        fontSize: sub ? 20 : 26,
        fontWeight: 700,
        color: "#fff",
        margin: 0,
        lineHeight: 1.2,
      }}>
        {children}
      </h2>
      <div style={{ width: sub ? 30 : 50, height: 1, background: "rgba(255,255,255,0.12)", marginTop: 10 }} />
    </div>
  );
}

function BlackpaperQuote({ children, color }) {
  return (
    <div style={{
      borderLeft: `2px solid ${color || "rgba(255,255,255,0.15)"}`,
      paddingLeft: 20,
      margin: "24px 0",
    }}>
      <p style={{
        fontFamily: "'Source Serif 4', Georgia, serif",
        fontSize: 17,
        lineHeight: 1.7,
        color: color || "rgba(255,255,255,0.5)",
        fontWeight: 500,
        fontStyle: "italic",
        margin: 0,
      }}>
        {children}
      </p>
    </div>
  );
}

function BlackpaperDatum({ label, value, color }) {
  return (
    <span style={{
      display: "inline-block",
      background: `${color || "rgba(255,255,255,0.1)"}12`,
      border: `1px solid ${color || "rgba(255,255,255,0.1)"}25`,
      borderRadius: 4,
      padding: "2px 8px",
      fontFamily: "'JetBrains Mono', monospace",
      fontSize: 12,
      color: color || "rgba(255,255,255,0.6)",
      margin: "0 2px",
    }}>
      {label && <span style={{ color: "rgba(255,255,255,0.3)", marginRight: 4 }}>{label}</span>}
      {value}
    </span>
  );
}

function Blackpaper() {
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

const CONVERSION_PHASES = [
  { id: "I", label: "JURISDICTIONAL ENGINEERING", color: "#9D4EDD", summary: "Sever domicile from high-tax states and establish residency in a zero-income-tax jurisdiction before the liquidation event." },
  { id: "II", label: "FIDUCIARY ARCHITECTURE", color: "#6450FF", summary: "Structure capital within Domestic Asset Protection Trusts and establish a Single-Family Office with Private Trust Company governance." },
  { id: "III", label: "INSTITUTIONAL LIQUIDATION", color: "#23F0C6", summary: "Execute nine-figure liquidation via institutional OTC desks with locked quotes, bypassing public order books entirely." },
  { id: "IV", label: "CAPITAL PRESERVATION", color: "#F4B728", summary: "Neutralize counterparty banking risk via FDIC sweep networks and deploy into ultra-low-risk preservation instruments." },
  { id: "V", label: "TREASURY & RE-ENTRY", color: "#00B4FF", summary: "Generate risk-free yield via Treasury ladders, maintain liquidity through SBLOCs, and execute rules-based re-entry into subsequent cycles." },
];

const CONVERSION_STATES = [
  { state: "Nevada", rate: "0%", test: "Domicile / 30-day presence", protections: "Homestead exemption, strongest asset protection trusts, no exception creditors", notes: "Fastest DAPT seasoning (2yr). Explicitly exempts crypto from property tax. Optimal for UHNW." },
  { state: "Texas", rate: "0%", test: "Domicile / 183-day rule", protections: "Homestead exemption (unlimited acreage outside city)", notes: "Business-friendly, vehicle inspection required. Strong for operational SFO base." },
  { state: "Wyoming", rate: "0%", test: "Domicile / minimal", protections: "Privacy protections, SPDI charter for crypto banking", notes: "1,000-year trust duration. Lowest LLC fees. Pro-crypto banking laws (SPDI charter)." },
  { state: "Florida", rate: "0%", test: "Domicile / straightforward", protections: "Homestead exemption (unlimited value), asset protection", notes: "No annual vehicle inspection. Straightforward domicile process. Strong case law." },
];

const DAPT_JURISDICTIONS = [
  { jurisdiction: "Nevada", statute: "2 Years", exceptionCreditors: "None", stateTax: "0%", advantage: "Fastest seasoning period. Zero exception creditors. Explicitly exempts crypto from property tax." },
  { jurisdiction: "South Dakota", statute: "2 Years", exceptionCreditors: "Few", stateTax: "0%", advantage: "Highest privacy standards. Permanent seal on trust litigation. Excellent for quiet wealth." },
  { jurisdiction: "Wyoming", statute: "4 Years", exceptionCreditors: "Few", stateTax: "0%", advantage: "1,000-year trust duration. Low LLC integration fees. Pro-crypto SPDI banking laws." },
  { jurisdiction: "Delaware", statute: "4 Years", exceptionCreditors: "Yes (Alimony, Support)", stateTax: "0% (trust income)", advantage: "Established Chancery Court system. Highly predictable legal outcomes." },
];

const SFO_PTC_DOMAINS = [
  { domain: "Primary Mandate", sfo: "Wealth multiplication, tax strategy, asset allocation, and lifestyle management.", ptc: "Fiduciary governance, legal trust compliance, and intergenerational transfer mechanisms.", synergy: "Complete alignment of agile investment operations with strict legal trust mandates." },
  { domain: "Regulatory Status", sfo: "Generally unregulated; exempt from Investment Advisers Act registration.", ptc: "Regulated fiduciary entity operating under specific state banking or trust laws.", synergy: "Combines rapid operational agility with formidable legal defensibility." },
  { domain: "Control Dynamics", sfo: "Directed by family principals and hired executives (CIO, CFO).", ptc: "Directed by a formal board of directors, which can legally include family members.", synergy: "Family retains active control over trust assets without piercing the legal liability veil." },
];

const OTC_DESKS = [
  { desk: "Coinbase Prime", minTrade: "$1M+", regulatory: "NY Trust Charter, SEC, FINRA", strength: "Regulated custody integration. Seamless fiat off-ramp. Institutional-grade compliance." },
  { desk: "FalconX", minTrade: "$1M+", regulatory: "CFTC Swap Dealer, EU VFA (Malta)", strength: "Unified margin accounts (no pre-funding). Deep liquidity across 200+ pairs." },
  { desk: "Galaxy Digital", minTrade: "$1M+", regulatory: "SEC, FINRA (publicly traded)", strength: "Principal desk using own balance sheet. OTC proceeds deployable into yield programs." },
  { desk: "Wintermute", minTrade: "$500K+", regulatory: "Global compliance", strength: "Algorithmic principal dealer. 24/7 trading. Extremely tight spreads on majors." },
  { desk: "Cumberland (DRW)", minTrade: "$1M+", regulatory: "SEC, FINRA", strength: "Backed by DRW's institutional trading infrastructure. Deep BTC/ETH liquidity." },
];

const CUSTODIANS = [
  { name: "Kraken Bank (WY)", detail: "SPDI charter. Bridges digital asset liquidation to institutional fiat custody." },
  { name: "BNY Mellon", detail: "World's largest custodian bank. Active digital assets division for institutional clients." },
  { name: "Anchorage Digital", detail: "OCC-chartered national trust bank. SOC 2 Type II. Federal regulatory framework." },
  { name: "Fidelity Digital Assets", detail: "Backed by Fidelity Investments. Cold-storage custody with institutional insurance." },
  { name: "Northern Trust", detail: "Institutional-grade crypto custody integrated with traditional wealth management." },
];

const PRESERVATION_INSTRUMENTS = [
  { instrument: "Short-Term U.S. Treasury Bills", annReturn: "4.0–5.5%", maxDrawdown: "Near-zero", liquidity: "T+0 to T+1", protection: "U.S. government backing", notes: "Lowest risk. Exempt from state/local tax. 4-week to 1-year maturities." },
  { instrument: "Government Money Market Funds", annReturn: "4.0–5.2%", maxDrawdown: "Low", liquidity: "T+0 to T+1", protection: "SIPC up to $500K", notes: "Stable $1 NAV. Slightly higher yield than savings. Daily liquidity." },
  { instrument: "FDIC-Insured Cash Sweeps (ICS)", annReturn: "3.5–4.5%", maxDrawdown: "Near-zero", liquidity: "T+0", protection: "FDIC up to $250K per bank", notes: "Auto-fragments across 1000s of banks. Single statement. Full FDIC on entire balance." },
];

const ALLOCATION_SHIFT = [
  { asset: "Public Equities", prevGen: "45–50%", nextGen: "30–35%", rationale: "Shift from correlated public markets to illiquid private markets for illiquidity premium and higher alpha." },
  { asset: "Private Equity / VC", prevGen: "25–30%", nextGen: "30–35%", rationale: "Preference for operational control, direct investments, and long-term tax-deferred compounding." },
  { asset: "Digital Assets / Crypto", prevGen: "< 10%", nextGen: "10–15%", rationale: "Core portfolio pillar — actively managed via hedge funds or direct custody as store of value and growth engine." },
  { asset: "Fixed Income / Cash", prevGen: "10–15%", nextGen: "5–8%", rationale: "Conservative buffers minimized. Yield sought via private credit rather than standard bonds." },
];

const REENTRY_CHECKLIST = [
  { label: "Dry Powder Reserve", detail: "Maintain 10–20% of proceeds in stable assets (USD, USDC). Ensures liquidity for opportunistic buys, taxes, or emergencies." },
  { label: "Staged Re-Entry Ladder", detail: "Deploy capital in tranches at predetermined drawdown levels — e.g., 25% at 60% market drop, 25% at 70%, 25% at 80%. Buys at progressively cheaper prices." },
  { label: "Rules-Based Allocation", detail: "No single crypto > 30% of portfolio. No ecosystem > 15%. Cap speculative tokens. Avoid projects with audit failures or key-person risks." },
  { label: "DCA Automation", detail: "Automate dollar-cost averaging for core assets during accumulation phases. Remove emotional decision-making from systematic re-entry." },
  { label: "Quarterly Review Cadence", detail: "Audit allocation drift, reassess counterparty risks, review market signals, update watchlists. Maintain documented what-if scenarios and emergency procedures." },
];

function ConversionTab() {
  return (
    <div>
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.3)", letterSpacing: 2, marginBottom: 8 }}>
          POST-CYCLE CONVERSION — WEALTH PRESERVATION ARCHITECTURE
        </div>
        <h2 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 26,
          fontWeight: 700,
          margin: "0 0 12px",
          lineHeight: 1.2,
          background: "linear-gradient(135deg, #9D4EDD, #6450FF, #00B4FF)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}>
          Strategic Wealth Preservation
        </h2>
        <p style={{ fontFamily: "'Source Serif 4', Georgia, serif", fontSize: 15, lineHeight: 1.8, color: "rgba(255,255,255,0.55)", margin: 0, maxWidth: 720 }}>
          The realization of a highly appreciated cryptocurrency portfolio at the apex of a projected market cycle presents a multifaceted financial, legal, and operational challenge. At this echelon of wealth, traditional retail banking frameworks are fundamentally inadequate. The transition of nine-figure digital asset wealth into preserved, liquid, and tax-optimized fiat currency requires an institutional-grade architecture — executed simultaneously across jurisdictional, fiduciary, and operational domains.
        </p>
      </div>

      <div style={{
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
        gap: 12,
        marginBottom: 40,
      }}>
        {CONVERSION_PHASES.map((phase) => (
          <div key={phase.id} style={{
            background: "rgba(255,255,255,0.02)",
            border: "1px solid rgba(255,255,255,0.06)",
            borderRadius: 10,
            padding: "18px 20px",
            borderLeft: `3px solid ${phase.color}`,
          }}>
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
              <GlowDot color={phase.color} size={6} />
              <span style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: phase.color, letterSpacing: 1.5 }}>
                PHASE {phase.id}
              </span>
            </div>
            <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 14, fontWeight: 600, color: "#fff", marginBottom: 8 }}>
              {phase.label}
            </div>
            <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.45)", margin: 0 }}>
              {phase.summary}
            </p>
          </div>
        ))}
      </div>

      {/* PHASE I: JURISDICTIONAL ENGINEERING */}
      <BlackpaperSection color="#9D4EDD" label="PHASE I — JURISDICTIONAL ENGINEERING & DOMICILE SEVERANCE">
        <BlackpaperHeading>Tax-Optimal Domicile Selection</BlackpaperHeading>
        <BlackpaperPara>
          The geographic location of an individual at the exact moment a highly appreciated asset is liquidated dictates the baseline erosion of that capital. Under both federal IRS guidelines and state-level tax codes, cryptocurrency is treated as <span style={{ color: "#9D4EDD" }}>intangible personal property</span>. The gain realized from its sale is sourced to the taxpayer's state of residence at the time of the sale. For a $232 million liquidation in a state like California (13.3% top rate), the state tax liability alone would exceed $30 million.
        </BlackpaperPara>
        <BlackpaperPara indent>
          The foundational step in wealth preservation is the legal and absolute severance of domicile from a high-tax state and the establishment of residency in a zero-income-tax jurisdiction. This must be completed well before the 2029 cycle peak — not during it. A mere change of driver's license or voter registration is catastrophically insufficient. Courts have repeatedly upheld tax agency determinations against taxpayers who failed to genuinely sever economic, social, and physical ties.
        </BlackpaperPara>

        <BlackpaperHeading sub>Zero-Tax State Comparison</BlackpaperHeading>
        <div style={{ overflowX: "auto", marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "100px 50px 1fr 1fr 1fr", gap: 0, minWidth: 700 }}>
            {["State", "Rate", "Residency Test", "Key Protections", "Notes"].map((h) => (
              <div key={h} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1.2 }}>
                {h.toUpperCase()}
              </div>
            ))}
            {CONVERSION_STATES.map((s) => (
              [s.state, s.rate, s.test, s.protections, s.notes].map((val, i) => (
                <div key={`${s.state}-${i}`} style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: i === 0 ? "#fff" : i === 1 ? "#9D4EDD" : "rgba(255,255,255,0.5)", lineHeight: 1.5, background: i === 1 ? "rgba(157,78,221,0.04)" : "transparent" }}>
                  {i === 0 ? <span style={{ fontWeight: 600 }}>{val}</span> : val}
                </div>
              ))
            ))}
          </div>
        </div>

        <div style={{
          padding: "16px 18px",
          background: "rgba(255,60,60,0.05)",
          border: "1px solid rgba(255,60,60,0.1)",
          borderRadius: 8,
          marginBottom: 20,
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,60,60,0.6)", letterSpacing: 1.5, marginBottom: 8 }}>
            AUDIT RISK — CALIFORNIA FTB & NEW YORK DTF
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.65, color: "rgba(255,255,255,0.5)", margin: "0 0 8px" }}>
            <strong style={{ color: "rgba(255,255,255,0.7)" }}>California</strong> utilizes a subjective "facts-and-circumstances" test — not a strict 183-day rule. The FTB will subpoena cell phone tower pings, ATM withdrawals, credit card locations, and EZ-Pass data. The burden of proof rests entirely on the taxpayer.
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.65, color: "rgba(255,255,255,0.5)", margin: 0 }}>
            <strong style={{ color: "rgba(255,255,255,0.7)" }}>New York</strong> enforces strict statutory residency: maintaining a "permanent place of abode" for &gt;10 months combined with 184+ days triggers full residency taxation — even if domicile was legally changed.
          </p>
        </div>

        <div style={{
          padding: "14px 18px",
          background: "rgba(157,78,221,0.03)",
          border: "1px solid rgba(157,78,221,0.08)",
          borderRadius: 8,
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(157,78,221,0.5)", letterSpacing: 1.5, marginBottom: 6 }}>
            CRITICAL TIMELINE
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.6, color: "rgba(255,255,255,0.5)", margin: 0 }}>
            Domicile severance must be surgically complete <strong style={{ color: "#9D4EDD" }}>12–24 months before</strong> the liquidation event. Physical relocation, property sale in the former state, purchase of primary residence in the new state, migration of banking/professional services, and meticulous presence tracking are all required to survive an audit.
          </p>
        </div>
      </BlackpaperSection>

      {/* PHASE II: FIDUCIARY ARCHITECTURE */}
      <BlackpaperSection color="#6450FF" label="PHASE II — FIDUCIARY ARCHITECTURE & ASSET PROTECTION">
        <BlackpaperHeading>Beyond the LLC Fortress Fallacy</BlackpaperHeading>

        <div style={{
          padding: "16px 18px",
          background: "rgba(255,60,60,0.05)",
          border: "1px solid rgba(255,60,60,0.1)",
          borderRadius: 8,
          marginBottom: 24,
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,60,60,0.6)", letterSpacing: 1.5, marginBottom: 8 }}>
            THE LLC FORTRESS FALLACY
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.65, color: "rgba(255,255,255,0.5)", margin: 0 }}>
            The belief that a Wyoming single-member LLC provides absolute protection is a dangerous misconception. In <em>Olmstead v. FTC</em>, the Florida Supreme Court demonstrated that courts can pierce single-member LLC protections, bypassing charging orders entirely to compel surrender of the underlying membership interest. True institutional-grade protection requires the absolute bifurcation of legal ownership from beneficial enjoyment via an <span style={{ color: "#6450FF" }}>irrevocable trust</span>.
          </p>
        </div>

        <BlackpaperPara>
          To construct an impenetrable firewall around the capital, assets must be structured within a Domestic Asset Protection Trust (DAPT). Among the 17 U.S. states permitting DAPTs, Nevada dominates for three reasons: an aggressively short 2-year statute of limitations, zero exception creditors (ensuring seasoned assets are shielded from all civil litigation), and explicit exemption of cryptocurrencies from taxation as intangible personal property.
        </BlackpaperPara>

        <BlackpaperHeading sub>DAPT Jurisdiction Comparison</BlackpaperHeading>
        <div style={{ overflowX: "auto", marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "100px 80px 1fr 80px 1fr", gap: 0, minWidth: 700 }}>
            {["Jurisdiction", "Statute", "Exception Creditors", "State Tax", "Strategic Advantage"].map((h) => (
              <div key={h} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1.2 }}>
                {h.toUpperCase()}
              </div>
            ))}
            {DAPT_JURISDICTIONS.map((d) => (
              [d.jurisdiction, d.statute, d.exceptionCreditors, d.stateTax, d.advantage].map((val, i) => (
                <div key={`${d.jurisdiction}-${i}`} style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)", lineHeight: 1.5, background: i === 1 && val === "2 Years" ? "rgba(100,80,255,0.05)" : "transparent" }}>
                  {i === 0 ? <span style={{ fontWeight: 600 }}>{val}</span> : val}
                </div>
              ))
            ))}
          </div>
        </div>

        <div style={{
          padding: "14px 18px",
          background: "rgba(100,80,255,0.04)",
          border: "1px solid rgba(100,80,255,0.1)",
          borderRadius: 8,
          marginBottom: 28,
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(100,80,255,0.6)", letterSpacing: 1.5, marginBottom: 6 }}>
            ESTATE TAX EXEMPTION SUNSET
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.65, color: "rgba(255,255,255,0.5)", margin: 0 }}>
            Transfer crypto <strong style={{ color: "#6450FF" }}>in-kind during bear market troughs</strong> to consume minimal lifetime exemption ($13.99M per individual in 2025, reverting to ~$7M in 2026). All subsequent appreciation to $232M occurs inside the trust — permanently excluded from the taxable estate, neutralizing the 40% federal estate tax. An Intentionally Defective Grantor Trust (IDGT) structure allows the grantor to pay income taxes from personal assets, enabling the trust principal to compound tax-free.
          </p>
        </div>

        <BlackpaperHeading sub>Single-Family Office + Private Trust Company</BlackpaperHeading>
        <BlackpaperPara indent>
          A liquid net worth approaching a quarter-billion dollars warrants a dedicated Single-Family Office (SFO) paired with a Private Trust Company (PTC). The SFO handles execution and research; the PTC handles legal authorization and fiduciary oversight. This dual structure allows the family to actively participate in governance without compromising the trust's spendthrift protections.
        </BlackpaperPara>

        <div style={{ overflowX: "auto", marginBottom: 20 }}>
          <div style={{ display: "grid", gridTemplateColumns: "120px 1fr 1fr 1fr", gap: 0, minWidth: 600 }}>
            {["Domain", "SFO Role", "PTC Role", "Integration Synergy"].map((h) => (
              <div key={h} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1.2 }}>
                {h.toUpperCase()}
              </div>
            ))}
            {SFO_PTC_DOMAINS.map((d) => (
              [d.domain, d.sfo, d.ptc, d.synergy].map((val, i) => (
                <div key={`${d.domain}-${i}`} style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                  {i === 0 ? <span style={{ fontWeight: 600 }}>{val}</span> : val}
                </div>
              ))
            ))}
          </div>
        </div>
      </BlackpaperSection>

      {/* PHASE III: INSTITUTIONAL LIQUIDATION */}
      <BlackpaperSection color="#23F0C6" label="PHASE III — INSTITUTIONAL LIQUIDATION MECHANICS">
        <BlackpaperHeading>The OTC Desk Imperative</BlackpaperHeading>
        <BlackpaperPara>
          Executing a market order of $232 million on a public centralized exchange will trigger <span style={{ color: "#23F0C6" }}>catastrophic market slippage</span>. Public order books rarely possess the localized liquidity depth to absorb a nine-figure sell order without collapsing the asset's price. Institutional OTC desks bypass the public order book entirely — sourcing liquidity through proprietary matching engines, dark pools, and direct capital relationships with institutional buyers.
        </BlackpaperPara>
        <BlackpaperPara indent>
          The OTC desk provides a "locked quote" — a guaranteed, flat execution price for the entire block of assets, typically valid for 30 seconds to a few minutes. By accepting the quote, the seller offloads execution risk and price volatility entirely onto the provider. The market remains blind to the transaction until post-trade settlement, preventing predatory HFT algorithms from front-running the liquidation.
        </BlackpaperPara>

        <BlackpaperHeading sub>OTC Desk Comparison</BlackpaperHeading>
        <div style={{ overflowX: "auto", marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "130px 80px 1fr 1fr", gap: 0, minWidth: 650 }}>
            {["Desk", "Min Trade", "Regulatory Status", "Key Strength"].map((h) => (
              <div key={h} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1.2 }}>
                {h.toUpperCase()}
              </div>
            ))}
            {OTC_DESKS.map((d) => (
              [d.desk, d.minTrade, d.regulatory, d.strength].map((val, i) => (
                <div key={`${d.desk}-${i}`} style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                  {i === 0 ? <span style={{ fontWeight: 600 }}>{val}</span> : val}
                </div>
              ))
            ))}
          </div>
        </div>

        <div style={{
          padding: "14px 18px",
          background: "rgba(35,240,198,0.04)",
          border: "1px solid rgba(35,240,198,0.1)",
          borderRadius: 8,
          marginBottom: 28,
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(35,240,198,0.6)", letterSpacing: 1.5, marginBottom: 6 }}>
            TEST TRANSACTION PROTOCOL
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.65, color: "rgba(255,255,255,0.5)", margin: 0 }}>
            Before executing the full transaction, run a <strong style={{ color: "#23F0C6" }}>$50K–$100K test</strong> through the entire OTC pipeline. Verify that digital assets move securely to the desk and that resulting fiat clears the banking system without triggering automated AML freezes — which are extremely common when sudden massive wire transfers hit standard retail bank accounts.
          </p>
        </div>

        <BlackpaperHeading sub>Crypto-Native Institutional Custodians</BlackpaperHeading>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: 10, marginBottom: 20 }}>
          {CUSTODIANS.map((c) => (
            <div key={c.name} style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8,
              padding: "14px 16px",
            }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 6 }}>
                {c.name}
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, lineHeight: 1.55, color: "rgba(255,255,255,0.45)", margin: 0 }}>
                {c.detail}
              </p>
            </div>
          ))}
        </div>
      </BlackpaperSection>

      {/* PHASE IV: CAPITAL PRESERVATION */}
      <BlackpaperSection color="#F4B728" label="PHASE IV — CAPITAL PRESERVATION & RISK MITIGATION">
        <BlackpaperHeading>Neutralizing Counterparty Banking Risk</BlackpaperHeading>
        <BlackpaperPara>
          Once $232 million is secured in fiat, the risk profile shifts from crypto volatility to <span style={{ color: "#F4B728" }}>traditional counterparty banking risk</span>. The FDIC limits insurance to $250,000 per depositor, per institution. Depositing $200M into a single bank means $199.75M becomes an unsecured claim in insolvency — potentially tied up in receivership for years. The collapses of Silicon Valley Bank, Credit Suisse, and First Republic are stark reminders that "too big to fail" does not guarantee uninsured deposit protection.
        </BlackpaperPara>

        <BlackpaperHeading sub>The IntraFi Sweep Solution</BlackpaperHeading>
        <BlackpaperPara indent>
          The IntraFi Network's Insured Cash Sweep (ICS) and CDARS programs solve this without manually opening hundreds of bank accounts. When $200M is deposited into an ICS-participating bank, proprietary software automatically fragments the capital into sub-$250K increments, sweeping them across thousands of participating FDIC-insured banks nationwide. The result: absolute multi-million-dollar FDIC protection on the entire principal, with a single banking relationship, single consolidated statement, and daily liquidity.
        </BlackpaperPara>

        <BlackpaperHeading sub>Preservation Instruments Comparison</BlackpaperHeading>
        <div style={{ overflowX: "auto", marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "150px 80px 80px 80px 1fr 1fr", gap: 0, minWidth: 750 }}>
            {["Instrument", "Return", "Drawdown", "Liquidity", "Protection", "Notes"].map((h) => (
              <div key={h} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1.2 }}>
                {h.toUpperCase()}
              </div>
            ))}
            {PRESERVATION_INSTRUMENTS.map((p) => (
              [p.instrument, p.annReturn, p.maxDrawdown, p.liquidity, p.protection, p.notes].map((val, i) => (
                <div key={`${p.instrument}-${i}`} style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)", lineHeight: 1.5 }}>
                  {i === 0 ? <span style={{ fontWeight: 600 }}>{val}</span> : val}
                </div>
              ))
            ))}
          </div>
        </div>

        <div style={{
          padding: "14px 18px",
          background: "rgba(244,183,40,0.04)",
          border: "1px solid rgba(244,183,40,0.1)",
          borderRadius: 8,
          marginBottom: 20,
        }}>
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(244,183,40,0.6)", letterSpacing: 1.5, marginBottom: 6 }}>
            BOND LADDER VS. MONEY MARKET — DECISION FRAMEWORK
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.65, color: "rgba(255,255,255,0.5)", margin: "0 0 8px" }}>
            <strong style={{ color: "rgba(255,255,255,0.7)" }}>Rate-cutting environment:</strong> MMF yields drop synchronously with benchmark rates. Construct a distributing Treasury bond ladder (1–3yr staggered maturities) to lock in the current yield curve, rendering returns immune to subsequent Fed rate cuts.
          </p>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.65, color: "rgba(255,255,255,0.5)", margin: 0 }}>
            <strong style={{ color: "rgba(255,255,255,0.7)" }}>Rate-holding/rising environment:</strong> MMFs automatically capture rising rates daily. Favor short-duration MMFs for maximum flexibility and immediate liquidity, with each rung of the ladder returning principal available for re-entry deployment.
          </p>
        </div>
      </BlackpaperSection>

      {/* PHASE V: TREASURY MANAGEMENT & RE-ENTRY */}
      <BlackpaperSection color="#00B4FF" label="PHASE V — TREASURY MANAGEMENT & NEXT-CYCLE PREPAREDNESS">
        <BlackpaperHeading>Generational Shifts in Asset Allocation</BlackpaperHeading>
        <BlackpaperPara>
          With capital protected and generating baseline yield, the SFO mandate shifts from preservation to tactical deployment. The Next-Gen UHNW cohort aggressively allocates toward private equity, direct business ownership, and venture capital — where capital compounds tax-deferred for a decade or more. Digital assets are no longer fringe speculation but a <span style={{ color: "#00B4FF" }}>core portfolio pillar</span>.
        </BlackpaperPara>

        <BlackpaperHeading sub>UHNW Allocation: Previous Gen vs. Next Gen</BlackpaperHeading>
        <div style={{ overflowX: "auto", marginBottom: 24 }}>
          <div style={{ display: "grid", gridTemplateColumns: "150px 90px 90px 1fr", gap: 0, minWidth: 550 }}>
            {["Asset Class", "Previous Gen", "Next Gen", "Strategic Rationale"].map((h) => (
              <div key={h} style={{ padding: "10px 12px", background: "rgba(255,255,255,0.04)", borderBottom: "1px solid rgba(255,255,255,0.08)", fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,255,255,0.4)", letterSpacing: 1.2 }}>
                {h.toUpperCase()}
              </div>
            ))}
            {ALLOCATION_SHIFT.map((a) => (
              [a.asset, a.prevGen, a.nextGen, a.rationale].map((val, i) => (
                <div key={`${a.asset}-${i}`} style={{ padding: "10px 12px", borderBottom: "1px solid rgba(255,255,255,0.04)", fontFamily: "'DM Sans', sans-serif", fontSize: 12, color: i === 0 ? "#fff" : "rgba(255,255,255,0.5)", lineHeight: 1.5, background: i === 2 ? "rgba(0,180,255,0.04)" : "transparent" }}>
                  {i === 0 ? <span style={{ fontWeight: 600 }}>{val}</span> : val}
                </div>
              ))
            ))}
          </div>
        </div>

        <BlackpaperHeading sub>Securities-Backed Lines of Credit (SBLOC)</BlackpaperHeading>
        <BlackpaperPara indent>
          A core tenet of UHNW wealth management is the strict avoidance of unnecessary asset liquidation. Selling an appreciated asset triggers immediate capital gains tax, breaking the compounding curve. Instead, the SFO facilitates liquidity through SBLOCs — borrowing cash against the portfolio at 50–70% LTV ratios. Because debt is not taxable income, capital is accessed <span style={{ color: "#00B4FF" }}>entirely tax-free</span> while underlying assets continue to appreciate. The SBLOC interest rate (6–8%, often lower for institutional SFO clients) is eclipsed by retained market gains plus avoidance of the 23.8% federal capital gains rate.
        </BlackpaperPara>

        <BlackpaperHeading sub>Re-Entry Execution Checklist</BlackpaperHeading>
        <div style={{ display: "flex", flexDirection: "column", gap: 8, marginBottom: 20 }}>
          {REENTRY_CHECKLIST.map((item, idx) => (
            <div key={idx} style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.06)",
              borderRadius: 8,
              padding: "14px 18px",
              display: "flex",
              gap: 14,
              alignItems: "flex-start",
            }}>
              <div style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                color: "#00B4FF",
                background: "rgba(0,180,255,0.08)",
                borderRadius: 4,
                padding: "3px 8px",
                flexShrink: 0,
                marginTop: 2,
              }}>
                {String(idx + 1).padStart(2, "0")}
              </div>
              <div>
                <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 13, fontWeight: 600, color: "#fff", marginBottom: 4 }}>
                  {item.label}
                </div>
                <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 12, lineHeight: 1.55, color: "rgba(255,255,255,0.45)", margin: 0 }}>
                  {item.detail}
                </p>
              </div>
            </div>
          ))}
        </div>
      </BlackpaperSection>
    </div>
  );
}

export default function LiquidityCascade() {
  const [activePhase, setActivePhase] = useState(0);
  const [activeNav, setActiveNav] = useState("overview");
  const { solPrice, zecPrice } = useMarketData();

  return (
    <>
    <GalaxyBackground />
    <ShootingStars />
    <AlienSaucer />
    <div style={{ minHeight: "100vh", background: "transparent", color: "#fff", fontFamily: "'DM Sans', sans-serif", position: "relative", zIndex: 2 }}>
      <div style={{ padding: "32px 28px 0", maxWidth: 960, margin: "0 auto" }}>
        <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 10, color: "rgba(255,255,255,0.25)", letterSpacing: 2, marginBottom: 8 }}>
          CAPITAL ROTATION MATRIX — 2024 HALVING CYCLE
        </div>
        <h1
          style={{
            fontFamily: "'Space Grotesk', sans-serif",
            fontSize: 32,
            fontWeight: 700,
            margin: "0 0 6px",
            lineHeight: 1.15,
            background: "linear-gradient(135deg, #9D4EDD, #23F0C6, #F4B728)",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
          }}
        >
          Alpha Hybrid
        </h1>
        <p style={{ fontSize: 14, color: "rgba(255,255,255,0.45)", margin: "0 0 24px", maxWidth: 620, lineHeight: 1.55 }}>
          A chronological matrix for capital rotation across Solana, XRP, and Zcash — anchored to the Bitcoin halving as the definitive temporal fulcrum.
        </p>

        <nav aria-label="Dashboard sections">
        <div role="tablist" style={{ display: "flex", gap: 4, borderBottom: "1px solid rgba(255,255,255,0.06)", marginBottom: 4, overflowX: "auto", scrollbarWidth: "none" }}>
          {NAV_ITEMS.map((n) => (
            <button
              key={n.key}
              role="tab"
              aria-selected={activeNav === n.key}
              aria-controls={`panel-${n.key}`}
              id={`tab-${n.key}`}
              onClick={() => setActiveNav(n.key)}
              style={{
                fontFamily: "'JetBrains Mono', monospace",
                fontSize: 10,
                letterSpacing: 1.5,
                padding: "8px 14px",
                background: "none",
                border: "none",
                color: activeNav === n.key ? "#fff" : "rgba(255,255,255,0.3)",
                borderBottom: activeNav === n.key ? "2px solid #fff" : "2px solid transparent",
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {n.label}
            </button>
          ))}
        </div>
        </nav>
      </div>

      <main role="tabpanel" id={`panel-${activeNav}`} aria-labelledby={`tab-${activeNav}`} style={{ padding: "20px 28px 60px", maxWidth: 960, margin: "0 auto" }}>
        {activeNav === "overview" && (
          <>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              {PHASES.map((p, i) => (
                <PhaseCard
                  key={i}
                  phase={p}
                  isActive={activePhase === i}
                  onClick={() => setActivePhase(i)}
                  currentPrice={
                    p.asset === "SOL" ? solPrice :
                    p.asset === "ZEC" ? zecPrice :
                    undefined
                  }
                />
              ))}
            </div>
            <Timeline activePhase={activePhase} setActivePhase={setActivePhase} />
            <CapitalFlowBar phases={PHASES} />
            <PhaseDetail phase={PHASES[activePhase]} />
          </>
        )}

        {activeNav === "macro" && (
          <>
            <MacroContext />
            <BtcDominanceNote />
            <div
              style={{
                background: "rgba(255,255,255,0.02)",
                border: "1px solid rgba(255,255,255,0.06)",
                borderRadius: 10,
                padding: "20px 22px",
                marginTop: 20,
              }}
            >
              <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 11, color: "rgba(255,255,255,0.4)", letterSpacing: 1.5, marginBottom: 10 }}>
                THE MID-CYCLE DILEMMA
              </div>
              <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 13, lineHeight: 1.65, color: "rgba(255,255,255,0.55)", margin: "0 0 10px" }}>
                The objective of macro capital rotation is not catching the absolute bottom of every asset simultaneously. The true edge lies in{" "}
                <span style={{ color: "#23F0C6" }}>chaining expansion phases</span>. While XRP was suppressed by the SEC lawsuit for 18 months, that same capital deployed in SOL generated
                a 19.66x return. One must rotate based on which asset is entering expansion next, ignoring nominal distance from cycle lows.
              </p>
            </div>
          </>
        )}

        {activeNav === "phases" && PHASES.map((p, i) => <PhaseDetail key={i} phase={p} />)}
        {activeNav === "signals" && <SignalsTab />}
        {activeNav === "cycles" && <CyclesTab />}
        {activeNav === "execution" && <ExecutionTab />}
        {activeNav === "calculator" && <CalculatorSection />}
        {activeNav === "predict" && <Predictions2028 />}
        {activeNav === "blackpaper" && <Blackpaper />}
        {activeNav === "conversion" && <ConversionTab />}

        <div
          style={{
            marginTop: 30,
            padding: "14px 16px",
            background: "rgba(255,60,60,0.06)",
            border: "1px solid rgba(255,60,60,0.12)",
            borderRadius: 8,
          }}
        >
          <div style={{ fontFamily: "'JetBrains Mono', monospace", fontSize: 9, color: "rgba(255,60,60,0.6)", letterSpacing: 1.5, marginBottom: 4 }}>
            RISK DISCLOSURE
          </div>
          <p style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 11, color: "rgba(255,255,255,0.35)", lineHeight: 1.55, margin: 0 }}>
            This is a theoretical analysis based on historical data. Cryptocurrency investments carry extreme risk including total loss of capital.
            Past performance does not guarantee future results. Executing large orders in illiquid assets carries significant slippage risk.
            Privacy coins face ongoing regulatory scrutiny and potential delistings. This is not financial advice.
          </p>
        </div>
      </main>
    </div>
    </>
  );
}
