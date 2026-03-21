# sale_items

Itens de uma venda. Cada registro representa um produto ou serviço incluído na venda.

| Coluna     | Tipo      | Nullable | Descrição                                      |
| ---------- | --------- | -------- | ---------------------------------------------- |
| id         | integer   | Não      | PK (auto-increment)                            |
| sale_id    | integer   | Não      | FK → sales                                     |
| product_id | integer   | Não      | FK → products (produto ou serviço)             |
| quantity   | decimal   | Não      | Quantidade vendida                             |
| unit_price | decimal   | Não      | Preço unitário de venda no momento da venda    |
| subtotal   | decimal   | Não      | quantity × unit_price                          |
| created_at | timestamp | Não      | Data/hora de criação                           |

**Regras:**
- Todos os itens de uma venda são inseridos na mesma transação que a venda
- O `unit_price` é salvo no momento da venda (pode ter sido editado manualmente, diferindo do preço cadastrado no produto)
- Itens do tipo **Produto** decrementam estoque e geram registro em `product_movimentations` com `type = sale`
- Itens do tipo **Serviço** não afetam estoque
- Registros não são editados ou excluídos após a confirmação da venda
