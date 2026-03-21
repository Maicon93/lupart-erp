## Titulo
- Título: 127 - Usuários
- Permissão: `127_users`
- Ambiente: Usuário
- Rota: `/settings/users`

## Objetivo
- Gerenciar os usuários e cargos vinculados à empresa atual

## Corpo

A tela possui **duas abas**: Usuários e Cargos.

```
┌──────────────────────────────────────────────────────────┐
│ 127 - Usuários                                            │
├──────────────────────────────────────────────────────────┤
│ [ Usuários ]  [ Cargos ]                                  │
├──────────────────────────────────────────────────────────┤
│                  (conteúdo da aba ativa)                   │
└──────────────────────────────────────────────────────────┘
```

---

### Aba: Usuários

```
┌──────────────────────────────────────────────────────────┐
│ Nome [__________]  Status [______▾]  3/10  [Novo Usuário]│
├───────────────┬──────────────┬──────────┬────────┬───────┤
│ Nome          │ E-mail       │ Cargos   │ Status │ Ações │
├───────────────┼──────────────┼──────────┼────────┼───────┤
│ João Silva    │ joao@emp.com │ Gerente  │ ● Ativo│ [Det] │
│ Maria Costa   │ maria@emp.com│ Vendedor │ ● Ativo│ [Det] │
│ Pedro Santos  │ pedro@emp.com│ —        │ ● Ativo│ [Det] │
├───────────────┴──────────────┴──────────┴────────┴───────┤
│ 20 ▾  1-3 de 3               [ < ]  1  [ > ]            │
└──────────────────────────────────────────────────────────┘
```

#### Listagem de usuários

Exibe apenas os usuários vinculados à empresa atual (via `user_companies`).

| Coluna | Descrição                                                    |
| ------ | ------------------------------------------------------------ |
| Nome   | Nome do usuário                                              |
| E-mail | E-mail do usuário                                            |
| Cargos | Cargos do usuário na empresa (lista separada por vírgula)    |
| Status | Ativo / Inativo                                              |
| Ações  | Detalhes                                                     |

- **Indicador de limite**: "X / Y" ao lado do botão (quantidade atual / limite do plano)
- **Filtros**: nome, status (Ativo / Inativo / Todos)
- **Paginação**: 20, 50, 100 registros
- **Skeleton** enquanto carrega

**Ações:**
- **Novo Usuário** — Botão no topo → abre formulário. Desabilitado se o limite do plano foi atingido
- **Detalhes** — Abre formulário com dados preenchidos para visualização e edição

#### Componente para criação e edição de usuário (`CompanyUserForm.vue`)

**Criação (novo usuário):**

| Campo           | Tipo         | Obrigatório | Observação                                              |
| --------------- | ------------ | ----------- | ------------------------------------------------------- |
| Nome            | text         | Sim         |                                                         |
| E-mail          | text         | Sim         | Validação de e-mail. Único globalmente                  |
| Senha           | password     | Sim         |                                                         |
| Confirmar Senha | password     | Sim         | Deve coincidir com Senha                                |
| Telefone        | text (mask)  | Não         |                                                         |
| Língua          | select       | Sim         | Opções fixas: pt-BR, en                            |
| Cargos          | multi-select | Não         | Cargos da empresa atual (roles onde company_id = atual) |

**Edição (usuário existente):**

| Campo           | Tipo         | Obrigatório | Observação                                              |
| --------------- | ------------ | ----------- | ------------------------------------------------------- |
| Nome            | text         | —           | Readonly (usuário altera no Meu Perfil, tela 102)       |
| E-mail          | text         | —           | Readonly                                                |
| Cargos          | multi-select | Não         | Cargos da empresa atual (roles onde company_id = atual) |
| Nova Senha      | password     | Não         | Se preenchido, altera a senha do usuário                |
| Confirmar Senha | password     | Condicional | Obrigatório se Nova Senha preenchido                    |

