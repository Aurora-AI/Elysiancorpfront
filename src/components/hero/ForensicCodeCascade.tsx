import { useEffect, useRef } from 'react';
import { REAL_CODE_SNIPPETS } from '../../data/snippets';

interface Props {
  isHovered?: boolean;
  isFinalState?: boolean;
}

interface Stream {
  x: number;
  y: number;
  speed: number;
  snippet: string;
  charIndex: number;
  opacity: number;
}

export function ForensicCodeCascade({ isHovered = false, isFinalState = false }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isHoveredRef = useRef(isHovered);
  const isFinalStateRef = useRef(isFinalState);

  useEffect(() => {
    isHoveredRef.current = isHovered;
  }, [isHovered]);

  useEffect(() => {
    isFinalStateRef.current = isFinalState;
  }, [isFinalState]);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext('2d')!;
    let streams: Stream[] = [];
    let raf = 0;

    const initStreams = () => {
      const streamCount = Math.floor(window.innerWidth / 20);
      streams = Array.from({ length: streamCount }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight * -1,
        speed: 0.5 + Math.random() * 1.5,
        snippet: REAL_CODE_SNIPPETS[Math.floor(Math.random() * REAL_CODE_SNIPPETS.length)],
        charIndex: 0,
        opacity: 0.05 + Math.random() * 0.15,
      }));
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.font = "9px 'DM Mono', monospace";
      
      streams.forEach((stream) => {
        // Institutional color logic
        const color = isFinalStateRef.current ? `26, 26, 23` : `244, 241, 234`;
        ctx.fillStyle = `rgba(${color}, ${stream.opacity})`;
        
        const chars = stream.snippet.split('');
        chars.forEach((char, i) => {
          const charY = stream.y + (i * 11);
          if (charY > 0 && charY < canvas.height) {
            ctx.fillText(char, stream.x, charY);
          }
        });

        if (!isHoveredRef.current) {
          stream.y += stream.speed;
        }

        if (stream.y > canvas.height) {
          stream.y = -stream.snippet.length * 11;
          stream.x = Math.random() * window.innerWidth;
          stream.snippet = REAL_CODE_SNIPPETS[Math.floor(Math.random() * REAL_CODE_SNIPPETS.length)];
        }
      });

      raf = requestAnimationFrame(draw);
    };

    const resize = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.scale(dpr, dpr);
      initStreams();
    };

    window.addEventListener('resize', resize);
    resize();
    raf = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none absolute inset-0 z-10"
    />
  );
}
