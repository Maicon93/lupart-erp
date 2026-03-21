# inventory_items

Itens de um inventário. Snapshot dos produtos no momento da criação, com a contagem física registrada.

| Coluna           | Tipo      | Nullable | Descrição                                                                         |
| ---------------- | --------- | -------- | --------------------------------------------------------------------------------- |
| id               | integer   | Não      | PK (auto-increment)                                                               |
| inventory_id     | integer   | Não      | FK → inventories                                                                  |
| product_id       | integer   | Não      | FK → products                                                                     |
| system_quantity  | decimal   | Não      | Estoque do produto congelado no momento da criação do inventário                  |
| counted_quantity | decimal   | Sim      | Quantidade encontrada na contagem física. Null = ainda não contado                |
| counted_by       | integer   | Sim      | FK → users. Usuário que registrou/atualizou a contagem. Null se não contado ainda |
| created_at       | timestamp | Não      | Data/hora de criação (snapshot)                                                   |
| updated_at       | timestamp | Não      | Data/hora da última atualização da contagem                                       |

**Regras:**
- Todos os itens são inseridos no momento da criação do inventário (snapshot imutável de quais produtos fazem parte)
- `system_quantity` é congelado na criação e nunca alterado
- `counted_quantity` é atualizado durante a contagem física (pode ser 0)
- Um item é considerado **lido** quando `counted_quantity` não é null
- Múltiplos usuários podem atualizar `counted_quantity` e `counted_by` simultaneamente (cada item salva individualmente)
- Para cada item com divergência, ao gerar o ajuste, inserir registro em `product_movimentations` com `type = inventory`
- Ao finalizar o inventário, todos os itens devem ter `counted_quantity` preenchida (>= 0)
- A diferença (divergência) é calculada: `counted_quantity − system_quantity`
