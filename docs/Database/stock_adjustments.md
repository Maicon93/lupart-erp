# stock_adjustments

Cabeçalho dos ajustes de estoque. Cada registro representa um ajuste agrupando múltiplos itens corrigidos.

| Coluna      | Tipo      | Nullable | Descrição                                        |
| ----------- | --------- | -------- | ------------------------------------------------ |
| id          | integer   | Não      | PK (auto-increment)                              |
| company_id  | integer   | Não      | FK → companies (tenant)                          |
| date        | date      | Não      | Data do ajuste                                   |
| reason      | text      | Não      | Justificativa do ajuste                          |
| created_by  | integer   | Não      | FK → users (usuário que registrou o ajuste)      |
| created_at  | timestamp | Não      | Data/hora de criação                             |
| updated_at  | timestamp | Não      | Data/hora da última atualização                  |

**Regras:**
- Filtrada por `company_id` (multi-tenant)
- Ao confirmar, todos os itens são salvos em transação única
- Registro finalizado não pode ser editado
- Antes de processar, o serviço verifica bloqueio de inventário ativo via helper [inventoryLock](../CodeBase/Helpers/inventoryLock.md)
- Ajustes gerados automaticamente pelo Inventário (tela 112) usam motivo: "Ajuste gerado pelo Inventário Nº {numero}"
- Referenciada por `inventories.adjustment_id` quando o ajuste é gerado pelo inventário
- Fonte de dados da tela [Ajuste de Estoque](../Módulos/Usuário/Controle%20de%20Estoque/Ajuste%20de%20Estoque.md) (tela 111)
