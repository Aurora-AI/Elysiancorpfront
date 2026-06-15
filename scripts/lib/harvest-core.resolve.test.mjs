import { describe, it, expect } from 'vitest';
import { sha256, classifyKind } from './harvest-core.mjs';

describe('harvest-core hashing', () => {
  it('hashes deterministically', () => {
    expect(sha256('abc')).toBe(sha256('abc'));
    expect(sha256('abc')).not.toBe(sha256('abd'));
    expect(sha256('abc')).toHaveLength(64);
  });
  it('classifies file kind by extension', () => {
    expect(classifyKind('a/b.py')).toBe('code');
    expect(classifyKind('a/b.md')).toBe('report');
    expect(classifyKind('a/b.png')).toBe('image');
    expect(classifyKind('a/dir-no-ext')).toBe('code');
  });
});
