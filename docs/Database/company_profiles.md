# Database

Documentação das tabelas importantes do sistema.

---

## company_profiles

Dados auxiliares da empresa (contato e endereço). Relação 1:1 com `companies`.

| Coluna       | Tipo      | Nullable | Descrição                        |
| ------------ | --------- | -------- | -------------------------------- |
| id           | integer   | Não      | PK (auto-increment)              |
| company_id   | integer   | Não      | FK → companies (unique)          |
| phone        | varchar   | Sim      | Telefone (armazenado com máscara)|
| email        | varchar   | Sim      | E-mail                           |
| zip_code     | varchar   | Sim      | CEP (armazenado com máscara: 00000-000) |
| street       | varchar   | Não      | Logradouro                       |
| number       | varchar   | Não      | Número                           |
| complement   | varchar   | Não      | Complemento                      |
| neighborhood | varchar   | Não      | Bairro                           |
| city         | varchar   | Sim      | Cidade                           |
| state        | varchar   | Sim      | Estado (UF)                      |
| created_at   | timestamp | Não      | Data de criação                  |
| updated_at   | timestamp | Não      | Data da última atualização       |

**Regras:**
- Relação 1:1 com `companies` via `company_id` (unique)
- `street`, `number`, `complement` e `neighborhood` são obrigatórios. Demais campos são opcionais
- Gerenciada pela tela 12 (Empresas) no Painel Administrador
