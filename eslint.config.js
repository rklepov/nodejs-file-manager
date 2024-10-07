import pluginJs from '@eslint/js';
import pluginImport from 'eslint-plugin-import';
import pluginPromise from 'eslint-plugin-promise';
import pluginNode from 'eslint-plugin-n';
import globals from 'globals';

export default [
  pluginJs.configs.recommended,
  pluginImport.flatConfigs.recommended,
  pluginPromise.configs['flat/recommended'],
  pluginNode.configs['flat/recommended'],
  {
    files: ['**/*.js'],
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
      globals: globals.node,
    },
  },
  {
    ignores: ['eslint.config.js'],
  },
];
