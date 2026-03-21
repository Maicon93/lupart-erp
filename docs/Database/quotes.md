# quotes

Orçamentos emitidos para clientes. Não afeta estoque nem gera títulos financeiros.

| Coluna               | Tipo      | Nullable | Descrição                                                              |
| -------------------- | --------- | -------- | ---------------------------------------------------------------------- |
| id                   | integer   | Não      | PK (auto-increment)                                                    |
| company_id           | integer   | Não      | FK → companies                                                         |
| customer_id          | integer   | Não      | FK → customers (inclui Consumidor Final)                               |
| validity_date        | date      | Não      | Data limite da proposta                                                |
| observation          | varchar   | Sim      | Observação livre                                                       |
| discount_percentage  | decimal   | Não      | Desconto em % (0–100). Default 0                                       |
| discount_value       | decimal   | Não      | Desconto em R$. Default 0                                              |
| total_value          | decimal   | Não      | Soma dos subtotais dos itens                                           |
| final_value          | decimal   | Não      | total_value − discount_value                                           |
| payment_type_id      | integer   | Sim      | FK → payment_types. Condição de pagamento sugerida (opcional)          |
| status               | varchar   | Não      | `emitido` / `recusado` / `convertido`                                  |
| sale_id              | integer   | Sim      | FK → sales. Preenchido ao converter em venda                           |
| created_by           | integer   | Não      | FK → users                                                             |
| created_at           | timestamp | Não      | Data/hora de criação                                                   |
| updated_at           | timestamp | Não      | Data/hora da última atualização                                        |
| deleted_at           | timestamp | Sim      | Soft delete. Null = ativo                                              |

**status:**
- `emitido` — padrão ao criar. Editável
- `recusado` — cliente recusou. Somente leitura
- `convertido` — convertido em venda. Somente leitura. `sale_id` preenchido

**Regras:**
- Filtrado por `company_id`
- Apenas orçamentos com status `emitido` podem ser editados ou excluídos
- Exclusão via soft delete (`deleted_at`) — listagens filtram `deleted_at IS NULL`
- `sale_id` é preenchido somente ao confirmar a venda gerada pela conversão
