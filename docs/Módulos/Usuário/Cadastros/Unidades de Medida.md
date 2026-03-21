## Titulo
- Título: 104 - Unidades de Medida
- Permissão: `104_measurement_units`
- Ambiente: Usuário
- Rota: `/measurement-units`

## Objetivo
- Cadastro e gerenciamento de unidades de medida para produtos

## Corpo

#### Listagem de dados

| Coluna    | Descrição                                 |
| --------- | ----------------------------------------- |
| Sigla     | Abreviação (ex: Kg, Un, L)               |
| Descrição | Nome completo (ex: Quilo, Unidade)        |
| Status    | Checkbox readonly indicando ativo/inativo |
| Ações     | Detalhes                                  |

- **Filtro**: sigla, descrição, status (Ativo / Inativo / Todos)
- **Paginação**: 20, 50, 100 registros
- **Skeleton** enquanto carrega

**Ações**:
- **Nova Unidade** — Botão no topo da tela → abre formulário de cadastro
- **Detalhes** — Abre formulário com dados preenchidos para visualização e edição. Inclui ação Inativar/Ativar

#### Componente para criação e edição

Componente separado (`UnitForm.vue`)

| Campo     | Tipo | Obrigatório | Observação               |
| --------- | ---- | ----------- | ------------------------ |
| Sigla     | text | Sim         | Máximo 10 caracteres     |
| Descrição | text | Sim         | Nome completo da unidade |

## Regras específicas
- Sigla da unidade de medida deve ser única dentro do tenant
- **Validação (Zod)**: sigla e descrição obrigatórios
- Botão "Salvar" com **spinner** enquanto processa

## Seed

| Sigla   | Descrição |
| ------- | --------- |
| Kg      | Quilo     |
| Un      | Unidade   |
| L       | Litro     |
| Serviço | Serviço   |
