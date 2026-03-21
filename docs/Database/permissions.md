# permissions

Permissões do sistema. Uma permissão por tela do Painel do Usuário.

| Coluna      | Tipo      | Nullable | Descrição                                              |
| ----------- | --------- | -------- | ------------------------------------------------------ |
| id          | integer   | Não      | PK (auto-increment)                                    |
| name        | varchar   | Não      | Identificador único (ex: `105_customers`)              |
| observation | varchar   | Sim      | Descrição do que essa permissão libera acesso          |
| created_at  | timestamp | Não      | Data/hora de criação                                   |

**Formato do name:** `{numero_tela}_{identificador}` — ex: `105_customers`, `110_stock_entries`

**Regras:**
- `name` é único na tabela
- Permissões são criadas via seed — não são gerenciadas pela interface
- Painel Administrador não usa permissões — acesso total para role admin
- Apenas telas do Painel do Usuário possuem permissão vinculada

**Seed:**

| name                        | observation                              |
| --------------------------- | ---------------------------------------- |
| 101_dashboard               | Dashboard                                |
| 102_profile                 | Meu Perfil                               |
| 104_measurement_units       | Unidades de Medida                       |
| 105_customers               | Clientes                                 |
| 106_suppliers               | Fornecedores                             |
| 107_products                | Produtos                                 |
| 108_categories              | Categorias                               |
| 109_payment_types           | Tipos de Pagamento                       |
| 110_stock_entries           | Entrada de Estoque                       |
| 111_stock_adjustments       | Ajuste de Estoque                        |
| 112_inventory               | Inventário                               |
| 113_stock_history           | Histórico de Movimentações               |
| 114_pdv                     | Venda Direta (PDV)                       |
| 115_sales                   | Vendas                                   |
| 117_quotes                  | Orçamentos                               |
| 118_service_orders          | Ordem de Serviço                         |
| 119_accounts_receivable     | Contas a Receber                         |
| 120_accounts_payable        | Contas a Pagar                           |
| 121_cash_flow               | Fluxo de Caixa                           |
| 122_cash_movements          | Movimentações de Caixa                   |
| 123_sales_report            | Vendas por Período                       |
| 124_top_products            | Produtos Mais Vendidos                   |
| 125_settings                | Configurações da Empresa                 |
| 126_plan                    | Meu Plano                                |
| 127_users                   | Usuários                                 |
| 128_minimum_stock           | Estoque Mínimo                           |
