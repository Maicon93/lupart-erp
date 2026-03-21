## Titulo
- Título: 113 - Histórico de Movimentações
- Permissão: `113_stock_history`
- Ambiente: Usuário
- Rota: `/reports/stock-history`

## Objetivo
- Consultar todas as movimentações de estoque de forma unificada (entradas, ajustes, inventários, vendas, cancelamentos e ordens de serviço)

## Corpo

```
┌──────────────────────────────────────────────────────────────┐
│ 113 - Histórico de Movimentações        [ Exportar CSV ]     │
├──────────────────────────────────────────────────────────────┤
│ Produto [__________▾]  Tipo [________▾]                      │
│ Responsável [________▾]  De [__/__/__]  Até [__/__/__]       │
├──────────┬───────────┬───────┬─────────┬─────┬──────┬─────── ┤
│ Data     │ Tipo      │ Nº    │ Produto │ Ant.│ Nov. │ Dif.   │
├──────────┼───────────┼───────┼─────────┼─────┼──────┼─────── ┤
│ 09/03/26 │ Entrada   │ #42   │Produto A│ 10  │ 20   │ +10    │
│ 08/03/26 │ Venda     │ #137  │Produto B│ 5   │ 3    │ -2     │
│ 07/03/26 │ Ajuste    │ #8    │Produto C│ 15  │ 12   │ -3     │
│ 06/03/26 │ Inventário│ #3    │Produto A│ 20  │ 18   │ -2     │
│ 05/03/26 │ Canc.Venda│ #137  │Produto B│ 3   │ 5    │ +2     │
│ 04/03/26 │ Ord.Serv. │ #22   │Produto C│ 12  │ 10   │ -2     │
├──────────┴───────────┴───────┴─────────┴─────┴──────┴─────── ┤
│ 20 ▾  1-20 de 84            [ < ]  1  2  3  4  [ > ]         │
└──────────────────────────────────────────────────────────────┘
```

#### Listagem de dados (movimentações)

Tela somente leitura — sem criação, apenas consulta.

Cada linha representa **um produto movimentado**:

| Coluna        | Descrição                                   |
| ------------- | ------------------------------------------- |
| Data          | Data da movimentação                        |
| Tipo          | Entrada / Ajuste / Inventário / Venda / Cancelamento / Ordem de Serviço |
| Nº Referência | Número do documento de origem (ver regras)  |
| Produto       | Nome do produto movimentado                 |
| Qtd. Anterior | Estoque antes da movimentação               |
| Nova Qtd.     | Estoque após a movimentação                 |
| Diferença     | Nova Qtd. − Qtd. Anterior                   |
| Responsável   | Nome do usuário que realizou a movimentação |
| Ações         | Ver Origem                                  |

- **Filtros**: produto (autocomplete), tipo (Entrada / Ajuste / Inventário / Venda / Cancelamento / Ordem de Serviço), responsável (autocomplete), período (data início / data fim)
- **Paginação**: 20, 50, 100 registros
- **Ordenação padrão**: data mais recente primeiro
- **Skeleton** enquanto carrega
- Coluna **Diferença**: texto em `success` se > 0, `danger` se < 0 (cores do [Theme Store](../../../CodeBase/Theme%20Store.md))

**Ações:**
- **Ver Origem** — Redireciona para a tela de origem com o registro correspondente:
  - `entry` → tela 110 (Entrada de Estoque), abrindo os detalhes da entrada
  - `adjustment` → tela 111 (Ajuste de Estoque), abrindo os detalhes do ajuste
  - `inventory` → tela 112 (Inventário), abrindo os detalhes do inventário
  - `sale` → tela 115 (Vendas), abrindo os detalhes da venda
  - `sale_return` → tela 115 (Vendas), abrindo os detalhes da venda cancelada
  - `service_order` → tela 118 (Ordem de Serviço), abrindo os detalhes da OS

**Exportação:**
- Botão **Exportar CSV** — exporta os registros filtrados com as mesmas colunas da listagem

## Regras específicas

- Tela **somente leitura** — não possui formulário de criação
- Fonte de dados: tabela `product_movimentations` — ver [product_movimentations](../../../Database/product_movimentations.md)
- Os dados são alimentados automaticamente pelas telas 110, 111, 112, 114, 115 e 118
- Tipos presentes: `entry` (tela 110), `adjustment` (tela 111), `inventory` (tela 112), `sale` (telas 114 e 115), `sale_return` (cancelamento na tela 115), `service_order` (tela 118)
- O PDV (tela 114) gera registros com `type = sale` na mesma tabela `sales` da tela 115 — "Ver Origem" para `sale` sempre aponta para a tela 115

**Resolução do Nº Referência:**

O campo `reference_id` em `product_movimentations` armazena o ID do *item* de origem (polimórfico). O endpoint da tela 113 deve resolver o número do documento pai conforme o tipo:

| Tipo        | reference_id aponta para      | Nº Referência exibido                                                       |
| ----------- | ----------------------------- | --------------------------------------------------------------------------- |
| `entry`     | `stock_entry_items.id`        | `stock_entry_items.stock_entry_id` (ID da entrada)                          |
| `adjustment`| `stock_adjustment_items.id`   | `stock_adjustment_items.stock_adjustment_id` (ID do ajuste)                 |
| `inventory` | `stock_adjustment_items.id`   | `inventories.id` via `stock_adjustments.id` → `inventories.adjustment_id`  |
| `sale`      | `sale_items.id`               | `sale_items.sale_id` (ID da venda)                                          |
| `sale_return`| `sale_items.id`              | `sale_items.sale_id` (ID da venda devolvida)                                |
| `service_order`| `service_order_items.id`   | `service_order_items.service_order_id` (ID da OS)                           |

- Para `inventory`, o Nº Referência exibe o número do **inventário** (não do ajuste gerado), pois é a origem real da movimentação
- Para `sale_return`, o Nº Referência exibe o número da **venda** cancelada
- O redirecionamento "Ver Origem" usa o mesmo ID resolvido acima para abrir o registro correto na tela de destino
