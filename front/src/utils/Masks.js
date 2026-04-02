export const maskCpfCnpj = (value) => {
    const digits = value.replace(/\D/g, '');

    if (digits.length <= 11) {
        return digits
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d)/, '$1.$2')
            .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }

    return digits
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d{1,2})$/, '$1-$2');
};

export const maskPhone = (value) => {
    const digits = value.replace(/\D/g, '');

    if (digits.length <= 10) {
        return digits
            .replace(/(\d{2})(\d)/, '($1) $2')
            .replace(/(\d{4})(\d{1,4})$/, '$1-$2');
    }

    return digits
        .replace(/(\d{2})(\d)/, '($1) $2')
        .replace(/(\d{5})(\d{1,4})$/, '$1-$2');
};

export const maskCep = (value) => {
    const digits = value.replace(/\D/g, '');
    return digits.replace(/(\d{5})(\d{1,3})$/, '$1-$2');
};

export const maskMoney = (value) => {
    if (value === '' || value === null || value === undefined) return '';
    const number = String(value).replace(/\D/g, '');
    if (!number) return '';
    const cents = Number(number) / 100;
    return cents.toLocaleString('pt-BR', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const parseMoney = (value) => {
    if (!value) return 0;
    const cleaned = String(value).replace(/\./g, '').replace(',', '.');
    return parseFloat(cleaned) || 0;
};
