import { describe, it, expect } from 'vitest';
import { isMeshNode } from '@/data/alvaro-mesh.types';
import { MESH_NODES, MESH_EDGES } from '@/data/alvaro-mesh';

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
