## Titulo
- Título: 115 - Vendas
- Permissão: `115_sales`
- Ambiente: Usuário
- Rota: `/sales`

## Objetivo
- Registrar vendas de produtos e serviços, com controle de itens, valores e parcelamento

## Corpo

#### Listagem de dados (vendas)

| Coluna              | Descrição                            |
| ------------------- | ------------------------------------ |
| Nº Venda            | Código sequencial da venda           |
| Data                | Data da venda                        |
| Cliente             | Nome do cliente                      |
| Valor Final         | Valor após desconto (R$)             |
| Status              | Finalizada / Cancelada               |
| Responsável         | Nome do usuário que realizou a venda |
| Ações               | Detalhes                             |

- **Filtro**: nº venda, cliente, período (data início / data fim)
- **Paginação**: 20, 50, 100 registros
- **Skeleton** enquanto carrega

**Ações:**
- **Nova Venda** — Botão no topo da tela → abre formulário de venda
- **Detalhes** — Abre visualização completa da venda (readonly)

#### Componente de detalhes

Componente separado (`SaleDetails.vue`) — todos os campos readonly

**Cabeçalho:**
- Nº Venda
- Data
- Cliente
- Observação (se informada)
- Status (Finalizada / Cancelada)
- Responsável (nome do usuário)
- **Valor Final** / **Valor Pago** / **Valor Faltante** — exibidos na mesma linha. Valor Pago = soma dos títulos com `status = paid`. Valor Faltante = Valor Final − Valor Pago

**Lista de itens:**

| Coluna            | Descrição                        |
| ----------------- | -------------------------------- |
| Produto           | Nome do produto / serviço        |
| Unidade de Medida | Unidade de medida do produto     |
| Quantidade        | Quantidade vendida               |
| Preço Unitário    | Preço unitário de venda (R$)     |
| Subtotal          | Quantidade × Preço Unitário (R$) |

- **Valor Total** exibido no rodapé (soma dos subtotais)
- **Desconto %** e **Desconto R$** aplicados na venda
- **Valor Final** = Valor Total − Desconto R$

**Rodapé:**
- **Ver Pagamento** — Abre modal com os dados de pagamento da venda. Os dados são carregados sob demanda (requisição feita ao abrir o modal, não no carregamento do componente)
- **Ver Títulos** — Navega para a tela de Contas a Receber (tela 119) com os parâmetros `type=inflow&reference_id={id_da_venda}` na URL, pré-filtrando os títulos da venda
- **Cancelar Venda** — Visível apenas se status = Finalizada. Exibe modal com campo **Motivo** (textarea, obrigatório) e confirmação antes de executar

**Modal de pagamento (`SalePaymentDetails.vue`):**

- Forma de Pagamento: À vista / Parcelado

| Coluna             | Descrição                                                |
| ------------------ | -------------------------------------------------------- |
| Parcela            | Número da parcela (ex: 1/3)                              |
| Tipo de Pagamento  | Tipo de pagamento utilizado na parcela                   |
| Valor              | Valor da parcela (R$)                                    |
| Data de Vencimento | Data de vencimento da parcela                            |
| Status             | Status do título (Pendente / Pago / Vencido / Cancelado) |

#### Componente para criação

Componente separado (`SaleForm.vue`)

**Cabeçalho da venda:**

| Campo      | Tipo         | Obrigatório | Observação                                                           |
| ---------- | ------------ | ----------- | -------------------------------------------------------------------- |
| Cliente    | autocomplete | Sim         | Busca por nome ou CPF/CNPJ (tela 105). Inclui "Consumidor Final" como cliente padrão cadastrado. Botão **Novo Cliente** ao lado para criação rápida (reutiliza o componente de criação da tela 105) |
| Data       | date         | Sim         | Padrão: data atual                                                   |
| Observação | textarea     | Não         |                                                                      |

**Grid de itens (tabela dinâmica):**

| Campo             | Tipo         | Obrigatório | Observação                                                                       |
| ----------------- | ------------ | ----------- | -------------------------------------------------------------------------------- |
| Produto           | autocomplete | Sim         | Busca por nome, código interno ou código de barras                               |
| Unidade de Medida | text         | —           | Preenchido automaticamente pelo produto (readonly)                               |
| Estoque Atual     | text         | —           | Exibido automaticamente ao selecionar o produto (readonly). Não se aplica a Serviço |
| Quantidade        | number       | Sim         | Maior que 0                                                                      |
| Preço Unitário    | text (money) | Sim         | Preenchido com preço de venda do produto (editável)                              |
| Subtotal          | text (money) | —           | Calculado: Quantidade × Preço Unitário (readonly)                                |

