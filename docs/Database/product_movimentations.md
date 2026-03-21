# Database

Documentação das tabelas importantes do sistema.

---

## product_movimentations

Log unificado de todas as movimentações de estoque. Alimentada automaticamente pelas telas que alteram estoque.

| Coluna            | Tipo      | Nullable | Descrição                                            |
| ----------------- | --------- | -------- | ---------------------------------------------------- |
| id                | integer   | Não      | PK (auto-increment)                                  |
| company_id        | integer   | Não      | FK → companies (tenant)                              |
| product_id        | integer   | Não      | FK → products                                        |
| type              | enum      | Não      | entry / adjustment / inventory / sale / sale_return / service_order |
| reference_id      | integer   | Não      | ID do item de origem (polimórfico conforme type)     |
| previous_quantity | decimal   | Não      | Estoque antes da movimentação                        |
| new_quantity      | decimal   | Não      | Estoque após a movimentação                          |
| amount            | decimal   | Não      | Quantidade movimentada (new − previous)              |
| value             | decimal   | Sim      | Valor monetário (R$) — presente em entradas e vendas |
| created_by        | integer   | Não      | FK → users (quem realizou)                           |
| created_at        | timestamp | Não      | Data/hora da movimentação                            |

**Origem por type:**
- `entry` → item de Entrada de Estoque (tela 110)
- `adjustment` → item de Ajuste de Estoque (tela 111)
- `inventory` → item de Ajuste gerado pelo Inventário (tela 112)
- `sale` → item de Venda (tela 115)
- `sale_return` → item de Cancelamento de Venda (tela 115 | Vendas)
- `service_order` → item de Ordem de Serviço (tela 118)

**Regras:**
- Inserção feita dentro da mesma transação da operação de origem
- Tabela somente inserção (append-only) — registros nunca são editados ou excluídos
- Filtrada por `company_id` (multi-tenant)
- Fonte de dados da tela [Histórico de Movimentações](../Módulos/Usuário/Relatórios/Histórico%20de%20Movimentações.md) (tela 113)
