import type { MeshNode } from '@/data/alvaro-mesh.types';

export interface Point { x: number; y: number; }
export type LayoutMap = Record<string, Point>;

const CX = 450;
const CY = 290;
const RX = 195;
const RY = 155;
const SAT_OFFSET = 85;

// Loop nodes are ordered clockwise from top (-π/2).
const LOOP_ORDER = ['perception', 'memory', 'reasoning', 'response', 'learning'];

function loopAngle(index: number): number {
  return -Math.PI / 2 + (2 * Math.PI * index) / 5;
}

function loopPoint(index: number): Point {
  const a = loopAngle(index);
  return { x: CX + RX * Math.cos(a), y: CY + RY * Math.sin(a) };
}

function radialSatellite(loopPos: Point): Point {
  const dx = loopPos.x - CX;
  const dy = loopPos.y - CY;
  const dist = Math.sqrt(dx * dx + dy * dy);
  return {
    x: loopPos.x + (dx / dist) * SAT_OFFSET,
    y: loopPos.y + (dy / dist) * SAT_OFFSET,
  };
}

export function computeLayout(nodes: MeshNode[]): LayoutMap {
  const positions: LayoutMap = {};

  // Loop nodes: evenly spaced on ellipse.
  nodes.filter(n => n.kind === 'loop').forEach((n, i) => {
    const orderedIndex = LOOP_ORDER.indexOf(n.id);
    const idx = orderedIndex >= 0 ? orderedIndex : i;
    positions[n.id] = loopPoint(idx);
  });

  // Principle satellites: radially offset from their governed node.
  // Special case: p1-budget and p3-inference both govern 'perception' —
  // offset laterally so they don't stack.
  nodes.filter(n => n.kind === 'principle').forEach(n => {
    const governed = n.governs;
    const lp = governed && positions[governed] ? positions[governed] : { x: CX, y: CY };

    if (n.id === 'p1-budget') {
      positions[n.id] = { x: lp.x - 90, y: lp.y - 50 };
    } else if (n.id === 'p3-inference') {
      positions[n.id] = { x: lp.x + 90, y: lp.y - 50 };
    } else {
      positions[n.id] = radialSatellite(lp);
    }
  });

  return positions;
}
