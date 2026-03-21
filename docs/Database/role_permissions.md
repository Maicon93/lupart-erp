# role_permissions

Vínculo N:N entre cargos e permissões. Define quais telas um cargo pode acessar.

| Coluna        | Tipo      | Nullable | Descrição                                    |
| ------------- | --------- | -------- | -------------------------------------------- |
| id            | integer   | Não      | PK (auto-increment)                          |
| role_id       | integer   | Não      | FK → roles                                   |
| permission_id | integer   | Não      | FK → permissions                             |
| created_at    | timestamp | Não      | Data/hora do vínculo                         |
| created_by    | integer   | Não      | FK → users (quem concedeu a permissão)       |

**Regras:**
- Par `role_id + permission_id` é único (sem duplicata)
- Quando uma permissão é revogada de um cargo, o registro é excluído fisicamente
- Gerenciado na tela 14 - Permissões (Painel Administrador) e tela 127 - Usuários/Cargos (Painel do Usuário)
- A verificação de permissão no frontend consulta a API a cada navegação de tela (ver [Frontend](../Boas%20Práticas/Frontend.md))
