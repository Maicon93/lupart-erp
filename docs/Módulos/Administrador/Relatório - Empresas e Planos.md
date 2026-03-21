## Titulo
- Título: 16 - Relatório: Empresas e Planos
- Permissão: `16_companies_plans_report`
- Ambiente: Administrador
- Rota: `/admin/reports/companies-plans`

## Objetivo
- Visualizar a relação entre empresas e seus respectivos planos de acesso

## Corpo

#### Listagem de dados

| Coluna         | Descrição                                |
| -------------- | ---------------------------------------- |
| Empresa        | Nome da empresa                          |
| CNPJ           | CNPJ da empresa                          |
| Plano          | Nome do plano de acesso vinculado        |
| Valor do Plano | Valor mensal do plano (R$)               |
| Vencimento     | Data de vencimento do plano              |
| Status         | Checkbox readonly indicando ativo/inativo|

- **Filtro**: empresa, plano, status (Ativo / Inativo / Todos)
- **Paginação**: 20, 50, 100 registros
- **Skeleton** enquanto carrega

## Regras específicas
- Tela apenas de consulta — sem criação, edição ou exclusão
- Possibilidade de exportar para CSV
