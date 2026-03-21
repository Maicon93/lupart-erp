# cash_movements

Movimentações avulsas de caixa. Registra suprimentos (entradas físicas) e sangrias (retiradas físicas) que não são títulos financeiros.

| Coluna      | Tipo      | Nullable | Descrição                                  |
| ----------- | --------- | -------- | ------------------------------------------ |
| id          | integer   | Não      | PK (auto-increment)                        |
| company_id  | integer   | Não      | FK → companies                             |
| type        | varchar   | Não      | `suprimento` / `sangria`                   |
| value       | decimal   | Não      | Valor da movimentação (sempre positivo)    |
| description | varchar   | Sim      | Descrição ou motivo da movimentação        |
| created_by  | integer   | Não      | FK → users                                 |
| created_at  | timestamp | Não      | Data/hora da movimentação                  |
| deleted_at  | timestamp | Sim      | Soft delete. Null = ativo                  |

**type:**
- `suprimento` — entrada de dinheiro no caixa (ex: troco inicial, reforço de caixa)
- `sangria` — retirada de dinheiro do caixa (ex: pagamento em espécie, retirada)

**Regras:**
- Filtrado por `company_id`
- Registros com `deleted_at` preenchido são ignorados em todas as consultas
- Usado pelo Fluxo de Caixa (tela 121): suprimentos somam às Entradas, sangrias somam às Saídas do dia
