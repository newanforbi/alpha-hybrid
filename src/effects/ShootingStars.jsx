import { useEffect, useRef } from "react";

export function ShootingStars() {
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
