## Titulo
- Título: 111 - Ajuste de Estoque
- Permissão: `111_stock_adjustments`
- Ambiente: Usuário
- Rota: `/stock/adjustments`

## Objetivo
- Corrigir divergências de estoque por meio de ajustes manuais

## Corpo

#### Listagem de dados (itens ajustados)

| Coluna        | Descrição                             |
| ------------- | ------------------------------------- |
| Nº Ajuste     | Código sequencial do ajuste           |
| Data          | Data do ajuste                        |
| Produto       | Nome do produto ajustado              |
| Qtd. Anterior | Estoque antes do ajuste               |
| Nova Qtd.     | Quantidade após o ajuste              |
| Responsável   | Nome do usuário que realizou o ajuste |
| Ações         | Detalhes                              |

- **Filtro**: nº ajuste, produto, período (data início / data fim)
- **Paginação**: 20, 50, 100 registros
- **Skeleton** enquanto carrega

**Ações:**
- **Novo Ajuste** — Botão no topo da tela → abre formulário de ajuste
- **Detalhes** — Abre visualização completa do ajuste (readonly)

#### Componente de detalhes

Componente separado (`StockAdjustmentDetails.vue`) — todos os campos readonly

**Cabeçalho:**
- Nº Ajuste
- Data
- Motivo
- Responsável (nome do usuário)

**Lista de itens:**

| Coluna        | Descrição                             |
| ------------- | ------------------------------------- |
| Produto       | Nome do produto                       |
| Un. Medida    | Unidade de medida do produto          |
| Qtd. Anterior | Estoque antes do ajuste               |
| Nova Qtd.     | Quantidade após o ajuste              |
| Diferença     | Nova Qtd. − Qtd. Anterior (calculado) |

#### Componente para criação

Componente separado (`StockAdjustmentForm.vue`)

**Cabeçalho do ajuste:**

| Campo      | Tipo     | Obrigatório | Observação |
| ---------- | -------- | ----------- | ---------- |
| Data       | date     | Sim         | Padrão: data atual |
| Motivo     | textarea | Sim         | Justificativa do ajuste |

**Grid de itens (tabela dinâmica):**

| Campo         | Tipo         | Obrigatório | Observação                                                |
| ------------- | ------------ | ----------- | --------------------------------------------------------- |
| Produto       | autocomplete | Sim         | Busca por nome, código interno ou código de barras        |
| Un. Medida    | text         | —           | Preenchido automaticamente pelo produto (readonly)        |
| Qtd. Anterior | number       | —           | Estoque atual do produto no momento da seleção (readonly) |
| Nova Qtd.     | number       | Sim         | Nova quantidade total do estoque para este produto        |

- Background do campo **Nova Qtd.**: `success` se diferença > 0, `danger` se diferença < 0 (cores do theme store)
- Botão **Adicionar Item** para incluir nova linha no grid
- Botão **Remover** em cada linha para excluir o item
- Botão **Revisar Ajuste** ao final do grid → abre o componente de confirmação

#### Componente de confirmação

Componente separado (`StockAdjustmentConfirm.vue`)

Exibe um resumo completo do ajuste para revisão antes de salvar:

**Cabeçalho:**
- Data
- Motivo

**Lista de itens:**

| Coluna        | Descrição                            |
| ------------- | ------------------------------------ |
| Produto       | Nome do produto                      |
| Un. Medida    | Unidade de medida do produto         |
| Qtd. Anterior | Estoque antes do ajuste              |
| Nova Qtd.     | Nova quantidade informada            |
| Diferença     | Nova Qtd. − Qtd. Anterior (calculado) |

- Coluna **Diferença**: texto em `success` se > 0, `danger` se < 0 (cores do [Theme Store](../../../CodeBase/Theme%20Store.md))

**Ações:**
- **Confirmar** — Salva o ajuste e todos os itens (com **spinner** enquanto processa)
- **Cancelar** — Volta ao grid de itens para possibilitar edições na lista

## Regras específicas
- A confirmação **não** usa o [Confirm Dialog](../../../CodeBase/Confirm%20Dialog.md) genérico — usa o componente personalizado `StockAdjustmentConfirm.vue` descrito acima
- Um ajuste agrupa múltiplos itens sob um mesmo número
- O campo `created_by` salva o ID do usuário que registrou o ajuste
- Ao confirmar, todos os itens são salvos de uma vez (transação única)
- Antes de processar, o serviço utiliza o helper [inventoryLock](../../../CodeBase/Helpers/inventoryLock.md) para verificar se algum produto está em inventário ativo — rejeita se houver bloqueio
- Para cada item da movimentação, salvar `previous_quantity` e `new_quantity` no banco
- O estoque do produto é atualizado para a nova quantidade informada
- Para cada item, inserir um registro na tabela `product_movimentations` com `type = adjustment` — ver [product_movimentations](../../../Database/product_movimentations.md)
- Nova quantidade não pode ser negativa — exibir erro de validação
- O `average_cost` (preço médio) **não** é recalculado em ajustes — apenas em entradas de estoque
- Ajuste finalizado não pode ser editado — apenas visualizado
- **Validação (Zod)**: data obrigatória, motivo obrigatório, pelo menos 1 item, nova quantidade >= 0
- Fluxo: Grid de itens → Revisar Ajuste → Componente de confirmação → Confirmar / Cancelar
