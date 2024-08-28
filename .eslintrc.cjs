module.exports = {
    root: true,
    env: {
        browser: true,
        es2021: true,
        node: true,
    },
    ignorePatterns: ["dist", "node_modules"],
    extends: [
        "eslint:recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:import/recommended",
        "plugin:import/typescript",
    ],
    parser: "@typescript-eslint/parser",
    parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
    },
    plugins: ["import", "no-only-tests"],
    settings: {
        "import/resolver": {
            node: {},
            typescript: {
                project: "./tsconfig.json",
            },
        },
        react: {
            version: "detect",
        },
    },
    rules: {
        "no-console": ["error", { allow: ["warn", "error"] }],
        "no-debugger": "error",
        "no-only-tests/no-only-tests": "error",
        "import/no-unresolved": "off",
        "@typescript-eslint/consistent-type-imports": [
            "error",
            { prefer: "type-imports", fixStyle: "inline-type-imports" },
        ],
        "@typescript-eslint/array-type": [
            "error",
            {
                default: "generic",
            },
        ],
    },
};
