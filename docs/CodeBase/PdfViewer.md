# PdfViewer

Componente reutilizável para exibição e impressão de PDFs gerados no frontend.

## Componente

`PdfViewer.vue`

## Props

| Prop       | Tipo   | Obrigatório | Descrição                                          |
| ---------- | ------ | ----------- | -------------------------------------------------- |
| pdfContent | object | Sim         | Definição do documento no formato do pdfmake        |
| title      | string | Não         | Título exibido no cabeçalho do componente           |

## Comportamento

- Recebe a definição do documento (pdfmake document definition) via prop
- Gera o PDF em memória utilizando a lib `pdfmake`
- Exibe o PDF renderizado em um iframe/embed dentro do componente
- Botão **Imprimir** — abre a janela de impressão do navegador
- Botão **Download** — faz download do arquivo PDF
- Botão **Fechar** — fecha o componente

## Uso

O componente é genérico e pode ser reutilizado em qualquer tela que precise gerar e exibir um PDF. A tela que utiliza é responsável por montar o `pdfContent` com os dados necessários.

**Exemplo de uso:**
- Comprovante de venda (tela 115)
