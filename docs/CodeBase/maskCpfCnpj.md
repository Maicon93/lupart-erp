# maskCpfCnpj

## Descrição
Máscara dinâmica para campos CPF/CNPJ. Aplica automaticamente o formato correto conforme a quantidade de dígitos informados.

## Comportamento
- Até **11 dígitos** → aplica máscara de **CPF**: `999.999.999-99`
- A partir de **12 dígitos** → aplica máscara de **CNPJ**: `99.999.999/9999-99`
- A troca de máscara acontece em tempo real conforme o usuário digita

## Uso
```vue
<v-text-field v-mask="maskCpfCnpj" />
```

## Onde é utilizado
- [Clientes](../Módulos/Usuário/Cadastros/Clientes.md) — campo CPF/CNPJ
