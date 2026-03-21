# categories

Categorias de produtos.

| Coluna      | Tipo      | Nullable | Descrição                                |
| ----------- | --------- | -------- | ---------------------------------------- |
| id          | integer   | Não      | PK (auto-increment)                      |
| company_id  | integer   | Não      | FK → [companies](companies.md). Tenant               |
| name        | varchar   | Não      | Nome da categoria                        |
| observation | varchar   | Sim      | Descrição ou observação da categoria     |
| status      | enum      | Não      | active / inactive. Padrão: active        |
| created_at  | timestamp | Não      | Data/hora de criação                     |
| updated_at  | timestamp | Não      | Data/hora da última atualização          |

**Regras:**
- `name` único por `company_id` (UNIQUE constraint composta)
- Inativação via `status` — sem exclusão física se houver vínculos ([products](products.md), [inventories](inventories.md))

**Registros iniciais por empresa** (criados pelo helper `seedCompanyData(company_id)`):

| name   | observation                                              |
| ------ | -------------------------------------------------------- |
| Outros | Categoria para produtos diversos ainda sem classificação |

**Referenciada por:**
- [products](products.md) (category_id)
- [inventories](inventories.md) (category_id — quando scope = category)
