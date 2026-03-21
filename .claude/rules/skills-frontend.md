# skills-frontend.md

Quando o usuário pedir para criar uma "skill" de um módulo do **Frontend**, criar um **arquivo de skill** em `.claude/skills/front/`.

## Formato do Arquivo

```markdown
---
name: nome-do-modulo
description: |
  Descrição do módulo. Use quando trabalhar com:
  palavras-chave, componentes, funcionalidades relacionadas
argument-hint: [tarefa a realizar]
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# Nome do Módulo - Lupart Frontend

Ajude com: $ARGUMENTS

---

[conteúdo detalhado]
```

## Estrutura Obrigatória

O comando deve conter as seguintes seções:

1. **Visão Geral** — O que o módulo faz
2. **Arquivos do Sistema** — Tabela com: Views, Componentes, Services, Stores, Schemas
3. **Telas** — Para cada tela:
   - Número da tela e permissão
   - Rota
   - Componentes utilizados
   - Descrição da UI
4. **Services** — Métodos HTTP utilizados e endpoints chamados
5. **Validações (Zod)** — Schemas de validação dos formulários
6. **Fluxos Completos** — Passo a passo das operações (sem exemplos de código)

## Manutenção

- Ao finalizar a criação de um módulo ou uma modificação grande, sempre criar ou atualizar a skill correspondente.
- Criar em: `.claude/skills/front/{nome-do-modulo}.md`
- Atualizar referência em: `.claude/CLAUDE.md` na seção "Skills Disponíveis"
