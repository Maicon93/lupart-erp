export const formatDate = (date) => {
    if (!date) return '—';
    return new Date(date).toLocaleDateString('pt-BR');
};

export const formatCurrency = (value) => {
    return Number(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
};
