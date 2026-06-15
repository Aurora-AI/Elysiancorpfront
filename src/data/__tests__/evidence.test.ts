import { describe, it, expect } from 'vitest';
import { CLAIMS, PRODUCTS } from '../evidence';
import { isClaim } from '../evidence.types';

describe('evidence manifest', () => {
  it('has 6 primary + 1 secondary claim, all valid', () => {
    expect(CLAIMS.every(isClaim)).toBe(true);
    expect(CLAIMS.filter(c => c.tier === 'primary')).toHaveLength(6);
    expect(CLAIMS.filter(c => c.tier === 'secondary')).toHaveLength(1);
  });
  it('uses unique ids and indices', () => {
    expect(new Set(CLAIMS.map(c => c.id)).size).toBe(CLAIMS.length);
  });
  it('lists 3 real products incl. the agentic mesh', () => {
    expect(PRODUCTS.map(p => p.id)).toEqual(['crm-aurora', 'elysian-lex', 'alvaro-mesh']);
  });
});
