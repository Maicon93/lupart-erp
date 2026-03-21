# user_profiles

Dados pessoais complementares do usuário. Relação 1:1 com [users](users.md).

| Coluna     | Tipo      | Nullable | Descrição                                  |
| ---------- | --------- | -------- | ------------------------------------------ |
| id         | integer   | Não      | PK (auto-increment)                        |
| user_id    | integer   | Não      | FK → users (unique — 1 perfil por usuário) |
| phone      | varchar   | Não      | Telefone (armazenado com máscara)          |
| country    | varchar   | Não      | País                                       |
| created_at | timestamp | Não      | Data/hora de criação                       |
| updated_at | timestamp | Não      | Data/hora da última atualização            |

**Regras:**
- Um registro por usuário (unique em `user_id`)
- Todos os campos são obrigatórios
