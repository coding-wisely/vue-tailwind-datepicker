module.exports = {
    env: {
        browser: true,
        es6: true,
        commonjs: true,
        node: true
    },
    extends: ["eslint:recommended", "plugin:vue/strongly-recommended"],
    globals: {
        Atomics: "readonly",
        SharedArrayBuffer: "readonly"
    },

    parserOptions: {
        extends: "standard",
        parser: "babel-eslint"
    },
    plugins: ["eslint-plugin-vue"],
    rules: {
        // indent: ["error", 4],
        "no-const-assign": "warn",
        "no-unreachable": "warn",
        "no-unused-vars": "warn",
        "valid-typeof": "warn",
        "linebreak-style": ["error", "unix"],
        "no-multi-spaces": "error",
        quotes: ["error", "single"],
        semi: ["error", "always"],
        eqeqeq: "warn",
        "no-console": "off",
        "brace-style": "error",
        "vue/html-indent": [
            "error",
            4,
            {
                attribute: 1,
                baseIndent: 1,
                closeBracket: 0,
                alignAttributesVertically: true,
                ignores: []
            }
        ],
        "vue/html-closing-bracket-newline": [
            "error",
            {
                singleline: "never",
                multiline: "never"
            }
        ],
        "vue/no-multi-spaces": [
            "error",
            {
                ignoreProperties: false
            }
        ]
    }
};
