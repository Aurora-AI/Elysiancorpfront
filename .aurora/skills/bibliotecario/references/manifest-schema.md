# Manifest Schema

Exemplo canonico de `vault_manifest.json`:

```json
{
  "document_id": "sha256-abc123def456",
  "title": "Nome do documento",
  "source": "URL ou descricao da fonte",
  "ingested_at": "2026-03-28T10:30:00Z",
  "ingested_by": "bibliotecario",
  "classification": "Hibrido",
  "qdrant_chunks": 14,
  "neo4j_nodes": 8,
  "neo4j_edges": 22,
  "skills_enriched": ["aurora-clevel-advisor", "loop-balance-analyzer"],
  "new_skill_proposed": "devil-advocate-auditor",
  "sanitized": true,
  "deprecated": false,
  "raw_path": "docs/Vault/Raw/sha256-abc123def456.md"
}
```

## Regras

- `document_id` deve derivar do hash do conteudo.
- `raw_path` deve apontar para o documento efetivamente persistido.
- `sanitized` nao pode ser `true` se a higienizacao nao ocorreu.
- `deprecated` so muda por metadado; o documento nunca e removido do Vault.
