## Titulo
- Título: 114 - Venda Direta (PDV)
- Permissão: `114_pdv`
- Ambiente: Usuário
- Rota: `/pdv`

## Objetivo
- Registrar vendas de forma rápida e direta, otimizada para atendimento no balcão com suporte a scanner de código de barras

## Corpo

#### Tela de itens

```
┌─────────────────────────────────────────────────────────────────────┐
│ 114 - Venda Direta (PDV)                                            │
├─────────────────────────────────────────────────────────────────────┤
│ [🔍 Buscar por nome, código de barras, código interno...      ] [+] │
├──────────────────────────────────────────────┬──────────────────────┤
│  Produto              Qtd      Preço   Sub   │                      │
│ ─────────────────────────────────────────── │                      │
│  Produto A           [−][2][+] R$10  R$20 🗑 │   Valor Total        │
│  Produto B           [−][1][+] R$50  R$50 🗑 │   R$ 70,00           │
│  Produto C           [−][3][+] R$ 5  R$15 🗑 │                      │
│                                              │                      │
│                                              │                      │
│                                              │                      │
│                                              │                      │
├──────────────────────────────────────────────┤                      │
│  Total: R$ 70,00                             │ [ Ir para Pagamento ]│
└─────────────────────────────────────────────────────────────────────┘
```

**Campo de busca:**

- Busca por nome, código interno ou código de barras
- Suporte a scanner: entrada rápida de código de barras seguida de Enter adiciona o produto automaticamente ao grid, sem interação manual
- Se o produto buscado já existir no grid, a quantidade é incrementada em 1 (não cria nova linha)
- Se o produto estiver em inventário ativo, exibe toast de erro e não adiciona ao grid

**Grid de itens:**

| Campo          | Tipo         | Observação                                                                 |
| -------------- | ------------ | -------------------------------------------------------------------------- |
| Produto        | text         | Nome do produto (readonly)                                                 |
| Quantidade     | number       | Editável diretamente no grid. Botões [−] e [+] para ajuste rápido         |
| Preço Unitário | text (money) | Preenchido com o preço de venda do produto (editável)                      |
| Subtotal       | text (money) | Quantidade × Preço Unitário (readonly, calculado)                          |
| Ações          | —            | Ícone de lixeira — remove o item do grid                                   |

- **Valor Total** exibido no rodapé do grid (soma dos subtotais)
- Se `allow_negative_stock = false` e a quantidade exceder o estoque atual, exibe aviso na linha (não bloqueia o campo, mas impede avançar para pagamento). Não se aplica a Serviço

**Rodapé da tela:**
- Botão **Ir para Pagamento** → abre o modal de pagamento. Desabilitado se o grid estiver vazio

#### Modal de pagamento (`PdvPaymentModal.vue`)

```
┌─────────────────────────────────────────────────┐
│  Pagamento                                   [x] │
├─────────────────────────────────────────────────┤
│  Valor Total: R$ 70,00                          │
│                                                 │
│  Cliente                                        │
│  [Consumidor Final                          ▾]  │
│                                                 │
│  Desconto %   [      ]   Desconto R$ [        ] │
│  Valor Final: R$ 70,00                          │
│                                                 │
│  Pagamento   (●) À vista   ( ) Parcelado        │
│                                                 │
│  Parcela  Tipo Pagamento    Valor    Vencimento  │
│  ──────────────────────────────────────────────│
│  1/1    [Dinheiro      ▾] [R$70,00] [dd/mm/aa] │
│                                                 │
│  Total parcelas: R$ 70,00                       │
│                                                 │
│             [ Confirmar Venda ]                 │
└─────────────────────────────────────────────────┘
```

Exibe o **Valor Total** no topo para referência.

**Cliente:**

| Campo   | Tipo         | Observação                                                              |
| ------- | ------------ | ----------------------------------------------------------------------- |
| Cliente | autocomplete | Busca por nome ou CPF/CNPJ. Padrão: Consumidor Final (pré-selecionado) |

**Desconto:**

| Campo       | Tipo         | Observação                                                                            |
| ----------- | ------------ | ------------------------------------------------------------------------------------- |
| Desconto %  | number (%)   | Ao alterar, calcula Desconto R$ automaticamente                                       |
| Desconto R$ | text (money) | Ao alterar, calcula Desconto % automaticamente                                        |

- Cálculo bidirecional idêntico ao da tela 115
- **Valor Final** = Valor Total − Desconto R$ (exibido abaixo do desconto)

**Forma de pagamento:**

| Campo              | Tipo  | Observação                          |
| ------------------ | ----- | ----------------------------------- |
| Forma de Pagamento | radio | À vista (padrão) / Parcelado        |

**Grid de parcelas:**

Idêntico ao da tela 115:
- **À vista**: 1 parcela gerada automaticamente
- **Parcelado**: inicia com 1 parcela, botão **Adicionar Parcela** para incluir novas linhas

| Campo              | Tipo         | Observação                                                                         |
| ------------------ | ------------ | ---------------------------------------------------------------------------------- |
| Parcela            | text         | Número da parcela (ex: 1/3) (readonly)                                             |
| Tipo de Pagamento  | select       | Lista de tipos de pagamento cadastrados (tela 109)                                 |
| Valor              | text (money) | Calculado automaticamente (Valor Final ÷ total de parcelas), editável              |
| Data de Vencimento | date         | Usuário deve informar                                                              |
| Ações              | —            | Ícone de lixeira — remove a linha                                                  |

- **Total Parcelas** exibido no rodapé
- Indicador visual **Falta R$ X,XX** se Total Parcelas < Valor Final
- Botão **Confirmar Venda** — visível apenas se Total Parcelas = Valor Final. Não exibe confirm dialog adicional

#### Cupom compacto (PDF)

Gerado no frontend com pdfmake após confirmação bem-sucedida. Exibido no [PdfViewer](../../../CodeBase/PdfViewer.md).

Formato compacto (estilo cupom térmico):

- Nome e logo da empresa
- Nº da venda + data/hora
- Lista de itens: nome, quantidade, preço unitário, subtotal
- Desconto aplicado (% e R$)
- Valor Total e Valor Final
- Forma de pagamento e parcelas (valor e vencimento)

## Regras específicas
- Salva na mesma tabela `sales` da tela 115 — mesmo modelo de dados
- Data da venda (`sales.date`) definida automaticamente como data atual pela API
- Ao confirmar, o serviço utiliza o helper [inventoryLock](../../../CodeBase/Helpers/inventoryLock.md) para verificar produtos em inventário ativo — rejeita se houver bloqueio
- Para cada item do tipo **Produto**, o estoque é decrementado e um registro é inserido em `product_movimentations` com `type = sale`
- Itens do tipo **Serviço** não afetam estoque
- Títulos financeiros gerados automaticamente em `financial_titles` para cada parcela (`type = inflow`, `origin = sale`)
- Ao trocar a forma de pagamento, o grid de parcelas é destruído e recriado do zero
- Ao remover uma parcela, o Valor Final é redistribuído entre as restantes (diferença de centavos vai para a última)
- **Validação (Zod)**:
  - Pelo menos 1 item no grid
  - Quantidade > 0
  - Preço unitário > 0
  - Desconto entre 0 e 100
  - Forma de pagamento obrigatória
  - Soma das parcelas = Valor Final
- Fluxo: Grid de itens → Ir para Pagamento → Modal de pagamento → Confirmar Venda → Cupom PDF
