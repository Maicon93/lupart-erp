## Titulo
- Título: 101 - Dashboard
- Permissão: —
- Ambiente: Usuário
- Rota: `/dashboard`

## Objetivo
- Visão geral dos indicadores financeiros e operacionais da empresa

## Corpo

```
┌───────────────────────────────────────────────────────────┐
│ 101 - Dashboard                                           │
├───────────────────────────────────────────────────────────┤
│                                                           │
│  Financeiro                                               │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────┐ │
│  │ A Receber  │ │ A Pagar    │ │ Vencidos   │ │Vencidos│ │
│  │ Hoje       │ │ Hoje       │ │ Receber    │ │Pagar   │ │
│  │ R$ 1.200   │ │ R$ 800     │ │ R$ 350     │ │R$ 120  │ │
│  └────────────┘ └────────────┘ └────────────┘ └────────┘ │
│                                                           │
│  Vendas                                                   │
│  ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────┐ │
│  │ Vendas Dia │ │ Vendas Mês │ │ Orçamentos │ │OS      │ │
│  │ 5          │ │ 42         │ │ Emitidos   │ │Abertas │ │
│  │ R$ 2.350   │ │ R$ 18.400  │ │ 3          │ │2       │ │
│  └────────────┘ └────────────┘ └────────────┘ └────────┘ │
│                                                           │
│  Vendas - Últimos 30 dias                                 │
│  ┌──────────────────────────────────────────────────────┐ │
│  │ R$                                                   │ │
│  │ 3k ┤          ╭╮                                     │ │
│  │ 2k ┤    ╭╮   ╭╯╰╮  ╭╮        ╭─╮                   │ │
│  │ 1k ┤╭──╮╯╰╮╭╯   ╰╮╯ ╰╮ ╭╮╭─╯  ╰╮                 │ │
│  │  0 ┤╯   ╰   ╰     ╰    ╰╯ ╰      ╰──              │ │
│  │    └──────────────────────────────────────           │ │
│  │    12/02  17/02  22/02  27/02  04/03  09/03          │ │
│  └──────────────────────────────────────────────────────┘ │
│                                                           │
└───────────────────────────────────────────────────────────┘
```

### Seção: Financeiro

4 cards em linha. Dados de `financial_titles` filtrados por `company_id`.

| Card               | Fonte de dados                                                                                          | Cor    |
| ------------------ | ------------------------------------------------------------------------------------------------------- | ------ |
| A Receber Hoje     | Soma de `value` onde `type = inflow`, `status = pendente`, `due_date = hoje`                            | —      |
| A Pagar Hoje       | Soma de `value` onde `type = outflow`, `status = pendente`, `due_date = hoje`                           | —      |
| Vencidos Receber   | Soma de `value` onde `type = inflow`, `status = pendente`, `due_date < hoje`                            | danger |
| Vencidos Pagar     | Soma de `value` onde `type = outflow`, `status = pendente`, `due_date < hoje`                           | danger |

- Cards "Vencidos" exibem valor em cor `danger` quando > 0
- Cada card é clicável — redireciona para a tela correspondente:
  - A Receber Hoje / Vencidos Receber → tela 119 (Contas a Receber)
  - A Pagar Hoje / Vencidos Pagar → tela 120 (Contas a Pagar)

### Seção: Vendas

4 cards em linha.

| Card             | Fonte de dados                                                                                    |
| ---------------- | ------------------------------------------------------------------------------------------------- |
| Vendas do Dia    | Quantidade e soma de `final_value` em `sales` onde `date = hoje`, `status = finalized`            |
| Vendas do Mês    | Quantidade e soma de `final_value` em `sales` onde `date` no mês atual, `status = finalized`      |
| Orçamentos       | Quantidade de `quotes` onde `status = emitido`                                                    |
| OS Abertas       | Quantidade de `service_orders` onde `status` in (`aberta`, `em_andamento`)                        |

- "Vendas do Dia" e "Vendas do Mês" exibem duas linhas: quantidade (ex: "5") e valor (ex: "R$ 2.350,00")
- Cada card é clicável — redireciona para a tela correspondente:
  - Vendas do Dia / Vendas do Mês → tela 115 (Vendas)
  - Orçamentos → tela 117 (Orçamentos)
  - OS Abertas → tela 118 (Ordem de Serviço)

### Seção: Gráfico de Vendas

Gráfico de linha exibindo o valor total de vendas por dia nos **últimos 30 dias**.

- **Eixo X**: datas (dias)
- **Eixo Y**: valor em R$
- Fonte: soma de `sales.final_value` agrupado por `sales.date` onde `status = finalized`
- Dias sem vendas exibem valor 0 (linha contínua)
- Tooltip ao passar o mouse: data + valor do dia

## Regras específicas
- Tela **somente leitura** — sem filtros, sem paginação
- Sem permissão específica — acessível por qualquer usuário autenticado da empresa
- Todos os dados filtrados por `company_id` (multi-tenant)
- **Skeleton** em cada card e no gráfico enquanto carrega
- A API retorna todos os KPIs em um único endpoint (`GET /dashboard`) para minimizar requisições
- O gráfico é renderizado no frontend com uma biblioteca de gráficos (a definir)
