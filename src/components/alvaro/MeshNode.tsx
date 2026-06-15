import { motion, useMotionValue, useReducedMotion } from 'framer-motion';
import type { MeshNode as MeshNodeData } from '@/data/alvaro-mesh.types';

interface Props {
  node: MeshNodeData;
  x: number;
  y: number;
  lang: 'en' | 'pt';
}

const MOSS = '#4E5B4B';
const GREY = '#9AA0A6';
const INK  = '#1A1A17';

export function MeshNode({ node, x, y, lang }: Props) {
  const prefersReduced = useReducedMotion();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);

  const isLive = node.status === 'live';

  const handleMouseMove = (e: React.MouseEvent<SVGGElement>) => {
    if (prefersReduced) return;
    const el = e.currentTarget;
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    mx.set((e.clientX - cx) * 0.25);
    my.set((e.clientY - cy) * 0.25);
  };

  const handleMouseLeave = () => { mx.set(0); my.set(0); };

  return (
    <motion.g
      data-node={node.id}
      data-live={isLive}
      style={{ x: mx, y: my }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      role="img"
      aria-label={`${node.label[lang]}${!isLive ? ` (Roadmap ${node.phase})` : ' (Live)'}`}
    >
      <circle
        cx={x}
        cy={y}
        r={node.kind === 'loop' ? 9 : 6}
        fill={isLive ? MOSS : 'none'}
        stroke={isLive ? 'none' : GREY}
        strokeWidth={1.5}
        strokeDasharray={isLive ? undefined : '3 3'}
      />

      <text
        x={x}
        y={y - 18}
        textAnchor="middle"
        fill={isLive ? INK : GREY}
        fontSize={node.kind === 'loop' ? 11 : 10}
        fontFamily="JetBrains Mono, monospace"
        fontWeight={isLive ? '500' : '400'}
      >
        {node.label[lang]}
      </text>

      {!isLive && node.phase && (
        <text
          x={x}
          y={y + (node.kind === 'loop' ? 24 : 20)}
          textAnchor="middle"
          fill="#B7B5AC"
          fontSize={9}
          fontFamily="JetBrains Mono, monospace"
        >
          {node.phase}
        </text>
      )}
    </motion.g>
  );
}
