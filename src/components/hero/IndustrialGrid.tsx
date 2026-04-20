import { useEffect, useRef } from 'react';
import { mouseState } from '../../utils/mouse-state';

export function IndustrialGrid() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    let raf = 0;

    const update = () => {
      // Update CSS variables for the radial mask
      container.style.setProperty('--mouse-x', `${mouseState.x}px`);
      container.style.setProperty('--mouse-y', `${mouseState.y}px`);
      
      raf = requestAnimationFrame(update);
    };

    raf = requestAnimationFrame(update);

    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div 
      ref={containerRef}
      className="industrial-grid-layer"
      style={{
        '--mouse-x': '-1000px',
        '--mouse-y': '-1000px'
      } as any}
    >
      {/* The main grid mesh */}
      <div className="grid-mesh" />
      
      {/* The magnetic aura highlight */}
      <div className="grid-highlight" />

      <style>{`
        .industrial-grid-layer {
          position: absolute;
          inset: 0;
          pointer-events: none;
          z-index: 1;
          opacity: 0.45;
        }

        .grid-mesh {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(0,0,0,0.08) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(0,0,0,0.08) 1px, transparent 1px);
          background-size: 40px 40px;
        }

        .grid-highlight {
          position: absolute;
          inset: 0;
          background-image: 
            linear-gradient(to right, rgba(212,175,55,0.25) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(212,175,55,0.25) 1px, transparent 1px);
          background-size: 40px 40px;
          mask-image: radial-gradient(
            circle 180px at var(--mouse-x) var(--mouse-y),
            black 0%,
            transparent 100%
          );
          -webkit-mask-image: radial-gradient(
            circle 180px at var(--mouse-x) var(--mouse-y),
            black 0%,
            transparent 100%
          );
        }

        /* Subtle axes through the screen */
        .industrial-grid-layer::before {
          content: '';
          position: absolute;
          top: var(--mouse-y);
          left: 0;
          width: 100%;
          height: 1px;
          background: rgba(0,0,0,0.1);
          display: block;
        }
        .industrial-grid-layer::after {
          content: '';
          position: absolute;
          left: var(--mouse-x);
          top: 0;
          width: 1px;
          height: 100%;
          background: rgba(0,0,0,0.1);
          display: block;
        }
      `}</style>
    </div>
  );
}
