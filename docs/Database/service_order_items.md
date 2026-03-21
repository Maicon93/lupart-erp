# service_order_items

Itens de uma ordem de serviço. Cada linha representa um produto (peça) ou serviço executado.

| Coluna           | Tipo      | Nullable | Descrição                                              |
| ---------------- | --------- | -------- | ------------------------------------------------------ |
| id               | integer   | Não      | PK (auto-increment)                                    |
| service_order_id | integer   | Não      | FK → service_orders                                    |
| product_id       | integer   | Não      | FK → products                                          |
| quantity         | decimal   | Não      | Quantidade utilizada/executada                         |
| unit_price       | decimal   | Não      | Preço unitário no momento de adição do item            |
| subtotal         | decimal   | Não      | quantity × unit_price                                  |
| created_at       | timestamp | Não      | Data/hora de criação                                   |

**Regras:**
- Ao inserir item do tipo **Produto**: valida estoque se `allow_negative_stock = false` — rejeita se insuficiente. Estoque decrementado imediatamente. Registro em `product_movimentations` com `type = service_order`
- Ao remover item do tipo **Produto**: estoque revertido imediatamente (novo registro em `product_movimentations` com `amount` positivo)
- Itens do tipo **Serviço** não afetam estoque
- Itens só podem ser adicionados/removidos enquanto status da OS for `aberta` ou `em_andamento`
- Excluídos fisicamente ao remover do grid
