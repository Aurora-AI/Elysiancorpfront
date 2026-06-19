export interface Bilingual { en: string; pt: string; }

export type PiiType =
  | 'name' | 'cpf' | 'cnpj' | 'email' | 'phone'
  | 'rg' | 'cnh' | 'address' | 'processo' | 'oab';

export interface PiiSpan {
  text: string;   // plaintext original (e.g. "João Carlos da Silva")
  type: PiiType;  // detected category
  token: string;  // real format: TOK_<TYPE>_<16 hex>
}

export type DocSegment = string | PiiSpan;

export interface LexDocument { segments: DocSegment[]; }

export interface Stage { id: string; label: Bilingual; }

const PII_TYPES: readonly PiiType[] = [
  'name', 'cpf', 'cnpj', 'email', 'phone',
  'rg', 'cnh', 'address', 'processo', 'oab',
];

export function isPiiSpan(v: unknown): v is PiiSpan {
  if (!v || typeof v !== 'object') return false;
  const s = v as PiiSpan;
  return typeof s.text === 'string'
    && typeof s.type === 'string'
    && (PII_TYPES as readonly string[]).includes(s.type)
    && typeof s.token === 'string'
    && /^TOK_[A-Z]+_[0-9a-f]{16}$/.test(s.token);
}
