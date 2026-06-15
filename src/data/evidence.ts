import type { Claim, Bilingual } from './evidence.types';

export interface Product { id: string; label: string; beta?: boolean; }

export const HEADER: { label: string; title: Bilingual } = {
  label: '[ 02 // THE EVIDENCE LEDGER ]',
  title: {
    en: "We Don't Ask for Trust. We Show the Trace.",
    pt: 'Não pedimos confiança. Mostramos o rastro.',
  },
};

export const CLAIMS: Claim[] = [
  {
    id: 'deterministic-gate', index: '01', tier: 'primary', colSpan: 5, status: 'OK',
    title: {
      en: 'No critical state mutation without a non-LLM deterministic gate.',
      pt: 'Nenhuma mutação de estado crítico sem gate determinístico não-LLM.',
    },
    source: { path: 'CRM/libs/trustware/src/engine/engine.ts', lines: [11, 28], label: 'lib/trustware' },
    caption: { en: 'The guardrail runs outside the model.', pt: 'O guardrail roda fora do modelo.' },
  },
  {
    id: 'human-approval', index: '02', tier: 'primary', colSpan: 7, status: 'INFO',
    title: {
      en: 'Production promotion requires explicit human approval.',
      pt: 'Promoção à produção exige aprovação humana explícita.',
    },
    source: {
      path: 'AuroraOS/factory/frontend_synthesis/run_os019_m3_rendered_candidate_gate.py',
      label: 'HumanPromotionGate',
    },
    caption: { en: 'Human-in-the-loop, by construction.', pt: 'Human-in-the-loop, por construção.' },
  },
  {
    id: 'persisted-evidence', index: '03', tier: 'primary', colSpan: 4, status: 'OK',
    title: {
      en: 'No action concludes without persisted, traceable evidence.',
      pt: 'Nenhuma ação encerra sem evidência persistida e rastreável.',
    },
    source: {
      path: 'AuroraOS/factory/frontend_synthesis/output_synthesis/OS-019/M3_QA_REVIEW.md',
      label: 'QA_REVIEW',
    },
    caption: { en: 'Total auditability.', pt: 'Auditabilidade total.' },
  },
  {
    id: 'adversarial-qa', index: '04', tier: 'primary', colSpan: 8, status: 'OK',
    title: {
      en: 'Every delivery undergoes formal adversarial QA before closing.',
      pt: 'Toda entrega passa por QA formal adversarial antes de fechar.',
    },
    source: {
      path: 'AuroraOS/factory/frontend_synthesis/output_synthesis/OS-019/M4.1_QA_REVIEW.md',
      label: 'skill/qa-review',
    },
    caption: { en: 'Independent verification.', pt: 'Verificação independente.' },
  },
  {
    id: 'readonly-observability', index: '05', tier: 'primary', colSpan: 6, status: 'INFO',
    title: {
      en: 'The factory is observable read-only — no write, replay, or auto-repair.',
      pt: 'A fábrica é observável read-only — sem escrita, replay ou auto-reparo.',
    },
    source: {
      path: 'Ozzmosis/apps/aurora-observability-mcp-gateway/src/aurora/observability_mcp_gateway/server.py',
      label: 'observability gateway',
    },
    caption: { en: 'Oversight with bounded power.', pt: 'Oversight com poder limitado.' },
  },
  {
    id: 'micro-steps', index: '06', tier: 'primary', colSpan: 6, status: 'OK',
    title: {
      en: 'Micro-step execution with limited blast radius and a mandatory stop.',
      pt: 'Execução em micro-etapas com blast radius limitado e parada obrigatória.',
    },
    source: { path: 'Ozzmosis/docs/AGENTS/OS_TEMPLATE.md', label: 'OS Protocol' },
    caption: { en: 'Risk containment.', pt: 'Contenção de risco.' },
  },
  {
    id: 'pii-tokenization', index: '07', tier: 'secondary', colSpan: 12, status: 'OK',
    title: {
      en: 'PII never reaches the LLM in plaintext — tokenized in transit, sealed by Trustware.',
      pt: 'PII nunca alcança o LLM em plaintext — tokenizada em trânsito, selada pelo Trustware.',
    },
    source: { path: 'ElysianLex/backend/lex_core/pii/tokenizer.py', label: 'pii/tokenizer' },
    caption: { en: 'Data safety, not data luck.', pt: 'Segurança de dados, não sorte.' },
  },
];

export const PRODUCTS: Product[] = [
  { id: 'crm-aurora', label: 'CRM Aurora' },
  { id: 'elysian-lex', label: 'ElysianLex' },
  { id: 'alvaro-mesh', label: 'Álvaro · Agentic Mesh' },
];
