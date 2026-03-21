# stock_entry_items

Itens de uma entrada de estoque. Cada registro representa um produto incluído na movimentação.

| Coluna          | Tipo      | Nullable | Descrição                                             |
| --------------- | --------- | -------- | ----------------------------------------------------- |
| id              | integer   | Não      | PK (auto-increment)                                   |
| stock_entry_id  | integer   | Não      | FK → stock_entries                                    |
| product_id      | integer   | Não      | FK → products                                         |
| quantity        | decimal   | Não      | Quantidade entrada                                    |
| unit_price      | decimal   | Sim      | Preço de custo unitário informado (R$). Null quando não informado pelo usuário  |
| subtotal        | decimal   | Sim      | quantity × unit_price. Null quando unit_price não informado                     |
| created_at      | timestamp | Não      | Data/hora de criação                                  |

**Regras:**
- Todos os itens são inseridos na mesma transação que o cabeçalho
- Ao confirmar, o estoque do produto é incrementado com a quantidade informada
- Ao confirmar, se `unit_price` foi informado, o `average_cost` (preço médio) do produto é recalculado via média ponderada. Se não informado, o `average_cost` não é alterado
- Para cada item, inserir registro em `product_movimentations` com `type = entry` e `reference_id = id deste item`
- Registros não são editados ou excluídos após a confirmação
