## Titulo
- Título: 14 - Permissões
- Permissão: `14_permissions`
- Ambiente: Administrador
- Rota: `/admin/permissions`

## Objetivo
- Listagem readonly de todas as permissões do sistema

## Corpo

#### Listagem de dados

| Coluna    | Descrição                                          |
| --------- | -------------------------------------------------- |
| Descrição | Nome da permissão (ex: `101_dashboard`)            |
| Observação| Tela responsável pela permissão (ex: "Dashboard")  |

- **Filtro**: descrição
- **Paginação**: 20, 50, 100 registros
- **Skeleton** enquanto carrega

## Regras específicas
- Tela apenas de consulta — sem criação, edição ou exclusão
- As permissões são gerenciadas via seed/migration, não pelo usuário

## Seed

### Painel Administrador (10–99)

| Descrição                        | Observação                        |
| -------------------------------- | --------------------------------- |
| `10_access_plans`                | Planos de Acesso                  |
| `11_users`                       | Usuários                          |
| `12_companies`                   | Empresas                          |
| `13_positions`                   | Cargos                            |
| `14_permissions`                 | Permissões                        |
| `15_system_parameters`           | Parâmetros do Sistema             |
| `16_companies_plans_report`      | Relatório: Empresas e Planos      |
| `17_defaulting_companies_report` | Relatório: Empresas Inadimplentes |
| `18_users_by_company_report`     | Relatório: Usuários por Empresa   |

### Painel do Usuário (100+)

| Descrição                  | Observação                 |
| -------------------------- | -------------------------- |
| `101_dashboard`            | Dashboard                  |
| `102_profile`              | Meu Perfil                 |
| `104_measurement_units`    | Unidades de Medida         |
| `105_customers`            | Clientes                   |
| `106_suppliers`            | Fornecedores               |
| `107_products`             | Produtos                   |
| `108_categories`           | Categorias                 |
| `109_payment_types`        | Tipos de Pagamento         |
| `110_stock_entries`        | Entrada de Estoque         |
| `111_stock_adjustments`    | Ajuste de Estoque          |
| `112_inventory`            | Inventário                 |
| `113_stock_history`        | Histórico de Movimentações |
| `114_pdv`                  | Venda Direta (PDV)         |
| `115_sales`                | Vendas                     |
| `117_quotes`               | Orçamentos                 |
| `118_service_orders`       | Ordem de Serviço (OS)      |
| `119_accounts_receivable`  | Contas a Receber           |
| `120_accounts_payable`     | Contas a Pagar             |
| `121_cash_flow`            | Fluxo de Caixa             |
| `122_cash_movements`       | Movimentações de Caixa     |
| `123_sales_report`         | Vendas por Período         |
| `124_top_products`         | Produtos Mais Vendidos     |
| `125_settings`             | Configurações da Empresa   |
| `126_plan`                 | Meu Plano                  |
| `127_users`                | Usuários                   |
| `128_minimum_stock`        | Estoque Mínimo             |