- Ação **Remover da Empresa** — Confirm dialog: "Deseja remover este usuário da empresa?" Remove o vínculo em `user_companies` e os cargos em `user_roles`
- Ação **Inativar/Ativar** — Confirm dialog antes de alterar o status

---

### Aba: Cargos

```
┌──────────────────────────────────────────────────────────┐
│ Nome [__________]                        [ Novo Cargo ]  │
├──────────────────┬──────────────┬────────────────────────┤
│ Nome             │ Permissões   │ Ações                  │
├──────────────────┼──────────────┼────────────────────────┤
│ Gerente          │ 12           │ [Det]                  │
│ Vendedor         │ 5            │ [Det]                  │
│ Estoquista       │ 3            │ [Det]                  │
├──────────────────┴──────────────┴────────────────────────┤
│ 20 ▾  1-3 de 3               [ < ]  1  [ > ]            │
└──────────────────────────────────────────────────────────┘
```

#### Listagem de cargos

Exibe apenas os cargos da empresa atual (roles onde `company_id` = empresa atual).

| Coluna     | Descrição                           |
| ---------- | ----------------------------------- |
| Nome       | Nome do cargo                       |
| Permissões | Quantidade de permissões atribuídas |
| Ações      | Detalhes                            |

- **Filtros**: nome
- **Paginação**: 20, 50, 100 registros
- **Skeleton** enquanto carrega

**Ações:**
- **Novo Cargo** — Botão no topo → abre formulário de criação
- **Detalhes** — Abre formulário com dados preenchidos para visualização e edição. Inclui ação Excluir

#### Componente para criação e edição de cargo (`CompanyRoleForm.vue`)

| Campo      | Tipo      | Obrigatório | Observação                                                               |
| ---------- | --------- | ----------- | ------------------------------------------------------------------------ |
| Nome       | text      | Sim         |                                                                          |
| Permissões | checklist | Sim         | Lista de permissões do Painel do Usuário (telas 100+). Uma por tela      |

- Ação **Excluir** — Confirm dialog: "Deseja excluir este cargo?" Exclusão física. Se houver usuários vinculados, a API rejeita com mensagem: "Não é possível excluir este cargo pois existem usuários vinculados a ele"

---

## Regras específicas

**Usuários:**
- Exibe apenas usuários da empresa atual (filtro por `company_id` via `user_companies`)
- O usuário criado recebe `role_id = user` (papel global) automaticamente
- O usuário criado é vinculado automaticamente à empresa atual via `user_companies`
- **Limite do plano**: a API rejeita criação se a quantidade de usuários ativos na empresa atingir `access_plans.user_limit`
- Na edição, apenas os **cargos** são alteráveis — dados pessoais são gerenciados pelo próprio usuário na tela 102
- **Remover da Empresa**: exclui fisicamente o registro em `user_companies` e os registros em `user_roles` para cargos da empresa. O usuário não é excluído do sistema — apenas perde acesso à empresa
- Se o e-mail informado na criação já existir no sistema, exibir erro: "E-mail já cadastrado"

**Cargos:**
- Exibe apenas cargos da empresa atual (roles onde `company_id` = empresa atual)
- O cargo criado recebe automaticamente `company_id` da empresa atual
- Exclusão física — ao excluir, remove o registro de `roles` e os vínculos em `role_permissions`
- **Validação de exclusão**: se houver usuários vinculados ao cargo via `user_roles`, a API rejeita com mensagem: "Não é possível excluir este cargo pois existem usuários vinculados a ele"
- As permissões disponíveis na checklist são apenas as do Painel do Usuário (telas 100+)

**Validações (Zod):**
- Usuário: nome obrigatório, e-mail válido, senha com requisitos mínimos (criação), cargos opcionais
- Cargo: nome obrigatório, ao menos uma permissão selecionada
- Botões "Salvar" com **spinner** enquanto processa
