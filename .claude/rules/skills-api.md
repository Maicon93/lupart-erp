# skills-api.md

Quando o usuário pedir para criar uma "skill" de um módulo da **API**, criar um **arquivo de skill** em `.claude/skills/api/`.

## Formato do Arquivo

```markdown
---
name: nome-do-modulo
description: |
  Descrição do módulo. Use quando trabalhar com:
  palavras-chave, funcionalidades relacionadas
argument-hint: [tarefa a realizar]
allowed-tools: Read, Grep, Glob, Edit, Write, Bash
---

# Nome do Módulo - Lupart API

Ajude com: $ARGUMENTS

---

[conteúdo detalhado]
```

## Estrutura Obrigatória

O comando deve conter as seguintes seções:

1. **Visão Geral** — O que o módulo faz
2. **Arquivos do Sistema** — Tabela com: Controller, Router, Services, Repositories, Models, Schemas
3. **Endpoints da API** — Para cada endpoint:
   - Método e rota
   - Middlewares utilizados
   - Request body/params/query (TypeScript)
   - Response (TypeScript)
   - Regras de negócio
4. **Entidades do Banco** — Referência das models utilizadas
5. **Configurações** — Se usar tabela configurations
6. **Cálculos/Fórmulas** — Apenas descritivo
7. **Fluxos Completos** — Passo a passo das operações (sem exemplos de código)

## Manutenção

- Ao finalizar a criação de um módulo ou uma modificação grande, sempre criar ou atualizar a skill correspondente.
- Criar em: `.claude/skills/api/{nome-do-modulo}.md`
- Atualizar referência em: `.claude/CLAUDE.md` na seção "Skills Disponíveis"
