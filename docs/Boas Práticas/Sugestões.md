# Sugestões e Correções

## Pendentes

### ~~1. Tela 11, 102 e 127 — referência a "lista de línguas habilitadas"~~ ✅
- Atualizado nas 3 telas para "Opções fixas: pt-BR, en"

### ~~2. Template.md — exemplo com dados conflitantes~~ ✅
- Atualizado para usar "XXX - Nome da Tela" como exemplo genérico

### ~~3. Definições.md e API.md — "não possuem company_id"~~ ✅
- Corrigido em ambos os arquivos — separado em 3 categorias: tenant (NOT NULL), global (sem coluna), híbridas (nullable)

### ~~4. Boas Práticas/API.md — tabela de exclusão omite caso híbrido~~ ✅
- Adicionado nota sobre entidades com workflow que usam ambos (status + deleted_at)
