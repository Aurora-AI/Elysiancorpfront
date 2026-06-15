import { describe, it, expect } from 'vitest';
import { isMeshNode } from '@/data/alvaro-mesh.types';

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
