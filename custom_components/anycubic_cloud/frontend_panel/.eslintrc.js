module.exports = {
  parser: "@typescript-eslint/parser",  // Specifies the ESLint parser
  extends: [
    "eslint:recommended",
    "plugin:@typescript-eslint/recommended-type-checked",
    "plugin:@typescript-eslint/strict-type-checked",
    "prettier",
    "plugin:prettier/recommended",
    "plugin:lit/recommended",
    "plugin:import/recommended",
  ],
  plugins: ["prettier", "lit", "import"],
  parserOptions: {
    ecmaVersion: 2018,  // Allows for the parsing of modern ECMAScript features
    sourceType: "module",  // Allows for the use of imports
    experimentalDecorators: true,
    emitDecoratorMetadata: true,
    projectService: true,
    tsconfigRootDir: __dirname,
    project: "./tsconfig.json",
  },
  settings: {
    "import/resolver": {
      "typescript": {
        "alwaysTryTypes": true,
        "project": "./tsconfig.json"
      }
    },
    "import/parsers": {
      "@typescript-eslint/parser": [".ts", ".tsx"]
    }
  },
  rules: {
    "@typescript-eslint/array-type": "error",
    "@typescript-eslint/camelcase": 0,
    "@typescript-eslint/consistent-generic-constructors": "error",
    "@typescript-eslint/consistent-type-exports": "error",
    "@typescript-eslint/explicit-function-return-type": "error",
    "@typescript-eslint/explicit-module-boundary-types": "error",
    "@typescript-eslint/no-confusing-non-null-assertion": "error",
    "@typescript-eslint/no-dupe-class-members": "error",
    "@typescript-eslint/no-shadow": "error",
    "@typescript-eslint/no-unnecessary-parameter-property-assignment": "error",
    "@typescript-eslint/no-unused-expressions": "error",
    "@typescript-eslint/no-unused-vars": [
      "error",
      {
        "argsIgnorePattern": "^_"
      }
    ],
    "@typescript-eslint/no-use-before-define": "error",
    "@typescript-eslint/parameter-properties": "error",
    "@typescript-eslint/restrict-template-expressions": [
      "error",
      {
        "allowNumber": true
      }
    ],
    "@typescript-eslint/typedef": "error",
    "curly": "error",
    "eqeqeq": "error",
    "lit/attribute-names": "warn",
    "lit/ban-attributes": "error",
    "lit/lifecycle-super": "error",
    "lit/no-classfield-shadowing": "error",
    "lit/no-invalid-escape-sequences": "error",
    "lit/no-legacy-imports": "error",
    "lit/no-native-attributes": "error",
    "lit/no-private-properties": "error",
    "lit/no-template-arrow": "error",
    "lit/no-template-bind": "error",
    "lit/no-template-map": "error",
    "lit/no-this-assign-in-render": "error",
    "lit/no-useless-template-literals": "error",
    "lit/no-value-attribute": "error",
    "lit/prefer-nothing": "error",
    "lit/prefer-static-styles": "error",
    "lit/quoted-expressions": "error",
    "lit/value-after-constraints": "error",
    "import/order": [
      "error",
      {
        "groups": [
          "external", 
          "builtin", 
          "internal", 
          "sibling", 
          "parent", 
          "index"
        ]
      }
    ],
    "no-console": "warn",
    "no-duplicate-imports": "error",
    "no-empty-function": "warn",
    "no-undef": "error",
    "no-unneeded-ternary": "warn",
    "no-var": "error",
    "operator-assignment": "warn",
    "prefer-const": "error",
    "sort-imports": [
      "error",
      {
        "ignoreCase": false,
        "ignoreDeclarationSort": true,
        "ignoreMemberSort": false
      }
    ]
  },
  overrides: [
    {
      files: [
        "*.ts",
        "**/*.ts"
      ],
      excludedFiles: [
        "./src/lib",
        "./src/lib/**/*.js",
      ]
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