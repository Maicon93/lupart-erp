# user_roles

Vínculo N:N entre usuários e cargos de empresa. Define quais cargos um usuário possui.

| Coluna     | Tipo      | Nullable | Descrição                               |
| ---------- | --------- | -------- | --------------------------------------- |
| id         | integer   | Não      | PK (auto-increment)                     |
| user_id    | integer   | Não      | FK → users                              |
| role_id    | integer   | Não      | FK → roles (apenas cargos de empresa — company_id preenchido) |
| created_at | timestamp | Não      | Data/hora do vínculo                    |
| created_by | integer   | Não      | FK → users (quem atribuiu o cargo)      |

**Regras:**
- Par `user_id + role_id` é único (sem duplicata)
- Apenas cargos de empresa (roles.company_id preenchido) são vinculados aqui — papéis globais (admin/user) ficam em users.role_id
- Quando um cargo é removido de um usuário, o registro é excluído fisicamente
- Gerenciado nas telas 11 - Usuários (admin) e 127 - Usuários (configurações da empresa)
