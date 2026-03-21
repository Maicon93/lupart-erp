## Titulo
- Título: 125 - Configurações da Empresa
- Permissão: `125_settings`
- Ambiente: Usuário
- Rota: `/settings`

## Objetivo
- Configurar preferências da empresa no sistema

## Corpo

```
┌──────────────────────────────────────────────────────┐
│ 125 - Configurações                                   │
├──────────────────────────────────────────────────────┤
│                                                       │
│  Marca                                                │
│ ┌──────────────────────────────────────────────┐      │
│ │  Logo da Empresa                             │      │
│ │  ┌────────┐                                  │      │
│ │  │        │  [ Enviar Logo ]  [ Remover ]    │      │
│ │  │  logo  │                                  │      │
│ │  │        │  Formatos: PNG, JPG. Máx: 2 MB   │      │
│ │  └────────┘                                  │      │
│ └──────────────────────────────────────────────┘      │
│                                                       │
│  Estoque                                              │
│ ┌──────────────────────────────────────────────┐      │
│ │  Permitir estoque negativo        [  toggle] │      │
│ │  Permite realizar vendas e ordens de serviço │      │
│ │  mesmo quando o estoque for insuficiente     │      │
│ │  (telas 114, 115 e 118).                     │      │
│ │                                              │      │
│ │                                              │      │
│ └──────────────────────────────────────────────┘      │
│                                                       │
│                               [ Salvar ]              │
└──────────────────────────────────────────────────────┘
```

#### Seção: Marca

| Campo            | Tipo   | Obrigatório | Observação                                                        |
| ---------------- | ------ | ----------- | ----------------------------------------------------------------- |
| Logo da Empresa  | upload | Não         | Imagem PNG ou JPG, máximo 2 MB. Exibido na navbar e nos PDFs      |

- Preview da imagem atual (se houver)
- Botão **Enviar Logo** — abre seletor de arquivo
- Botão **Remover** — remove o logo atual (visível apenas se houver logo)
- Ao remover, a navbar exibe apenas o nome da empresa (sem imagem)

#### Seção: Estoque

| Campo                                        | Tipo   | Padrão | Descrição                                                                                                                                                               |
| -------------------------------------------- | ------ | ------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Permitir estoque negativo                    | toggle | false  | Permite realizar vendas (telas 114/115) e ordens de serviço (tela 118) mesmo quando o estoque do produto for insuficiente.                                              |

- Cada toggle exibe a descrição abaixo do campo como texto explicativo

## Regras específicas
- Configurações são salvas por empresa (`company_id`)
- Apenas um logo por empresa — o upload substitui o anterior
- O logo é armazenado em S3 (mesmo bucket de imagens de produtos da tela 107)
	- /company/images/logos
- `allow_negative_stock` — consultada pela API ao confirmar vendas (telas 114/115) e OS (tela 118) para decidir se permite ou rejeita a operação quando o estoque for insuficiente
- **Validação**: logo deve ser PNG ou JPG, tamanho máximo 2 MB
- Botão **Salvar** com **spinner** enquanto processa
