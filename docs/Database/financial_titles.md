# financial_titles

Títulos financeiros do sistema. Agrupa contas a receber (`inflow`) e contas a pagar (`outflow`).

| Coluna          | Tipo      | Nullable | Descrição                                                                    |
| --------------- | --------- | -------- | ---------------------------------------------------------------------------- |
| id              | integer   | Não      | PK (auto-increment)                                                          |
| company_id      | integer   | Não      | FK → companies                                                               |
| customer_id     | integer   | Sim      | FK → customers. Preenchido para `inflow`                                     |
| supplier_id     | integer   | Sim      | FK → suppliers. Preenchido para `outflow`                                    |
| type            | varchar   | Não      | `inflow` / `outflow`                                                         |
| origin          | varchar   | Não      | `sale` / `service_order` / `manual`                                          |
| reference_id    | integer   | Sim      | ID do registro de origem. Null para `manual`                                 |
| parent_id       | integer   | Sim      | FK → financial_titles. Preenchido ao clonar por pagamento parcial            |
| value           | decimal   | Não      | Valor do título (ou valor efetivamente pago, no caso de pagamento parcial)   |
| due_date        | date      | Não      | Data de vencimento                                                           |
| payment_date    | date      | Sim      | Data da baixa. Preenchida ao pagar                                           |
| payment_type_id | integer   | Sim      | FK → payment_types. Preenchido na criação (via parcela) ou na baixa. Pode ser alterado na baixa |
| status          | varchar   | Não      | `pendente` / `pago` / `cancelado`                                            |
| observation     | varchar   | Sim      | Observação livre. Usada principalmente em títulos manuais                    |
| created_by      | integer   | Não      | FK → users                                                                   |
| created_at      | timestamp | Não      | Data/hora de criação                                                         |
| updated_at      | timestamp | Não      | Data/hora da última atualização                                              |
| deleted_at      | timestamp | Sim      | Soft delete. Null = ativo                                                    |

**status:**
- `pendente` — aguardando pagamento. Exibido como "Vencido" na UI se `due_date < hoje`
- `pago` — baixa realizada. `payment_date` preenchida, `payment_type_id` atualizado (pode ter sido alterado na baixa)
- `cancelado` — título cancelado

**Pagamento parcial (clonagem):**
1. Usuário informa valor parcial ao dar baixa (ex: R$200 de um título de R$300)
2. Título original: `value` atualizado para R$200, `status = pago`, `payment_date` e `payment_type_id` preenchidos
3. Novo título clonado: `value = R$100`, `status = pendente`, `parent_id` = id do original, demais campos herdados
4. Evento registrado em `activity_logs` com `action = payment` e `data` contendo o valor pago e o remanescente

**Edição e exclusão:**
- Títulos com `origin = manual`: podem ser editados e excluídos (soft delete via `deleted_at`) diretamente nas telas 119/120
- Títulos com `origin != manual`: somente leitura nas telas 119/120. Edição e exclusão permitidas apenas via entidade de origem (ex: cancelar a venda exclui/cancela os títulos vinculados)

**Regras:**
- Filtrado por `company_id`
- Registros com `deleted_at` preenchido são ignorados em todas as consultas
- `customer_id` e `supplier_id` são mutuamente exclusivos conforme o `type`
- "Vencido" é estado de exibição — calculado como `status = pendente AND due_date < hoje`
- Fonte de dados da tela 119 (Contas a Receber) e 120 (Contas a Pagar)
