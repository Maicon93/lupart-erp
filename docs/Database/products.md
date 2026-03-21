# products

Produtos e serviços da empresa.

| Coluna              | Tipo      | Nullable | Descrição                                                      |
| ------------------- | --------- | -------- | -------------------------------------------------------------- |
| id                  | integer   | Não      | PK (auto-increment)                                            |
| company_id          | integer   | Não      | FK → [companies](companies.md). Tenant                                     |
| type                | enum      | Não      | product / service                                              |
| name                | varchar   | Não      | Nome do produto ou serviço                                     |
| code                | varchar   | Sim      | Código interno. Unique por `company_id`                        |
| barcode             | varchar   | Sim      | Código de barras (EAN-13, EAN-8 ou próprio). Null para serviço |
| description         | text      | Sim      | Descrição detalhada                                            |
| category_id         | integer   | Não      | FK → [categories](categories.md)                                            |
| measurement_unit_id | integer   | Sim      | FK → [measurement_units](measurement_units.md). Null para serviço                  |
| sale_price          | decimal   | Não      | Preço de venda (R$)                                            |
| average_cost        | decimal   | Não      | Preço médio de custo (R$). Default 0                           |
| stock               | decimal   | Não      | Quantidade atual em estoque. Calculado pelo sistema. Default 0 |
| minimum_stock       | decimal   | Sim      | Estoque mínimo para alerta. Null para serviço                  |
| notes               | text      | Sim      | Observações / anotações livres                                 |
| status              | enum      | Não      | active / inactive. Padrão: active                              |
| created_at          | timestamp | Não      | Data/hora de criação                                           |
| updated_at          | timestamp | Não      | Data/hora da última atualização                                |

**type:**
- `product` → Produto físico. Possui estoque, código de barras, unidade de medida, preço de custo
- `service` → Serviço. Campos `barcode`, `measurement_unit_id`, `minimum_stock` ficam null. `average_cost` fica 0. Não afeta estoque

**average_cost:**
- Editável na tela 107 — o usuário pode definir ou corrigir o valor a qualquer momento
- Recalculado automaticamente a cada entrada de estoque (tela 110) quando o usuário informa o preço de custo unitário (média ponderada). Se não informado, o valor não é alterado
- Não é recalculado em ajustes de estoque, inventário ou vendas

**stock:**
- Readonly — não editável pelo formulário
- Incrementado por: entrada de estoque (tela 110), ajuste (tela 111), inventário (tela 112), cancelamento de venda (tela 115)
- Decrementado por: venda (telas 114/115), ordem de serviço (tela 118)

**Regras:**
- `code` único por `company_id` (UNIQUE constraint composta). Nullable
- Inativação via `status` — sem exclusão física se houver vínculos
- Imagens armazenadas via tabela auxiliar [product_images](product_images.md)
- Filtrada por `company_id` (multi-tenant)

**Referenciada por:**
- [sale_items](sale_items.md) (product_id)
- [quote_items](quote_items.md) (product_id)
- [service_order_items](service_order_items.md) (product_id)
- [stock_entry_items](stock_entry_items.md) (product_id)
- [stock_adjustment_items](stock_adjustment_items.md) (product_id)
- [inventory_items](inventory_items.md) (product_id)
- [product_movimentations](product_movimentations.md) (product_id)
- [product_images](product_images.md) (product_id)
