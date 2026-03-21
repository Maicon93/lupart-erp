## Titulo
- Título: 10 - Planos de Acesso
- Permissão: `10_access_plans`
- Ambiente: Administrador
- Rota: `/admin/access-plans`

## Objetivo
- Listagem e gerenciamento dos planos de acesso disponíveis para as empresas

## Corpo

#### Listagem de dados

| Coluna   | Descrição                               |
| -------- | --------------------------------------- |
| Title    | Nome do plano                           |
| Usuários | Quantidade de usuários permitidos       |
| Duração  | Dias de vigência (ciclo de faturamento) |
| Valor    | Valor da fatura (R$)                    |
| Status   | Ativo / Inativo                         |
| Ações    | Editar, Inativar/Ativar                 |

- **Filtro**: Nome, status (Ativo / Inativo / Todos)
- **Paginação**: 20, 50, 100 registros
- **Skeleton** enquanto carrega

#### Componente para criação e edição

Componente separado (`AccessPlanForm.vue`)

| Campo                  | Tipo             | Obrigatório | Observação |
| ---------------------- | ---------------- | ----------- | ---------- |
| Titulo                 | text             | Sim         |            |
| Quantidade de usuários | number           | Sim         |            |
| Dias de vigência       | number           | Sim         |            |
| Valor da fatura        | number (mask R$) | Sim         |            |

## Regras específicas
- **Validação (Zod)**: todos os campos obrigatórios, valores numéricos positivos
- Botão "Salvar" com **spinner** enquanto processa

## Seed

| Plano      | Usuários | Vigência | Valor      |
| ---------- | -------- | -------- | ---------- |
| Básico     | 2        | 30 dias  | R$ 130,00  |
| Enterprise | 10       | 30 dias  | R$ 250,00  |
