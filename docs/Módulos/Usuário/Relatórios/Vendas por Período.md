## Titulo
- Título: 123 - Vendas por Período
- Permissão: `123_sales_report`
- Ambiente: Usuário
- Rota: `/reports/sales-by-period`

## Objetivo
- Visualizar o desempenho de vendas em um período selecionado, com indicadores resumidos e listagem detalhada

## Corpo

```
┌──────────────────────────────────────────────────────────────┐
│ 123 - Vendas por Período                 [ Exportar CSV ]    │
├──────────────────────────────────────────────────────────────┤
│ De [__/__/____]  Até [__/__/____]  Status [________▾]        │
│ Cliente [__________▾]  Responsável [__________▾]             │
├──────────────────────────────────────────────────────────────┤
│ ┌────────────┐ ┌────────────┐ ┌────────────┐ ┌────────────┐ │
│ │ Total      │ │ Valor      │ │ Ticket     │ │ Canceladas │ │
│ │ Vendas     │ │ Total      │ │ Médio      │ │            │ │
│ │    47      │ │ R$12.340   │ │ R$ 262,55  │ │     3      │ │
│ └────────────┘ └────────────┘ └────────────┘ └────────────┘ │
├──────────────────────────────────────────────────────────────┤
│ Data     │ Nº   │ Cliente        │ Valor Final │ Status  │
├──────────┼──────┼────────────────┼─────────────┼─────────┤
│ 12/03/26 │ #152 │ João Silva     │ R$ 350,00   │Finaliz. │
│ 11/03/26 │ #151 │ Consumidor     │ R$  85,00   │Finaliz. │
│ 10/03/26 │ #150 │ Empresa X      │ R$ 1.200,00 │Cancel.  │
│ 10/03/26 │ #149 │ Consumidor     │ R$ 45,00    │Finaliz. │
├──────────┴──────┴────────────────┴─────────────┴─────────┤
│ 20 ▾  1-20 de 47            [ < ]  1  2  3  [ > ]           │
└──────────────────────────────────────────────────────────────┘
```

#### Cards de resumo

Exibidos no topo, abaixo dos filtros. Calculados com base nos registros filtrados:

| Card             | Descrição                                                        |
| ---------------- | ---------------------------------------------------------------- |
| Total de Vendas  | Contagem de vendas finalizadas no período                        |
| Valor Total      | Soma de `final_value` das vendas finalizadas                     |
| Ticket Médio     | Valor Total ÷ Total de Vendas                                   |
| Canceladas       | Contagem de vendas com `status = cancelled` no período           |

- Vendas canceladas **não** entram nos cálculos de Valor Total e Ticket Médio
- Se não houver vendas, os cards exibem `0` / `R$ 0,00`

#### Listagem de dados

Tela somente leitura — sem criação, apenas consulta.

| Coluna      | Descrição                                         |
| ----------- | ------------------------------------------------- |
| Data        | Data da venda                                     |
| Nº Venda    | ID da venda (link clicável)                       |
| Cliente     | Nome do cliente                                   |
| Valor Final | Valor após desconto (`final_value`)               |
| Status      | Finalizada / Cancelada                            |

- **Filtros**: período (data início / data fim), status (Todos / Finalizada / Cancelada), cliente (autocomplete), responsável (autocomplete)
- **Período padrão**: mês atual (primeiro dia até hoje)
- **Paginação**: 20, 50, 100 registros
- **Ordenação padrão**: data mais recente primeiro
- **Skeleton** enquanto carrega

**Ações:**
- **Nº Venda** — Link clicável que redireciona para a tela 115 (Vendas), abrindo os detalhes da venda
- **Exportar CSV** — exporta os registros filtrados com as mesmas colunas da listagem

## Regras específicas
- Tela **somente leitura** — não possui formulário de criação
- Fonte de dados: tabela `sales` — ver [sales](../../../Database/sales.md)
- Inclui vendas originadas tanto da tela 114 (PDV) quanto da tela 115 (Vendas), pois ambas salvam na mesma tabela `sales`
- Filtrada por `company_id` (multi-tenant)
- Os cards são recalculados a cada mudança de filtro
- O filtro de período é **obrigatório** — não é permitido consultar sem período definido
