# service_orders

Ordens de serviço. Registra o trabalho executado para um cliente, com controle de itens, tempo e geração de títulos financeiros ao concluir.

| Coluna              | Tipo      | Nullable | Descrição                                                                 |
| ------------------- | --------- | -------- | ------------------------------------------------------------------------- |
| id                  | integer   | Não      | PK (auto-increment)                                                       |
| company_id          | integer   | Não      | FK → companies                                                            |
| customer_id         | integer   | Não      | FK → customers                                                            |
| observation         | varchar   | Sim      | Descrição do problema, equipamento ou observações gerais                  |
| date_started        | timestamp | Sim      | Data/hora de início dos trabalhos. Auto-preenchida ao mudar para em_andamento |
| date_finished       | timestamp | Sim      | Data/hora de conclusão. Auto-preenchida ao mudar para concluida           |
| total_value         | decimal   | Não      | Soma dos subtotais dos itens                                              |
| discount_percentage | decimal   | Não      | Desconto em % (0–100). Default 0. Preenchido na conclusão                 |
| discount_value      | decimal   | Não      | Desconto em R$. Default 0. Preenchido na conclusão                        |
| final_value         | decimal   | Sim      | total_value − discount_value. Preenchido na conclusão                     |
| payment_form        | varchar   | Sim      | `cash` / `installment`. Preenchido na conclusão                           |
| status              | varchar   | Não      | `aberta` / `em_andamento` / `concluida` / `cancelada`                     |
| cancellation_reason | text      | Sim      | Motivo do cancelamento. Preenchido ao cancelar a OS                       |
| created_by          | integer   | Não      | FK → users. Usuário que abriu a OS                                        |
| created_at          | timestamp | Não      | Data/hora de criação                                                      |
| updated_at          | timestamp | Não      | Data/hora da última atualização                                           |

**status:**
- `aberta` — padrão ao criar. Itens podem ser gerenciados
- `em_andamento` — trabalho iniciado. `date_started` preenchida. Itens podem ser gerenciados
- `concluida` — trabalho concluído. `date_finished` preenchida. Somente leitura. Títulos financeiros gerados
- `cancelada` — OS cancelada. Estoque dos itens Produto revertido. Somente leitura

**Regras:**
- Técnicos vinculados via tabela [service_order_technicians](service_order_technicians.md). Atualmente a UI permite apenas um técnico, mas o modelo suporta múltiplos
- Filtrado por `company_id`
- `total_value` recalculado a cada adição/remoção de item
- Campos financeiros (`discount_*`, `final_value`, `payment_form`) preenchidos apenas na conclusão
- `date_started` e `date_finished` são auto-preenchidas na transição de status, mas editáveis pelo usuário
