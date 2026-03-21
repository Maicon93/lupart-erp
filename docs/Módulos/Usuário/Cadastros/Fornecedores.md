## Titulo
- Título: 106 - Fornecedores
- Permissão: `106_suppliers`
- Ambiente: Usuário
- Rota: `/suppliers`

## Objetivo
- Cadastro e gerenciamento de fornecedores da empresa

## Corpo

#### Listagem de dados

| Coluna   | Descrição                                 |
| -------- | ----------------------------------------- |
| Nome     | Nome do fornecedor                        |
| CPF/CNPJ | Documento formatado                       |
| Contato  | Telefone principal                        |
| E-mail   | E-mail do fornecedor                      |
| Ações    | Detalhes, Excluir                         |

- **Filtro**: nome, CPF/CNPJ
- **Paginação**: 20, 50, 100 registros
- **Skeleton** enquanto carrega

**Ações**:
- **Novo Fornecedor** — Botão no topo da tela → abre formulário de cadastro
- **Detalhes** — Abre formulário com dados preenchidos para visualização e edição
- **Excluir** — Confirm dialog → soft delete (`deleted_at`). Não permite excluir se houver vínculos ativos (entradas de estoque, títulos financeiros) — exibe mensagem informando o motivo

#### Componente para criação e edição

Componente separado (`SupplierForm.vue`)

| Campo       | Tipo        | Obrigatório | Observação                                    |
| ----------- | ----------- | ----------- | --------------------------------------------- |
| Nome        | text        | Sim         |                                               |
| CPF/CNPJ    | text (mask) | Sim         | Usar [maskCpfCnpj](../../../CodeBase/maskCpfCnpj.md)                 |
| Contato     | text (mask) | Sim         | Usar [maskContact](../../../CodeBase/maskContact.md)                 |
| E-mail      | text        | Não         | Validação de e-mail                           |
| CEP         | text (mask) | Não         | Busca automática de endereço via API (ViaCEP) |
| Endereço    | text        | Não         | Preenchido automaticamente pelo CEP           |
| Número      | text        | Não         |                                               |
| Complemento | text        | Não         |                                               |
| Bairro      | text        | Não         | Preenchido automaticamente pelo CEP           |
| Cidade      | text        | Não         | Preenchido automaticamente pelo CEP           |
| Estado      | text        | Não         | Preenchido automaticamente pelo CEP           |
| Observações | textarea    | Não         | Anotações livres sobre o fornecedor           |

## Regras específicas
- CPF/CNPJ deve ser único dentro do tenant (não permitir duplicata na mesma empresa)
- CEP busca endereço automaticamente via ViaCEP — usuário pode editar os campos retornados
- Exclusão via soft delete (`deleted_at`) — fornecedor não é removido fisicamente
- Não permite excluir se houver vínculos ativos (entradas de estoque, títulos financeiros)
- **Validação (Zod)**: CPF ou CNPJ válido, e-mail válido (se preenchido), contato válido
- Botão "Salvar" com **spinner** enquanto processa
