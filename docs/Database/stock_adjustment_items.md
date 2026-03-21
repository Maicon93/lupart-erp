# stock_adjustment_items

Itens de um ajuste de estoque. Cada registro representa um produto com sua quantidade corrigida.

| Coluna               | Tipo      | Nullable | Descrição                                            |
| -------------------- | --------- | -------- | ---------------------------------------------------- |
| id                   | integer   | Não      | PK (auto-increment)                                  |
| stock_adjustment_id  | integer   | Não      | FK → stock_adjustments                               |
| product_id           | integer   | Não      | FK → products                                        |
| previous_quantity    | decimal   | Não      | Estoque do produto no momento do ajuste              |
| new_quantity         | decimal   | Não      | Nova quantidade definida pelo ajuste (>= 0)          |
| created_at           | timestamp | Não      | Data/hora de criação                                 |

**Regras:**
- Todos os itens são inseridos na mesma transação que o cabeçalho
- Ao confirmar, o estoque do produto é atualizado para `new_quantity`
- O `average_cost` (preço médio) do produto **não** é recalculado em ajustes
- Para cada item, inserir registro em `product_movimentations` com `type = adjustment` e `reference_id = id deste item`
- `new_quantity` não pode ser negativa
- Registros não são editados ou excluídos após a confirmação
