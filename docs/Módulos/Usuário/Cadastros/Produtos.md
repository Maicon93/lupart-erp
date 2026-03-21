## Titulo
- Título: 107 - Produtos
- Permissão: `107_products`
- Ambiente: Usuário
- Rota: `/products`

## Objetivo
- Cadastro e gerenciamento de produtos da empresa

## Corpo

#### Listagem de dados

| Coluna     | Descrição                                 |
| ---------- | ----------------------------------------- |
| Nome       | Nome do produto                           |
| Código     | Código interno do produto                 |
| Tipo       | Produto ou Serviço                        |
| Categoria  | Categoria do produto                      |
| Un. Medida | Unidade de medida                         |
| Preço      | Preço de venda (R$)                       |
| Preço Médio| Preço médio de custo (R$)                 |
| Estoque    | Quantidade atual em estoque               |
| Status     | Checkbox readonly indicando ativo/inativo |
| Ações      | Detalhes                                  |

- **Filtro**: nome, código, tipo (Produto / Serviço / Todos), categoria, status (Ativo / Inativo / Todos)
- **Paginação**: 20, 50, 100 registros
- **Skeleton** enquanto carrega

**Ações**:
- **Novo Produto** — Botão no topo da tela → abre formulário de cadastro
- **Detalhes** — Abre formulário com dados preenchidos para visualização e edição. Inclui ação Inativar/Ativar

#### Componente para criação e edição

Componente separado (`ProductForm.vue`)

| Campo            | Tipo           | Obrigatório | Observação                                        |
| ---------------- | -------------- | ----------- | ------------------------------------------------- |
| Tipo             | radio          | Sim         | Produto / Serviço                                 |
| Nome             | text           | Sim         |                                                   |
| Código           | text           | Não         | Código interno, opcional. Unique por tenant        |
| Código de Barras | text           | Não         | EAN-13, EAN-8 ou código próprio                   |
| Descrição        | textarea       | Não         |                                                   |
| Categoria        | select         | Sim         | Lista de categorias cadastradas (tela 108)        |
| Unidade de Medida| select         | Sim         | Lista de unidades cadastradas (tela 104)          |
| Preço de Custo   | text (money)   | Não         | Editável. Valor do preço médio de custo do produto. Recalculado automaticamente quando o preço de custo é informado na entrada de estoque (tela 110) |
| Preço de Venda   | text (money)   | Sim         | Formato R$ com máscara monetária                  |
| Estoque Mínimo   | number         | Não         | Alerta quando estoque atingir esse valor          |
| Imagens          | file (upload)  | Não         | Upload de uma ou mais imagens do produto (S3). A primeira imagem é a principal |
| Observações      | textarea       | Não         | Anotações livres sobre o produto                  |

## Regras específicas
- A tabela `products` possui a coluna `average_cost` que armazena o preço de custo
- Campo "Preço de Custo" é **sempre editável** — o usuário pode definir o valor inicial ou corrigir quando necessário
- O `average_cost` é recalculado automaticamente a cada entrada de estoque (tela 110) quando o preço de custo unitário é informado (média ponderada). Se não informado na entrada, o valor não é alterado
- Código interno é opcional — se informado, deve ser único dentro do tenant
- Imagem armazenada no S3 (ver [Definições#Armazenamento de Arquivos](../../../Definições.md))
- Quando tipo = **Serviço**: campos Código de Barras, Unidade de Medida, Estoque Mínimo e Preço de Custo ficam ocultos (serviço não tem estoque)
- Unidade de medida vem do cadastro (tela 104)
- **Validação (Zod)**: nome obrigatório, preço de venda obrigatório e positivo, categoria obrigatória
- Botão "Salvar" com **spinner** enquanto processa
