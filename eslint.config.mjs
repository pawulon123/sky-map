// eslint.config.mjs
import js from '@eslint/js';
import tseslint from 'typescript-eslint';
import angular from '@angular-eslint/eslint-plugin';
import angularTemplate from '@angular-eslint/eslint-plugin-template';
import prettier from 'eslint-plugin-prettier';

export default [
  // Podstawowe rzeczy dla JS
  js.configs.recommended,

  // TypeScript (TS + Angular)
  ...tseslint.configs.recommended,

  {
    files: ['**/*.ts'],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.json'],
        sourceType: 'module',
        ecmaVersion: 2020,
      },
    },
    plugins: {
      '@angular-eslint': angular,
      prettier,
    },
    rules: {
      // Angularowe reguły domyślne
      ...angular.configs.recommended.rules,

      // Selektor komponentu: <app-xyz>
      '@angular-eslint/component-selector': [
        'error',
        {
          type: 'element',
          style: 'kebab-case',
          prefix: 'app',
        },
      ],

      // Selektor dyrektywy: [appXyz]
      '@angular-eslint/directive-selector': [
        'error',
        {
          type: 'attribute',
          style: 'camelCase',
          prefix: 'app',
        },
      ],

      // Integracja z Prettier – błędy formatowania jako błędy ESLint
      'prettier/prettier': 'error',
    },
  },

  // SZABLONY HTML ANGULARA
  {
    files: ['**/*.html'],
    plugins: {
      '@angular-eslint/template': angularTemplate,
      prettier,
    },
    processor: angularTemplate.processInlineTemplates,
    rules: {
      ...angularTemplate.configs.recommended.rules,
      'prettier/prettier': 'error',
    },
  },
];
