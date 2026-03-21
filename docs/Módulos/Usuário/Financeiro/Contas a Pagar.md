## Titulo
- Título: 120 - Contas a Pagar
- Permissão: `120_accounts_payable`
- Ambiente: Usuário
- Rota: `/accounts-payable`

## Objetivo
- Visualizar e gerenciar títulos financeiros de saída (outflow), registrar baixas e criar títulos manuais

## Corpo

#### Listagem de títulos

```
┌─────────────────────────────────────────────────────────────────────┐
│ 120 - Contas a Pagar                          [ + Nova Conta ]      │
├───────────────┬─────────────┬──────────────┬──────────┬────────────-┤
│ Fornec. [   ] │ Origem [ ▾] │ Status  [ ▾] │ De [   ] │ Até [     ] │
├───────────────┴─────────────┴──────────────┴──────────┴─────────────┤
│  Nº    Fornecedor     Origem        Valor     Vencimento  Status  Ações│
│ ────────────────────────────────────────────────────────────────────  │
│  0018  Dist. Silva    Manual        R$500,00  15/03/2026  Pendente  ⋮ │
│  0017  Tech Ltda      OS            R$200,00  05/03/2026  Vencido   ⋮ │
│  0016  —              Manual        R$ 90,00  01/04/2026  Pendente  ⋮ │
│  0015  Dist. Silva    Manual        R$350,00  20/02/2026  Pago      ⋮ │
└─────────────────────────────────────────────────────────────────────┘
```

| Coluna     | Descrição                                          |
| ---------- | -------------------------------------------------- |
| Nº         | ID do título                                       |
| Fornecedor | Nome do fornecedor vinculado (se houver)            |
| Origem     | OS / Manual                                        |
| Valor      | Valor do título (R$)                               |
| Vencimento | Data de vencimento                                 |
| Status     | Pendente / Vencido / Pago / Cancelado              |
| Ações      | Detalhes, Dar Baixa (se pendente/vencido)          |

- **Filtros**: fornecedor, origem, status, período (vencimento de/até)
- **Paginação**: 20, 50, 100 registros
- **Skeleton** enquanto carrega
- A tela aceita parâmetros de query string para pré-filtragem: `?reference_id={id}` (ex: ao navegar da tela 118) e `?payment_date={data}` (ex: ao navegar do Fluxo de Caixa)
- "Vencido" = `status = pendente AND due_date < hoje` (calculado na exibição)
- Linha com status Vencido exibida com destaque visual (ex: texto vermelho)

**Ações:**
- **Nova Conta** — Botão no topo → abre modal de criação manual
- **Detalhes** — Abre modal com dados completos e histórico
- **Dar Baixa** — Visível apenas para status Pendente ou Vencido → abre modal de baixa

#### Modal de criação manual (`AccountPayableForm`)

```
┌───────────────────────────────────────┐
│  Nova Conta a Pagar               [x] │
├───────────────────────────────────────┤
│  Fornecedor [Buscar fornecedor    ▾]  │
│  Valor      [R$ 0,00]                 │
│  Vencimento [dd/mm/aaaa]              │
│  Observação [                     ]   │
│                                       │
│  [ Cancelar ]         [ Salvar ]      │
└───────────────────────────────────────┘
```

| Campo      | Tipo         | Obrigatório | Observação                                 |
| ---------- | ------------ | ----------- | ------------------------------------------ |
| Fornecedor | autocomplete | Não         | Busca por nome. Opcional para contas avulsas |
| Valor      | text (money) | Sim         | Maior que 0                                |
| Vencimento | date         | Sim         |                                            |
| Observação | varchar      | Não         |                                            |

- Criado com `origin = manual`, `status = pendente`

#### Modal de detalhes (`AccountPayableDetails`)

```
┌──────────────────────────────────────────────┐
│  Título Nº 0018                          [x] │
├──────────────────────────────────────────────┤
│  Fornecedor: Dist. Silva                     │
│  Origem:     Manual                          │
│  Valor:      R$ 500,00                       │
│  Vencimento: 15/03/2026                      │
│  Status:     Pendente                        │
│  Observação: —                               │
├──────────────────────────────────────────────┤
│  Histórico                                   │
│  ────────────────────────────────────────    │
│  08/03/2026 - Título gerado (Entrada #0009)  │
└──────────────────────────────────────────────┘
```

- Todos os campos readonly
- **Origem** exibida como link quando vinculada (ex: "OS #0009" → navega para detalhes da OS)
- **Histórico**: registros de `activity_logs` com `entity_type = financial_title` e `entity_id = id do título`, ordenados por `created_at` desc
- Ação **Editar** — visível apenas se `origin = manual` e `status = pendente`. Abre modal de edição (mesmos campos da criação manual)
- Ação **Excluir** — visível apenas se `origin = manual`. Exibe confirm dialog. Executa soft delete (`deleted_at`)
- Ação **Dar Baixa** — visível se status = pendente/vencido
- Títulos com `origin != manual` não exibem ações de edição ou exclusão — somente leitura. A origem é exibida como link para gerenciar via entidade de origem

#### Modal de baixa (`AccountPayablePay`)

```
┌───────────────────────────────────────┐
│  Dar Baixa — Título Nº 0018       [x] │
├───────────────────────────────────────┤
│  Valor do Título: R$ 500,00           │
│                                       │
│  Valor Pago    [R$ 500,00]            │
│  Tipo Pagto    [Dinheiro          ▾]  │
│  Data Pagto    [08/03/2026]           │
│                                       │
│  [ Cancelar ]       [ Confirmar ]     │
└───────────────────────────────────────┘
```

| Campo          | Tipo         | Obrigatório | Observação                                                        |
| -------------- | ------------ | ----------- | ----------------------------------------------------------------- |
| Valor Pago     | text (money) | Sim         | Padrão: valor total do título. Pode ser menor (pagamento parcial) |
| Tipo Pagamento | select       | Sim         | Lista de tipos de pagamento (tela 109). Pré-preenchido com o tipo do título (editável) |
| Data Pagamento | date         | Sim         | Padrão: data atual                                                |

**Comportamento ao confirmar:**

- **Pagamento total** (Valor Pago = Valor do Título):
  - Título: `status = pago`, `payment_date` e `payment_type_id` preenchidos
  - Log em `activity_logs`: `action = payment`, `data = { amount, payment_type_id }`

- **Pagamento parcial** (Valor Pago < Valor do Título):
  - Título original: `value` atualizado para o valor pago, `status = pago`, `payment_date` e `payment_type_id` preenchidos
  - Novo título clonado: `value` = valor remanescente, `status = pendente`, `parent_id` = id do original, demais campos herdados (fornecedor, origem, vencimento, etc.)
  - Log em `activity_logs`: `action = payment`, `data = { amount, payment_type_id, remaining }`

## Regras específicas
- Exibe apenas títulos com `type = outflow` da empresa ativa
- Títulos com `origin != manual` são somente leitura nesta tela — edição e exclusão somente via entidade de origem
- **Validação (Zod)**:
  - Valor pago > 0
  - Valor pago ≤ valor do título
  - Tipo de pagamento obrigatório
  - Data de pagamento obrigatória
