# Pacote de Promoção — ceo-art-direction

## Artefato
Agente de Direção de Arte Cênica.

## Objetivo
Eliminar o gap entre curadoria visual e produção artística executável.

## API de entrada
`ArtDirectionBrief` (briefing artístico em formato JSON).

## API de saída
`ArtProductionReport` (relatório em Markdown com prompt universal, negative prompt, fallback, especificações e handoffs), `SceneCard` e `VisualWorldBible`.

## Gates
`QA-ART-DIRECTION-GATE` (threshold de aprovação: 4.0 / 5.0).

## Budgets
Este agente não consome custos computacionais para renderizar assets; ele apenas atua na especificação e regras. Todo asset especificado no relatório deve ter fallback dinâmico (CSS/SVG), peso alvo regulado e suporte a Reduced Motion.

## Riscos de Operação
- Prompt genérico de IA/SaaS clichê.
- Asset meramente decorativo e sem função cognitiva declarada.
- Falta de área segura para texto em layouts.
- Ausência de fallback viável para conexões instáveis.

## Checklist de Integridade (Checklist Trustware)
- [x] Função cognitiva declarada para todos os assets.
- [x] Regras de uso permitido e proibido.
- [x] Definição clara de fallback técnico.
- [x] Critérios de aceite estruturados.
- [x] Handoff detalhado direcionando a design, effects e web.
- [x] Filtros anti-IA / anti-SaaS genérico aplicados.
