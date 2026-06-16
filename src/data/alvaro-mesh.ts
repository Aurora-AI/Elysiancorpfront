import type { MeshNode, MeshEdge } from './alvaro-mesh.types';

export const MESH_NODES: MeshNode[] = [
  // ── LOOP (5 steps, clockwise from top) ──────────────────────────────
  {
    id: 'perception',
    kind: 'loop',
    status: 'roadmap',
    phase: 'F2',
    label: { en: 'Active Perception', pt: 'Percepção Ativa' },
    description: {
      en: 'The senses Álvaro will grow. Today it reacts to structured events; in Phase 2 it will model its environment and form beliefs before acting — anticipating, not just responding. _(Roadmap: Pyro active inference.)_',
      pt: 'Os sentidos que o Álvaro desenvolverá. Hoje reage a eventos estruturados; na Fase 2 modelará o ambiente e formará crenças antes de agir — antecipando, não só respondendo. _(Roadmap: inferência ativa com Pyro.)_',
    },
  },
  {
    id: 'memory',
    kind: 'loop',
    status: 'live',
    evidenceRef: 'aurora_vault.py',
    label: { en: 'Memory', pt: 'Memória' },
    description: {
      en: 'Álvaro never forgets context and never mixes clients. Knowledge isn\'t dumped into the model — it\'s sealed in encrypted vaults, so one client\'s data can never surface in another\'s answer. _(Under the hood: SQLCipher, PBKDF2, Fernet.)_',
      pt: 'O Álvaro não esquece o contexto e nunca mistura clientes. O conhecimento não é despejado no modelo — é selado em cofres criptografados, então o dado de um cliente nunca aparece na resposta de outro. _(Por baixo: SQLCipher, PBKDF2, Fernet.)_',
    },
  },
  {
    id: 'reasoning',
    kind: 'loop',
    status: 'live',
    evidenceRef: 'Ozzmosis/libs/alvaro_reasoning/core.py',
    label: { en: 'Reasoning + Validation', pt: 'Raciocínio + Validação' },
    description: {
      en: 'Álvaro can\'t hand-wave. Every conclusion must cite the axiom or prior decision it rests on — a step with no traceable basis is rejected before it ever reaches you. _(Mechanism: ReasoningCore\'s Split Cognitivo.)_',
      pt: 'O Álvaro não pode "achar". Toda conclusão precisa citar o axioma ou a decisão em que se apoia — um passo sem base rastreável é rejeitado antes de chegar até você. _(Mecanismo: Split Cognitivo do ReasoningCore.)_',
    },
  },
  {
    id: 'response',
    kind: 'loop',
    status: 'live',
    evidenceRef: 'Ozzmosis/docs/AGENTS/OS_TEMPLATE.md',
    label: { en: 'Response + Logging', pt: 'Resposta + Log' },
    description: {
      en: 'Nothing Álvaro does disappears. Every response runs a mandatory pre- and post-flight checklist and is logged as auditable evidence — so any action can be reconstructed and questioned. _(Mechanism: the OS Template\'s QA Learning Loop.)_',
      pt: 'Nada que o Álvaro faz se perde. Toda resposta passa por um checklist obrigatório antes e depois e é registrada como evidência auditável — então qualquer ação pode ser reconstruída e questionada. _(Mecanismo: QA Learning Loop do OS Template.)_',
    },
  },
  {
    id: 'learning',
    kind: 'loop',
    status: 'live',
    evidenceRef: 'Ozzmosis/apps/aurora-autoresearch-runner/',
    label: { en: 'Learning', pt: 'Aprendizado' },
    description: {
      en: 'Álvaro gets better across time, not just within a chat — but every upgrade is an experiment that must prove itself before it\'s let in. No promotion without measured gain. No silent regressions. _(Mechanism: aurora-autoresearch-runner.)_',
      pt: 'O Álvaro melhora ao longo do tempo, não só dentro de um chat — mas todo upgrade é um experimento que precisa se provar antes de entrar. Sem promoção sem ganho medido. Sem regressões silenciosas. _(Mecanismo: aurora-autoresearch-runner.)_',
    },
  },

  // ── PRINCIPLES (6 satellites) ───────────────────────────────────────
  {
    id: 'p2-memory',
    kind: 'principle',
    status: 'live',
    evidenceRef: 'aurora_vault.py',
    governs: 'memory',
    label: { en: 'P2 · Multi-level Memory', pt: 'P2 · Memória Multi-nível' },
    description: {
      en: 'Knowledge lives in compartments, not one big pile — each domain sealed in its own namespace, so leaks have nowhere to spread.',
      pt: 'O conhecimento vive em compartimentos, não numa pilha só — cada domínio selado em seu namespace, então vazamentos não têm para onde se espalhar.',
    },
  },
  {
    id: 'p5-governance',
    kind: 'principle',
    status: 'live',
    evidenceRef: 'CRM/libs/trustware/src/engine/engine.ts',
    governs: 'reasoning',
    label: { en: 'P5 · Governance / Trustware', pt: 'P5 · Governança / Trustware' },
    description: {
      en: 'The model never has the final word. A deterministic gate — no LLM, no randomness — must approve every output before it persists. If it doesn\'t pass, it doesn\'t ship.',
      pt: 'O modelo nunca tem a palavra final. Um gate determinístico — sem LLM, sem aleatoriedade — precisa aprovar toda saída antes de persistir. Se não passa, não sai.',
    },
  },
  {
    id: 'p6-event',
    kind: 'principle',
    status: 'live',
    evidenceRef: 'Ozzmosis/apps/aurora-conductor-service/',
    governs: 'response',
    label: { en: 'P6 · Event-Driven', pt: 'P6 · Orientado a Eventos' },
    description: {
      en: 'Álvaro acts on events, not guesswork — every move is triggered by a real state change, never by a model deciding to act on its own.',
      pt: 'O Álvaro age por eventos, não por palpite — todo movimento é disparado por uma mudança de estado real, nunca por um modelo agindo sozinho.',
    },
  },
  {
    id: 'p4-learning',
    kind: 'principle',
    status: 'live',
    evidenceRef: 'Ozzmosis/apps/aurora-autoresearch-runner/',
    governs: 'learning',
    label: { en: 'P4 · Continual Learning', pt: 'P4 · Aprendizado Contínuo' },
    description: {
      en: 'Álvaro gets smarter — but only if it measurably improves. Every candidate upgrade is tested against a stable baseline; only validated gains pass, and only with a human\'s approval. No silent regressions.',
      pt: 'O Álvaro fica mais inteligente — mas só se melhorar de verdade. Cada candidato de upgrade é testado contra um baseline estável; só ganhos validados avançam, e só com aprovação humana. Sem regressões silenciosas.',
    },
  },
  {
    id: 'p1-budget',
    kind: 'principle',
    status: 'roadmap',
    phase: 'F1',
    governs: 'perception',
    label: { en: 'P1 · Budget-Aware', pt: 'P1 · Gestão de Budget' },
    description: {
      en: 'The planned cost discipline. Phase 1 will teach Álvaro to account for every token, to prefer cached answers over fresh API calls, and to degrade gracefully when budgets run dry — ensuring inference cost stays predictable, not explosive.',
      pt: 'A disciplina de custo planejada. Fase 1 ensinará o Álvaro a contabilizar cada token, preferir respostas em cache a chamadas frescas de API, e degradar graciosamente quando orçamentos se esgotarem — garantindo que o custo de inferência seja previsível, não explosivo.',
    },
  },
  {
    id: 'p3-inference',
    kind: 'principle',
    status: 'roadmap',
    phase: 'F2',
    governs: 'perception',
    label: { en: 'P3 · Active Inference', pt: 'P3 · Inferência Ativa' },
    description: {
      en: 'The planned probabilistic mind. Phase 2 will teach Álvaro to model its environment as a Bayesian network, forming and updating beliefs before acting — reducing surprise, minimizing prediction error. Anticipation, not reaction.',
      pt: 'A mente probabilística planejada. Fase 2 ensinará o Álvaro a modelar seu ambiente como uma rede Bayesiana, formando e atualizando crenças antes de agir — reduzindo surpresa, minimizando erro de previsão. Antecipação, não reação.',
    },
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
