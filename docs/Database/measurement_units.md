# measurement_units

Unidades de medida dos produtos.

| Coluna      | Tipo      | Nullable | Descrição                                     |
| ----------- | --------- | -------- | --------------------------------------------- |
| id          | integer   | Não      | PK (auto-increment)                           |
| company_id  | integer   | Não      | FK → [companies](companies.md). Tenant                    |
| abbreviation| varchar   | Não      | Sigla da unidade (ex: Kg, Un, L). Máx 10 char |
| description | varchar   | Não      | Nome completo (ex: Quilo, Unidade, Litro)     |
| status      | enum      | Não      | active / inactive. Padrão: active             |
| created_at  | timestamp | Não      | Data/hora de criação                          |
| updated_at  | timestamp | Não      | Data/hora da última atualização               |

**Regras:**
- `abbreviation` único por `company_id` (UNIQUE constraint composta)
- Inativação via `status` — sem exclusão física se houver vínculos ([products](products.md))

**Registros iniciais por empresa** (criados pelo helper `seedCompanyData(company_id)`):

| abbreviation | description |
| ------------ | ----------- |
| Kg           | Quilo       |
| Un           | Unidade     |
| L            | Litro       |
| Serviço      | Serviço     |

**Referenciada por:**
- [products](products.md) (measurement_unit_id)
