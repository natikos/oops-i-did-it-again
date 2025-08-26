import js from '@eslint/js';
import typescript from '@typescript-eslint/eslint-plugin';
import typescriptParser from '@typescript-eslint/parser';
import prettier from 'eslint-plugin-prettier';
import prettierConfig from 'eslint-config-prettier';
import globals from 'globals';
import importPlugin from 'eslint-plugin-import';

export default [
  js.configs.recommended,
  {
    files: ['src/**/*.ts', '**/*.ts'],
    languageOptions: {
      parser: typescriptParser,
      ecmaVersion: 2020,
      sourceType: 'module',
      globals: {
        ...globals.node,
      },
    },
    plugins: {
      '@typescript-eslint': typescript,
      prettier: prettier,
      import: importPlugin,
    },
    rules: {
      ...typescript.configs.recommended.rules,
      ...prettierConfig.rules,
      'prefer-const': 'error',
      'prettier/prettier': 'error',
      'no-tabs': 'error',
      'no-mixed-spaces-and-tabs': 'error',
      '@typescript-eslint/consistent-type-imports': [
        'error',
        {
          prefer: 'type-imports',
          disallowTypeAnnotations: false,
        },
      ],
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            ['internal'],
            ['parent', 'sibling'],
            ['index'],
            ['object', 'type'],
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true },
        },
      ],
    },
    ignores: [
      'node_modules/**',
      'build/**',
      'dist/**',
      'coverage/**',
      '*.js',
      '*.d.ts',
      '.env*',
      'package-lock.json',
      'package.json',
    ],
  },
];
