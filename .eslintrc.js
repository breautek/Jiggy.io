module.exports = {
    "extends": [
        "eslint:recommended",
        "plugin:@typescript-eslint/eslint-recommended",
        "plugin:@typescript-eslint/recommended",
        "plugin:@nbsolutions/recommended"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "project": "./tsconfig-tests.json",
        "sourceType": "module",
        "tsconfigRootDir": __dirname
    },
    "plugins": [
        "@typescript-eslint",
        "@nbsolutions"
    ],
    "env": {
        "node": true,
        "jest": true
    },
    "rules": {
        "@typescript-eslint/consistent-type-assertions": ["error", {
            assertionStyle: 'angle-bracket'
        }],
        "@typescript-eslint/array-type": ["error", {
            default: 'generic'
        }],
        "keyword-spacing": ["error", {
            "overrides": {
                "this": {
                    "before": false
                }
            }
        }],
        "@typescript-eslint/no-this-alias": "off"
    }
};
