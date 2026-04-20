import { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import { mouseState } from '../../utils/mouse-state';

const INNER_LERP_DUR = 0.45;
const OUTER_LERP_DUR = 0.55;
const INNER_BASE_R = 22;
const INNER_IDLE_R = 18;
const OUTER_BASE_R = 52;
const IDLE_MS = 400;

export function MagneticCursor() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Refs para quickTo
  const innerTo = useRef<{ x: Function; y: Function } | null>(null);
  const outerTo = useRef<{ x: Function; y: Function } | null>(null);

  useGSAP(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;

    const inner = { x: mouseState.x, y: mouseState.y };
    const outer = { x: mouseState.x, y: mouseState.y };

    // Iniciliza quickTo para maior performance
    innerTo.current = {
      x: gsap.quickTo(inner, "x", { duration: INNER_LERP_DUR, ease: "power3.out" }),
      y: gsap.quickTo(inner, "y", { duration: INNER_LERP_DUR, ease: "power3.out" })
    };

    outerTo.current = {
      x: gsap.quickTo(outer, "x", { duration: OUTER_LERP_DUR, ease: "power3.out" }),
      y: gsap.quickTo(outer, "y", { duration: OUTER_LERP_DUR, ease: "power3.out" })
    };

    let raf = 0;
    let lastMoveTime = 0;
    let innerRadius = INNER_BASE_R;
    let crosshairOpacity = 0;
    let coordsOpacity = 0;
    let clickPulseT = -1;
    let lastT = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }

    const handleMouseMove = (e: MouseEvent) => {
      mouseState.vx = e.clientX - mouseState.x;
      mouseState.vy = e.clientY - mouseState.y;
      mouseState.x = e.clientX;
      mouseState.y = e.clientY;
      lastMoveTime = performance.now();

      // Atualiza os alvos do quickTo
      innerTo.current?.x(e.clientX);
      innerTo.current?.y(e.clientY);
      outerTo.current?.x(e.clientX);
      outerTo.current?.y(e.clientY);
    };

    const handleClick = () => { clickPulseT = 0; };

    function step(now: number) {
      const dt = Math.min((now - lastT) / 1000, 0.05);
      lastT = now;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const idleMs = now - lastMoveTime;
      const speed = Math.sqrt(mouseState.vx ** 2 + mouseState.vy ** 2);
      const moving = speed > 1.5 || idleMs < 80;

      mouseState.vx *= 0.75;
      mouseState.vy *= 0.75;

      crosshairOpacity += ((moving ? 0 : 0.35) - crosshairOpacity) * 0.1;
      coordsOpacity += ((idleMs > IDLE_MS && !moving ? 0.45 : 0) - coordsOpacity) * 0.08;

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

      // Central Dot
      ctx.beginPath();
      ctx.arc(mx, my, 3, 0, Math.PI * 2);
      ctx.fillStyle = '#0A0A0A'; // Digital Ink (Abyss)
      ctx.fill();

      // Crosshair
      if (crosshairOpacity > 0.01) {
        ctx.strokeStyle = `rgba(10,10,10,${crosshairOpacity.toFixed(3)})`;
        ctx.lineWidth = 0.8;
        ctx.beginPath(); ctx.moveTo(mx - 50, my); ctx.lineTo(mx - 8, my); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx + 8, my); ctx.lineTo(mx + 50, my); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx, my - 50); ctx.lineTo(mx, my - 8); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(mx, my + 8); ctx.lineTo(mx, my + 50); ctx.stroke();
      }

      // Inner ring (GSAP Optimized)
      ctx.beginPath();
      ctx.arc(inner.x, inner.y, Math.max(1, innerRadius), 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(10,10,10,0.55)';
      ctx.lineWidth = 1;
      ctx.stroke();

      // Outer ring (GSAP Optimized)
      ctx.beginPath();
      ctx.arc(outer.x, outer.y, outerRadius, 0, Math.PI * 2);
      ctx.strokeStyle = 'rgba(10,10,10,0.18)';
      ctx.lineWidth = 0.6;
      ctx.stroke();

      // Coordinates
      if (coordsOpacity > 0.01) {
        ctx.font = `9px 'DM Mono', monospace`;
        ctx.fillStyle = `rgba(10,10,10,${coordsOpacity.toFixed(3)})`;
        ctx.fillText(`X: ${Math.round(mx)}  Y: ${Math.round(my)}`, mx + 12, my + 16);
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
  }, { scope: containerRef });

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
