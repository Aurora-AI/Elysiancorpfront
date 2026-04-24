# Vault Custody

## Caminhos canonicos

- Raw: `C:\\Aurora\\Ozzmosis\\docs\\Vault\\Raw\\`
- Processed: `C:\\Aurora\\Ozzmosis\\docs\\Vault\\Processed\\`
- Deltas: `C:\\Aurora\\Ozzmosis\\docs\\Vault\\Deltas\\`

## Politica

- O Vault e append-only.
- O arquivo sanitizado em `Raw` e a copia imutavel de referencia.
- O pacote em `Processed\\[sha256]\\` concentra os derivados de indexacao.
- O hash do conteudo bruto e o id canonico da ingestao.

## Cadeia de custodia

1. Receber documento + matriz aprovada.
2. Sanitizar sem perder semantica.
3. Persistir o bruto sanitizado em `Raw`.
4. Gerar derivados em `Processed`.
5. Emitir manifest.
6. Handoff para `cientista`.
