# sales

Tabela principal de vendas. Cada registro representa uma venda completa, com seus itens e dados de pagamento relacionados.

| Coluna              | Tipo      | Nullable | Descrição                                                    |
| ------------------- | --------- | -------- | ------------------------------------------------------------ |
| id                  | integer   | Não      | PK (auto-increment)                                          |
| company_id          | integer   | Não      | FK → companies (tenant)                                      |
| customer_id         | integer   | Não      | FK → customers (inclui "Consumidor Final" como cliente padrão) |
| date                | date      | Não      | Data da venda                                                |
| observation         | text      | Sim      | Observação livre sobre a venda                               |
| status              | enum      | Não      | finalized / cancelled                                        |
| payment_form        | enum      | Não      | cash / installment (à vista / parcelado)                     |
| discount_percentage | decimal   | Não      | Desconto percentual aplicado (0–100). 0 se sem desconto      |
| discount_value      | decimal   | Não      | Desconto em valor (R$). 0 se sem desconto                    |
| total_value         | decimal   | Não      | Soma dos subtotais dos itens (antes do desconto)             |
| final_value         | decimal   | Não      | Valor final da venda (total_value − discount_value)          |
| cancellation_reason | text      | Sim      | Motivo do cancelamento. Preenchido ao cancelar a venda       |
| created_by          | integer   | Não      | FK → users (usuário que realizou a venda)                    |
| created_at          | timestamp | Não      | Data/hora de criação                                         |
| updated_at          | timestamp | Não      | Data/hora da última atualização                              |

**Status:**
- `finalized` → Venda concluída normalmente
- `cancelled` → Venda cancelada (estoque revertido, títulos cancelados)

**payment_form:**
- `cash` → À vista (1 parcela)
- `installment` → Parcelado (N parcelas)

**Regras:**
- Filtrada por `company_id` (multi-tenant)
- Ao confirmar, todos os itens e títulos são salvos em transação única
- Cancelamento exige `cancellation_reason` obrigatório, reverte estoque (gera `product_movimentations` com `type = sale_return`) e cancela títulos vinculados em transação única
- `discount_percentage` e `discount_value` são salvos com 2 casas decimais
- Fonte de dados da tela [Vendas](../Módulos/Usuário/Movimentações/Vendas.md) (tela 115)
