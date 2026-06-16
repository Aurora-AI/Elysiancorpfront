import { useEffect, useRef } from 'react';

// Mermaid is a large ESM lib — dynamic import keeps it out of the initial bundle.
// This component is always mounted inside a client:visible island, so dynamic import is safe.

const PARCHMENT = '#F8F7F3';
const INK = '#1A1A17';

const CLASS_DEFS = `
    classDef input  fill:#1A1A17,stroke:#1A1A17,stroke-width:1.5px,color:#F8F7F3
    classDef orch   fill:#4E5B4B,stroke:#4E5B4B,stroke-width:1.5px,color:#F8F7F3
    classDef memory fill:#6B7260,stroke:#6B7260,stroke-width:1.5px,color:#F8F7F3
    classDef gov    fill:#3D3831,stroke:#3D3831,stroke-width:1.5px,color:#F8F7F3
    classDef out    fill:#8A9E87,stroke:#8A9E87,stroke-width:1.5px,color:#1A1A17
    classDef learn  fill:#B5AC9E,stroke:#B5AC9E,stroke-width:1.5px,color:#1A1A17
    classDef obs    fill:#9AA0A6,stroke:#9AA0A6,stroke-width:1.5px,color:#1A1A17
`;

const FLOWCHART: Record<'en' | 'pt', string> = {
  en: `graph TD
${CLASS_DEFS}
    subgraph Entry ["Perception Layer"]
        Ev[Event / User Input / OS]:::input --> Gate[ElysiaJS Gateway / Redis Pub-Sub]:::input
    end
    subgraph Cognitive ["Reasoning & Active Inference"]
        Gate --> ActiveInf[Active Inference Engine]:::orch
        ActiveInf --> Pred[Prediction Generation]:::orch
        Pred --> EvalSurprise{Uncertainty / Prediction Error}:::orch
    end
    subgraph Memory ["Tripartite Memory"]
        EvalSurprise -- "Context Fetch" --> MemSessao[(1. Ephemeral Memory / Redis)]:::memory
        MemSessao --> MemTrab[(2. Working Memory / Postgres)]:::memory
        MemTrab --> Vault[(3. Long-term Memory / Vault & ChromaDB)]:::memory
        Vault --> ActiveInf
    end
    subgraph Governance ["Governance & Trustware — Deterministic"]
        EvalSurprise -- "Action Proposal" --> RulesGate{AST / Drools Rules Engine}:::gov
        RulesGate -- "Validated with genesis.v0.yaml" --> GenGate{Genesis Gate / Contracts}:::gov
        GenGate -- "Fail" --> Block[Action Blocked / Error Log]:::gov
    end
    subgraph Execution ["Action Execution"]
        GenGate -- "Approved" --> Exec[Execute Action / Output]:::out
        Exec --> LogVault[Evidence to docs/Vault/Raw/]:::out
        LogVault --> OutputNode[Final Response]:::out
    end
    subgraph Observability ["Agentive Observability — Read-Only"]
        Exec -.-> Trace[Trace Generation IDE / OS / QA]:::obs
        Trace --> ObsGateway[Observability MCP Gateway]:::obs
        ObsGateway --> Diag[Diagnostics: Bottlenecks, Failures, Costs]:::obs
        Diag -.-> |Regression Suggestions| ActiveInf
    end
    subgraph Hardening ["Continual Hardening — Supervised"]
        Diag --> Regress{Error / Regression?}:::learn
        Regress -- Yes --> SandBox[Self-Repair Sandbox]:::learn
        SandBox --> GenPatch[Candidate Patch]:::learn
        GenPatch --> QADet[Deterministic QA]:::learn
        QADet --> EvVault[Evidence in Vault]:::learn
        EvVault --> HumApp{Human Approval?}:::learn
        HumApp -- Approved --> Prom[Promote to Production]:::learn
        Prom --> ActiveInf
    end
    subgraph Ingestion ["Cognitive Ingestion — Passive Learning"]
        NewData[New Knowledge / Lessons Learned]:::learn --> Ingestor[Ingestor]:::learn
        Ingestor --> Biblio[Librarian]:::learn
        Biblio --> Cientista[Scientist: Delta & KI Update]:::learn
        Cientista --> Vault
    end
    Block --> OutputNode
`,
  pt: `graph TD
${CLASS_DEFS}
    subgraph Entrada ["Camada de Entrada / Percepção"]
        Ev[Evento / Input do Usuário / OS]:::input --> Gate[Gateway ElysiaJS / Redis Pub-Sub]:::input
    end
    subgraph Cognitiva ["Raciocínio & Inferência Ativa"]
        Gate --> ActiveInf[Active Inference Engine]:::orch
        ActiveInf --> Pred[Geração de Predição]:::orch
        Pred --> EvalSurprise{Incerteza / Erro de Predição}:::orch
    end
    subgraph Memoria ["Memória Tripartite"]
        EvalSurprise -- "Busca de Contexto" --> MemSessao[(1. Memória Efêmera / Redis)]:::memory
        MemSessao --> MemTrab[(2. Memória de Trabalho / Postgres)]:::memory
        MemTrab --> Vault[(3. Memória de Longo Prazo / Vault & ChromaDB)]:::memory
        Vault --> ActiveInf
    end
    subgraph Governanca ["Governança & Trustware — Determinístico"]
        EvalSurprise -- "Proposta de Ação" --> RulesGate{Motor de Regras AST / Drools}:::gov
        RulesGate -- "Validado com genesis.v0.yaml" --> GenGate{Genesis Gate / Contratos}:::gov
        GenGate -- "Falha" --> Block[Ação Bloqueada / Log de Erro]:::gov
    end
    subgraph Saida ["Execução de Ações"]
        GenGate -- "Aprovado" --> Exec[Execução da Ação / Output]:::out
        Exec --> LogVault[Evidências em docs/Vault/Raw/]:::out
        LogVault --> OutputNode[Resposta Final]:::out
    end
    subgraph Observabilidade ["Observabilidade Agentiva — Read-Only"]
        Exec -.-> Trace[Traces IDE / OS / QA]:::obs
        Trace --> ObsGateway[Observability MCP Gateway]:::obs
        ObsGateway --> Diag[Diagnóstico: Gargalos, Falhas, Custos]:::obs
        Diag -.-> |Sugestões de Regressão| ActiveInf
    end
    subgraph Hardening ["Continual Hardening — Supervisionado"]
        Diag --> Regress{Erro / Regressão?}:::learn
        Regress -- Sim --> SandBox[Sandbox de Auto-Reparo]:::learn
        SandBox --> GenPatch[Patch Candidato]:::learn
        GenPatch --> QADet[QA Determinístico]:::learn
        QADet --> EvVault[Evidência no Vault]:::learn
        EvVault --> HumApp{Aprovação Humana?}:::learn
        HumApp -- Aprovado --> Prom[Promoção para Produção]:::learn
        Prom --> ActiveInf
    end
    subgraph Ingestao ["Ingestão Cognitiva — Aprendizado Passivo"]
        NewData[Novo Conhecimento / Lições Aprendidas]:::learn --> Ingestor[Ingestor]:::learn
        Ingestor --> Biblio[Bibliotecário]:::learn
        Biblio --> Cientista[Cientista: Delta & Atualização de KI]:::learn
        Cientista --> Vault
    end
    Block --> OutputNode
`,
};

