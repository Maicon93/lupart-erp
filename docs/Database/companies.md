# Database

Documentação das tabelas importantes do sistema.

---

## companies

Empresas (matrizes e filiais) do sistema. Gerenciadas pelo Administrador na tela 12.

| Coluna          | Tipo      | Nullable | Descrição                                                            |
| --------------- | --------- | -------- | -------------------------------------------------------------------- |
| id              | integer   | Não      | PK (auto-increment)                                                  |
| name            | varchar   | Não      | Nome da empresa                                                      |
| cnpj            | varchar   | Não      | CNPJ (único, armazenado com máscara: 00.000.000/0000-00)             |
| access_plan_id  | integer   | Não      | FK → access_plans                                                    |
| responsible_id  | integer   | Não      | FK → users (usuário responsável)                                     |
| matriz          | integer   | Sim      | FK → companies (auto-referência). null = matriz, preenchido = filial |
| plan_expires_at | date      | Sim      | Data de vencimento do plano atual                                    |
| logo_url        | varchar   | Sim      | URL da imagem do logo no S3                                          |
| status          | enum      | Não      | active / inactive                                                    |
| created_at      | timestamp | Não      | Data de criação                                                      |
| updated_at      | timestamp | Não      | Data da última atualização                                           |

**Regras:**
- Soft delete via campo `status` (active/inactive)
- `cnpj` é único globalmente
- `matriz = null` → empresa é Matriz
- `matriz = <id>` → empresa é Filial da matriz referenciada
- `company_id` é o tenant ID usado em todas as tabelas do Painel do Usuário
- `logo_url` gerenciado pela tela 125 (Configurações da Empresa), armazenado em S3 (`/company/images/logos`)
- Dados auxiliares (telefone, e-mail, endereço) ficam em `company_profiles`
