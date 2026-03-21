# activity_logs

Log genérico e imutável de eventos do sistema. Usado para registrar ações relevantes em qualquer entidade.

| Coluna      | Tipo      | Nullable | Descrição                                                              |
| ----------- | --------- | -------- | ---------------------------------------------------------------------- |
| id          | integer   | Não      | PK (auto-increment)                                                    |
| company_id  | integer   | Sim      | FK → companies. Null para eventos do painel administrador              |
| entity_type | varchar   | Não      | Tipo da entidade afetada. Ex: `financial_title`, `service_order`       |
| entity_id   | integer   | Não      | ID do registro afetado                                                 |
| action      | varchar   | Não      | Ação executada. Ex: `payment`, `status_change`, `cancel`               |
| data        | jsonb     | Sim      | Dados relevantes do evento                                             |
| created_by  | integer   | Não      | FK → users. Usuário que executou a ação                                |
| created_at  | timestamp | Não      | Data/hora do evento                                                    |

**Regras:**
- Registros são imutáveis — nunca editados ou excluídos
- Sem `updated_at`
- Filtrado por `entity_type + entity_id` para exibir histórico de uma entidade específica

**Exemplos de uso:**

| entity_type      | action          | data (exemplo)                                                        |
| ---------------- | --------------- | --------------------------------------------------------------------- |
| financial_title  | payment         | `{ "amount": 200.00, "payment_type_id": 1, "remaining": 100.00 }`    |
| financial_title  | cancel          | `{ "reason": "venda cancelada" }`                                     |
| sale             | cancel          | `{ "reason": "cliente desistiu da compra" }`                           |
| service_order    | status_change   | `{ "from": "aberta", "to": "em_andamento" }`                          |
| service_order    | cancel          | `{ "reason": "cliente não autorizou o reparo" }`                       |
