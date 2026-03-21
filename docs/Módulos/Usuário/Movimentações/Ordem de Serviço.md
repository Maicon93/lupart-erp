## Titulo
- Título: 118 - Ordem de Serviço
- Permissão: `118_service_orders`
- Ambiente: Usuário
- Rota: `/service-orders`

## Objetivo
- Registrar e acompanhar ordens de serviço com controle de itens, tempo de execução e geração de títulos financeiros ao concluir

## Corpo

#### Listagem de ordens de serviço

| Coluna        | Descrição                                     |
| ------------- | --------------------------------------------- |
| Nº OS         | Código sequencial da ordem de serviço         |
| Data Abertura | Data de criação da OS                         |
| Cliente       | Nome do cliente                               |
| Técnico       | Nome do técnico responsável                   |
| Status        | Aberta / Em andamento / Concluída / Cancelada |
| Valor Total   | Soma dos subtotais dos itens (R$)             |
| Ações         | Detalhes, Imprimir                            |

- **Filtro**: nº OS, cliente, técnico, status, período (data início / data fim)
- **Paginação**: 20, 50, 100 registros
- **Skeleton** enquanto carrega

**Ações:**
- **Nova OS** — Botão no topo → abre o formulário de criação
- **Detalhes** — Abre a OS para visualização e gerenciamento
- **Imprimir** — Gera o PDF da OS diretamente da listagem

#### Formulário de criação (`ServiceOrderForm.vue`)

```
┌─────────────────────────────────────────────────────────────────────┐
│ 118 - Nova Ordem de Serviço                                         │
├─────────────────────────────────────────────────────────────────────┤
│ Cliente     [Buscar por nome ou CPF/CNPJ                        ▾]  │
│ Técnico     [Buscar técnico responsável                         ▾]  │
│ Observação  [                                                    ]  │
├─────────────────────────────────────────────────────────────────────┤
│ [+ Adicionar Item]                                                  │
│  Produto/Serviço      Qtd    Preço Unit.   Subtotal   Ações         │
│ ─────────────────────────────────────────────────────────────────── │
│  [Buscar produto  ▾]  [1]    [R$ 0,00]     R$ 0,00    🗑            │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  Total: R$ 0,00                                    [ Abrir OS ]     │
└─────────────────────────────────────────────────────────────────────┘
```

| Campo      | Tipo         | Obrigatório | Observação                                              |
| ---------- | ------------ | ----------- | ------------------------------------------------------- |
| Cliente    | autocomplete | Sim         | Busca por nome ou CPF/CNPJ (tela 105)                   |
| Técnico    | autocomplete | Sim         | Busca por nome entre os usuários da empresa             |
| Observação | textarea     | Não         | Descrição do problema, equipamento etc.                 |

**Grid de itens:**

| Campo          | Tipo         | Obrigatório | Observação                                                  |
| -------------- | ------------ | ----------- | ----------------------------------------------------------- |
| Produto        | autocomplete | Sim         | Busca por nome, código interno ou código de barras          |
| Quantidade     | number       | Sim         | Maior que 0                                                 |
| Preço Unitário | text (money) | Sim         | Preenchido com preço de venda do produto (editável)         |
| Subtotal       | text (money) | —           | Calculado: Quantidade × Preço Unitário (readonly)           |

- Botão **Adicionar Item** para incluir nova linha
- Ícone de lixeira em cada linha para remover o item
- Ao adicionar item do tipo **Produto**: estoque decrementado imediatamente
- Ao remover item do tipo **Produto**: estoque revertido imediatamente
- Ao selecionar produto com inventário ativo: exibe toast de erro e não insere no grid
- **Valor Total** no rodapé (soma dos subtotais)
- Botão **Abrir OS** — cria a OS com status `aberta`. Pode ser salvo sem itens

#### Componente de detalhes (`ServiceOrderDetails.vue`)

```
┌─────────────────────────────────────────────────────────────────────┐
│ 118 - Ordem de Serviço Nº 0042                                 [🖨] │
├─────────────────────────────────────────────────────────────────────┤
│ Status:   [Em andamento                                         ▾]  │
│ Cliente:  João Silva          Técnico: [Maria Oliveira          ▾]  │
│ Abertura: 08/03/2026                                                │
│ Início:   [08/03/2026]        Fim:     [--/--/----]                 │
│ Observação: Troca de tela do notebook                               │
├─────────────────────────────────────────────────────────────────────┤
│ [+ Adicionar Item]                                                  │
│  Produto/Serviço       Qtd    Preço Unit.  Subtotal   Ações         │
│ ─────────────────────────────────────────────────────────────────── │
│  Tela 15" Samsung      [1]    [R$250,00]   R$250,00   🗑            │
│  Mão de obra           [1]    [R$100,00]   R$100,00   🗑            │
│                                                                     │
├─────────────────────────────────────────────────────────────────────┤
│  Total: R$ 350,00                                                   │
└─────────────────────────────────────────────────────────────────────┘
```

**Campos editáveis:**

