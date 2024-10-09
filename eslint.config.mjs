import typescriptEslint from "@typescript-eslint/eslint-plugin";
import prettier from "eslint-plugin-prettier";
import globals from "globals";
import tsParser from "@typescript-eslint/parser";
import path from "node:path";
import { fileURLToPath } from "node:url";
import js from "@eslint/js";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const compat = new FlatCompat({
    baseDirectory: __dirname,
    recommendedConfig: js.configs.recommended,
    allConfig: js.configs.all
});

export default [{
    ignores: ["**/dist/*", "**/node_modules/*", "**/node_modules/", "**/dist/"],
}, ...compat.extends(
    "airbnb-base",
    "plugin:@typescript-eslint/eslint-recommended",
    "plugin:@typescript-eslint/recommended",
    "prettier",
), {
    plugins: {
        "@typescript-eslint": typescriptEslint,
        prettier,
    },

    languageOptions: {
        globals: {
            ...globals.node,
        },

        parser: tsParser,
        ecmaVersion: 2021,
        sourceType: "module",
    },

    rules: {
        "prettier/prettier": "warn",

        "import/no-extraneous-dependencies": ["error", {
            devDependencies: ["**/tests/**", "**/test/**", "**/__tests__/**", "**/__test__/**", "**/*.test.js", "**/*.spec.js",],
        }],

        "no-console": "off",
        "no-underscore-dangle": "off",

        "@typescript-eslint/no-explicit-any": "off",

        "import/no-unresolved": "off",
        "import/extensions": "off",
        "no-return-await": "off",
        "no-restricted-exports": "off",
        "no-param-reassign": "off",
        "no-use-before-define": "off",
        "import/prefer-default-export": "off",

        "max-classes-per-file": [
            "error",
            { "ignoreExpressions": true, "max": 2 }
        ]
    },
}];