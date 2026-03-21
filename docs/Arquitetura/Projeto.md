# Estrutura do Projeto (Monorepo)

```
lupart/
├── front/                        # [[Arquitetura/Frontend|Arquitetura Frontend]]
├── api/                          # [[Arquitetura/API|Arquitetura API]]
├── .claude/
│   ├── rules/
│   ├── skills/
│   └── CLAUDE.md
├── .gitignore
├── .env.example
└── README.md
```

## Observações

- Cada pasta (`front/` e `api/`) tem seu próprio `package.json` e gerencia suas dependências de forma independente
- Detalhes de cada parte estão nos documentos específicos: [Frontend](Frontend.md) e [API](API.md)
