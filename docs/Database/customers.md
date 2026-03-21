# customers

Tabela de clientes da empresa.

| Coluna      | Tipo      | Nullable | Descrição                                                        |
| ----------- | --------- | -------- | ---------------------------------------------------------------- |
| id          | integer   | Não      | PK (auto-increment)                                              |
| company_id  | integer   | Não      | FK → [companies](companies.md). Tenant                                       |
| name        | varchar   | Não      | Nome do cliente                                                  |
| cpf_cnpj    | varchar   | Não      | CPF ou CNPJ (armazenado com máscara)                             |
| phone       | varchar   | Não      | Telefone principal (armazenado com máscara)                      |
| email       | varchar   | Sim      | E-mail do cliente                                                |
| zip_code    | varchar   | Sim      | CEP (armazenado com máscara: 00000-000)                          |
| street      | varchar   | Sim      | Endereço (logradouro)                                            |
| number      | varchar   | Sim      | Número                                                           |
| complement  | varchar   | Sim      | Complemento                                                      |
| neighborhood| varchar   | Sim      | Bairro                                                           |
| city        | varchar   | Sim      | Cidade                                                           |
| state       | varchar   | Sim      | Estado (UF)                                                      |
| notes       | text      | Sim      | Observações / anotações livres                                   |
| created_at  | timestamp | Não      | Data/hora de criação                                             |
| updated_at  | timestamp | Não      | Data/hora da última atualização                                  |
| deleted_at  | timestamp | Sim      | Data/hora do soft delete. Null = ativo                           |

**Regras:**
- `cpf_cnpj` único por `company_id` (UNIQUE constraint composta — considerar apenas registros não deletados)
- Máscara de CPF ou CNPJ aplicada no frontend e armazenada no banco (ex: `000.000.000-00`, `00.000.000/0000-00`)
- Validação de CPF/CNPJ válido via Zod
- Soft delete via `deleted_at` — ao deletar, preenche com timestamp atual
- Não permite deletar se houver vínculos ativos ([sales](sales.md), [quotes](quotes.md), [service_orders](service_orders.md), [financial_titles](financial_titles.md)) — exibe mensagem informando o motivo
- Listagens filtram automaticamente `deleted_at IS NULL`
- Selects de cliente (telas 114, 115, 117, 118, 119) exibem apenas clientes não deletados
- Endereço preenchido automaticamente via ViaCEP a partir do CEP

**Seed:**

| name             | cpf_cnpj        | phone           | notes          |
| ---------------- | --------------- | --------------- | -------------- |
| Consumidor Final | 000.000.000-00  | (99) 99999-9999 | Cliente padrão |

**Referenciada por:**
- [sales](sales.md) (customer_id)
- [quotes](quotes.md) (customer_id)
- [service_orders](service_orders.md) (customer_id)
- [financial_titles](financial_titles.md) (customer_id — contas a receber)
