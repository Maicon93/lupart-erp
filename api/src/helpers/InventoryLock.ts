/**
 * Verifica se algum produto está bloqueado por inventário ativo (status = Em Andamento).
 * Se bloqueado, lança erro informando quais produtos estão em inventário ativo.
 * Se liberado, retorna normalmente.
 *
 * Utilizado por:
 * - Entrada de Estoque (tela 110)
 * - Ajuste de Estoque (tela 111)
 * - PDV (tela 114)
 * - Vendas (tela 115)
 * - Ordem de Serviço (tela 118)
 *
 * TODO: Implementar verificação real ao criar a tela 112 (Inventário).
 * Deve consultar a tabela inventory_items filtrando por product_id e inventário com status = 'in_progress'.
 */

const checkInventoryLock = async (_productIds: number[], _companyId: number): Promise<void> => {
    // TODO: Implementar quando a tela de Inventário (112) for criada
    // const blockedProducts = await inventoryItemRepository.findBlockedProducts(productIds, companyId);
    // if (blockedProducts.length > 0) {
    //     throw { status: 400, messageCode: messageCodes.common.errors.PRODUCT_IN_ACTIVE_INVENTORY };
    // }
};

export default checkInventoryLock;
