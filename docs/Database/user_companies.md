# user_companies

Vínculo N:N entre usuários e empresas. Define quais empresas um usuário pode acessar.

| Coluna     | Tipo      | Nullable | Descrição                              |
| ---------- | --------- | -------- | -------------------------------------- |
| id         | integer   | Não      | PK (auto-increment)                    |
| user_id    | integer   | Não      | FK → users                             |
| company_id | integer   | Não      | FK → companies                         |
| created_at | timestamp | Não      | Data/hora do vínculo                   |
| created_by | integer   | Não      | FK → users (quem criou o vínculo)      |

**Regras:**
- Par `user_id + company_id` é único (sem duplicata)
- Quando o acesso de um usuário a uma empresa é revogado, o registro é removido fisicamente
- Criado pelo admin ao vincular um usuário responsável à empresa, ou ao adicionar usuários à empresa
- Consultado no login para exibir a lista de empresas disponíveis ao usuário
