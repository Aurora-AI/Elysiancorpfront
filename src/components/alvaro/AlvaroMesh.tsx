import { useRef, useEffect, useState, useCallback } from 'react';
import { useReducedMotion, AnimatePresence, motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MESH_NODES, MESH_EDGES } from '@/data/alvaro-mesh';
import type { MeshNode as MeshNodeData } from '@/data/alvaro-mesh.types';
import { computeLayout } from '@/lib/mesh-layout';
import { MeshNode } from './MeshNode';
import { MeshEdge } from './MeshEdge';
import { MeshNodeCard } from './MeshNodeCard';
import { AlvaroFlowchart } from './AlvaroFlowchart';

const LAYOUT = computeLayout(MESH_NODES);
const SVG_W = 900;
const SVG_H = 580;

interface Props {
  lang?: 'en' | 'pt';
}

interface CardState {
  node: MeshNodeData;
  anchorX: number;
  anchorY: number;
}

const COPY = {
  hint: { en: '↗ click the nodes to explore', pt: '↗ clique nos nós para explorar' },
  toFlowchart: { en: 'Full architecture →', pt: 'Arquitetura completa →' },
  toMesh: { en: '← Cognitive map', pt: '← Mapa cognitivo' },
  flowTitle: { en: 'Full Architecture', pt: 'Arquitetura Completa' },
  flowSub: {
    en: '8 layers — perception, memory, reasoning, governance, execution, observability, continual hardening, cognitive ingestion',
    pt: '8 camadas — percepção, memória, raciocínio, governança, execução, observabilidade, hardening contínuo, ingestão cognitiva',
  },
};

export function AlvaroMesh({ lang = 'en' }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const prefersReduced = useReducedMotion();
  const [card, setCard] = useState<CardState | null>(null);
  const [view, setView] = useState<'mesh' | 'flowchart'>('mesh');

  useEffect(() => {
    if (prefersReduced || !svgRef.current || view !== 'mesh') return;

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

    svg.querySelectorAll<SVGPathElement>('[data-edge]').forEach((el) => {
      const len = el.getTotalLength?.() ?? 200;
      gsap.set(el, { strokeDasharray: len, strokeDashoffset: len });
    });

    svg.querySelectorAll('[data-node]').forEach((el) => {
      gsap.set(el, { opacity: 0, transformOrigin: 'center' });
    });

    svg.querySelectorAll('[data-edge]').forEach((el, i) => {
      tl.to(el, { strokeDashoffset: 0, duration: 0.4, ease: 'none' }, i * 0.08);
    });

    svg.querySelectorAll('[data-node]').forEach((el, i) => {
      tl.to(el, { opacity: 1, duration: 0.3 }, 0.3 + i * 0.2);
    });

    return () => {
      tl.kill();
      tl.scrollTrigger?.kill();
    };
  }, [prefersReduced, view]);

  const handleNodeClick = useCallback((nodeId: string, svgX: number, svgY: number) => {
    const node = MESH_NODES.find(n => n.id === nodeId);
    if (!node) return;
    setCard(prev => prev?.node.id === nodeId ? null : { node, anchorX: svgX, anchorY: svgY });
  }, []);

  const handleToggle = () => {
    setCard(null);
    setView(v => v === 'mesh' ? 'flowchart' : 'mesh');
  };

  const nodeStatusMap = new Map(MESH_NODES.map(n => [n.id, n.status]));

  return (
    <div className="relative w-full">
      <AnimatePresence mode="wait">
        {view === 'mesh' ? (
          <motion.div
            key="mesh"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="relative w-full"
          >
            <svg
              ref={svgRef}
              viewBox={`0 0 ${SVG_W} ${SVG_H}`}
              preserveAspectRatio="xMidYMid meet"
              className="w-full max-w-4xl mx-auto"
              aria-label="Álvaro cognitive mesh diagram — click a node to learn more"
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
                      onClick={handleNodeClick}
                    />
                  );
                })}
              </g>
            </svg>

            {/* Floating info card overlay */}
            {card && (
              <MeshNodeCard
                node={card.node}
                anchorX={card.anchorX}
                anchorY={card.anchorY}
                svgWidth={SVG_W}
                svgHeight={SVG_H}
                lang={lang}
                onClose={() => setCard(null)}
              />
            )}

            {/* Click affordance hint */}
            <p className="mt-4 text-center font-mono text-[10px] uppercase tracking-widest text-[#9AA0A6]">
              {COPY.hint[lang]}
            </p>

            {/* Legend */}
            <div className="flex items-center justify-center gap-8 mt-4 font-mono text-xs">
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
          </motion.div>
        ) : (
          <motion.div
            key="flowchart"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="w-full"
          >
            <div className="mb-6">
              <h3 className="font-mono text-[13px] uppercase tracking-widest text-[#4E5B4B]">
                {COPY.flowTitle[lang]}
              </h3>
              <p className="mt-1 font-mono text-[11px] text-[#9AA0A6] leading-relaxed">
                {COPY.flowSub[lang]}
              </p>
            </div>
            <AlvaroFlowchart lang={lang} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Toggle button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={handleToggle}
          className="group inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-widest px-4 py-2 border border-[#4E5B4B]/30 text-[#4E5B4B] hover:border-[#4E5B4B] hover:bg-[#4E5B4B]/5 transition-all duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#4E5B4B]/40"
        >
          {view === 'mesh' ? COPY.toFlowchart[lang] : COPY.toMesh[lang]}
        </button>
      </div>
    </div>
  );
}
