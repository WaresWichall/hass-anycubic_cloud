module.exports = {
  parser: '@typescript-eslint/parser',  // Specifies the ESLint parser
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',  // Uses the recommended rules from the @typescript-eslint/eslint-plugin
    'prettier',  // Uses eslint-config-prettier to disable ESLint rules from @typescript-eslint/eslint-plugin that would conflict with prettier
    'plugin:prettier/recommended',  // Enables eslint-plugin-prettier and displays prettier errors as ESLint errors. Make sure this is always the last configuration in the extends array.
    'plugin:lit/recommended',
  ],
  plugins: ["prettier", "lit"],
  parserOptions: {
    ecmaVersion: 2018,  // Allows for the parsing of modern ECMAScript features
    sourceType: 'module',  // Allows for the use of imports
    experimentalDecorators: true,
  },
  rules: {
    "no-undef": "error",
    "@typescript-eslint/camelcase": 0,
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/no-non-null-assertion": "error",
    "@typescript-eslint/no-unused-vars": ["error", {
      "argsIgnorePattern": "^_"
    }],
    '@typescript-eslint/ban-types': 'error',
    'no-array-constructor': 'off',
    '@typescript-eslint/no-array-constructor': 'error',
    '@typescript-eslint/no-duplicate-enum-values': 'error',
    '@typescript-eslint/no-dynamic-delete': 'error',
    '@typescript-eslint/no-extra-non-null-assertion': 'error',
    '@typescript-eslint/no-extraneous-class': 'error',
    '@typescript-eslint/no-invalid-void-type': 'error',
    'no-loss-of-precision': 'off',
    '@typescript-eslint/no-loss-of-precision': 'error',
    '@typescript-eslint/no-misused-new': 'error',
    '@typescript-eslint/no-namespace': 'error',
    '@typescript-eslint/no-non-null-asserted-nullish-coalescing': 'error',
    '@typescript-eslint/no-non-null-asserted-optional-chain': 'error',
    '@typescript-eslint/no-this-alias': 'error',
    '@typescript-eslint/no-unnecessary-type-constraint': 'error',
    '@typescript-eslint/no-unsafe-declaration-merging': 'error',
    'no-useless-constructor': 'off',
    '@typescript-eslint/no-useless-constructor': 'error',
    '@typescript-eslint/no-var-requires': 'error',
    '@typescript-eslint/prefer-as-const': 'error',
    '@typescript-eslint/prefer-literal-enum-member': 'error',
    '@typescript-eslint/triple-slash-reference': 'error',
    '@typescript-eslint/unified-signatures': 'error',
    'no-console': 'warn',
    'no-var': 'error',
    'prefer-const': 'error',
    'curly': 'error',
    'lit/no-duplicate-template-bindings': 'error',
    'lit/no-template-map': 'error',
    'lit/no-useless-template-literals': 'error',
    'lit/attribute-value-entities': 'error',
    'lit/binding-positions': 'error',
    'lit/no-property-change-update': 'error',
    'lit/no-invalid-html': 'error',
    'eqeqeq': 'error',
    'no-unused-vars': 'off'
  },
  overrides: [
    {
      files: [
        '*.ts'
      ],
      excludedFiles: "src/lib/**/*.js"
    },
  ],
  globals: {
    customElements: "writable",
    document: "writable",
    history: "writable",
    window: "writable",
    clearInterval: "readonly",
    setInterval: "readonly",
    clearTimeout: "readonly",
    setTimeout: "readonly",
    CustomEvent: "readonly",
    HTMLElement: "readonly",
    Window: "readonly",
    Event: "readonly",
    FillMode: "readonly",
    scrollTo: "readonly"
  }
};