# users

Tabela principal de usuários do sistema.

| Coluna      | Tipo      | Nullable | Descrição                                                                                         |
| ----------- | --------- | -------- | ------------------------------------------------------------------------------------------------- |
| id          | integer   | Não      | PK (auto-increment)                                                                               |
| name        | varchar   | Não      | Nome completo                                                                                     |
| email       | varchar   | Não      | E-mail único no sistema (login)                                                                   |
| password    | varchar   | Não      | Senha hasheada                                                                                    |
| language    | varchar   | Não      | Sigla do idioma preferido (ex: pt-BR, en). Padrão: pt-BR                                          |
| role_id     | integer   | Não      | FK → roles (papel global do sistema: admin ou user)                                               |
| company_id  | integer   | Sim      | FK → companies. Empresa em inspeção (admin) ou empresa ativa selecionada (user). Null = nenhuma   |
| status      | enum      | Não      | active / inactive. Padrão: active                                                                 |
| created_at  | timestamp | Não      | Data/hora de criação                                                                              |
| updated_at  | timestamp | Não      | Data/hora da última atualização                                                                   |

**role_id:**
- Referencia apenas papéis globais (company_id = null) da tabela [roles](roles.md)
- `admin` → Administrador global, sem vínculo com empresa. Acessa o Painel Administrador
- `user` → Usuário de empresa. Acessa o Painel do Usuário conforme cargos e permissões

**company_id:**
- Para `admin`: aponta para a empresa que está sendo inspecionada no momento. Null quando não está inspecionando
- Para `user`: aponta para a empresa ativa selecionada no login. Null antes de selecionar

**Regras:**
- Email único em toda a tabela (não por tenant)
- Filtrada por `company_id` apenas nas queries de tenant — a tabela em si não é multi-tenant
- Inativação não permite exclusão física se houver vínculos (vendas, movimentações, etc.)
- Dados complementares (telefone, país) ficam na tabela auxiliar [user_profiles](user_profiles.md)
- Empresas vinculadas ficam em [user_companies](user_companies.md)
