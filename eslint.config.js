import eslint from '@eslint/js';
import ts from 'typescript-eslint';

export default ts.config(
  {
    ignores: ['node_modules'],
  },
  eslint.configs.recommended,
  ...ts.configs.strictTypeChecked,
  {
    languageOptions: {
      parserOptions: {
        projectService: true,
        tsconfigRootDir: import.meta.dirname,
      },
    },
    rules: {
      '@typescript-eslint/no-unused-vars': [
        'warn',
        {
          argsIgnorePattern: '^_',
          varsIgnorePattern: '^_',
        },
      ],
      '@typescript-eslint/no-non-null-assertion': 'off',
      '@typescript-eslint/no-empty-object-type': [
        'error',
        {
          allowInterfaces: 'always',
        },
      ],
      // Enables passing async functions to event handler props
      '@typescript-eslint/no-misused-promises': 'off',
      '@typescript-eslint/no-confusing-void-expression': 'off',
      // Enables throwing `redirect` errors for Tanstack Router
      '@typescript-eslint/only-throw-error': 'off',
      '@typescript-eslint/restrict-template-expressions': [
        'warn',
        {
          allowNumber: true,
          allowBoolean: true,
        },
      ],
    },
  },
  {
    files: ['**/*.js'],
    extends: [ts.configs.disableTypeChecked],
    languageOptions: {
      parserOptions: {
        project: false,
      },
    },
  },
  {
    files: ['**/*.cjs'],
    extends: [ts.configs.disableTypeChecked],
    languageOptions: {
      sourceType: 'commonjs',
      parserOptions: {
        project: false,
      },
    },
  },
  {
    files: ['**/*.test.ts', '**/*.test.tsx'],
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unsafe-argument': 'off',
      '@typescript-eslint/no-unsafe-assignment': 'off',
      '@typescript-eslint/no-unsafe-call': 'off',
      '@typescript-eslint/no-unsafe-member-access': 'off',
      '@typescript-eslint/no-unsafe-return': 'off',
      '@typescript-eslint/no-floating-promises': 'off',
      '@typescript-eslint/require-await': 'off',
    },
  },
  {
    rules: {
      quotes: ['warn', 'single', { avoidEscape: true }],
      semi: ['warn', 'always'],
      'no-debugger': 'warn',
      'no-console': [
        'warn',
        { allow: ['warn', 'error', 'info', 'table', 'dir'] },
      ],
    },
  }
);
