import type { Point } from '@/lib/mesh-layout';

interface Props {
  from: Point;
  to: Point;
  kind: 'loop' | 'governs';
  status: 'live' | 'roadmap';
}

const MOSS = '#4E5B4B';
const GREY = '#9AA0A6';

export function MeshEdge({ from, to, kind, status }: Props) {
  const isLive = status === 'live';
  const isLoop = kind === 'loop';

  const stroke = isLoop
    ? `${MOSS}99`
    : isLive ? MOSS : GREY;

  const strokeDasharray = isLoop
    ? undefined
    : isLive ? undefined
    : '4 4';

  const path = `M ${from.x} ${from.y} L ${to.x} ${to.y}`;

  return (
    <path
      data-edge
      data-edge-kind={kind}
      d={path}
      stroke={stroke}
      strokeWidth={isLoop ? 1.5 : 1}
      strokeDasharray={strokeDasharray}
      fill="none"
      strokeLinecap="round"
    />
  );
}
