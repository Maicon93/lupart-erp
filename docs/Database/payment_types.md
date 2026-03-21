# payment_types

Tipos de pagamento disponíveis para uso nas parcelas de vendas e títulos financeiros.

| Coluna      | Tipo      | Nullable | Descrição                       |
| ----------- | --------- | -------- | ------------------------------- |
| id          | integer   | Não      | PK (auto-increment)             |
| company_id  | integer   | Não      | FK → companies (tenant)         |
| name        | varchar   | Não      | Nome do tipo de pagamento       |
| observation | text      | Sim      | Observações adicionais          |
| status      | enum      | Não      | active / inactive. Padrão: active |
| created_at  | timestamp | Não      | Data/hora de criação            |
| updated_at  | timestamp | Não      | Data/hora da última atualização |

**Regras:**
- `name` único por `company_id` (UNIQUE constraint composta)
- Filtrada por `company_id` (multi-tenant)
- Soft delete via `status` (active/inactive)
- Apenas tipos com `status = active` aparecem como opção nas parcelas
- Referenciada por `financial_titles.payment_type_id`
- Gerenciada pela tela 109 (Tipos de Pagamento)

**Registros iniciais por empresa** (criados pelo helper `seedCompanyData(company_id)`):

| name               |
| ------------------ |
| Dinheiro           |
| PIX                |
| Cartão de Débito   |
| Cartão de Crédito  |
| Boleto             |

