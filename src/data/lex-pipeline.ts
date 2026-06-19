import type { Bilingual, DocSegment, LexDocument, Stage } from './lex-pipeline.types';

// Document segments. Plain strings render as-is; PiiSpan objects animate
// plaintext → token → restored. "Justiça Federal" / "Ministério Público"
// are legal stopwords in tokenizer.py — they stay as plain strings.
export const LEX_DOCUMENT: LexDocument = {
  segments: [
    'Intima-se ',
    { text: 'João Carlos da Silva', type: 'name', token: 'TOK_NAME_3a9f1c7e2b8d4f06' },
    ', CPF ',
    { text: '123.456.789-00', type: 'cpf', token: 'TOK_CPF_b2c4e6a8d0f2a4c6' },
    ', ',
    { text: 'OAB/SP 187.432', type: 'oab', token: 'TOK_OAB_7d1e3f5a9c2b8e04' },
    ', nos autos do processo ',
    { text: '0034567-89.2025.4.03.6100', type: 'processo', token: 'TOK_PROCESSO_5f8a2c1d7e9b3a06' },
    ', em trâmite na Justiça Federal, com vista ao Ministério Público, para manifestação no prazo legal.',
  ],
};

export const STAGES: Stage[] = [
  { id: 'raw',        label: { en: 'Raw document',          pt: 'Documento bruto' } },
  { id: 'tokenize',   label: { en: 'Tokenization',          pt: 'Tokenização' } },
  { id: 'reason',     label: { en: 'LLM reasoning (blind)', pt: 'Raciocínio do LLM (cego)' } },
  { id: 'seal',       label: { en: 'Trustware seal',        pt: 'Selo Trustware' } },
  { id: 'detokenize', label: { en: 'Detokenization (final output)', pt: 'Destokenização (output final)' } },
];

export const LEX_HEADER: { label: string; title: Bilingual; subline: Bilingual } = {
  label: '[ 04 // ELYSIAN LEX ]',
  title: {
    en: 'The LLM never sees your client.',
    pt: 'O LLM nunca vê seu cliente.',
  },
  subline: {
    en: 'Names, CPFs, case numbers — tokenized before a single token reaches the LLM. Detokenized only when the answer returns to you.',
    pt: 'Nomes, CPFs, números de processo — tokenizados antes de um único token alcançar o LLM. Destokenizados só quando a resposta volta para você.',
  },
};

export const REDACTED_COUNT_LABEL: Bilingual = { en: 'PII redacted', pt: 'PII redigida' };

// Convenience: ordered list of PII spans (used by the island to stagger morphs).
export const PII_SPANS = LEX_DOCUMENT.segments.filter(
  (s): s is Exclude<DocSegment, string> => typeof s !== 'string',
);
