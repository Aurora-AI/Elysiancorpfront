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
      en: 'The planned sensory input layer — a probabilistic inference module (Pyro-based) that will monitor incoming signals, form beliefs about the environment, and feed structured context into Memory. Awaiting Pyro integration in Phase 2.',
      pt: 'A camada de entrada sensorial planejada — um módulo de inferência probabilística (baseado em Pyro) que monitorará sinais de entrada, formará crenças sobre o ambiente e alimentará contexto estruturado na Memória. Aguardando integração Pyro na Fase 2.',
    },
  },
  {
    id: 'memory',
    kind: 'loop',
    status: 'live',
    evidenceRef: 'aurora_vault.py',
    label: { en: 'Memory', pt: 'Memória' },
    description: {
      en: "Álvaro's encrypted knowledge store — a SQLCipher-backed vault with PBKDF2 key derivation (100 k iterations) and Fernet encryption. Namespaced secrets persist across sessions with LRU-cached key access, so no context is lost between cognitive cycles.",
      pt: 'O repositório de conhecimento criptografado do Álvaro — um vault baseado em SQLCipher com derivação de chave PBKDF2 (100 mil iterações) e criptografia Fernet. Segredos com namespace persistem entre sessões com acesso cacheado por LRU, garantindo que nenhum contexto se perca entre ciclos cognitivos.',
    },
  },
  {
    id: 'reasoning',
    kind: 'loop',
    status: 'live',
    evidenceRef: 'Ozzmosis/libs/alvaro_reasoning/core.py',
    label: { en: 'Reasoning + Validation', pt: 'Raciocínio + Validação' },
    description: {
      en: "The core thinking engine. ReasoningCore performs 'Split Cognitivo' — extracting hidden <think> chain-of-thought blocks from LLM responses, validating that every step cites an Axiom or DECISION reference, and structuring inference prompts with verified facts before any answer is formed.",
      pt: "O motor de pensamento central. ReasoningCore realiza o 'Split Cognitivo' — extraindo blocos ocultos de raciocínio <think> de respostas LLM, validando que cada passo cita um Axioma ou referência DECISION, e estruturando prompts de inferência com fatos verificados antes de qualquer resposta ser formada.",
    },
  },
  {
    id: 'response',
    kind: 'loop',
    status: 'live',
    evidenceRef: 'Ozzmosis/docs/AGENTS/OS_TEMPLATE.md',
    label: { en: 'Response + Logging', pt: 'Resposta + Log' },
    description: {
      en: 'Every Álvaro output passes a mandatory preflight checklist before and after execution. The OS Template enforces a QA Learning Loop (ingest + corrective flow + Reflexion Capture), Topology Impact analysis, and a Pre-Code QA Sensor — making every response observable, auditable, and looped back into learning.',
      pt: 'Toda saída do Álvaro passa por um checklist de preflight obrigatório antes e após a execução. O Template de OS exige QA Learning Loop (ingestão + fluxo corretivo + Reflexion Capture), análise de Topology Impact e Pre-Code QA Sensor — tornando cada resposta observável, auditável e retroalimentada no ciclo de aprendizado.',
    },
  },
  {
    id: 'learning',
    kind: 'loop',
    status: 'live',
    evidenceRef: 'Ozzmosis/apps/aurora-autoresearch-runner/',
    label: { en: 'Learning', pt: 'Aprendizado' },
    description: {
      en: "The governed self-improvement engine. aurora-autoresearch-runner runs controlled experiments against a synthetic benchmark, calculates a Delta Alignment Level (DAL) between baseline and candidate scores, writes structured ledger entries, and creates promotion candidates only when a policy gate allows — blocking unvalidated regressions.",
      pt: 'O motor de auto-melhoria governado. aurora-autoresearch-runner executa experimentos controlados contra um benchmark sintético, calcula um Delta Alignment Level (DAL) entre pontuações baseline e candidato, escreve entradas estruturadas no ledger e cria candidatos de promoção apenas quando um gate de política permite — bloqueando regressões não validadas.',
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
      en: "Knowledge persists in structured layers, not a flat key-value store. aurora_vault.py's namespace system places each cognitive domain (system, project, context) in its own namespace — enabling targeted retrieval, selective expiration, and secure compartmentalization across sessions.",
      pt: 'O conhecimento persiste em camadas estruturadas, não em um armazenamento chave-valor plano. O sistema de namespace do aurora_vault.py coloca cada domínio cognitivo (sistema, projeto, contexto) em seu próprio namespace — possibilitando recuperação direcionada, expiração seletiva e compartimentalização segura entre sessões.',
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
      en: 'The deterministic gate between reasoning and output. DefaultTrustwareEngine evaluates every verdict — validating request shape, subject identity, source context, and fact structure — with no filesystem access, no network calls, and no time dependencies. Every LLM output must pass this gate before persisting.',
      pt: 'O gate determinístico entre raciocínio e saída. DefaultTrustwareEngine avalia cada veredicto — validando forma da solicitação, identidade do sujeito, contexto de origem e estrutura de fatos — sem acesso ao sistema de arquivos, sem chamadas de rede e sem dependências de tempo. Toda saída LLM deve passar por este gate antes de persistir.',
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
      en: "Álvaro's responses are triggered by structured events, not polling. aurora-conductor-service orchestrates cognitive rituals (morning briefs, meeting debriefs, T+30 briefings) via a scheduler, routes events through an OS engine generator, and integrates calendar and email — all fired by state changes, never by busy-waiting.",
      pt: 'As respostas do Álvaro são disparadas por eventos estruturados, não por polling. aurora-conductor-service orquestra rituais cognitivos (briefings matinais, debriefs de reuniões, briefings T+30) via agendador, roteia eventos por um gerador de motor OS e integra calendário e e-mail — tudo disparado por mudanças de estado, nunca por busy-waiting.',
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
      en: 'Álvaro improves across experiments, not just within a session. aurora-autoresearch-runner enforces a policy gate before each run, measures alignment delta against a stable baseline, and restricts promotions to experimentally validated improvements — applying scientific method to cognitive upgrades.',
      pt: 'O Álvaro melhora ao longo de experimentos, não apenas dentro de uma sessão. aurora-autoresearch-runner aplica um gate de política antes de cada execução, mede o delta de alinhamento contra um baseline estável e restringe promoções a melhorias validadas experimentalmente — aplicando o método científico a atualizações cognitivas.',
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
      en: 'A planned governing principle that will constrain perceptual sampling by compute cost. Every inference call will be accounted for — queuing expensive operations, preferring cached beliefs, and degrading gracefully when token or API budgets are depleted. Phase 1 roadmap.',
      pt: 'Um princípio governante planejado que restringirá a amostragem perceptual pelo custo computacional. Cada chamada de inferência será contabilizada — enfileirando operações caras, preferindo crenças em cache e degradando graciosamente quando orçamentos de tokens ou API se esgotarem. Roadmap Fase 1.',
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
      en: 'The planned probabilistic perception engine — a Pyro-backed module that will model the world as a generative Bayesian network. Rather than reacting to raw inputs, Álvaro will maintain and update environmental beliefs, minimizing prediction error across cognitive cycles. Phase 2 roadmap.',
      pt: 'O motor de percepção probabilística planejado — um módulo baseado em Pyro que modelará o mundo como uma rede Bayesiana generativa. Em vez de reagir a entradas brutas, o Álvaro manterá e atualizará crenças ambientais, minimizando o erro de previsão ao longo dos ciclos cognitivos. Roadmap Fase 2.',
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
