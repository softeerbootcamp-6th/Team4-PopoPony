import pluginQuery from '@tanstack/eslint-plugin-query';
import ts from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';
import prettierConfig from 'eslint-config-prettier';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';

/** @type {import("eslint").FlatConfig[]} */
export default [
  {
    ignores: ['node_modules', 'dist', 'build'],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      parser: tsParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
    plugins: {
      '@typescript-eslint': ts,
      react,
      'react-hooks': reactHooks,
      prettier,
      '@tanstack/query': pluginQuery,
      import: importPlugin,
    },
    rules: {
      ...ts.configs.recommended.rules,
      ...prettierConfig.rules,

      'prettier/prettier': 'error',

      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }], // 사용하지 않는 변수 경고
      ...pluginQuery.configs.recommended.rules,

      'sort-imports': [
        'error',
        {
          ignoreCase: false,
          ignoreDeclarationSort: true, // @typescript-eslint/consistent-type-imports가 처리
          ignoreMemberSort: false,
          memberSyntaxSortOrder: ['none', 'all', 'multiple', 'single'],
          allowSeparatedGroups: true,
        },
      ],
    },
    settings: {
      react: {
        version: 'detect', // React 버전 자동 감지
      },
    },
  },
];
