## Titulo
- Título: 124 - Produtos Mais Vendidos
- Permissão: `124_top_products`
- Ambiente: Usuário
- Rota: `/reports/best-selling-products`

## Objetivo
- Visualizar o ranking de produtos mais vendidos em um período, com indicadores de quantidade e faturamento

## Corpo

```
┌──────────────────────────────────────────────────────────────┐
│ 124 - Produtos Mais Vendidos            [ Exportar CSV ]     │
├──────────────────────────────────────────────────────────────┤
│ De [__/__/____]  Até [__/__/____]                            │
│ Categoria [________▾]  Exibição [Vendidos ▾]                │
├──────────────────────────────────────────────────────────────┤
│ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────────┐ ┌──────┐│
│ │Prod.   ⓘ│ │Qtd.    ⓘ│ │Custo   ⓘ│ │Fatur.  ⓘ│ │Lucro ⓘ│
│ │Únicos    │ │Unitária  │ │Projetado │ │Projetado │ │Projet.│
│ │   32     │ │   184    │ │R$ 7.200  │ │R$ 12.340 │ │R$5140││
│ └──────────┘ └──────────┘ └──────────┘ └──────────┘ └──────┘│
├──────────────────────────────────────────────────────────────┤
│ #  │ Produto       │ Categoria │ Qtd. │ Faturamento │ %     │
├────┼───────────────┼───────────┼──────┼─────────────┼───────┤
│ 1  │ Produto A     │ Peças     │ 42   │ R$ 4.200,00 │ 34,0% │
│ 2  │ Produto B     │ Outros    │ 35   │ R$ 3.500,00 │ 28,4% │
│ 3  │ Produto C     │ Peças     │ 28   │ R$ 1.680,00 │ 13,6% │
│ 4  │ Serviço X     │ Serviços  │ 20   │ R$ 2.000,00 │ 16,2% │
│ 5  │ Produto D     │ Outros    │ 12   │ R$   960,00 │  7,8% │
├────┴───────────────┴───────────┴──────┴─────────────┴───────┤
│ 20 ▾  1-20 de 32            [ < ]  1  2  [ > ]              │
└──────────────────────────────────────────────────────────────┘
```

#### Cards de resumo

Exibidos no topo, abaixo dos filtros. Calculados com base nos registros filtrados:

| Card                | Tooltip (ⓘ)                                                                                                                        |
| ------------------- | ----------------------------------------------------------------------------------------------------------------------------------- |
| Produtos Únicos     | Quantidade de produtos distintos que tiveram ao menos uma venda no período                                                          |
| Qtd. Unitária       | Soma total de unidades vendidas (ex: 3 unid. do Produto A + 2 unid. do Produto B = 5)                                              |
| Custo Projetado     | Soma de (`quantidade vendida × preço de custo cadastrado`). Baseado no preço de custo atual do cadastro, não no valor real da venda  |
| Faturamento Projetado | Soma de (`quantidade vendida × preço de venda cadastrado`). Baseado no preço de venda atual do cadastro, não no valor real da venda |
| Lucro Projetado     | Faturamento Projetado − Custo Projetado. Projeção baseada nos preços cadastrados, sem considerar descontos ou alterações de preço na venda |

Cada card possui um ícone **ⓘ** que ao passar o mouse (hover) ou clicar (mobile) exibe o tooltip com a descrição acima.

- Apenas vendas com `status = finalized` entram nos cálculos
- Se não houver vendas, os cards exibem `0` / `R$ 0,00`
- Os valores são **projetados** com base nos preços atuais do cadastro do produto — não refletem descontos, alterações de preço ou condições especiais aplicadas nas vendas

#### Listagem de dados (ranking)

Tela somente leitura — sem criação, apenas consulta.

Cada linha representa **um produto**, agregando todas as vendas do período:

| Coluna       | Descrição                                                 |
| ------------ | --------------------------------------------------------- |
| #            | Posição no ranking (ordenado por quantidade vendida)      |
| Produto      | Nome do produto                                           |
| Categoria    | Categoria do produto                                      |
| Qtd. Vendida | Soma das quantidades vendidas no período                  |
| Faturamento  | Soma dos subtotais (`quantity × unit_price`) no período   |
| %            | Percentual do faturamento em relação ao Faturamento Total |

- **Filtros**: período (data início / data fim), categoria (select), exibição (Vendidos / Sem vendas)
- **Período padrão**: mês atual (primeiro dia até hoje)
- **Paginação**: 20, 50, 100 registros
- **Ordenação padrão**: quantidade vendida (maior primeiro)
- **Skeleton** enquanto carrega

**Ações:**
- **Exportar CSV** — exporta os registros filtrados com as mesmas colunas da listagem

## Regras específicas
- Tela **somente leitura** — não possui formulário de criação
- Fonte de dados: tabela `sale_items` com join em `sales` — ver [sale_items](../../../Database/sale_items.md) e [sales](../../../Database/sales.md)
- Apenas vendas com `status = finalized` — canceladas são excluídas
- Inclui vendas originadas tanto da tela 114 (PDV) quanto da tela 115 (Vendas)
- Inclui produtos e serviços no ranking
- Agrupamento por `product_id` — soma `quantity` e `subtotal` de todos os `sale_items` do período
- Filtrada por `company_id` (multi-tenant)
- Os cards são recalculados a cada mudança de filtro
- O filtro de período é **obrigatório** — não é permitido consultar sem período definido

**Filtro de exibição:**
- **Vendidos** (padrão): exibe apenas produtos que tiveram vendas no período (ranking normal)
- **Sem vendas**: exibe produtos ativos que **não** tiveram nenhuma venda no período — útil para identificar itens parados. Colunas Qtd. Vendida, Faturamento e % exibem `—`. Ordenação alfabética por nome. Cards de resumo ficam ocultos