| Campo       | Editável quando              | Observação                                           |
| ----------- | ---------------------------- | ---------------------------------------------------- |
| Status      | Sempre (exceto concluída/cancelada) | Select com transições válidas                |
| Técnico     | status != concluída/cancelada| Autocomplete de usuários da empresa. Atualmente 1 técnico por OS — modelo suporta múltiplos via `service_order_technicians` |
| date_started| status != concluída/cancelada| Auto-preenchida ao mudar para `em andamento`, editável|
| date_finished| status != cancelada         | Auto-preenchida ao mudar para `concluída`, editável  |
| Itens       | status != concluída/cancelada| Adicionar/remover itens                              |

**Transições de status:**

| De            | Para          | Comportamento                                                              |
| ------------- | ------------- | -------------------------------------------------------------------------- |
| aberta        | em andamento  | Preenche `date_started` com data/hora atual (editável). Salva imediatamente |
| aberta        | cancelada     | Modal com **Motivo** (textarea, obrigatório) → confirm dialog → reverte estoque dos itens Produto |
| em andamento  | concluída     | Preenche `date_finished` com data/hora atual (editável) → abre componente de pagamento |
| em andamento  | cancelada     | Modal com **Motivo** (textarea, obrigatório) → confirm dialog → reverte estoque dos itens Produto |
| concluída     | —             | Somente leitura. Nenhuma transição permitida                               |
| cancelada     | —             | Somente leitura. Nenhuma transição permitida                               |

- Ícone **🖨 Imprimir** disponível em qualquer status → gera PDF da OS

#### Componente de pagamento (`ServiceOrderPayment.vue`)

Aberto automaticamente ao selecionar status `concluída`.

```
┌──────────────────────────────────────────┐
│  Pagamento — OS Nº 0042                  │
├──────────────────────────────────────────┤
│  Valor Total: R$ 350,00                  │
│                                          │
│  Desconto %  [    ]   Desconto R$ [    ] │
│  Valor Final: R$ 350,00                  │
│                                          │
│  Pagamento  (●) À vista  ( ) Parcelado   │
│                                          │
│  Parcela  Tipo Pagamento  Valor  Vencto  │
│  ──────────────────────────────────────  │
│  1/1    [Dinheiro    ▾]  [R$350] [data]  │
│                                          │
│  Total parcelas: R$ 350,00               │
│                                          │
│         [ Confirmar Conclusão ]          │
└──────────────────────────────────────────┘
```

- Idêntico ao componente de pagamento da tela 115
- **Desconto bidirecional** (% ↔ R$)
- **Valor Final** = Valor Total − Desconto R$
- **Grid de parcelas**: À vista (1 parcela) ou Parcelado (N parcelas)
- **Total Parcelas** no rodapé + indicador **Falta R$ X,XX**
- Botão **Confirmar Conclusão** — visível apenas se Total Parcelas = Valor Final
  - Salva desconto e forma de pagamento na OS
  - Gera `financial_titles` para cada parcela
  - Status da OS é salvo como `concluída`
  - Fecha o componente e exibe PDF da OS

#### PDF da OS

Gerado no frontend com pdfmake. Disponível via ícone 🖨 em qualquer status.

Conteúdo:
- Nome e logo da empresa
- Nº da OS + data de abertura
- Dados do cliente (nome, CPF/CNPJ)
- Técnico responsável
- Status atual
- Data de início e data de conclusão (se preenchidas)
- Observação (se informada)
- Lista de itens: produto/serviço, quantidade, preço unitário, subtotal
- Valor Total
- Desconto % e R$ (se concluída)
- Valor Final (se concluída)
- Forma de pagamento e parcelas (se concluída)

## Regras específicas
- Ao adicionar item do tipo **Produto**: se `allow_negative_stock = false` e a quantidade exceder o estoque disponível, a API rejeita a adição. Caso contrário, estoque decrementado imediatamente via `product_movimentations` com `type = service_order`
- Ao remover item do tipo **Produto**: estoque revertido imediatamente (novo registro em `product_movimentations` com `type = service_order` e `amount` positivo)
- Itens do tipo **Serviço** não afetam estoque
- Ao selecionar produto com inventário ativo: exibe toast de erro e não insere no grid (helper [inventoryLock](../../../CodeBase/Helpers/inventoryLock.md))
- **Cancelamento**: exige **Motivo** obrigatório, salvo em `service_orders.cancellation_reason`. Para cada item do tipo Produto, o estoque é revertido (novo registro em `product_movimentations`). Se já havia sido concluída e houvesse títulos gerados, todos os `financial_titles` vinculados são marcados como `cancelled`
- **Títulos financeiros**: gerados ao confirmar conclusão. `type = inflow`, `origin = service_order`, `reference_id = id da OS`
- `date_started`: preenchida automaticamente ao mudar para `em andamento`. Editável pelo usuário
- `date_finished`: preenchida automaticamente ao mudar para `concluída`. Editável pelo usuário
- `created_by`: ID do usuário que abriu a OS
- **Validação (Zod)**:
  - Cliente obrigatório
  - Técnico obrigatório
  - Quantidade > 0
  - Preço unitário > 0
  - Desconto entre 0 e 100
  - Soma das parcelas = Valor Final (na conclusão)
- Fluxo: Formulário → Abrir OS → Detalhes (gerenciamento) → Concluída → Pagamento → Confirmar Conclusão → PDF
