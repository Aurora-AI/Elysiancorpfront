import React, { useEffect, useRef } from 'react';
import type { MeshNode } from '@/data/alvaro-mesh.types';
import { MESH_NODES } from '@/data/alvaro-mesh';
import { AnimatePresence, motion } from 'framer-motion';

interface Props {
  node: MeshNode | null;
  /** SVG pixel coordinates of the node centre */
  anchorX: number;
  anchorY: number;
  /** SVG viewBox dimensions used for percentage calculations */
  svgWidth: number;
  svgHeight: number;
  lang: 'en' | 'pt';
  onClose: () => void;
}

const MOSS = '#4E5B4B';
const ROADMAP_GREY = '#9AA0A6';
const CARD_W = 300;
const CARD_H_EST = 220; // rough height for overflow guard

/** Convert SVG-space coords to percentage of container, clamp to stay in bounds. */
function toContainerPercent(
  svgX: number,
  svgY: number,
  svgW: number,
  svgH: number,
): { left: string; top: string; transformOrigin: string } {
  const pctX = svgX / svgW;
  const pctY = svgY / svgH;

  // Prefer right-of-node; flip to left if near right edge
  const flipX = pctX > 0.65;
  // Prefer below node; flip above if near bottom
  const flipY = pctY > 0.65;

  const offsetX = flipX ? '-110%' : '18px';
  const offsetY = flipY ? '-100%' : '18px';

  return {
    left: `${(pctX * 100).toFixed(2)}%`,
    top: `${(pctY * 100).toFixed(2)}%`,
    transformOrigin: `${flipX ? 'right' : 'left'} ${flipY ? 'bottom' : 'top'}`,
  };
}

export function MeshNodeCard({ node, anchorX, anchorY, svgWidth, svgHeight, lang, onClose }: Props) {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!node) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [node, onClose]);

  // Focus card on open for a11y
  useEffect(() => {
    if (node) cardRef.current?.focus();
  }, [node?.id]);

  const loopLabel = (id: string | undefined) => {
    if (!id) return null;
    const found = MESH_NODES.find(n => n.id === id);
    return found ? found.label[lang] : id;
  };

  const { left, top, transformOrigin } = node
    ? toContainerPercent(anchorX, anchorY, svgWidth, svgHeight)
    : { left: '50%', top: '50%', transformOrigin: 'left top' };

  const isLive = node?.status === 'live';
  const accentColor = isLive ? MOSS : ROADMAP_GREY;

  return (
    <AnimatePresence>
      {node && (
        <>
          {/* invisible backdrop to close on outside click */}
          <div
            className="absolute inset-0 z-10"
            aria-hidden="true"
            onClick={onClose}
          />

          <motion.div
            ref={cardRef}
            role="dialog"
            aria-modal="true"
            aria-label={node.label[lang]}
            tabIndex={-1}
            initial={{ opacity: 0, scale: 0.88 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.88 }}
            transition={{ duration: 0.18, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'absolute',
              left,
              top,
              width: CARD_W,
              zIndex: 20,
              transformOrigin,
              outline: 'none',
            }}
            className="pointer-events-auto rounded-[3px] border border-[#4E5B4B]/20 bg-[#F8F7F3] shadow-[0_8px_32px_rgba(26,26,23,0.12)] focus-visible:ring-2 focus-visible:ring-[#4E5B4B]/40"
          >
            {/* accent bar */}
            <div
              className="h-[3px] w-full rounded-t-[3px]"
              style={{ background: accentColor }}
            />

            <div className="p-5 flex flex-col gap-3">
              {/* header row */}
              <div className="flex items-start justify-between gap-2">
                <h3 className="font-display text-[15px] font-semibold leading-snug text-[#1A1A17]">
                  {node.label[lang]}
                </h3>
                <button
                  onClick={onClose}
                  aria-label="Close"
                  className="mt-0.5 shrink-0 text-[#9AA0A6] hover:text-[#1A1A17] transition-colors"
                >
                  <svg width="12" height="12" viewBox="0 0 12 12" fill="none">
                    <path d="M1 1l10 10M11 1L1 11" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                </button>
              </div>

              {/* status badge */}
              <div className="flex items-center gap-2">
                {isLive ? (
                  <span
                    className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm border"
                    style={{ borderColor: `${MOSS}50`, color: MOSS, background: `${MOSS}10` }}
                  >
                    <span className="inline-block w-1.5 h-1.5 rounded-full" style={{ background: MOSS }} />
                    LIVE
                  </span>
                ) : (
                  <span
                    className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest px-2 py-0.5 rounded-sm border"
                    style={{ borderColor: `${ROADMAP_GREY}50`, color: ROADMAP_GREY, background: `${ROADMAP_GREY}10` }}
                  >
                    <span
                      className="inline-block w-1.5 h-1.5 rounded-sm border"
                      style={{ borderColor: ROADMAP_GREY }}
                    />
                    ROADMAP {node.phase ?? ''}
                  </span>
                )}
                {node.kind === 'principle' && node.governs && (
                  <span className="font-mono text-[10px] text-[#9AA0A6] uppercase tracking-widest">
                    → {loopLabel(node.governs)}
                  </span>
                )}
              </div>

              {/* description */}
              {node.description && (
                <p className="font-body text-[13px] leading-relaxed text-[#1A1A17]/70">
                  {node.description[lang]}
                </p>
              )}

              {/* evidence anchor */}
              {node.evidenceRef && (
                <div className="border-t border-[#4E5B4B]/10 pt-3">
                  <p className="font-mono text-[10px] uppercase tracking-widest text-[#9AA0A6] mb-1">Module</p>
                  <code className="font-mono text-[11px] text-[#4E5B4B] break-all leading-snug">
                    {node.evidenceRef}
                  </code>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
