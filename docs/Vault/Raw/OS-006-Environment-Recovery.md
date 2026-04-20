# OS-006: Environment Recovery & Build Neutralization
**Status**: [DRAFT]
**Priority**: CRITICAL
**Owner**: Aurora Full-Spectrum Agent

## 1. Contexto & Diagnóstico
O ambiente de desenvolvimento está sofrendo de "Environment Drift" severo. As ferramentas de build (`npm`, `pnpm`, `vite`) estão ignorando o contexto local do projeto (`c:\Projetos\Aurora\MadLabAurora\ElysianCorp`) e ancorando-se no diretório interno da IDE (`AppData\Local\Programs\Antigravity`).

**Causa Raiz**: As variáveis `VSCODE_CWD` e shims no `Path` direcionam as chamadas de sistema para o diretório de instalação do Antigravity.

## 2. Ordem de Execução (Hard Neutralization)

### Gate 1: Isolamento de Sessão
1. Criar script de build soberano (`build.ps1`).
2. Limpar `VSCODE_CWD`, `VSCODE_PID` e referências de `Path` ao Antigravity dentro da sessão de shell.
3. Configurar `.npmrc` local para forçar armazenamento de módulos dentro do projeto (`.pnpm-store`).

### Gate 2: Reconstrução de Dependências
1. Executar `pnpm install --store-dir ./.pnpm-store` sob isolamento.
2. Validar que `node_modules` local foi populado corretamente.

### Gate 3: Build & Validação
1. Executar `astro build` utilizando o binário hard-coded (`.\node_modules\.bin\astro`).
2. Gerar evidências de sucesso (Exit code 0).

## 3. Riscos & Mitigação
- **Risco**: Perda de integração com ferramentas de depuração da IDE.
- **Mitigação**: O isolamento é aplicado apenas à sessão de build/install, não afetando o estado global da IDE.

## 4. Aprovação Necessária
- [ ] Gate 1: Aprovação do Plano de Isolamento.
- [ ] Gate 2: Aprovação da Reinstalação de Dependências.
