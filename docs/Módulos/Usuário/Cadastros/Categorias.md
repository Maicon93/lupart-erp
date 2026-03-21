## Titulo
- Título: 108 - Categorias
- Permissão: `108_categories`
- Ambiente: Usuário
- Rota: `/categories`

## Objetivo
- Cadastro e gerenciamento de categorias de produto

## Corpo

#### Listagem de dados

| Coluna     | Descrição                                 |
| ---------- | ----------------------------------------- |
| Nome       | Nome da categoria                         |
| Observação | Descrição ou observação da categoria      |
| Status     | Checkbox readonly indicando ativo/inativo |
| Ações      | Detalhes                                  |

- **Filtro**: nome, status (Ativo / Inativo / Todos)
- **Paginação**: 20, 50, 100 registros
- **Skeleton** enquanto carrega

**Ações**:
- **Nova Categoria** — Botão no topo da tela → abre formulário de cadastro
- **Detalhes** — Abre formulário com dados preenchidos para visualização e edição. Inclui ação Inativar/Ativar

#### Componente para criação e edição

Componente separado (`CategoryForm.vue`)

| Campo      | Tipo     | Obrigatório | Observação |
| ---------- | -------- | ----------- | ---------- |
| Nome       | text     | Sim         |            |
| Observação | textarea | Não         |            |

## Regras específicas
- Nome da categoria deve ser único dentro do tenant
- **Validação (Zod)**: nome obrigatório
- Botão "Salvar" com **spinner** enquanto processa

## Seed

| Nome   | Observação                                              |
| ------ | ------------------------------------------------------- |
| Outros | Categoria para produtos diversos ainda sem classificação |
