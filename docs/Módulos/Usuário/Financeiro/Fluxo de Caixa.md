## Titulo
- Título: 121 - Fluxo de Caixa
- Permissão: `121_cash_flow`
- Ambiente: Usuário
- Rota: `/cash-flow`

## Objetivo
- Visualizar entradas e saídas financeiras realizadas por fonte, agrupadas por dia dentro do mês selecionado

## Corpo

#### Relatório

```
┌────────────────────────────────────────────────────────────────────────────┐
│ 121 - Fluxo de Caixa                                                       │
├────────────────────────────────────────────────────────────────────────────┤
│ Mês  [Março / 2026                                                     ▾]  │
├────────────────────────────────────────────────────────────────────────────┤
│  Data      Recebimentos   Suprimentos  Pagamentos    Sangrias    Saldo     │
│ ────────────────────────────────────────────────────────────────────────── │
│  01/03     +R$  500,00    +R$  50,00   −R$  200,00   —          R$ 350,00  │
│  03/03     +R$  800,00    —            −R$  150,00   −R$100,00  R$ 550,00  │
│  05/03     —              —            −R$  300,00   —          R$-300,00  │
├────────────────────────────────────────────────────────────────────────────┤
│  Total     +R$1.300,00    +R$  50,00   −R$  650,00   −R$100,00  R$ 600,00  │
└────────────────────────────────────────────────────────────────────────────┘
```

**Filtro:**

| Campo | Tipo   | Obrigatório | Observação                                                        |
| ----- | ------ | ----------- | ----------------------------------------------------------------- |
| Mês   | select | Sim         | Lista de Março/2026 até o mês atual, crescendo automaticamente    |

- Padrão ao abrir: mês atual
- A seleção cobre do primeiro ao último dia do mês escolhido

**Colunas:**

| Coluna       | Cor    | Sinal | Fonte                                                                              |
| ------------ | ------ | ----- | ---------------------------------------------------------------------------------- |
| Data         | —      | —     | Dia da movimentação                                                                |
| Recebimentos | verde  | `+`   | `financial_titles` com `type = inflow`, `status = pago`, `payment_date = data`    |
| Suprimentos  | verde  | `+`   | `cash_movements` com `type = suprimento`, `created_at = data`                     |
| Pagamentos   | vermelho | `−` | `financial_titles` com `type = outflow`, `status = pago`, `payment_date = data`   |
| Sangrias     | vermelho | `−` | `cash_movements` com `type = sangria`, `created_at = data`                        |
| Saldo        | —      | —     | Recebimentos + Suprimentos − Pagamentos − Sangrias                                 |

- Células sem valor exibem `—` (sem link)
- Saldo negativo exibido em vermelho
- **Rodapé**: soma de cada coluna do mês

**Hiperlinks:**
- **Recebimentos** → `/accounts-receivable?payment_date={data}`
- **Suprimentos** → `/cash-movements?date={data}&type=suprimento`
- **Pagamentos** → `/accounts-payable?payment_date={data}`
- **Sangrias** → `/cash-movements?date={data}&type=sangria`
- Células com `—` não são clicáveis

## Regras específicas
- Fonte de dados: `financial_titles` (`status = pago`) + `cash_movements`, agrupados por data
- Apenas títulos pagos — sem projeção de pendentes ou vencidos
- Filtrado por `company_id`
- **Skeleton** enquanto carrega