- Botão **Adicionar Item** para incluir nova linha no grid
- Botão **Remover** em cada linha para excluir o item
- **Valor Total** exibido no rodapé (soma dos subtotais)
- Botão **Ir para Pagamento** ao final → abre o componente de pagamento
- Ao selecionar um produto no autocomplete, verificar se ele possui inventário ativo. Se sim, exibir modal informativo com a mensagem de que o produto está bloqueado por inventário ativo e botão **Fechar**. O produto **não é inserido** no grid
- Ao digitar a quantidade, validar no frontend: se a configuração `allow_negative_stock` da empresa for `false` e a quantidade informada exceder o Estoque Atual, exibir aviso na linha (não bloqueia o campo, mas impede avançar para pagamento). Não se aplica a Serviço

#### Componente de pagamento

Componente separado (`SalePayment.vue`)

Exibe o **Valor Total da venda** no topo para referência.

**Desconto na venda:**

| Campo       | Tipo         | Obrigatório | Observação                                                                            |
| ----------- | ------------ | ----------- | ------------------------------------------------------------------------------------- |
| Desconto %  | number (%)   | Não         | Desconto percentual (0–100). Ao alterar, calcula Desconto R$ automaticamente          |
| Desconto R$ | text (money) | Não         | Desconto em valor sobre o Valor Total. Ao alterar, calcula Desconto % automaticamente |

**Desconto bidirecional:**
- Ao preencher **Desconto %**, o sistema calcula: Desconto R$ = Valor Total × (Desconto % / 100)
- Ao preencher **Desconto R\$**, o sistema calcula: Desconto % = (Desconto R$ / Valor Total) × 100
- Apenas o campo editado pelo usuário dispara o cálculo (evita loop infinito)
- Ambos os valores são arredondados para 2 casas decimais
- **Valor Final** = Valor Total − Desconto R$ (exibido abaixo do desconto)

**Forma de pagamento:**

| Campo              | Tipo  | Obrigatório | Observação          |
| ------------------ | ----- | ----------- | ------------------- |
| Forma de Pagamento | radio | Sim         | À vista / Parcelado |

**Grid de parcelas:**

O grid **não é exibido** até o usuário selecionar a forma de pagamento. Após a seleção:
- **À vista**: gera 1 parcela automaticamente. Não permite adicionar mais parcelas
- **Parcelado**: inicia com 1 parcela. Botão **Adicionar Parcela** (pequeno, abaixo do grid) permite incluir novas linhas individualmente

| Campo              | Tipo         | Obrigatório | Observação                                                                              |
| ------------------ | ------------ | ----------- | --------------------------------------------------------------------------------------- |
| Parcela            | text         | —           | Número da parcela (ex: 1/3, 2/3, 3/3) (readonly)                                       |
| Tipo de Pagamento  | select       | Sim         | Lista de tipos de pagamento cadastrados (tela 109)                                      |
| Valor              | text (money) | Sim         | Calculado automaticamente (Valor Final ÷ total de parcelas), editável pelo usuário      |
| Data de Vencimento | date         | Sim         | Usuário deve informar a data de vencimento                                              |
| Ações              | —            | —           | Ícone de lixeira — remove a linha permanentemente                                       |

- Ao adicionar ou remover uma parcela, o Valor Final é redistribuído igualmente entre todas as parcelas (diferença de centavos vai para a última parcela)
- O usuário pode editar o valor de cada parcela manualmente após o cálculo automático
- Ao remover uma parcela, a linha é excluída do grid (não oculta)
- **Ao alterar a forma de pagamento**, o grid é destruído e recriado do zero (sem dados anteriores)

**Rodapé:**
- **Total Parcelas** exibido (soma dos valores das parcelas)
- Indicador visual: **Falta R$ X,XX** se Total Parcelas < Valor Final
- Botão **Voltar** — retorna ao grid de itens para edições
- Botão **Revisar Venda** — visível apenas se Total Parcelas = Valor Final → abre o componente de confirmação

#### Componente de confirmação

Componente separado (`SaleConfirm.vue`)

Exibe um resumo completo da venda para revisão antes de salvar:

**Cabeçalho:**
- Cliente — Data
- Observação (se informada)

**Lista de itens:**

| Coluna            | Descrição                        |
| ----------------- | -------------------------------- |
| Produto           | Nome do produto / serviço        |
| Unidade de Medida | Unidade de medida do produto     |
| Quantidade        | Quantidade informada             |
| Preço Unitário    | Preço unitário de venda (R$)     |
| Subtotal          | Quantidade × Preço Unitário (R$) |

- **Valor Total** exibido no rodapé (soma dos subtotais)
- **Desconto %** e **Desconto R$** aplicados na venda
- **Valor Final** = Valor Total − Desconto R$

