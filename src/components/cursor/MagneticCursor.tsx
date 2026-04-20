// src/components/cursor/MagneticCursor.tsx
import { useEffect, useRef } from 'react';
import { mouseState } from '../../utils/mouse-state';

const INNER_LERP = 0.18;
const OUTER_LERP = 0.055;
const INNER_BASE_R = 22;
const INNER_IDLE_R = 18;
const OUTER_BASE_R = 52;
const IDLE_MS = 400;

export default function MagneticCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // After null guards, TypeScript knows these are non-null for the scope below
    const canvasRef_ = canvas as HTMLCanvasElement;
    const ctx_ = ctx as CanvasRenderingContext2D;

    let raf = 0;
    let lastMoveTime = 0;

    const inner = { x: -1000, y: -1000 };
    const outer = { x: -1000, y: -1000 };
    let innerRadius = INNER_BASE_R;
    let crosshairOpacity = 0;
    let coordsOpacity = 0;
    let clickPulseT = -1;
    let lastT = 0;

    function resize() {
      canvasRef_.width = window.innerWidth;
      canvasRef_.height = window.innerHeight;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseState.vx = e.clientX - mouseState.x;
      mouseState.vy = e.clientY - mouseState.y;
      mouseState.x = e.clientX;
      mouseState.y = e.clientY;
      lastMoveTime = performance.now();
    };

    const handleClick = () => { clickPulseT = 0; };

    function step(now: number) {
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;

      ctx_.clearRect(0, 0, canvasRef_.width, canvasRef_.height);

      const idleMs = now - lastMoveTime;
      const speed = Math.sqrt(mouseState.vx ** 2 + mouseState.vy ** 2);
      const moving = speed > 1.5 || idleMs < 80;

      mouseState.vx *= 0.75;
      mouseState.vy *= 0.75;

      crosshairOpacity += ((moving ? 0 : 0.35) - crosshairOpacity) * 0.1;
      coordsOpacity += ((idleMs > IDLE_MS && !moving ? 0.45 : 0) - coordsOpacity) * 0.08;

      inner.x += (mouseState.x - inner.x) * INNER_LERP;
      inner.y += (mouseState.y - inner.y) * INNER_LERP;
      outer.x += (mouseState.x - outer.x) * OUTER_LERP;
      outer.y += (mouseState.y - outer.y) * OUTER_LERP;

      let pulseR = 0;
      if (clickPulseT >= 0) {
        clickPulseT += dt;
        const t = Math.min(clickPulseT / 0.2, 1);
        pulseR = (38 - INNER_BASE_R) * (1 - t);
        if (t >= 1) clickPulseT = -1;
      }
      const innerRadiusTarget = (moving ? INNER_BASE_R : INNER_IDLE_R) + pulseR;
      innerRadius += (innerRadiusTarget - innerRadius) * 0.2;

      const outerRadius = OUTER_BASE_R + Math.min(speed * 2, 20);

      const mx = mouseState.x;
      const my = mouseState.y;

      // Dot
      ctx_.beginPath();
      ctx_.arc(mx, my, 3, 0, Math.PI * 2);
      ctx_.fillStyle = 'rgba(255,255,255,1)';
      ctx_.fill();

      // Crosshair
      if (crosshairOpacity > 0.01) {
        ctx_.strokeStyle = `rgba(255,255,255,${crosshairOpacity.toFixed(3)})`;
        ctx_.lineWidth = 0.8;
        ctx_.beginPath(); ctx_.moveTo(mx - 50, my); ctx_.lineTo(mx - 8, my); ctx_.stroke();
        ctx_.beginPath(); ctx_.moveTo(mx + 8, my); ctx_.lineTo(mx + 50, my); ctx_.stroke();
        ctx_.beginPath(); ctx_.moveTo(mx, my - 50); ctx_.lineTo(mx, my - 8); ctx_.stroke();
        ctx_.beginPath(); ctx_.moveTo(mx, my + 8); ctx_.lineTo(mx, my + 50); ctx_.stroke();
      }

      // Inner ring
      ctx_.beginPath();
      ctx_.arc(inner.x, inner.y, Math.max(1, innerRadius), 0, Math.PI * 2);
      ctx_.strokeStyle = 'rgba(255,255,255,0.75)';
      ctx_.lineWidth = 1;
      ctx_.stroke();

      // Outer ring
      ctx_.beginPath();
      ctx_.arc(outer.x, outer.y, outerRadius, 0, Math.PI * 2);
      ctx_.strokeStyle = 'rgba(255,255,255,0.25)';
      ctx_.lineWidth = 0.6;
      ctx_.stroke();

      // Coordinates
      if (coordsOpacity > 0.01) {
        ctx_.font = `9px 'DM Mono', 'Courier New', monospace`;
        ctx_.fillStyle = `rgba(255,255,255,${coordsOpacity.toFixed(3)})`;
        ctx_.fillText(`X: ${Math.round(mx)}  Y: ${Math.round(my)}`, mx + 12, my + 16);
      }

      raf = requestAnimationFrame(step);
    }

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('click', handleClick);
    window.addEventListener('resize', resize);
    resize();
    raf = requestAnimationFrame(step);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('click', handleClick);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        width: '100%',
        height: '100%',
        display: 'block',
        pointerEvents: 'none',
        zIndex: 50,
      }}
    />
  );
}
