"use client";

import { useEffect, useRef } from "react";

/** Full-bleed axial signal field — waveform + lattice, not neural particles */
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
      const ink = dark ? "rgba(232,236,242,0.08)" : "rgba(16,20,28,0.07)";
      const steel = dark ? "rgba(122,155,184,0.35)" : "rgba(61,90,115,0.35)";
      const accent = dark ? "rgba(224,74,60,0.85)" : "rgba(200,50,40,0.8)";
      const accentSoft = dark ? "rgba(224,74,60,0.18)" : "rgba(200,50,40,0.14)";

      // Diagonal lattice (axial geometry)
      ctx.strokeStyle = ink;
      ctx.lineWidth = 1;
      const step = 56;
      for (let x = -h; x < w + h; x += step) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x + h * 0.35, h);
        ctx.stroke();
      }

      // Vertical axis
      const ax = w * 0.62;
      ctx.strokeStyle = steel;
      ctx.lineWidth = 1.25;
      ctx.beginPath();
      ctx.moveTo(ax, 0);
      ctx.lineTo(ax, h);
      ctx.stroke();

      // Cross ticks
      for (let y = 40; y < h; y += 48) {
        ctx.beginPath();
        ctx.moveTo(ax - 8, y);
        ctx.lineTo(ax + 8, y);
        ctx.stroke();
      }

      // Seismograph / signal waveform
      const mid = h * 0.55;
      ctx.beginPath();
      for (let x = 0; x <= w; x += 3) {
        const n1 = Math.sin(x * 0.018 + t * 1.4) * 18;
        const n2 = Math.sin(x * 0.041 - t * 0.9) * 9;
        const n3 = Math.sin(x * 0.007 + t * 0.35) * 28;
        const spike =
          Math.abs(Math.sin(x * 0.012 + t)) > 0.97
            ? Math.sin(x * 0.2 + t * 3) * 42
            : 0;
        const y = mid + n1 + n2 + n3 + spike;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.strokeStyle = accent;
      ctx.lineWidth = 1.75;
      ctx.stroke();

      // Soft fill under wave
      ctx.lineTo(w, h);
      ctx.lineTo(0, h);
      ctx.closePath();
      ctx.fillStyle = accentSoft;
      ctx.fill();

      // Orbit nodes on axis
      for (let i = 0; i < 5; i++) {
        const y = ((t * 40 + i * 90) % (h + 40)) - 20;
        const pulse = 3 + Math.sin(t * 2 + i) * 1.5;
        ctx.fillStyle = accent;
        ctx.beginPath();
        ctx.arc(ax, y, pulse, 0, Math.PI * 2);
        ctx.fill();
      }

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