**Forma de pagamento e parcelas:**

- Forma de Pagamento: À vista / Parcelado

| Coluna             | Descrição                              |
| ------------------ | -------------------------------------- |
| Parcela            | Número da parcela (ex: 1/3)            |
| Tipo de Pagamento  | Tipo de pagamento utilizado na parcela |
| Valor              | Valor da parcela (R$)                  |
| Data de Vencimento | Data de vencimento da parcela          |

**Ações:**
- **Confirmar** — Salva a venda e todos os itens (com **spinner** enquanto processa)
- **Voltar** — Retorna ao componente de pagamento para edições

## Regras específicas
- A confirmação **não** usa o [Confirm Dialog](../../../CodeBase/Confirm%20Dialog.md) genérico — usa o componente personalizado `SaleConfirm.vue` descrito acima
- Uma venda agrupa múltiplos itens sob um mesmo número
- O campo `created_by` salva o ID do usuário que realizou a venda
- Ao confirmar, todos os itens são salvos de uma vez (transação única)
- Antes de processar, o serviço utiliza o helper [inventoryLock](../../../CodeBase/Helpers/inventoryLock.md) para verificar se algum produto está em inventário ativo — rejeita se houver bloqueio
- Para cada item do tipo **Produto**, o estoque é decrementado com a quantidade vendida
- Itens do tipo **Serviço** não afetam estoque
- Para cada item do tipo **Produto**, inserir um registro na tabela `product_movimentations` com `type = sale` — ver [product_movimentations](../../../Database/product_movimentations.md)
- O preço unitário vem do preço de venda cadastrado no produto, mas pode ser editado manualmente na venda
- **Desconto na venda**: aplicado sobre o Valor Total no componente de pagamento. Dois campos (Desconto % e Desconto R$) com cálculo bidirecional. No banco de dados, salvar ambos os valores (`discount_percentage` e `discount_value`) com 2 casas decimais
- A soma das parcelas deve ser **exatamente igual** ao Valor Final — não é permitido confirmar se houver diferença
- **Forma de pagamento**: salvar na venda o campo `payment_form` com valor `cash` (à vista) ou `installment` (parcelado)
- **Títulos financeiros**: ao confirmar a venda, para cada parcela, gerar um registro na tabela `financial_titles` com `type = inflow`, `origin = sale` e `payment_type_id` do tipo de pagamento selecionado na parcela — ver [financial_titles](../../../Database/financial_titles.md)
- **Validação de estoque**: ao confirmar, o backend verifica o estoque de cada item do tipo Produto. Se a configuração `allow_negative_stock` da empresa for `false` e a quantidade vendida exceder o estoque disponível, a operação é rejeitada com erro de validação. Não se aplica a Serviço
- **Cancelamento**: venda finalizada pode ser cancelada. O modal de cancelamento exige **Motivo** (textarea, obrigatório) antes de confirmar. O cancelamento executa dentro de uma transação única:
  1. **Motivo**: salva o motivo em `sales.cancellation_reason`
  2. **Estoque**: para cada item do tipo Produto, o estoque é incrementado de volta com a quantidade vendida. Um novo registro é inserido na `product_movimentations` com `type = sale_return` e `amount` positivo (revertendo a saída)
  3. **Financeiro**: todos os `financial_titles` vinculados (`reference_id` = id da venda) têm o `status` atualizado para `cancelled`. Nenhum saldo é recalculado
- Venda cancelada não pode ser editada — apenas visualizada
- **Comprovante de venda (PDF)**: após confirmar a venda com sucesso, o sistema gera automaticamente um PDF com o comprovante e exibe no componente [PdfViewer](../../../CodeBase/PdfViewer.md). O PDF contém:
  - Nº da Venda
  - Dados do cliente (nome, CPF/CNPJ)
  - Lista de produtos (nome, quantidade, preço unitário, subtotal)
  - Desconto aplicado (% e R$)
  - Valor Total e Valor Final
  - Forma de pagamento com parcelas (valor e data de vencimento de cada parcela)
  - O PDF é gerado no frontend com os dados já disponíveis em memória, utilizando a lib [Stack#pdfmake](../../../Stack.md)
- **Validação (Zod)**: 
	- data obrigatória
	- pelo menos 1 item
	- quantidade > 0
	- preço unitário > 0
	- desconto entre 0 e 100
	- forma de pagamento obrigatória
	- soma das parcelas = valor final
- Fluxo: Grid de itens → Ir para Pagamento → Componente de pagamento → Revisar Venda → Componente de confirmação → Confirmar → Comprovante PDF / Voltar
