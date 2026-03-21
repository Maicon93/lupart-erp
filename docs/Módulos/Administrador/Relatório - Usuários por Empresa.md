## Titulo
- Título: 18 - Relatório: Usuários por Empresa
- Permissão: `18_users_by_company_report`
- Ambiente: Administrador
- Rota: `/admin/reports/users-by-company`

## Objetivo
- Visualizar a quantidade de usuários vinculados a cada empresa

## Corpo

#### Listagem de dados

| Coluna              | Descrição                                  |
| ------------------- | ------------------------------------------ |
| Empresa             | Nome da empresa                            |
| CNPJ                | CNPJ da empresa                            |
| Plano               | Nome do plano de acesso vinculado          |
| Máx. Usuários       | Limite de usuários do plano                |
| Usuários Vinculados | Quantidade atual de usuários na empresa    |
| Status              | Checkbox readonly indicando ativo/inativo  |

- **Filtro**: empresa, status (Ativo / Inativo / Todos)
- **Paginação**: 20, 50, 100 registros
- **Skeleton** enquanto carrega

## Regras específicas
- Tela apenas de consulta — sem criação, edição ou exclusão
- Destacar visualmente empresas que atingiram o limite de usuários do plano
- Possibilidade de exportar para CSV
