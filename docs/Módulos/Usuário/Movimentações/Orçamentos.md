## Titulo
- Título: 117 - Orçamentos
- Permissão: `117_quotes`
- Ambiente: Usuário
- Rota: `/quotes`

## Objetivo
- Registrar propostas comerciais com itens e condições financeiras, permitindo conversão em venda após aprovação do cliente

## Corpo

#### Listagem de orçamentos

| Coluna       | Descrição                              |
| ------------ | -------------------------------------- |
| Nº Orçamento | Código sequencial do orçamento         |
| Data         | Data de emissão                        |
| Validade     | Data limite da proposta                |
| Cliente      | Nome do cliente                        |
| Valor Final  | Valor após desconto (R$)               |
| Status       | Emitido / Recusado / Convertido        |
| Responsável  | Nome do usuário que criou o orçamento  |
| Ações        | Detalhes                               |

- **Filtro**: nº orçamento, cliente, período (data início / data fim), status
- **Paginação**: 20, 50, 100 registros
- **Skeleton** enquanto carrega

**Ações:**
- **Novo Orçamento** — Botão no topo → abre o formulário
- **Detalhes** — Abre visualização completa (readonly)

#### Componente de detalhes (`QuoteDetails.vue`)

Todos os campos readonly.

**Cabeçalho:**
- Nº Orçamento
- Data
- Validade
- Cliente
- Observação (se informada)
- Status
- Responsável

**Lista de itens:**

| Coluna         | Descrição                        |
| -------------- | -------------------------------- |
| Produto        | Nome do produto / serviço        |
| Quantidade     | Quantidade informada             |
| Preço Unitário | Preço unitário (R$)              |
| Subtotal       | Quantidade × Preço Unitário (R$) |

- **Valor Total** exibido no rodapé (soma dos subtotais)
- **Desconto %** e **Desconto R$**
- **Valor Final** = Valor Total − Desconto R$
- **Tipo de Pagamento** (se informado)

**Ações conforme status:**

| Status    | Ações disponíveis                         |
| --------- | ----------------------------------------- |
| Emitido   | Editar, Excluir, Recusar, Converter em Venda, PDF  |
| Recusado  | PDF                                       |
| Convertido| PDF                                       |

- **Excluir** — Exibe confirm dialog antes de executar. Soft delete (`deleted_at`). Disponível apenas para status `emitido`
- **Recusar** — Exibe confirm dialog antes de executar. Atualiza status para `recusado`
- **Converter em Venda** — Abre `SaleForm.vue` com dados pré-preenchidos (itens, cliente, desconto, tipo de pagamento se informado). Ao confirmar a venda, o orçamento muda para `convertido`

#### Componente de formulário (`QuoteForm.vue`)

Disponível para criação e edição (somente status = emitido).

```
┌─────────────────────────────────────────────────────────────────────┐
│ 117 - Orçamentos                                                     │
├─────────────────────────────────────────────────────────────────────┤
│ Cliente   [Consumidor Final                                      ▾]  │
│ Validade  [dd/mm/aaaa]                                              │
│ Observação [                                                     ]   │
├─────────────────────────────────────────────────────────────────────┤
│ [+ Adicionar Item]                                                   │
│  Produto              Qtd      Preço Unit.   Subtotal   Ações       │
│ ─────────────────────────────────────────────────────────────────── │
│  [Buscar produto  ▾]  [1]      [R$ 0,00]     R$ 0,00    🗑          │
│  [Buscar produto  ▾]  [2]      [R$ 0,00]     R$ 0,00    🗑          │
│                                                                      │
├─────────────────────────────────────────────────────────────────────┤
│  Total: R$ 0,00                          [ Ir para Pagamento ]      │
└─────────────────────────────────────────────────────────────────────┘
```

**Cabeçalho:**

| Campo      | Tipo         | Obrigatório | Observação                                                          |
| ---------- | ------------ | ----------- | ------------------------------------------------------------------- |
| Cliente    | autocomplete | Sim         | Busca por nome ou CPF/CNPJ. Padrão: Consumidor Final (pré-selecionado) |
| Validade   | date         | Sim         | Data limite da proposta                                             |
| Observação | textarea     | Não         |                                                                     |

