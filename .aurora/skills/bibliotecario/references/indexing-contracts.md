# Indexing Contracts

## Qdrant

Prepare:
- `chunks.json`
- `embeddings-meta.json`

Cada chunk deve manter:
- `document_id`
- `chunk_id`
- `source_title`
- `classification`
- `security_clearance`
- `text`

## Neo4j

Prepare:
- `neo4j-nodes.json`
- `neo4j-edges.json`

Mapeie:
- entidades
- conceitos
- dependencias
- relacoes entre conhecimento novo e skills/produtos atuais

## Regra de integridade

Nenhum chunk ou relacao pode existir sem `document_id` e fonte rastreavel.
