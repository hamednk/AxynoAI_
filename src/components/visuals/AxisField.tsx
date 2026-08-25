"use client";

import { useEffect, useRef } from "react";

/** Logo-matched galaxy: nebula + tech streaks + constellation network */
export function AxisField() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let raf = 0;
    let t = 0;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const stars = Array.from({ length: 160 }, () => ({
      x: Math.random(),
      y: Math.random(),
      r: Math.random() * 1.7 + 0.2,
      a: Math.random() * 0.75 + 0.2,
      tw: Math.random() * Math.PI * 2,
    }));

    const nodes = Array.from({ length: 32 }, () => ({
      x: 0.32 + Math.random() * 0.64,
      y: 0.1 + Math.random() * 0.8,
      r: Math.random() * 2.4 + 1.2,
      phase: Math.random() * Math.PI * 2,
    }));

    const links: [number, number][] = [];
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x;
        const dy = nodes[i].y - nodes[j].y;
        if (Math.hypot(dx, dy) < 0.2) links.push([i, j]);
      }
    }

    const streaks = Array.from({ length: 6 }, (_, i) => ({
      angle: -0.35 + i * 0.12,
      offset: Math.random(),
      width: 1.2 + Math.random() * 2.2,
      speed: 0.08 + Math.random() * 0.12,
    }));

    const resize = () => {
      const parent = canvas.parentElement;
      if (!parent) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = parent.clientWidth;
      const h = parent.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = `${w}px`;
      canvas.style.height = `${h}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const isDark = () => document.documentElement.classList.contains("dark");

    const draw = () => {
      const w = canvas.clientWidth;
      const h = canvas.clientHeight;
      ctx.clearRect(0, 0, w, h);

      const dark = isDark();
      const neon = dark ? "rgba(0,229,255,0.95)" : "rgba(0,136,204,0.85)";
      const neonSoft = dark ? "rgba(0,180,255,0.2)" : "rgba(0,168,232,0.14)";

      // Nebula
      const n1 = ctx.createRadialGradient(w * 0.8, h * 0.15, 0, w * 0.8, h * 0.15, w * 0.5);
      n1.addColorStop(0, dark ? "rgba(0,180,255,0.28)" : "rgba(0,160,230,0.22)");
      n1.addColorStop(0.5, dark ? "rgba(0,80,160,0.1)" : "rgba(0,100,180,0.08)");
      n1.addColorStop(1, "transparent");
      ctx.fillStyle = n1;
      ctx.fillRect(0, 0, w, h);

      const n2 = ctx.createRadialGradient(w * 0.15, h * 0.75, 0, w * 0.15, h * 0.75, w * 0.42);
      n2.addColorStop(0, dark ? "rgba(0,50,140,0.35)" : "rgba(0,90,170,0.16)");
      n2.addColorStop(1, "transparent");
      ctx.fillStyle = n2;
      ctx.fillRect(0, 0, w, h);

      // Diagonal galactic/tech streaks (logo energy lines)
      for (const s of streaks) {
        const progress = (s.offset + t * s.speed) % 1;
        ctx.save();
        ctx.translate(w * 0.55, h * 0.45);
        ctx.rotate(s.angle);
        const grad = ctx.createLinearGradient(-w, 0, w, 0);
        // Fixed stops in (0,1) — animate via stroke alpha instead
        const alpha = 0.2 + 0.45 * Math.sin(progress * Math.PI * 2) ** 2;
        grad.addColorStop(0, "transparent");
        grad.addColorStop(
          0.5,
          dark
            ? `rgba(0,229,255,${alpha})`
            : `rgba(0,140,220,${alpha * 0.7})`,
        );
        grad.addColorStop(1, "transparent");
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width;
        ctx.shadowColor = dark ? "rgba(0,200,255,0.5)" : "rgba(0,140,220,0.3)";
        ctx.shadowBlur = 12;
        ctx.globalAlpha = 0.85;
        ctx.beginPath();
        ctx.moveTo(-w * 0.9, (progress - 0.5) * h * 0.25);
        ctx.lineTo(w * 0.9, (progress - 0.5) * h * 0.25);
        ctx.stroke();
        ctx.globalAlpha = 1;
        ctx.restore();
      }

      // Stars / galaxy speckles
      for (const s of stars) {
        const twinkle = 0.4 + Math.sin(t * 1.5 + s.tw) * 0.6;
        ctx.fillStyle = dark
          ? `rgba(220,245,255,${s.a * twinkle})`
          : `rgba(0,90,160,${s.a * twinkle * 0.45})`;
        ctx.beginPath();
        ctx.arc(s.x * w, s.y * h, s.r, 0, Math.PI * 2);
        ctx.fill();
      }

      // Neural / constellation mesh (logo A interior)
      for (const [i, j] of links) {
        const a = nodes[i];
        const b = nodes[j];
        const pulse = 0.5 + Math.sin(t * 1.2 + a.phase) * 0.5;
        ctx.strokeStyle = dark
          ? `rgba(0,220,255,${0.1 + pulse * 0.28})`
          : `rgba(0,120,200,${0.08 + pulse * 0.18})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(a.x * w, a.y * h);
        ctx.lineTo(b.x * w, b.y * h);
        ctx.stroke();
      }

      for (const n of nodes) {
        const pulse = 1 + Math.sin(t * 2.1 + n.phase) * 0.4;
        const x = n.x * w;
        const y = n.y * h;
        ctx.fillStyle = neonSoft;
        ctx.beginPath();
        ctx.arc(x, y, n.r * pulse * 3.4, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = neon;
        ctx.beginPath();
        ctx.arc(x, y, n.r * pulse, 0, Math.PI * 2);
        ctx.fill();
      }

      // Circuit axis
      const ax = w * 0.7;
      ctx.strokeStyle = dark ? "rgba(0,200,255,0.22)" : "rgba(0,120,200,0.2)";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.moveTo(ax, 0);
      ctx.lineTo(ax, h);
      ctx.stroke();

      // Waveform
      const mid = h * 0.52;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 3) {
        const y =
          mid +
          Math.sin(x * 0.015 + t * 1.4) * 14 +
          Math.sin(x * 0.036 - t) * 7 +
          Math.sin(x * 0.006 + t * 0.35) * 22;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = neon;
      ctx.lineWidth = 1.5;
      ctx.shadowColor = dark ? "rgba(0,220,255,0.4)" : "transparent";
      ctx.shadowBlur = dark ? 8 : 0;
      ctx.stroke();
      ctx.shadowBlur = 0;

      if (!reduce) {
        t += 0.016;
        raf = requestAnimationFrame(draw);
      }
    };

    resize();
    draw();
    window.addEventListener("resize", resize);
    const observer = new MutationObserver(() => {
      if (reduce) draw();
    });
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["class"],
    });

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0 size-full"
      aria-hidden
    />
  );
}
