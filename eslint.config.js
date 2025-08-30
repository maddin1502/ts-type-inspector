import globals from 'globals';
import pluginJs from '@eslint/js';
import tseslint, { parser } from 'typescript-eslint';

export default [
  {
    ignores: ['*', '!src', '!vitest.config.ts']
  },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  {
    languageOptions: {
      globals: { ...globals.browser, ...globals.node },
      parser: parser,
      ecmaVersion: 5,
      sourceType: 'module',

      parserOptions: {
        project: ['tsconfig.json']
      }
    },
    rules: {
      '@typescript-eslint/array-type': 'off',
      '@typescript-eslint/consistent-type-assertions': 'warn',
      '@typescript-eslint/no-empty-interface': 'off',
      '@typescript-eslint/no-empty-function': 'off',
      '@typescript-eslint/no-var-requires': 'warn',
      '@typescript-eslint/no-explicit-any': 'error',
      '@typescript-eslint/no-shadow': 'warn',
      '@typescript-eslint/no-unsafe-assignment': 'warn',
      '@typescript-eslint/no-unsafe-return': 'warn',
      '@typescript-eslint/no-unsafe-argument': 'warn',
      indent: 'off',
      'prefer-arrow-callback': 'warn',
      'object-shorthand': ['warn', 'never'],
      camelcase: 'warn',
      'no-bitwise': 'off',
      'no-console': 'warn',
      'no-empty': 'warn',
      'no-param-reassign': 'warn',
      quotes: ['warn', 'single'],
      semi: 'off',
      'no-unused-vars': 'off',
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_'
        }
      ]
    }
  }
];
