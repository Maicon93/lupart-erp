# inventoryLock

Helper de validação utilizado na camada de serviço para verificar se algum produto está bloqueado por inventário ativo antes de processar movimentações de estoque.

## Onde é utilizado
- Entrada de Estoque (tela 110) — ao confirmar movimentação
- Ajuste de Estoque (tela 111) — ao confirmar ajuste
- PDV (tela 114) — ao confirmar venda
- Vendas (tela 115) — ao confirmar venda
- Orçamentos (tela 117) — ao adicionar produto no grid
- Ordem de Serviço (tela 118) — ao adicionar produto no grid

## Comportamento
- Recebe um array de `product_id`s a verificar
- Consulta a tabela de itens do inventário filtrando por `product_id` e inventário com status = Em Andamento
- Se **bloqueado**: lança erro informando quais produtos estão em inventário ativo
- Se **liberado**: retorna normalmente, permitindo que o serviço prossiga

## Erro
- Código: `PRODUCT_IN_ACTIVE_INVENTORY`
- Mensagem (i18n): "Os seguintes produtos estão bloqueados por inventário ativo: {produtos}"
