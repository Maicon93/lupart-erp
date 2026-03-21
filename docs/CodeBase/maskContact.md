# maskContact

## Descrição
Máscara dinâmica para campos de telefone. Aplica automaticamente o formato correto conforme a quantidade de dígitos informados.

## Comportamento
- Até **10 dígitos** → aplica máscara de **telefone fixo**: `(99) 9999-9999`
- A partir de **11 dígitos** → aplica máscara de **celular**: `(99) 99999-9999`
- A troca de máscara acontece em tempo real conforme o usuário digita

## Uso
```vue
<v-text-field v-mask="maskContact" />
```

## Onde é utilizado
- [Clientes](../Módulos/Usuário/Cadastros/Clientes.md) — campo Telefone
