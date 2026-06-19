import { describe, it, expect } from 'vitest';
import { isPiiSpan } from '@/data/lex-pipeline.types';

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
