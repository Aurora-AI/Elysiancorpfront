import { describe, it, expect } from 'vitest';
import { isPiiSpan } from '@/data/lex-pipeline.types';
import { LEX_DOCUMENT, STAGES, LEX_HEADER } from '@/data/lex-pipeline';

describe('isPiiSpan', () => {
  it('accepts a valid span with a real-format token', () => {
    expect(isPiiSpan({
      text: 'João Carlos da Silva',
      type: 'name',
      token: 'TOK_NAME_3a9f1c7e2b8d4f06',
    })).toBe(true);
  });

  it('rejects a token with the wrong format', () => {
    expect(isPiiSpan({ text: 'x', type: 'cpf', token: 'CPF_123' })).toBe(false);
  });

  it('rejects a token with a non-hex / wrong-length suffix', () => {
    expect(isPiiSpan({ text: 'x', type: 'cpf', token: 'TOK_CPF_ZZZZ' })).toBe(false);
  });

  it('rejects non-objects', () => {
    expect(isPiiSpan(null)).toBe(false);
    expect(isPiiSpan('TOK_CPF_3a9f1c7e2b8d4f06')).toBe(false);
  });

  it('rejects an invalid PiiType value', () => {
    expect(isPiiSpan({ text: 'x', type: 'invalid_type', token: 'TOK_INVALID_3a9f1c7e2b8d4f06' })).toBe(false);
  });
});

describe('lex-pipeline data', () => {
  const spans = LEX_DOCUMENT.segments.filter(
    (s): s is import('@/data/lex-pipeline.types').PiiSpan => typeof s !== 'string',
  );

  it('has exactly 4 PII spans', () => {
    expect(spans).toHaveLength(4);
  });

  it('every PII span passes the guard', () => {
    for (const s of spans) {
      expect(isPiiSpan(s), `span "${s.text}" failed guard`).toBe(true);
    }
  });

  it('covers the four expected PII types', () => {
    const types = spans.map(s => s.type).sort();
    expect(types).toEqual(['cpf', 'name', 'oab', 'processo']);
  });

  it('keeps legal stopwords as plain (untokenized) strings', () => {
    const plain = LEX_DOCUMENT.segments.filter(s => typeof s === 'string').join(' ');
    expect(plain).toContain('Justiça Federal');
    expect(plain).toContain('Ministério Público');
  });

  it('has exactly 5 stages with bilingual labels', () => {
    expect(STAGES).toHaveLength(5);
    for (const st of STAGES) {
      expect(st.label.en.length).toBeGreaterThan(0);
      expect(st.label.pt.length).toBeGreaterThan(0);
    }
  });

  it('exposes bilingual header copy', () => {
    expect(LEX_HEADER.title.en).toMatch(/never sees/i);
    expect(LEX_HEADER.title.pt).toMatch(/nunca vê/i);
  });
});

import { stageAt, STAGE_COUNT } from '@/lib/lex-stages';

describe('stageAt', () => {
  it('exposes 5 stages', () => {
    expect(STAGE_COUNT).toBe(5);
  });

  it('progress 0 is stage 0, local 0', () => {
    expect(stageAt(0)).toEqual({ index: 0, local: 0 });
  });

  it('progress 1 clamps to last stage, local 1', () => {
    expect(stageAt(1)).toEqual({ index: 4, local: 1 });
  });

  it('mid-band gives correct index and local', () => {
    // 0.30 → band 1 (0.2–0.4), local = (0.30-0.2)/0.2 = 0.5
    const r = stageAt(0.30);
    expect(r.index).toBe(1);
    expect(r.local).toBeCloseTo(0.5, 5);
  });

  it('clamps out-of-range input', () => {
    expect(stageAt(-1)).toEqual({ index: 0, local: 0 });
    expect(stageAt(2)).toEqual({ index: 4, local: 1 });
  });

  it('is deterministic', () => {
    expect(stageAt(0.42)).toEqual(stageAt(0.42));
  });
});
