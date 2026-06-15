import { describe, it, expect } from 'vitest';
import type { Claim } from '../evidence.types';
import { isClaim } from '../evidence.types';

describe('isClaim', () => {
  it('accepts a well-formed claim', () => {
    const c: Claim = {
      id: 'x', index: '01', tier: 'primary', colSpan: 5, status: 'OK',
      title: { en: 'E', pt: 'P' },
      source: { path: 'a/b.py', label: 'lib/x' },
    };
    expect(isClaim(c)).toBe(true);
  });
  it('rejects missing bilingual title', () => {
    expect(isClaim({ id: 'x', index: '01', tier: 'primary', colSpan: 5, status: 'OK', source: { path: 'a', label: 'b' } } as unknown)).toBe(false);
  });
});
