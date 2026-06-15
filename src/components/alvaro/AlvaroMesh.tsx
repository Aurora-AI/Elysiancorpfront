import { useRef, useEffect } from 'react';
import { useReducedMotion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MESH_NODES, MESH_EDGES } from '@/data/alvaro-mesh';
import { computeLayout } from '@/lib/mesh-layout';
import { MeshNode } from './MeshNode';
import { MeshEdge } from './MeshEdge';

const LAYOUT = computeLayout(MESH_NODES);

interface Props {
  lang?: 'en' | 'pt';
}

export function AlvaroMesh({ lang = 'en' }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced || !svgRef.current) return;

    gsap.registerPlugin(ScrollTrigger);

    const svg = svgRef.current;
    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: svg,
        start: 'top 75%',
        end: 'bottom 30%',
        scrub: 1.2,
      },
    });

    // Set initial state for all edge paths.
    svg.querySelectorAll<SVGPathElement>('[data-edge]').forEach((el) => {
      const len = el.getTotalLength?.() ?? 200;
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
    });

    // Set initial state for node groups.
    svg.querySelectorAll('[data-node]').forEach((el) => {
      gsap.set(el, { opacity: 0, transformOrigin: 'center' });
    });

    // Animate edges in sequence.
    svg.querySelectorAll('[data-edge]').forEach((el, i) => {
      tl.to(el, { strokeDashoffset: 0, duration: 0.4, ease: 'none' }, i * 0.08);
    });

    // Stagger nodes after edges.
    svg.querySelectorAll('[data-node]').forEach((el, i) => {
      tl.to(el, { opacity: 1, duration: 0.3 }, 0.3 + i * 0.2);
    });

    return () => {
      tl.kill();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, [prefersReduced]);

  const nodeStatusMap = new Map(MESH_NODES.map(n => [n.id, n.status]));

  return (
    <div className="relative w-full">
      <svg
        ref={svgRef}
        viewBox="0 0 900 580"
        preserveAspectRatio="xMidYMid meet"
        className="w-full max-w-4xl mx-auto"
        aria-label="Álvaro cognitive mesh diagram"
        role="img"
      >
        <g aria-hidden="true">
          {MESH_EDGES.map(edge => {
            const from = LAYOUT[edge.from];
            const to = LAYOUT[edge.to];
            if (!from || !to) return null;
            const principleStatus = edge.kind === 'governs'
              ? nodeStatusMap.get(edge.from) ?? 'live'
              : 'live';
            return (
              <MeshEdge
                key={`${edge.from}-${edge.to}`}
                from={from}
                to={to}
                kind={edge.kind}
                status={principleStatus}
              />
            );
          })}
        </g>

        <g>
          {MESH_NODES.map(node => {
            const pos = LAYOUT[node.id];
            if (!pos) return null;
            return (
              <MeshNode
                key={node.id}
                node={node}
                x={pos.x}
                y={pos.y}
                lang={lang}
              />
            );
          })}
        </g>
      </svg>

      {/* Legend */}
      <div className="flex items-center justify-center gap-8 mt-8 font-mono text-xs">
        <span className="flex items-center gap-2">
          <span className="block w-2.5 h-2.5 rounded-full bg-[#4E5B4B]" aria-hidden="true" />
          <span className="text-[#4E5B4B] uppercase tracking-widest">LIVE</span>
          <span className="text-[#9AA0A6]">— runs today</span>
        </span>
        <span className="flex items-center gap-2">
          <span
            className="block w-2.5 h-2.5 rounded-full border border-[#9AA0A6]"
            style={{ borderStyle: 'dashed' }}
            aria-hidden="true"
          />
          <span className="text-[#9AA0A6] uppercase tracking-widest">ROADMAP</span>
          <span className="text-[#B7B5AC]">— phased (F1–F2)</span>
        </span>
      </div>
    </div>
  );
}
