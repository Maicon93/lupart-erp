# service_order_technicians

Vínculo N:N entre ordens de serviço e técnicos responsáveis.

| Coluna           | Tipo      | Nullable | Descrição                              |
| ---------------- | --------- | -------- | -------------------------------------- |
| id               | integer   | Não      | PK (auto-increment)                    |
| service_order_id | integer   | Não      | FK → service_orders                    |
| user_id          | integer   | Não      | FK → users. Técnico responsável        |
| created_at       | timestamp | Não      | Data/hora do vínculo                   |
| created_by       | integer   | Não      | FK → users. Quem atribuiu o técnico    |

**Regras:**
- Par `service_order_id + user_id` é único (sem duplicata)
- Registro excluído fisicamente ao remover o técnico da OS
- Atualmente a UI permite apenas um técnico por OS. O modelo está preparado para múltiplos técnicos no futuro
- Técnico só pode ser atribuído/removido enquanto status da OS for `aberta` ou `em_andamento`
