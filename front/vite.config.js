import { fileURLToPath } from 'node:url';
import { defineConfig, loadEnv } from 'vite';
import vue from '@vitejs/plugin-vue';
import { quasar, transformAssetUrls } from '@quasar/vite-plugin';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd());

    return {
        plugins: [
            vue({
                template: { transformAssetUrls },
            }),
            quasar({
                sassVariables: fileURLToPath(new URL('./src/quasar-variables.sass', import.meta.url)),
            }),
        ],
        server: {
            port: parseInt(env.VITE_PORT) || 5172,
        },
    };
});
