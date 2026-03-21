## Titulo
- Título: 122 - Movimentações de Caixa
- Permissão: `122_cash_movements`
- Ambiente: Usuário
- Rota: `/cash-movements`

## Objetivo
- Visualizar todas as movimentações financeiras do dia (recebimentos, pagamentos, suprimentos e sangrias) e registrar suprimentos e sangrias avulsos

## Corpo

#### Listagem

```
┌──────────────────────────────────────────────────────────────────────┐
│ 122 - Movimentações de Caixa          [ + Suprimento ] [ + Sangria ] │
├──────────────────────────────────────────────────────────────────────┤
│ Data  [08/03/2026]    Tipo  [Todos                              ▾]   │
├──────────────────────────────────────────────────────────────────────┤
│  Data/Hora          Tipo        Descrição             Valor      Ações│
│ ──────────────────────────────────────────────────────────────────── │
│  08/03/2026 08:10   Recebimento Venda #0042 / João S. +R$300,00      │
│  08/03/2026 08:15   Suprimento  Troco inicial         +R$ 50,00  🗑  │
│  08/03/2026 11:30   Recebimento Venda #0011            +R$150,00      │
│  08/03/2026 14:00   Pagamento   Conta manual #0016     −R$200,00      │
│  08/03/2026 14:30   Sangria     Retirada gerente      −R$100,00  🗑  │
├──────────────────────────────────────────────────────────────────────┤
│  Entradas: +R$ 500,00   Saídas: −R$ 300,00   Saldo: R$ 200,00       │
└──────────────────────────────────────────────────────────────────────┘
```

**Filtros:**

| Campo | Tipo   | Obrigatório | Observação                                                              |
| ----- | ------ | ----------- | ----------------------------------------------------------------------- |
| Data  | date   | Sim         | Padrão: hoje                                                            |
| Tipo  | select | Não         | Recebimento / Suprimento / Pagamento / Sangria. Padrão: Todos           |

**Colunas:**

| Coluna     | Descrição                                                                              |
| ---------- | -------------------------------------------------------------------------------------- |
| Data/Hora  | Data e hora do registro ou da baixa                                                    |
| Tipo       | Recebimento / Suprimento / Pagamento / Sangria                                         |
| Descrição  | Origem do registro (ex: "Venda #0042 / João Silva", "OS #0009") ou descrição livre para suprimento/sangria |
| Valor      | Recebimentos e suprimentos em verde com `+`. Pagamentos e sangrias em vermelho com `−` |
| Ações      | Ícone de lixeira — visível apenas para Suprimento e Sangria                            |

- Ordenado por hora crescente
- **Skeleton** enquanto carrega
- **Rodapé**: total de entradas, total de saídas e saldo do dia

**Fontes por tipo:**

| Tipo        | Fonte                                                                           |
| ----------- | ------------------------------------------------------------------------------- |
| Recebimento | `financial_titles` com `type = inflow`, `status = pago`, `payment_date = data`  |
| Suprimento  | `cash_movements` com `type = suprimento`, `created_at = data`                   |
| Pagamento   | `financial_titles` com `type = outflow`, `status = pago`, `payment_date = data` |
| Sangria     | `cash_movements` com `type = sangria`, `created_at = data`                      |

**Ações:**
- **Suprimento** / **Sangria** — Botões no topo → abrem modal de registro (tipo pré-selecionado)
- **Excluir** (lixeira) — Disponível apenas para Suprimento e Sangria. Exibe confirm dialog. Executa soft delete (`deleted_at`)
- Recebimentos e Pagamentos são somente leitura — gerenciados via tela 119/120

#### Modal de registro (`CashMovementForm`)

```
┌───────────────────────────────────────┐
│  Novo Suprimento                  [x] │
├───────────────────────────────────────┤
│  Valor      [R$ 0,00]                 │
│  Descrição  [                     ]   │
│                                       │
│  [ Cancelar ]         [ Salvar ]      │
└───────────────────────────────────────┘
```

| Campo      | Tipo         | Obrigatório | Observação                           |
| ---------- | ------------ | ----------- | ------------------------------------ |
| Valor      | text (money) | Sim         | Maior que 0                          |
| Descrição  | varchar      | Não         | Motivo ou observação da movimentação |

- Tipo definido pelo botão que abriu o modal (Suprimento ou Sangria)
- `created_by` salvo automaticamente como o usuário logado

## Regras específicas
- Filtrado por `company_id`
- Recebimentos e Pagamentos são somente leitura nesta tela
- Suprimentos e Sangrias aparecem também no Fluxo de Caixa (tela 121)
- **Validação (Zod)**: valor > 0
