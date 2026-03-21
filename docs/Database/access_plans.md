# Database

Documentação das tabelas importantes do sistema.

---

## access_plans

Planos de acesso disponíveis para empresas. Gerenciados pelo Administrador na tela 10.

| Coluna        | Tipo      | Nullable | Descrição                                |
| ------------- | --------- | -------- | ---------------------------------------- |
| id            | integer   | Não      | PK (auto-increment)                      |
| title         | varchar   | Não      | Nome do plano                            |
| user_limit    | integer   | Não      | Quantidade máxima de usuários permitidos |
| duration_days | integer   | Não      | Dias de vigência (ciclo de faturamento)  |
| price         | decimal   | Não      | Valor da fatura (R$)                     |
| status        | enum      | Não      | active / inactive                        |
| created_at    | timestamp | Não      | Data de criação                          |
| updated_at    | timestamp | Não      | Data da última atualização               |

**Regras:**
- Soft delete via campo `status` (active/inactive)
- Referenciada por `companies.access_plan_id`
- Consultada na tela 126 (Meu Plano) pelo usuário da empresa

**Seed:**

| Plano      | Usuários | Vigência | Valor      |
| ---------- | -------- | -------- | ---------- |
| Básico     | 2        | 30 dias  | R$ 130,00  |
| Enterprise | 10       | 30 dias  | R$ 250,00  |
