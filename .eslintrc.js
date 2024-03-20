module.exports = {
    env: {
        es6: true,
        mocha: true,
        node: true
    },
    parserOptions: {
        ecmaVersion: 11,
        sourceType: 'module'
    },
    globals: {
        window: true,
        document: true,
        localStorage: true,
        debounce: true
    },
    extends: ['eslint:recommended'],
    overrides: [
        {
            files: ['*.ts', '*.tsx'],
            parser: '@typescript-eslint/parser',
            plugins: ['@typescript-eslint'],
            extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
            rules: {
                '@typescript-eslint/no-explicit-any': ['off']
            }
        }
    ]
};