**Grid de itens:**

| Campo          | Tipo         | Obrigatório | Observação                                                     |
| -------------- | ------------ | ----------- | -------------------------------------------------------------- |
| Produto        | autocomplete | Sim         | Busca por nome, código interno ou código de barras             |
| Quantidade     | number       | Sim         | Maior que 0                                                    |
| Preço Unitário | text (money) | Sim         | Preenchido com preço de venda do produto (editável)            |
| Subtotal       | text (money) | —           | Calculado: Quantidade × Preço Unitário (readonly)              |

- Botão **Adicionar Item** para incluir nova linha
- Ícone de lixeira em cada linha para remover o item
- **Valor Total** no rodapé (soma dos subtotais)
- Ao selecionar produto com inventário ativo: exibe toast de erro e não insere no grid (helper [inventoryLock](../../../CodeBase/Helpers/inventoryLock.md))
- Botão **Ir para Pagamento** no rodapé → abre o componente de condições financeiras. Desabilitado se grid estiver vazio

#### Componente de condições financeiras (`QuotePayment.vue`)

```
┌──────────────────────────────────────────┐
│  Condições Financeiras                   │
├──────────────────────────────────────────┤
│  Valor Total: R$ 70,00                   │
│                                          │
│  Desconto %  [      ]  Desconto R$ [   ] │
│  Valor Final: R$ 70,00                   │
│                                          │
│  Tipo de Pagamento                       │
│  [Selecionar (opcional)              ▾]  │
│                                          │
│  [ Voltar ]       [ Confirmar Orçamento ]│
└──────────────────────────────────────────┘
```

| Campo              | Tipo         | Obrigatório | Observação                                                                |
| ------------------ | ------------ | ----------- | ------------------------------------------------------------------------- |
| Desconto %         | number (%)   | Não         | Ao alterar, calcula Desconto R$ automaticamente                           |
| Desconto R$        | text (money) | Não         | Ao alterar, calcula Desconto % automaticamente                            |
| Tipo de Pagamento  | select       | Não         | Lista de tipos de pagamento cadastrados (tela 109)                        |

- **Desconto bidirecional** idêntico ao da tela 115
- **Valor Final** = Valor Total − Desconto R$ (exibido abaixo do desconto)
- **Voltar** — retorna ao grid de itens
- **Confirmar Orçamento** — salva o orçamento com status `emitido` e gera o PDF

#### PDF de orçamento

Gerado no frontend com pdfmake após confirmação. Exibido no [PdfViewer](../../../CodeBase/PdfViewer.md).

Conteúdo:
- Nome e logo da empresa
- Nº do orçamento + data de emissão + validade
- Dados do cliente (nome, CPF/CNPJ)
- Lista de itens: produto, quantidade, preço unitário, subtotal
- Desconto aplicado (% e R$)
- Valor Total e Valor Final
- Tipo de Pagamento (se informado)
- Observação (se informada)

## Regras específicas
- Orçamento não afeta estoque
- Orçamento não gera títulos financeiros
- Ao selecionar produto com inventário ativo, exibe toast de erro e não insere no grid (helper [inventoryLock](../../../CodeBase/Helpers/inventoryLock.md))
- Editável apenas quando status = `emitido`
- **Recusar**: altera status para `recusado`. Exibe confirm dialog antes de executar
- **Converter em Venda**: abre `SaleForm.vue` com itens, cliente, desconto e tipo de pagamento pré-preenchidos. O usuário pode editar livremente antes de confirmar. Ao confirmar a venda com sucesso, o status do orçamento é atualizado para `convertido` e o campo `sale_id` é preenchido
- O campo `created_by` salva o ID do usuário que criou o orçamento
- **Validação (Zod)**:
  - Validade obrigatória
  - Pelo menos 1 item no grid
  - Quantidade > 0
  - Preço unitário > 0
  - Desconto entre 0 e 100
- Fluxo: Grid de itens → Ir para Pagamento → Condições financeiras → Confirmar → PDF
