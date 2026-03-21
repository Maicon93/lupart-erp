## Titulo
- Título: 102 - Meu Perfil
- Permissão: nenhuma (acesso garantido a todos os usuários)
- Ambiente: Usuário
- Rota: `/profile`

## Objetivo
- Permitir que o usuário visualize e edite seus próprios dados pessoais

## Corpo

#### Dados do perfil

Componente único (`ProfileForm.vue`) — exibição e edição na mesma tela.

| Campo           | Tipo        | Editável | Observação                          |
| --------------- | ----------- | -------- | ----------------------------------- |
| Nome            | text        | Sim      |                                     |
| E-mail          | text        | Não      | Readonly — apenas admin pode alterar|
| Telefone        | text (mask) | Sim      |                                     |
| País            | select      | Sim      |                                     |
| Língua          | select      | Sim      | Opções fixas: pt-BR, en        |

#### Alteração de senha

Seção separada dentro da mesma tela.

| Campo           | Tipo     | Obrigatório | Observação                     |
| --------------- | -------- | ----------- | ------------------------------ |
| Senha Atual     | password | Sim         | Validação contra a senha atual |
| Nova Senha      | password | Sim         | Requisitos mínimos de senha    |
| Confirmar Senha | password | Sim         | Deve ser igual à nova senha    |

#### Informações readonly

Seção informativa (não editável):

- **Empresas vinculadas** — lista das empresas do usuário
- **Cargos** — lista dos cargos atribuídos

## Regras específicas
- Não possui permissão — todos os usuários logados acessam essa tela
- É o fallback final do redirecionamento inicial (quando o usuário não tem nenhuma permissão)
- E-mail não pode ser alterado pelo próprio usuário (apenas via painel admin)
- Alteração de senha exige informar a senha atual
- **Validação (Zod)**: telefone válido, nova senha com requisitos mínimos, confirmar senha igual à nova senha
- Botão "Salvar" com **spinner** enquanto processa
