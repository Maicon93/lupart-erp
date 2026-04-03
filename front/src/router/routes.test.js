import { describe, it, expect } from 'vitest';
import routes from './routes';

function collectRoutes(routeList) {
    const collected = [];
    for (const route of routeList) {
        collected.push(route);
        if (route.children) {
            collected.push(...collectRoutes(route.children));
        }
    }
    return collected;
}

describe('router/routes', () => {
    it('should not have duplicate screen numbers', () => {
        const allRoutes = collectRoutes(routes);
        const screenNumbers = allRoutes
            .filter((r) => r.meta?.screen !== undefined)
            .map((r) => r.meta.screen);
        const duplicates = screenNumbers.filter((screen, index) => screenNumbers.indexOf(screen) !== index);

        expect(duplicates, `Screens duplicados: ${duplicates.join(', ')}`).toEqual([]);
    });

    it('should not have duplicate route names', () => {
        const allRoutes = collectRoutes(routes);
        const names = allRoutes.filter((r) => r.name !== undefined).map((r) => r.name);
        const duplicates = names.filter((name, index) => names.indexOf(name) !== index);

        expect(duplicates, `Nomes duplicados: ${duplicates.join(', ')}`).toEqual([]);
    });
});
