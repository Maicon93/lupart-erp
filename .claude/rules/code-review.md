# code-review.md

## Quando sugerir

- Ao finalizar a implementação de um **módulo novo** (API + Frontend)
- Ao finalizar **refatorações grandes** que afetam múltiplos arquivos
- Ao finalizar mudanças em **regras de negócio** ou **cálculos**

## Quando NÃO sugerir

- Ajustes pequenos (corrigir cor, renomear, fix pontual)
- Alterações apenas em documentação, rules ou skills
- Commits de configuração (docker, deps, env)

## Como sugerir

Ao finalizar um ajuste grande, pergunte:

> "Quer que eu rode o `/code-review` antes do commit?"

Nunca rode automaticamente sem aprovação do usuário.
