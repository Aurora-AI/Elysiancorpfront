import type { MeshNode, MeshEdge } from './alvaro-mesh.types';

export const MESH_NODES: MeshNode[] = [
  // ── LOOP (5 steps, clockwise from top) ──────────────────────────────
  {
    id: 'perception',
    kind: 'loop',
    status: 'roadmap',
    phase: 'F2',
    label: { en: 'Active Perception', pt: 'Percepção Ativa' },
  },
  {
    id: 'memory',
    kind: 'loop',
    status: 'live',
    evidenceRef: 'aurora_vault.py',
    label: { en: 'Memory', pt: 'Memória' },
  },
  {
    id: 'reasoning',
    kind: 'loop',
    status: 'live',
    evidenceRef: 'Ozzmosis/libs/alvaro_reasoning/core.py',
    label: { en: 'Reasoning + Validation', pt: 'Raciocínio + Validação' },
  },
  {
    id: 'response',
    kind: 'loop',
    status: 'live',
    evidenceRef: 'Ozzmosis/docs/AGENTS/OS_TEMPLATE.md',
    label: { en: 'Response + Logging', pt: 'Resposta + Log' },
  },
  {
    id: 'learning',
    kind: 'loop',
    status: 'live',
    evidenceRef: 'Ozzmosis/apps/aurora-autoresearch-runner/',
    label: { en: 'Learning', pt: 'Aprendizado' },
  },

  // ── PRINCIPLES (6 satellites) ───────────────────────────────────────
  {
    id: 'p2-memory',
    kind: 'principle',
    status: 'live',
    evidenceRef: 'aurora_vault.py',
    governs: 'memory',
    label: { en: 'P2 · Multi-level Memory', pt: 'P2 · Memória Multi-nível' },
  },
  {
    id: 'p5-governance',
    kind: 'principle',
    status: 'live',
    evidenceRef: 'CRM/libs/trustware/src/engine/engine.ts',
    governs: 'reasoning',
    label: { en: 'P5 · Governance / Trustware', pt: 'P5 · Governança / Trustware' },
  },
  {
    id: 'p6-event',
    kind: 'principle',
    status: 'live',
    evidenceRef: 'Ozzmosis/apps/aurora-conductor-service/',
    governs: 'response',
    label: { en: 'P6 · Event-Driven', pt: 'P6 · Orientado a Eventos' },
  },
  {
    id: 'p4-learning',
    kind: 'principle',
    status: 'live',
    evidenceRef: 'Ozzmosis/apps/aurora-autoresearch-runner/',
    governs: 'learning',
    label: { en: 'P4 · Continual Learning', pt: 'P4 · Aprendizado Contínuo' },
  },
  {
    id: 'p1-budget',
    kind: 'principle',
    status: 'roadmap',
    phase: 'F1',
    governs: 'perception',
    label: { en: 'P1 · Budget-Aware', pt: 'P1 · Gestão de Budget' },
  },
  {
    id: 'p3-inference',
    kind: 'principle',
    status: 'roadmap',
    phase: 'F2',
    governs: 'perception',
    label: { en: 'P3 · Active Inference', pt: 'P3 · Inferência Ativa' },
  },
];

const LOOP_IDS = ['perception', 'memory', 'reasoning', 'response', 'learning'];

const loopEdges: MeshEdge[] = LOOP_IDS.map((id, i) => ({
  from: id,
  to: LOOP_IDS[(i + 1) % LOOP_IDS.length],
  kind: 'loop',
}));

const governsEdges: MeshEdge[] = MESH_NODES
  .filter(n => n.kind === 'principle')
  .map(n => ({ from: n.id, to: n.governs!, kind: 'governs' }));

export const MESH_EDGES: MeshEdge[] = [...loopEdges, ...governsEdges];
