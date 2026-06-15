import { describe, it, expect, beforeAll } from 'vitest';
import { render, screen } from '@testing-library/react';
import { isMeshNode } from '@/data/alvaro-mesh.types';
import { MESH_NODES, MESH_EDGES } from '@/data/alvaro-mesh';
import { computeLayout, type LayoutMap } from '@/lib/mesh-layout';
import { MeshNode } from '../MeshNode';
import { MeshEdge } from '../MeshEdge';

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

describe('MeshNode', () => {
  const liveNode = MESH_NODES.find(n => n.id === 'memory')!;
  const roadmapNode = MESH_NODES.find(n => n.id === 'perception')!;

  it('renders the EN label', () => {
    render(
      <svg>
        <MeshNode node={liveNode} x={450} y={135} lang="en" />
      </svg>
    );
    expect(screen.getByText('Memory')).toBeInTheDocument();
  });

  it('renders the PT label when lang=pt', () => {
    render(
      <svg>
        <MeshNode node={liveNode} x={450} y={135} lang="pt" />
      </svg>
    );
    expect(screen.getByText('Memória')).toBeInTheDocument();
  });

  it('live node has data-live attribute set to true', () => {
    render(
      <svg>
        <MeshNode node={liveNode} x={450} y={135} lang="en" />
      </svg>
    );
    expect(document.querySelector('[data-live="true"]')).toBeInTheDocument();
  });

  it('roadmap node shows phase label', () => {
    render(
      <svg>
        <MeshNode node={roadmapNode} x={450} y={135} lang="en" />
      </svg>
    );
    expect(screen.getByText('F2')).toBeInTheDocument();
  });
});

describe('MeshEdge', () => {
  it('renders a path element', () => {
    const { container } = render(
      <svg>
        <MeshEdge
          from={{ x: 100, y: 100 }}
          to={{ x: 200, y: 200 }}
          kind="loop"
          status="live"
        />
      </svg>
    );
    expect(container.querySelector('path')).toBeInTheDocument();
  });

  it('loop edge has data-edge-kind="loop"', () => {
    const { container } = render(
      <svg>
        <MeshEdge from={{ x: 0, y: 0 }} to={{ x: 1, y: 1 }} kind="loop" status="live" />
      </svg>
    );
    expect(container.querySelector('[data-edge-kind="loop"]')).toBeInTheDocument();
  });
});

import { AlvaroMesh } from '../AlvaroMesh';

// Hoist stable mock references so they are accessible both in the factory
// and in the test body (vi.mock factories are hoisted to top of file).
const gsapMocks = vi.hoisted(() => {
  const tl = { to: vi.fn().mockReturnThis(), kill: vi.fn() };
  return {
    set: vi.fn(),
    registerPlugin: vi.fn(),
    timeline: vi.fn(() => tl),
  };
});

// framer-motion's useReducedMotion caches state via module-level singletons;
// mocking it directly gives reliable control in tests.
const reducedMotionMock = vi.hoisted(() => ({ value: false }));
vi.mock('framer-motion', async (importOriginal) => {
  const actual = await importOriginal<typeof import('framer-motion')>();
  return {
    ...actual,
    useReducedMotion: () => reducedMotionMock.value,
  };
});

// GSAP can't run animations in jsdom — mock it.
vi.mock('gsap', () => ({
  default: {
    registerPlugin: gsapMocks.registerPlugin,
    set: gsapMocks.set,
    timeline: gsapMocks.timeline,
  },
}));
vi.mock('gsap/ScrollTrigger', () => ({
  ScrollTrigger: { getAll: vi.fn(() => [{ kill: vi.fn() }]) },
}));

describe('AlvaroMesh', () => {
  afterEach(() => {
    reducedMotionMock.value = false;
    gsapMocks.set.mockClear();
  });

  it('renders an SVG element', () => {
    render(<AlvaroMesh lang="en" />);
    expect(document.querySelector('svg')).toBeInTheDocument();
  });

  it('renders all 11 node groups', () => {
    render(<AlvaroMesh lang="en" />);
    expect(document.querySelectorAll('[data-node]')).toHaveLength(11);
  });

  it('renders 11 edge paths (5 loop + 6 governs)', () => {
    render(<AlvaroMesh lang="en" />);
    expect(document.querySelectorAll('[data-edge]')).toHaveLength(11);
  });

  it('renders the legend with LIVE and ROADMAP labels', () => {
    render(<AlvaroMesh lang="en" />);
    expect(screen.getByText(/LIVE/i)).toBeInTheDocument();
    expect(screen.getByText(/ROADMAP/i)).toBeInTheDocument();
  });

  it('in reduced-motion mode, GSAP.set is not called', () => {
    reducedMotionMock.value = true;
    render(<AlvaroMesh lang="en" />);
    expect(gsapMocks.set).not.toHaveBeenCalled();
  });
});
