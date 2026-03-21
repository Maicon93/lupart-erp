# roles

Papéis do sistema e cargos de empresa. Unificados em uma única tabela diferenciados pelo `company_id`.

| Coluna     | Tipo      | Nullable | Descrição                                                          |
| ---------- | --------- | -------- | ------------------------------------------------------------------ |
| id         | integer   | Não      | PK (auto-increment)                                                |
| name        | varchar   | Não      | Nome do papel/cargo                                                |
| description | varchar   | Sim      | Descrição do papel/cargo                                           |
| company_id  | integer   | Sim      | FK → companies. Null = papel global. Preenchido = cargo da empresa |
| created_by | integer   | Sim      | FK → users (quem criou). Null para registros de seed               |
| created_at | timestamp | Não      | Data/hora de criação                                               |
| updated_at | timestamp | Não      | Data/hora da última atualização                                    |

**company_id:**
- `null` → papel global do sistema (seed). Define o tipo de acesso do usuário (Painel Admin ou Painel Usuário)
- `<id>` → cargo personalizado criado pelo gerente da empresa. Usado para atribuir permissões dentro do Painel do Usuário

**Regras:**
- Papéis globais (company_id = null) são criados via seed e não podem ser editados ou removidos
- Cargos de empresa (company_id preenchido) são gerenciados nas telas 13 (admin) e 127 (usuário)
- Exclusão física — cargos de empresa podem ser deletados diretamente (sem soft delete)
- **Validação de exclusão**: antes de deletar, verificar se há usuários vinculados ao cargo via `user_roles`. Se houver, rejeitar com mensagem: "Não é possível excluir este cargo pois existem usuários vinculados a ele"
- Filtrado por `company_id` nas listagens de cargos da empresa

**Seed:**

| name  | company_id |
| ----- | ---------- |
| admin | null       |
| user  | null       |
