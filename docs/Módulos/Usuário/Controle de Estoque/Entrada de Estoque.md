## Titulo
- Título: 110 - Entrada de Estoque
- Permissão: `110_stock_entries`
- Ambiente: Usuário
- Rota: `/stock/entries`

## Objetivo
- Registrar movimentações de entrada de produtos no estoque

## Corpo

#### Listagem de dados (movimentações)

| Coluna       | Descrição                            |
| ------------ | ------------------------------------ |
| Nº Moviment. | Código sequencial da movimentação    |
| Data         | Data da movimentação                 |
| Nota Fiscal  | Número da nota fiscal (se informado) |
| Fornecedor   | Fornecedor vinculado (se houver)     |
| Qtd. Itens   | Quantidade de itens na movimentação  |
| Valor Total  | Soma dos subtotais dos itens (R$)    |
| Ações        | Detalhes                             |

- **Filtro**: nº movimentação, nota fiscal, fornecedor, período (data início / data fim)
- **Paginação**: 20, 50, 100 registros
- **Skeleton** enquanto carrega

**Ações**:
- **Nova Entrada** — Botão no topo da tela → abre formulário de movimentação
- **Detalhes** — Abre visualização completa da movimentação (readonly)

#### Componente de detalhes

Componente separado (`StockEntryDetails.vue`) — todos os campos readonly

**Cabeçalho:**
- Nº Movimentação
- Data
- Fornecedor (se informado)
- Nota Fiscal (se informada)
- Observação (se informada)
- Responsável (nome do usuário)

**Lista de itens:**

| Coluna      | Descrição                     |
| ----------- | ----------------------------- |
| Produto     | Nome do produto               |
| Un. Medida  | Unidade de medida do produto  |
| Quantidade  | Quantidade entrada            |
| Preço Unit. | Preço de custo unitário (R$)  |
| Subtotal    | Quantidade × preço unit. (R$) |

- **Valor Total** exibido no rodapé (soma dos subtotais)

#### Componente para criação

Componente separado (`StockEntryForm.vue`)

**Cabeçalho da movimentação:**

| Campo                    | Tipo     | Obrigatório | Observação                                   |
| ------------------------ | -------- | ----------- | -------------------------------------------- |
| Fornecedor               | select   | Não         | Lista de fornecedores cadastrados (tela 106) |
| Nota Fiscal              | text     | Não         | Número da nota fiscal                        |
| Data                     | date     | Sim         | Padrão: data atual                           |
| Observação               | textarea | Não         |                                              |

**Grid de itens (tabela dinâmica):**

| Campo       | Tipo         | Obrigatório | Observação                                         |
| ----------- | ------------ | ----------- | -------------------------------------------------- |
| Produto     | autocomplete | Sim         | Busca por nome, código ou código de barras         |
| Un. Medida  | text         | —           | Preenchido automaticamente pelo produto (readonly) |
| Quantidade  | number       | Sim         | Maior que 0                                        |
| Preço Unit. | text (money) | Não         | Preço de custo unitário (R$). Opcional — quando informado, recalcula o preço médio de custo do produto (média ponderada) |
| Subtotal    | text (money) | —           | Calculado: quantidade × preço unitário (readonly). Oculto quando Preço Unit. não informado |

- Botão **Adicionar Item** para incluir nova linha no grid
- Botão **Remover** em cada linha para excluir o item
- **Valor Total** exibido no rodapé (soma dos subtotais)
- Botão **Revisar Entrada** ao final do grid → abre o componente de confirmação

#### Componente de confirmação

Componente separado (`StockEntryConfirm.vue`)

Exibe um resumo completo da movimentação para revisão antes de salvar:

**Cabeçalho:**
- Fornecedor (se informado)
- Nota Fiscal (se informada)
- Data
- Observação (se informada)

**Lista de itens:**

| Coluna      | Descrição                       |
| ----------- | ------------------------------- |
| Produto     | Nome do produto                 |
| Un. Medida  | Unidade de medida do produto    |
| Quantidade  | Quantidade informada            |
| Preço Unit. | Preço de custo unitário (R$)    |
| Subtotal    | Quantidade × preço unit. (R$)   |

- **Valor Total** exibido no rodapé (soma dos subtotais)
**Ações:**
- **Confirmar** — Salva a movimentação e todos os itens (com **spinner** enquanto processa)
- **Voltar** — Retorna ao grid de itens

## Regras específicas
- A confirmação **não** usa o [Confirm Dialog](../../../CodeBase/Confirm%20Dialog.md) genérico — usa o componente personalizado `StockEntryConfirm.vue` descrito acima
- Uma movimentação agrupa múltiplos itens de entrada sob um mesmo número
- O campo `created_by` salva o ID do usuário que registrou a entrada
- Ao confirmar, todos os itens são salvos de uma vez (transação única)
- Antes de processar, o serviço utiliza o helper [inventoryLock](../../../CodeBase/Helpers/inventoryLock.md) para verificar se algum produto está em inventário ativo — rejeita se houver bloqueio
- Para cada item, o estoque do produto é incrementado com a quantidade informada
- Para cada item, inserir um registro na tabela `product_movimentations` com `type = entry` — ver [product_movimentations](../../../Database/product_movimentations.md)
- Para cada item com `unit_price` informado, o `average_cost` (preço médio) do produto é recalculado automaticamente (média ponderada). Se não informado, o `average_cost` não é alterado
- Movimentação finalizada não pode ser editada — apenas visualizada
- **Validação (Zod)**: data obrigatória, pelo menos 1 item, quantidade > 0. Se preço unitário informado: deve ser > 0
- Fluxo: Grid de itens → Revisar Entrada → Componente de confirmação → Confirmar / Voltar
