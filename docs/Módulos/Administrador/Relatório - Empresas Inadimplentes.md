## Titulo
- Título: 17 - Relatório: Empresas Inadimplentes
- Permissão: `17_defaulting_companies_report`
- Ambiente: Administrador
- Rota: `/admin/reports/defaulting-companies`

## Objetivo
- Visualizar empresas com planos vencidos ou pagamentos em atraso

## Corpo

#### Listagem de dados

| Coluna          | Descrição                                 |
| --------------- | ----------------------------------------- |
| Empresa         | Nome da empresa                           |
| CNPJ            | CNPJ da empresa                           |
| Plano           | Nome do plano de acesso vinculado         |
| Vencimento      | Data de vencimento do plano               |
| Dias em Atraso  | Quantidade de dias desde o vencimento     |

- **Filtro**: empresa, faixa de dias em atraso
- **Paginação**: 20, 50, 100 registros
- **Skeleton** enquanto carrega

## Regras específicas
- Tela apenas de consulta — sem criação, edição ou exclusão
- Lista apenas empresas com plano vencido (vencimento < data atual)
- Ordenação padrão: maior atraso primeiro
- Possibilidade de exportar para CSV
