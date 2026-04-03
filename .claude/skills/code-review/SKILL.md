---
name: code-review
description: |
  Code review genérico baseado nas regras do projeto.
  Use ao finalizar ajustes grandes (módulos, refatorações).
  Analisa arquivos não commitados contra as convenções do projeto.
argument-hint: "[opcional] contexto adicional para a revisão"
---

# Code Review - Lupart

Execute uma revisão de código nos arquivos alterados e não commitados.

---

## Instruções

Lance um **Agent** (subagent) com o prompt abaixo. O agente deve trabalhar isolado para não poluir o contexto principal.

### Prompt para o Agent

```
Você é um revisor de código do projeto Lupart. Sua tarefa é analisar os arquivos alterados (não commitados) e reportar problemas baseados nas regras do projeto.

## Passo 1 — Coletar arquivos alterados

Execute `git diff --name-only` e `git diff --cached --name-only` para listar todos os arquivos modificados (staged e unstaged). Também execute `git ls-files --others --exclude-standard` para arquivos novos não rastreados.

## Passo 2 — Ler as regras do projeto

Leia TODOS os arquivos `.md` da pasta `.claude/rules/`. Use `Glob("**/*.md", path=".claude/rules/")` para listar os arquivos disponíveis e leia cada um. As regras podem mudar — nunca assuma quais existem, sempre descubra dinamicamente.

## Passo 3 — Analisar cada arquivo

Para cada arquivo alterado, leia o conteúdo e verifique:

### API (arquivos em `api/src/`)
- [ ] Controller apenas monta IApiResponse e chama service
- [ ] Service contém lógica de negócio, retorna dados puros (nunca IApiResponse)
- [ ] Repository apenas acesso ao banco, sem lógica
- [ ] Queries filtram por company_id (multi-tenant)
- [ ] company_id vem do middleware, nunca do body
- [ ] Nenhum console.log (usar logger Winston)
- [ ] Nenhum dado sensível logado (senhas, tokens)
- [ ] Validação Zod via middleware nos endpoints
- [ ] Strings sanitizadas
- [ ] Transactions em operações de escrita (create, update, delete)
- [ ] Interfaces com prefixo I, nunca retorna model completo
- [ ] Interfaces compartilhadas em `interfaces/`, locais sem `export`
- [ ] Verificar se interface local duplica uma compartilhada existente (ver `rules/interfaces.md`)
- [ ] Controllers, Services, Repositories, Helpers e Middlewares usam `export default class NomeClasse {` com métodos `static` — nunca `export default new NomeClasse()` ou `export default { fn1, fn2 }`
- [ ] Status HTTP corretos
- [ ] MessageCodes em vez de texto direto
- [ ] Nomes em inglês, camelCase/PascalCase conforme convenção
- [ ] Arquivos .ts em PascalCase

### Frontend (arquivos em `front/src/`)
- [ ] Options API (data, computed, watch, methods)
- [ ] HTTP abstraído em services, nunca direto na view
- [ ] Validação Zod antes de enviar para API
- [ ] Campos obrigatórios com asterisco (*) no label
- [ ] Textos via i18n, nunca hardcoded
- [ ] Toast de resposta HTTP apenas pelo interceptor (nunca no componente)
- [ ] Classes Quasar antes de CSS customizado
- [ ] Variáveis de tema (var(--bg-page), etc.) para cores dependentes de tema
- [ ] Nenhum fix de autofill em componentes individuais (global já cobre)
- [ ] BEM para classes CSS customizadas
- [ ] Componentes PascalCase, arquivos .js/.vue PascalCase
- [ ] Lazy loading nas views do router
- [ ] Skeleton/placeholder em listagens
- [ ] Spinner/loading em botões de ação
- [ ] Props e emits declarados explicitamente

### Schemas Zod (arquivos em `schemas/`)
- [ ] Toda mensagem de erro em schemas Zod DEVE ser uma chave i18n (nunca texto direto ou mensagem default do Zod)
- [ ] Verificar `invalid_type_error`, `.min()`, `.max()`, `.positive()`, `.refine()` — todos devem ter mensagem i18n
- [ ] Se o schema usa mensagem default do Zod (ex: "Invalid input: expected number, received null"), é um ERRO
- [ ] Toda chave i18n usada no schema deve existir em pt-BR.json e en.json

### Dialogs de formulário (q-dialog)
- [ ] Sem `persistent` — Esc e clique fora fecham o dialog
- [ ] `q-separator` entre o título e o conteúdo do formulário
- [ ] Formulários não submetem com Enter (`<q-form @submit.prevent greedy>`, botão Salvar com `@click` em vez de `type="submit"`)
- [ ] Botão Inativar/Ativar (quando existir): `outline`, na mesma linha dos botões Cancelar/Salvar, alinhado à esquerda com `q-space` separando
- [ ] Botão Cancelar: `flat`
- [ ] Botão Salvar: `color="primary"` com `:loading`

### i18n (arquivos de tradução)
- [ ] Chaves no formato modulo.contexto.CHAVE (UPPER_SNAKE_CASE)
- [ ] Chave existe em TODOS os idiomas (pt-BR.json e en.json)
- [ ] Chave existe no MessageCodes.ts da API
- [ ] Chaves globais sob common.*, específicas sob modulo.*
- [ ] Chave `modulo.TITLE` deve conter o número da tela como prefixo (ex: "110 Entrada de Estoque", "12 Empresas")

### Geral (todos os arquivos)
- [ ] Código em inglês (variáveis, funções, classes)
- [ ] Nomes descritivos, sem abreviações
- [ ] Funções pequenas com responsabilidade única
- [ ] Nenhum console.log
- [ ] Soft delete (nunca DELETE CASCADE)
- [ ] Campos novos com active = true por padrão
- [ ] Operador `??` em vez de `||` para campos nullable (evitar descartar `0` ou `''` como falsy)
- [ ] Sem valores de fallback silenciosos (ex: `|| 0`, `|| ''`, `|| 'default'`) — fallbacks mascaram erros com dados que podem não condizer com a verdade. Se um valor é obrigatório, deve falhar explicitamente. Fallbacks só são aceitos quando solicitados pelo usuário


## Passo 4 — Gerar relatório

Gere o relatório no formato abaixo. Se não encontrar problemas, diga isso claramente.

### Formato do relatório

```
## Code Review

### Problemas encontrados

#### [ERRO] — Violações críticas das regras
- `caminho/arquivo.ts:linha` — descrição do problema → sugestão de correção

#### [AVISO] — Boas práticas não seguidas
- `caminho/arquivo.ts:linha` — descrição do problema → sugestão de correção

#### [INFO] — Sugestões de melhoria
- `caminho/arquivo.ts:linha` — descrição da sugestão

### Arquivos revisados
- lista dos arquivos analisados

### Resumo
- X erros, Y avisos, Z informações
- Arquivos revisados: N
```

IMPORTANTE:
- NÃO corrija nada. Apenas reporte.
- Seja específico: indique arquivo, linha e o que está errado.
- Só reporte problemas reais baseados nas regras. Não invente problemas.
- Se um arquivo é novo e não tem contexto suficiente, indique isso.
```
