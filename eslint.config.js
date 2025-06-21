import globals from 'globals';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import jsxA11y from 'eslint-plugin-jsx-a11y';
import react from 'eslint-plugin-react';
import importPlugin from 'eslint-plugin-import';  // Added import plugin for resolving imports

export default [
  { ignores: ['dist'] },
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: globals.browser,
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
      'jsx-a11y': jsxA11y,
      import: importPlugin, // Added import plugin here
    },
    settings: {
      'import/resolver': {
        alias: {
          map: [
            ['@services', './src/services'],
            ['@', './src'],
            ['@app', './src/app'],
            ['@assets', './src/assets'],
            ['@containers', './src/containers'],
            ['@context', './src/context'],
            ['@hooks', './src/hooks'],
            ['@shared', './src/shared'],
            ['@store', './src/store'],
            ['@styles', './src/styles'],
            ['@utilities', './src/utilities'],
          ],
          extensions: ['.js', '.jsx', '.ts', '.tsx'], // Add extensions you use
        },
      },
    },
    rules: {
      ...reactHooks.configs.recommended.rules,
      'no-unused-vars': ['error', { varsIgnorePattern: '^[A-Z_]' }],
      'import/no-unresolved': 'error',
      'import/no-extraneous-dependencies': 'error',
      'react-refresh/only-export-components': [
        'warn',
        { allowConstantExport: true },
      ],
      'arrow-parens': [2, 'as-needed'],
      'jsx-a11y/anchor-is-valid': [
        'error',
        {
          components: ['Link'],
          specialLink: ['to', 'hrefLeft', 'hrefRight'],
          aspects: ['noHref', 'invalidHref', 'preferButton'],
        },
      ],
      'max-len': [
        'error',
        {
          code: 200,
          ignoreRegExpLiterals: true,
          tabWidth: 2,
        },
      ],
      'no-console': [1],
      'linebreak-style': 'off',
      'react/jsx-one-expression-per-line': [
        0,
        {
          allow: 'literal',
        },
      ],
      'jsx-a11y/label-has-associated-control': 'off',
      'jsx-a11y/label-has-for': [
        2,
        {
          required: {
            some: ['nesting', 'id'],
          },
        },
      ],
      'no-multiple-empty-lines': ['error', { max: 1 }],
      'react/no-did-update-set-state': ['off'],
      'jsx-a11y/click-events-have-key-events': 0,
      'react/forbid-prop-types': 0,
      'comma-dangle': 'off',
      'object-curly-newline': 'off',
      'operator-linebreak': 'off',
      'react/jsx-props-no-spreading': 'off',
      'react/function-component-definition': [
        2,
        {
          unnamedComponents: 'arrow-function',
          namedComponents: 'function-declaration',
        },
      ],
      'react/no-array-index-key': 'off',
      'no-plusplus': 'off',
    },
  },
];
