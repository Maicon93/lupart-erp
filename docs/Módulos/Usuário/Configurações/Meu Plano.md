## Titulo
- Título: 126 - Meu Plano
- Permissão: `126_plan`
- Ambiente: Usuário
- Rota: `/settings/plan`

## Objetivo
- Visualizar as informações do plano de acesso contratado pela empresa

## Corpo

```
┌──────────────────────────────────────────────────────┐
│ 126 - Meu Plano                                      │
├──────────────────────────────────────────────────────┤
│                                                       │
│  ┌────────────────────────────────────────────┐       │
│  │  Plano Atual                               │       │
│  │                                            │       │
│  │  Nome do Plano         Enterprise          │       │
│  │  Usuários              3 / 10              │       │
│  │  Vigência              30 dias             │       │
│  │  Vencimento            15/04/2026          │       │
│  │  Valor da Fatura       R$ 250,00           │       │
│  │  Status                ● Ativo             │       │
│  └────────────────────────────────────────────┘       │
│                                                       │
└──────────────────────────────────────────────────────┘
```

#### Informações do Plano (readonly)

Tela somente leitura — sem edição. Dados do plano vinculado à empresa na tela 12.

| Campo           | Descrição                                                        |
| --------------- | ---------------------------------------------------------------- |
| Nome do Plano   | Nome do plano de acesso (ex: Básico, Enterprise)                 |
| Usuários        | Quantidade utilizada / limite do plano (ex: "3 / 10")            |
| Vigência        | Dias de vigência do plano (ex: "30 dias")                        |
| Vencimento      | Data de vencimento do plano (`companies.plan_expires_at`)        |
| Valor da Fatura | Valor da fatura do plano (R$)                                    |
| Status          | Ativo / Inativo — badge colorida (success / danger)              |

- **Skeleton** enquanto carrega

## Regras específicas
- Tela **somente leitura** — dados gerenciados exclusivamente pelo Administrador (telas 10 e 12)
- "Usuários" conta os registros ativos em `user_companies` para a empresa atual vs. limite do plano
- "Status" reflete o status da empresa na tabela `companies`
- Se a empresa não possuir plano vinculado, exibir mensagem: "Nenhum plano vinculado. Entre em contato com o administrador"
