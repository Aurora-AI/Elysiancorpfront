import { describe, it, expect, beforeAll } from 'vitest';
import { isMeshNode } from '@/data/alvaro-mesh.types';
import { MESH_NODES, MESH_EDGES } from '@/data/alvaro-mesh';
import { computeLayout, type LayoutMap } from '@/lib/mesh-layout';

describe('isMeshNode', () => {
  it('accepts a valid live node with evidenceRef', () => {
    expect(isMeshNode({
      id: 'memory',
      label: { en: 'Memory', pt: 'Memória' },
      kind: 'loop',
      status: 'live',
      evidenceRef: 'aurora_vault.py',
    })).toBe(true);
  });

  it('accepts a valid roadmap node with phase, no evidenceRef', () => {
    expect(isMeshNode({
      id: 'perception',
      label: { en: 'Active Perception', pt: 'Percepção Ativa' },
      kind: 'loop',
      status: 'roadmap',
      phase: 'F2',
    })).toBe(true);
  });

  it('rejects a live node missing evidenceRef', () => {
    expect(isMeshNode({
      id: 'memory',
      label: { en: 'Memory', pt: 'Memória' },
      kind: 'loop',
      status: 'live',
      // evidenceRef missing on purpose
    })).toBe(false);
  });

  it('rejects a node with invalid kind', () => {
    expect(isMeshNode({
      id: 'x', label: { en: 'X', pt: 'X' }, kind: 'invalid', status: 'live', evidenceRef: 'x',
    })).toBe(false);
  });

  it('rejects a non-object', () => {
    expect(isMeshNode(null)).toBe(false);
    expect(isMeshNode('string')).toBe(false);
  });
});

describe('alvaro-mesh data', () => {
  it('has exactly 5 loop nodes', () => {
    expect(MESH_NODES.filter(n => n.kind === 'loop')).toHaveLength(5);
  });

  it('has exactly 6 principle nodes', () => {
    expect(MESH_NODES.filter(n => n.kind === 'principle')).toHaveLength(6);
  });

  it('every live node has an evidenceRef', () => {
    for (const node of MESH_NODES) {
      if (node.status === 'live') {
        expect(node.evidenceRef, `node ${node.id} is live but missing evidenceRef`).toBeTruthy();
      }
    }
  });

  it('every roadmap node has a phase', () => {
    for (const node of MESH_NODES) {
      if (node.status === 'roadmap') {
        expect(node.phase, `node ${node.id} is roadmap but missing phase`).toBeTruthy();
      }
    }
  });

  it('all nodes pass isMeshNode guard', () => {
    for (const node of MESH_NODES) {
      expect(isMeshNode(node), `node ${node.id} failed guard`).toBe(true);
    }
  });

  it('has 5 loop edges and 6 governs edges', () => {
    expect(MESH_EDGES.filter(e => e.kind === 'loop')).toHaveLength(5);
    expect(MESH_EDGES.filter(e => e.kind === 'governs')).toHaveLength(6);
  });

  it('every principle node governs a valid loop node id', () => {
    const loopIds = new Set(MESH_NODES.filter(n => n.kind === 'loop').map(n => n.id));
    for (const node of MESH_NODES.filter(n => n.kind === 'principle')) {
      expect(loopIds.has(node.governs ?? ''), `principle ${node.id} governs unknown id "${node.governs}"`).toBe(true);
    }
  });
});

describe('computeLayout', () => {
  let layout: LayoutMap;

  beforeAll(() => {
    layout = computeLayout(MESH_NODES);
  });

  it('returns a position for every node', () => {
    for (const node of MESH_NODES) {
      expect(layout[node.id], `missing position for ${node.id}`).toBeDefined();
      expect(typeof layout[node.id].x).toBe('number');
      expect(typeof layout[node.id].y).toBe('number');
    }
  });

  it('perception is at the top (lowest y among loop nodes)', () => {
    const loopPositions = ['perception', 'memory', 'reasoning', 'response', 'learning']
      .map(id => layout[id].y);
    expect(layout['perception'].y).toBe(Math.min(...loopPositions));
  });

  it('is deterministic — same input gives same output', () => {
    const layout2 = computeLayout(MESH_NODES);
    for (const node of MESH_NODES) {
      expect(layout2[node.id].x).toBeCloseTo(layout[node.id].x, 1);
      expect(layout2[node.id].y).toBeCloseTo(layout[node.id].y, 1);
    }
  });

  it('principle satellites are outside the loop ellipse boundary', () => {
    // Ellipse center (450, 290), rx=195, ry=155
    const CX = 450, CY = 290, RX = 195, RY = 155;
    const principles = MESH_NODES.filter(n => n.kind === 'principle');
    for (const p of principles) {
      const { x, y } = layout[p.id];
      const inEllipse = ((x - CX) / RX) ** 2 + ((y - CY) / RY) ** 2;
      expect(inEllipse, `satellite ${p.id} is inside the ellipse`).toBeGreaterThan(1);
    }
  });

  it('P1 and P3 (both governing perception) have different positions', () => {
    const p1 = layout['p1-budget'];
    const p3 = layout['p3-inference'];
    const dist = Math.sqrt((p1.x - p3.x) ** 2 + (p1.y - p3.y) ** 2);
    expect(dist).toBeGreaterThan(40);
  });

  it('throws if a principle node governs an unknown id', () => {
    const badNode: typeof MESH_NODES[0] = {
      id: 'bad-p',
      kind: 'principle',
      status: 'roadmap',
      phase: 'F1',
      governs: 'nonexistent',
      label: { en: 'Bad', pt: 'Ruim' },
    };
    expect(() => computeLayout([...MESH_NODES, badNode])).toThrow('computeLayout');
  });
});
