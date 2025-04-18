import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import reactPlugin from 'eslint-plugin-react';
import reactHooksPlugin from 'eslint-plugin-react-hooks';
import importPlugin from 'eslint-plugin-import';
import jsxA11yPlugin from 'eslint-plugin-jsx-a11y';
import prettierPlugin from 'eslint-plugin-prettier';
import preferArrowPlugin from 'eslint-plugin-prefer-arrow';

import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
    baseDirectory: __dirname,
});


export default tseslint.config(
    // Base ESLint configuration
    eslint.configs.recommended,

    ...compat.extends("next/core-web-vitals", "next/typescript"),
    // TypeScript configuration
    ...tseslint.configs.recommended,


    // React configuration
    {
        files: ['**/*.{jsx,tsx}'],
        plugins: {
            react: reactPlugin,
            'react-hooks': reactHooksPlugin
        },
        settings: {
            react: {
                version: 'detect'
            }
        },
        rules: {
            ...reactPlugin.configs.recommended.rules,
            ...reactHooksPlugin.configs.recommended.rules,
            'react/react-in-jsx-scope': 'off',
            'react/self-closing-comp': 'error',
            'react/jsx-boolean-value': ['error', 'never'],
            'react/jsx-curly-brace-presence': ['error', 'never'],
            'react/jsx-curly-spacing': ['error', 'never'],
            'react/jsx-equals-spacing': ['error', 'never'],
            'react/jsx-fragments': ['error', 'syntax'],
            'react/jsx-no-useless-fragment': 'error',
            'react/display-name': 'off',
            'react/function-component-definition': [
                'error',
                { namedComponents: 'arrow-function', unnamedComponents: 'arrow-function' }
            ],
            'react/prop-types': 'off' // Disabled for TypeScript files
        }
    },

    // JSX A11y configuration
    {
        files: ['**/*.{jsx,tsx}'],
        plugins: {
            'jsx-a11y': jsxA11yPlugin
        },
        rules: {
            ...jsxA11yPlugin.configs.recommended.rules
        }
    },

    // Import configuration
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            import: importPlugin
        },
        settings: {
            'import/resolver': {
                node: { paths: 'src' },
                typescript: {
                    extensionAlias: {
                        '.js': ['.ts', '.tsx', '.d.ts', '.js'],
                        '.jsx': ['.tsx', '.d.ts', '.jsx'],
                        '.cjs': ['.cts', '.d.cts', '.cjs'],
                        '.mjs': ['.mts', '.d.mts', '.mjs']
                    }
                }
            }
        },
        rules: {
            ...importPlugin.configs.recommended.rules,
            'import/order': [
                'error',
                {
                    'newlines-between': 'always',
                    'groups': [
                        'builtin',
                        'external',
                        'internal',
                        'parent',
                        'sibling',
                        'index'
                    ]
                }
            ]
        }
    },

    // Prettier configuration
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            prettier: prettierPlugin
        },
        rules: {
            ...prettierPlugin.configs.recommended.rules
        }
    },

    // Prefer Arrow configuration  
    {
        files: ['**/*.{js,jsx,ts,tsx}'],
        plugins: {
            'prefer-arrow': preferArrowPlugin
        },
        rules: {
            'prefer-arrow/prefer-arrow-functions': 'error'
        }
    },

    // Ignoring specific files and patterns
    {
        ignores: [
            'eslint.config.js',
            'tailwind.config.cjs',
            'postcss.config.js',
            'next.config.mjs',
            '**/*.md',
            '**/*.html'
        ]
    }
);
