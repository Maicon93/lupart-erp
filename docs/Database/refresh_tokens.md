# refresh_tokens

Tokens de refresh ativos por usuário. Permite múltiplas sessões simultâneas.

| Coluna     | Tipo      | Nullable | Descrição                                    |
| ---------- | --------- | -------- | -------------------------------------------- |
| id         | integer   | Não      | PK (auto-increment)                          |
| user_id    | integer   | Não      | FK → users                                   |
| token      | varchar   | Não      | Token raw (único no sistema)                 |
| expires_at | timestamp | Não      | Data/hora de expiração                       |
| created_at | timestamp | Não      | Data/hora de criação                         |

**Regras:**
- Um usuário pode ter múltiplos tokens ativos (múltiplos dispositivos/sessões)
- Ao fazer refresh, o token antigo é removido e um novo é gerado (rotação de token)
- Ao fazer logout, o token da sessão atual é removido
- Tokens expirados podem ser removidos por job de limpeza periódica
- `token` é unique na tabela
