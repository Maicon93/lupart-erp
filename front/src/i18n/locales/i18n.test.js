import { describe, it, expect } from 'vitest';
import ptBR from './pt-BR.json';
import en from './en.json';

function collectKeys(obj, prefix = '') {
    const keys = [];
    for (const key of Object.keys(obj)) {
        const fullKey = prefix ? `${prefix}.${key}` : key;
        if (typeof obj[key] === 'object' && obj[key] !== null) {
            keys.push(...collectKeys(obj[key], fullKey));
        } else {
            keys.push(fullKey);
        }
    }
    return keys;
}

describe('i18n/locales', () => {
    it('should have all pt-BR keys present in en', () => {
        const ptBRKeys = collectKeys(ptBR);
        const enKeys = new Set(collectKeys(en));
        const missing = ptBRKeys.filter((key) => !enKeys.has(key));

        expect(missing, `Chaves presentes em pt-BR mas ausentes em en:\n${missing.join('\n')}`).toEqual([]);
    });

    it('should have all en keys present in pt-BR', () => {
        const enKeys = collectKeys(en);
        const ptBRKeys = new Set(collectKeys(ptBR));
        const missing = enKeys.filter((key) => !ptBRKeys.has(key));

        expect(missing, `Chaves presentes em en mas ausentes em pt-BR:\n${missing.join('\n')}`).toEqual([]);
    });
});
