# system_configurations

Configurações globais do sistema em formato chave/valor. Gerenciadas pelo Administrador na tela 15.

| Coluna     | Tipo      | Nullable | Descrição                          |
| ---------- | --------- | -------- | ---------------------------------- |
| id         | integer   | Não      | PK (auto-increment)                |
| key        | varchar   | Não      | Chave única do parâmetro           |
| value      | varchar   | Não      | Valor do parâmetro (armazenado como string) |
| created_at | timestamp | Não      | Data/hora de criação               |
| updated_at | timestamp | Não      | Data/hora da última atualização    |

**Regras:**
- `key` único na tabela (UNIQUE constraint)
- Não é multi-tenant — configurações são globais do sistema
- Valores interpretados pela API conforme o tipo esperado de cada chave
- Alterações nos tokens só afetam novos logins (tokens existentes mantêm a duração original)

**Seed:**

| key                      | value | Descrição                            |
| ------------------------ | ----- | ------------------------------------ |
| access_token_duration    | 15    | Duração do access token (minutos)    |
| refresh_token_duration   | 7     | Duração do refresh token (dias)      |
| max_upload_size          | 5     | Tamanho máximo de upload no S3 (MB)  |
