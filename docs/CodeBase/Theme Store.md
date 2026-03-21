# Theme Store

Store Pinia responsável pelas preferências visuais do usuário.

## Estado

| Campo | Tipo | Padrão | Persiste? | Descrição |
| --- | --- | --- | --- | --- |
| `darkMode` | `boolean` | `false` | Sim | Tema claro/escuro |
| `sidebarOpen` | `boolean` | `true` | Não | Estado da sidebar (aberta/fechada) |

## Persistência

- Usa **pinia-plugin-persistedstate** para salvar automaticamente no `localStorage`
- Apenas `darkMode` é persistido (sobrevive ao F5)
- `sidebarOpen` reseta ao padrão a cada carregamento (aberta no desktop, fechada no mobile)

## Exemplo

```js
import { defineStore } from 'pinia'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    darkMode: false,
    sidebarOpen: true,
  }),

  persist: {
    pick: ['darkMode'],
  },
})
```

## Cores Personalizadas

| Nome      | Descrição                                       |
| --------- | ----------------------------------------------- |
| `success` | Indica valor positivo, acréscimo, confirmação   |
| `danger`  | Indica valor negativo, redução, erro, exclusão  |

- Definidas como **CSS custom properties** no tema (light e dark)
- Usadas em: [Ajuste de Estoque](../Módulos/Usuário/Controle%20de%20Estoque/Ajuste%20de%20Estoque.md) (background do campo Nova Qtd.)

## Consumo em Options API

```js
import { mapState, mapActions } from 'pinia'
import { useThemeStore } from '@/stores/theme'

export default {
  computed: {
    ...mapState(useThemeStore, ['darkMode', 'sidebarOpen']),
  },

  methods: {
    ...mapActions(useThemeStore, ['toggleDarkMode', 'toggleSidebar']),
  },
}
```

- `mapState` → expõe o estado da store como **computed properties** (reativas, read-only)
- `mapActions` → expõe actions da store como **methods** do componente
