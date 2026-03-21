# Confirm Dialog

Componente global injetado via `provide/inject`. Usado para confirmação de ações destrutivas (excluir, inativar, etc.).

## Injeção no componente
```js
export default {
  inject: ['$confirm'],
}
```

## Assinatura
```js
$confirm(title, message, options?) → Promise<boolean>
```

| Parâmetro | Tipo | Descrição |
| --- | --- | --- |
| `title` | `string` | Título do dialog |
| `message` | `string` | Mensagem de confirmação |
| `options.color` | `string` | Cor do botão de confirmação (ex: `error`, `primary`) |
| `options.confirmText` | `string` | Texto do botão confirmar |
| `options.cancelText` | `string` | Texto do botão cancelar |

## Uso
```js
async confirmDelete(item) {
  const msg = this.$t('confirmDeleteMessage', { name: item.name })
  if (!this.$confirm || !await this.$confirm(this.$t('confirmDeleteTitle'), msg)) {
    return
  }

  try {
    await ItemService.delete(item.id)
    await this.loadItems()
  } catch {
    // toast já exibido pelo interceptor do axios
  }
},
```
