## Titulo
- Título: 128 - Estoque Mínimo
- Permissão: `128_minimum_stock`
- Ambiente: Usuário
- Rota: `/reports/minimum-stock`

## Objetivo
- Visualizar os produtos que estão com estoque igual ou abaixo do mínimo configurado, facilitando o controle de reposição

## Corpo

```
┌──────────────────────────────────────────────────────────────┐
│ 128 - Estoque Mínimo                   [ Exportar CSV ]      │
├──────────────────────────────────────────────────────────────┤
│ Categoria [________▾]  Nome [______________]                  │
├──────────────────────────────────────────────────────────────┤
│ ┌────────────┐ ┌────────────┐                                │
│ │ Produtos   │ │ Produtos   │                                │
│ │ Abaixo     │ │ Zerados    │                                │
│ │    12      │ │     4      │                                │
│ └────────────┘ └────────────┘                                │
├──────────────────────────────────────────────────────────────┤
│ Nome         │ Código │ Categ.   │ Estoque │ Mínimo │ Dif.  │
├──────────────┼────────┼──────────┼─────────┼────────┼───────┤
│ Parafuso 6mm │ P-001  │ Fixação  │    5    │   20   │  -15  │
│ Óleo Motor   │ O-010  │ Lubrif.  │    0    │   10   │  -10  │
│ Lixa 120     │ L-003  │ Abrasivo │    8    │   15   │   -7  │
│ Fita Isol.   │ F-022  │ Elétrica │    3    │    5   │   -2  │
├──────────────┴────────┴──────────┴─────────┴────────┴───────┤
│ 20 ▾  1-20 de 12            [ < ]  1  [ > ]                  │
└──────────────────────────────────────────────────────────────┘
```

#### Cards de resumo

| Card              | Descrição                                                              |
| ----------------- | ---------------------------------------------------------------------- |
| Produtos Abaixo   | Contagem de produtos com `stock <= minimum_stock` e `stock > 0`        |
| Produtos Zerados  | Contagem de produtos com `stock = 0` e `minimum_stock` preenchido      |

- Os cards são recalculados a cada mudança de filtro

#### Listagem de dados

Tela somente leitura — sem criação, apenas consulta.

| Coluna         | Descrição                                                    |
| -------------- | ------------------------------------------------------------ |
| Nome           | Nome do produto                                              |
| Código         | Código interno do produto                                    |
| Categoria      | Categoria do produto                                         |
| Estoque Atual  | Quantidade atual em estoque (`stock`)                        |
| Estoque Mínimo | Quantidade mínima configurada (`minimum_stock`)              |
| Diferença      | `stock - minimum_stock` (sempre negativo ou zero)            |

- **Filtros**: categoria (select), nome (text)
- **Paginação**: 20, 50, 100 registros
- **Ordenação padrão**: menor diferença primeiro (mais críticos no topo)
- **Skeleton** enquanto carrega

**Ações:**
- **Exportar CSV** — exporta os registros filtrados com as mesmas colunas da listagem

## Regras específicas
- Tela **somente leitura** — não possui formulário de criação
- Fonte de dados: tabela `products` — ver [products](../../../Database/products.md)
- Busca apenas produtos com `minimum_stock IS NOT NULL` (estoque mínimo preenchido no cadastro)
- Dentre estes, exibe apenas os que possuem `stock <= minimum_stock`
- Apenas `type = product` — serviços não possuem estoque
- Filtrada por `company_id` (multi-tenant)
- Produtos com `status = inactive` não são exibidos
