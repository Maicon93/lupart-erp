# stock_entries

Cabeçalho das entradas de estoque. Cada registro representa uma movimentação de entrada agrupando múltiplos itens.

| Coluna         | Tipo      | Nullable | Descrição                                        |
| -------------- | --------- | -------- | ------------------------------------------------ |
| id             | integer   | Não      | PK (auto-increment)                              |
| company_id     | integer   | Não      | FK → companies (tenant)                          |
| supplier_id    | integer   | Sim      | FK → suppliers (fornecedor vinculado, opcional)  |
| invoice_number | varchar   | Sim      | Número da nota fiscal                            |
| date           | date      | Não      | Data da movimentação                             |
| observation    | text      | Sim      | Observações adicionais                           |
| total_value    | decimal   | Sim      | Soma dos subtotais dos itens (R$). Null quando nenhum item possui unit_price |
| created_by     | integer   | Não      | FK → users (usuário que registrou a entrada)     |
| created_at     | timestamp | Não      | Data/hora de criação                             |
| updated_at     | timestamp | Não      | Data/hora da última atualização                  |

**Regras:**
- Filtrada por `company_id` (multi-tenant)
- Ao confirmar, todos os itens são salvos em transação única
- Registro finalizado não pode ser editado
- Antes de processar, o serviço verifica bloqueio de inventário ativo via helper [inventoryLock](../CodeBase/Helpers/inventoryLock.md)
- Fonte de dados da tela [Entrada de Estoque](../Módulos/Usuário/Controle%20de%20Estoque/Entrada%20de%20Estoque.md) (tela 110)
