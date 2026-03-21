# quote_items

Itens de um orçamento. Cada linha representa um produto ou serviço incluído na proposta.

| Coluna         | Tipo      | Nullable | Descrição                                    |
| -------------- | --------- | -------- | -------------------------------------------- |
| id             | integer   | Não      | PK (auto-increment)                          |
| quote_id       | integer   | Não      | FK → quotes                                  |
| product_id     | integer   | Não      | FK → products                                |
| quantity       | decimal   | Não      | Quantidade informada                         |
| unit_price     | decimal   | Não      | Preço unitário no momento do orçamento       |
| subtotal       | decimal   | Não      | quantity × unit_price                        |
| created_at     | timestamp | Não      | Data/hora de criação                         |

**Regras:**
- Vinculados ao orçamento pelo `quote_id`
- Excluídos fisicamente ao remover o item do grid ou ao excluir o orçamento
- Itens do tipo Serviço não afetam estoque (mesma regra da tela 115)
