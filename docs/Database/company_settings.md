# company_settings

Configurações da empresa. Relação 1:1 com [companies](companies.md).

| Coluna               | Tipo      | Nullable | Descrição                                                        |
| -------------------- | --------- | -------- | ---------------------------------------------------------------- |
| id                   | integer   | Não      | PK (auto-increment)                                              |
| company_id           | integer   | Não      | FK → [companies](companies.md). Unique (1:1)                                 |
| allow_negative_stock | boolean   | Não      | Permite vendas sem estoque suficiente. Padrão: false             |
| created_at           | timestamp | Não      | Data/hora de criação                                             |
| updated_at           | timestamp | Não      | Data/hora da última atualização                                  |

**allow_negative_stock:**
- `false` (padrão) → API rejeita vendas (telas 114/115) e OS (tela 118) quando estoque insuficiente
- `true` → Permite operações mesmo com estoque insuficiente (estoque pode ficar negativo)

**Regras:**
- Criado automaticamente ao criar a empresa (seed com valores padrão)
- Gerenciado pela tela 125 (Configurações da Empresa)
- `company_id` único — uma configuração por empresa
