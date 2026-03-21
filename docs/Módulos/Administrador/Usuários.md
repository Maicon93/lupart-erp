## Titulo
- Título: 11 - Usuários
- Permissão: `11_users`
- Ambiente: Administrador
- Rota: `/admin/users`

## Objetivo
- Listagem e gerenciamento global de todos os usuários do sistema (admins e usuários de empresa)

## Corpo

#### Listagem de dados

| Coluna  | Descrição                                      |
| ------- | ---------------------------------------------- |
| Nome    | Nome do usuário                                |
| E-mail  | E-mail do usuário                              |
| Empresa | Empresas vinculadas (ou "Admin" se role admin) |
| Status  | Checkbox readonly indicando ativo/inativo      |
| Ações   | Detalhes                                       |

- **Filtro**: nome, e-mail, empresa, status (Ativo / Inativo / Todos)
- **Paginação**: 20, 50, 100 registros
- **Skeleton** enquanto carrega

**Ações**:
- **Novo Usuário** — Botão no topo da tela → abre formulário de cadastro
- **Detalhes** — Abre formulário com dados preenchidos para visualização e edição. Inclui ação Inativar/Ativar

#### Componente para criação e edição

Componente separado (`UserForm.vue`)

| Campo           | Tipo         | Obrigatório | Observação                                                                |
| --------------- | ------------ | ----------- | ------------------------------------------------------------------------- |
| Nome            | text         | Sim         |                                                                           |
| E-mail          | text         | Sim         | Validação de e-mail                                                       |
| Senha           | password     | Sim (criar) | Apenas na criação. Na edição, campo separado ou omitido                   |
| Confirmar Senha | password     | Condicional | Apenas na criação do usuário                                              |
| Telefone        | text (mask)  | Sim         |                                                                           |
| País            | select       | Sim         |                                                                           |
| Língua          | select       | Sim         | Opções fixas: pt-BR, en                                              |
| Role            | select       | Sim         | admin / user                                                              |
| Empresas        | multi-select | Não         | Oculto se role = admin. Um usuário pode ter mais de uma empresa vinculada |
| Cargos          | multi-select | Não         | Oculto se role = admin. Um usuário pode ter mais de um cargo atrelado     |

## Regras específicas
- Quando role = `admin`, campos Empresas e Cargos ficam null (admin é global)
- Quando role = `user`, Empresas e Cargos são opcionais — um usuário pode ser criado antes de ser vinculado a uma empresa
- **Validação (Zod)**: e-mail válido, senha com requisitos mínimos, campos condicionais conforme role
- Botão "Salvar" com **spinner** enquanto processa
