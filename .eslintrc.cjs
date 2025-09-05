module.exports = {
  root: true,
  env: {
    es2020: true,
  },
  extends: ["eslint:recommended"],
  parserOptions: { ecmaVersion: "latest", sourceType: "module" },
  ignorePatterns: ["dist", ".eslintrc.cjs"],
  overrides: [
    // frontend (React + Vitest)
    {
      files: ["bloglist-frontend/**/*.{js,jsx,ts,tsx}"],
      env: {
        browser: true,
        "vitest-globals/env": true
      },
      extends: [
        "plugin:react/recommended",
        "plugin:react/jsx-runtime",
        "plugin:react-hooks/recommended",
        "plugin:vitest-globals/recommended"
      ],
      settings: { react: { version: "18.2" } },
      plugins: ["react", "react-hooks"],
      rules: {
        indent: ["error", 2],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "single"],
        semi: ["error", "never"],
        eqeqeq: "error",
        "no-trailing-spaces": "error",
        "object-curly-spacing": ["error", "always"],
        "arrow-spacing": ["error", { before: true, after: true }],
        "no-console": 0,
        "react/react-in-jsx-scope": "off",
        "react/prop-types": 0,
        "no-unused-vars": 0
      }
    },

    // backend (Node/Express)
    {
      files: ["bloglist-backend/**/*.js"],
      env: { node: true },
      rules: {
        indent: ["error", 2],
        "linebreak-style": ["error", "unix"],
        quotes: ["error", "single"],
        semi: ["error", "never"],
        eqeqeq: "error",
        "no-trailing-spaces": "error",
        "object-curly-spacing": ["error", "always"],
        "arrow-spacing": ["error", { before: true, after: true }],
        "no-console": 0,
        "no-unused-vars": 0
      }
    },

    // cypress (E2E)
    {
      files: ["cypress/**/*.js"],
      env: { "cypress/globals": true, node: true },
      plugins: ["cypress"],
      extends: ["plugin:cypress/recommended"],
      rules: { 'no-unused-vars': ['error', { argsIgnorePattern: '^_' }] }// keep the rule as an error but ignore unused function parameters whose names start with an underscore (^_ is a regex: begins with “_”).
    }
  ]
}
