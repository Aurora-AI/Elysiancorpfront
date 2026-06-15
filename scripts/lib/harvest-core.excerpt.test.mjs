import { describe, it, expect } from 'vitest';
import { extractExcerpt, sanitize } from './harvest-core.mjs';

const SAMPLE = ['line1', 'line2', 'line3', 'line4', 'line5'].join('\n');

describe('extractExcerpt', () => {
  it('returns the requested 1-based inclusive window', () => {
    expect(extractExcerpt(SAMPLE, [2, 4])).toBe('line2\nline3\nline4');
  });
  it('caps an unbounded excerpt to 40 lines', () => {
    const big = Array.from({ length: 100 }, (_, i) => `l${i}`).join('\n');
    expect(extractExcerpt(big).split('\n')).toHaveLength(40);
  });
});

describe('sanitize', () => {
  it('strips absolute Windows paths to repo-relative-ish labels', () => {
    expect(sanitize('see C:\\\\Projetos\\\\Aurora\\\\x.py here')).not.toContain('C:\\\\Projetos');
  });
});