/** Insert an SVG string into a container safely via DOMParser (no innerHTML). */
function mountSvg(container: HTMLDivElement, svgString: string): void {
  // Parse in SVG namespace — scripts cannot execute in image/svg+xml context.
  const parser = new DOMParser();
  const doc = parser.parseFromString(svgString, 'image/svg+xml');
  const svgEl = doc.documentElement as unknown as SVGSVGElement;

  // Resize to fill container width.
  svgEl.removeAttribute('width');
  svgEl.removeAttribute('height');
  svgEl.style.width = '100%';
  svgEl.style.height = 'auto';

  // Clear previous content and append the parsed node.
  while (container.firstChild) container.removeChild(container.firstChild);
  container.appendChild(document.importNode(svgEl, true));
}

interface Props {
  lang: 'en' | 'pt';
}

export function AlvaroFlowchart({ lang }: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const renderIdRef = useRef(0);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const renderId = ++renderIdRef.current;

    import('mermaid').then(({ default: mermaid }) => {
      if (renderId !== renderIdRef.current) return;

      mermaid.initialize({
        startOnLoad: false,
        theme: 'base',
        themeVariables: {
          background: PARCHMENT,
          mainBkg: '#F0EDE8',
          nodeBorder: '#9AA0A6',
          clusterBkg: '#EAE7E2',
          clusterBorder: '#9AA0A6',
          titleColor: INK,
          primaryTextColor: INK,
          lineColor: '#9AA0A6',
          edgeLabelBackground: PARCHMENT,
          fontFamily: 'JetBrains Mono, monospace',
          fontSize: '12px',
        },
        flowchart: { curve: 'basis' },
      });

      mermaid
        .render(`alvaro-fc-${lang}-${renderId}`, FLOWCHART[lang])
        .then(({ svg }) => {
          if (renderId !== renderIdRef.current || !containerRef.current) return;
          mountSvg(containerRef.current, svg);
        })
        .catch(() => {
          if (renderId !== renderIdRef.current || !containerRef.current) return;
          const p = document.createElement('p');
          p.textContent = 'Diagram render unavailable';
          p.style.cssText = 'color:#9AA0A6;font-family:monospace;text-align:center;padding:2rem';
          while (containerRef.current.firstChild) containerRef.current.removeChild(containerRef.current.firstChild);
          containerRef.current.appendChild(p);
        });
    });
  }, [lang]);

  return (
    <div
      ref={containerRef}
      className="w-full overflow-x-auto rounded-sm"
      style={{ background: PARCHMENT, minHeight: '300px' }}
      aria-label={
        lang === 'en'
          ? 'Álvaro full architecture flowchart'
          : 'Fluxograma da arquitetura completa do Álvaro'
      }
    />
  );
}
