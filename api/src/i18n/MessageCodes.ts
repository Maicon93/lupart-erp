/**
 * Códigos de mensagem i18n — sincronizados com o frontend.
 * A API envia apenas o código via messageCode, o frontend traduz via i18n.
 *
 * O valor de cada chave é a descrição em português (para documentação).
 * O builder gera automaticamente o caminho como string (ex: 'common.messages.CREATED').
 *
 * Uso: MessageCodes.common.messages.CREATED → 'common.messages.CREATED'
 */

type CodeLeaf = string;
type CodeTree = { [key: string]: CodeTree | CodeLeaf };
type ResolvedTree<T> = { [K in keyof T]: T[K] extends string ? string : ResolvedTree<T[K]> };

const buildMessageCodes = <T extends CodeTree>(tree: T, prefix = ''): ResolvedTree<T> => {
    const result = {} as Record<string, unknown>;

    for (const key of Object.keys(tree)) {
        const value = tree[key];
        const path = prefix ? `${prefix}.${key}` : key;

        if (typeof value === 'string') {
            result[key] = path;
        } else {
            result[key] = buildMessageCodes(value as CodeTree, path);
        }
    }

    return result as ResolvedTree<T>;
};

const messageCodes = buildMessageCodes({
    auth: {
        messages: {
            LOGIN_SUCCESS: 'Login realizado com sucesso',
            LOGOUT_SUCCESS: 'Logout realizado com sucesso',
            TOKEN_REFRESHED: 'Token renovado com sucesso',
        },
        errors: {
            INVALID_CREDENTIALS: 'E-mail ou senha inválidos',
            USER_INACTIVE: 'Usuário inativo no sistema',
            USER_NO_COMPANY: 'Usuário sem empresa vinculada',
            INVALID_REFRESH_TOKEN: 'Refresh token inválido ou expirado',
        },
    },
    accessPlans: {
        errors: {
            HAS_LINKED_COMPANIES: 'Não é possível excluir este plano pois existem empresas vinculadas',
        },
    },
    companies: {
        errors: {
            CNPJ_ALREADY_EXISTS: 'CNPJ já cadastrado no sistema',
            HAS_ACTIVE_BRANCHES: 'Não é possível inativar empresa com filiais ativas',
        },
    },
    users: {
        errors: {
            EMAIL_ALREADY_EXISTS: 'E-mail já cadastrado no sistema',
        },
        validations: {
            PASSWORDS_DONT_MATCH: 'As senhas não conferem',
        },
    },
    products: {
        errors: {
            CODE_ALREADY_EXISTS: 'Código interno já cadastrado para esta empresa',
        },
    },
    categories: {
        errors: {
            NAME_ALREADY_EXISTS: 'Nome de categoria já cadastrado para esta empresa',
        },
    },
    paymentTypes: {
        errors: {
            NAME_ALREADY_EXISTS: 'Nome de tipo de pagamento já cadastrado para esta empresa',
        },
    },
    suppliers: {
        errors: {
            CPF_CNPJ_ALREADY_EXISTS: 'CPF/CNPJ já cadastrado para esta empresa',
            HAS_LINKED_RECORDS: 'Não é possível excluir este fornecedor pois existem registros vinculados',
        },
    },
    customers: {
        errors: {
            CPF_CNPJ_ALREADY_EXISTS: 'CPF/CNPJ já cadastrado para esta empresa',
            HAS_LINKED_RECORDS: 'Não é possível excluir este cliente pois existem registros vinculados',
        },
    },
    measurementUnits: {
        errors: {
            ABBREVIATION_ALREADY_EXISTS: 'Sigla já cadastrada para esta empresa',
        },
    },
    systemParameters: {
        errors: {
            KEY_NOT_FOUND: 'Chave de configuração não encontrada',
        },
    },
    positions: {
        errors: {
            HAS_LINKED_USERS: 'Não é possível excluir este cargo pois existem usuários vinculados a ele',
            CANNOT_DELETE_GLOBAL: 'Não é possível excluir cargos globais do sistema',
            CANNOT_EDIT_GLOBAL: 'Não é possível editar cargos globais do sistema',
        },
    },
    common: {
        messages: {
            CREATED: 'Registro criado com sucesso',
            UPDATED: 'Registro atualizado com sucesso',
            DELETED: 'Registro excluído com sucesso',
            ERROR: 'Erro inesperado no servidor',
            NOT_FOUND: 'Registro não encontrado',
            UNAUTHORIZED: 'Sessão expirada ou token inválido',
            FORBIDDEN: 'Usuário sem permissão para o recurso',
            COMPANY_REQUIRED: 'É necessário selecionar uma empresa',
            TOO_MANY_REQUESTS: 'Rate limit atingido',
        },
        validations: {
            VALIDATION_ERROR: 'Erro de validação nos dados enviados',
            REQUIRED_FIELD: 'Campo obrigatório não preenchido',
            INVALID_EMAIL: 'Formato de e-mail inválido',
        },
    },
});

export default messageCodes;
