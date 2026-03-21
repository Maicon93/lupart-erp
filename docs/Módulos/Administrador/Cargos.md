## Titulo
- Título: 13 - Cargos
- Permissão: `13_positions`
- Ambiente: Administrador
- Rota: `/admin/positions`

## Objetivo
- Listagem e gerenciamento dos cargos do sistema. Cada cargo possui um conjunto de permissões vinculadas às telas

## Corpo

#### Listagem de dados

| Coluna     | Descrição                                 |
| ---------- | ----------------------------------------- |
| Nome       | Nome do cargo                             |
| Permissões | Quantidade de permissões atribuídas       |
| Ações      | Detalhes, Excluir                         |

- **Filtro**: nome
- **Paginação**: 20, 50, 100 registros
- **Skeleton** enquanto carrega

**Ações**:
- **Novo Cargo** — Botão no topo da tela → abre formulário de cadastro
- **Detalhes** — Abre formulário com dados preenchidos para visualização e edição
- **Excluir** — Exibe confirm dialog antes de executar. Exclusão física do cargo e suas permissões vinculadas (`role_permissions`)

#### Componente para criação e edição

Componente separado (`PositionForm.vue`)

| Campo      | Tipo      | Obrigatório | Observação                                                         |
| ---------- | --------- | ----------- | ------------------------------------------------------------------ |
| Nome       | text      | Sim         |                                                                    |
| Permissões | checklist | Sim         | Lista de todas as permissões disponíveis (uma por tela do sistema) |

## Regras específicas
- Cada permissão corresponde a **uma tela** do sistema
- Formato da permissão: `{numero_tela}_{nome}` (ex: `101_dashboard`)
- O admin seleciona quais telas o cargo terá acesso via checklist
- **Excluir**: antes de excluir, a API verifica se há usuários vinculados ao cargo via `user_roles`. Se houver, a exclusão é rejeitada com mensagem informando que existem usuários ativos com esse cargo
- Cargos globais (`company_id = null`: admin, user) não podem ser excluídos — botão Excluir não é exibido para eles
- **Validação (Zod)**: nome obrigatório, ao menos uma permissão selecionada
- Botão "Salvar" com **spinner** enquanto processa

## Seed

| Cargo         | Permissões                                                                                                                                                                              |
| ------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Administrador | `10_access_plans`, `11_users`, `12_companies`, `13_positions`, `14_permissions`, `15_system_parameters`, `16_companies_plans_report`, `17_defaulting_companies_report`, `18_users_by_company_report` |
