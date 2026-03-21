import js from '@eslint/js';
import pluginVue from 'eslint-plugin-vue';
import eslintConfigPrettier from 'eslint-config-prettier';

export default [
  js.configs.recommended,
  ...pluginVue.configs['flat/recommended'],
  eslintConfigPrettier,
  {
    files: ['src/**/*.{js,vue}'],
    rules: {
      'no-console': 'error',
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
      'no-debugger': 'error',
      'vue/multi-word-component-names': 'off',
      'vue/no-unused-vars': 'warn',
    },
  },
];
