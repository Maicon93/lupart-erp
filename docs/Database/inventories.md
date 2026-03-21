# inventories

Cabeçalho dos inventários de estoque. Cada registro representa uma contagem física completa.

| Coluna        | Tipo      | Nullable | Descrição                                                                 |
| ------------- | --------- | -------- | ------------------------------------------------------------------------- |
| id            | integer   | Não      | PK (auto-increment)                                                       |
| company_id    | integer   | Não      | FK → companies (tenant)                                                   |
| scope         | enum      | Não      | all / category (todos os produtos / por categoria)                        |
| category_id   | integer   | Sim      | FK → categories. Preenchido apenas quando scope = category                |
| date          | date      | Não      | Data de criação do inventário                                             |
| observation   | text      | Sim      | Observações adicionais                                                    |
| status        | enum      | Não      | in_progress / finalized                                                   |
| adjustment_id | integer   | Sim      | FK → stock_adjustments. Preenchido após geração do ajuste de divergências |
| created_by    | integer   | Não      | FK → users (usuário que criou o inventário)                               |
| created_at    | timestamp | Não      | Data/hora de criação                                                      |
| updated_at    | timestamp | Não      | Data/hora da última atualização                                           |

**Status:**
- `in_progress` → Em andamento — itens podem ser contados, produtos bloqueados para movimentação
- `finalized` → Finalizado — somente visualização, produtos desbloqueados

**scope:**
- `all` → Todos os produtos da empresa
- `category` → Apenas produtos da categoria especificada em `category_id`

**Regras:**
- Filtrada por `company_id` (multi-tenant)
- Somente 1 inventário com `status = in_progress` por empresa por vez
- Ao criar, gera snapshot dos itens em `inventory_items` com o estoque congelado naquele momento
- Apenas produtos do tipo **Produto** são incluídos (Serviço ignorado)
- Produtos do inventário ficam bloqueados para entrada/saída enquanto `status = in_progress`
- Ao finalizar, todos os itens devem ter `counted_quantity` preenchida (>= 0)
- `adjustment_id` é preenchido ao clicar em **Gerar Ajuste de Estoque** — apenas uma vez por inventário
- Fonte de dados da tela [Inventário](../Módulos/Usuário/Controle%20de%20Estoque/Inventário.md) (tela 112)
