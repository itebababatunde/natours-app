// {
//   "extends": ["airbnb", "prettier", "plugin:node/recommended"],
//   "plugins": ["prettier"],
//   "rules": {
//     "prettier/prettier": "error",
//     "spaced-comment": "off",
//     "no-console": "warn",
//     "consistent-return": "off",
//     "func-names": "off",
//     "object-shorthand": "off",
//     "no-process-exit": "off",
//     "no-param-reassign": "off",
//     "no-return-await": "off",
//     "no-underscore-dangle": "off",
//     "class-methods-use-this": "off",
//     "prefer-destructuring": ["error", { "object": true, "array": false }],
//     "no-unused-vars": ["error", { "argsIgnorePattern": "req|res|next|val" }]
//   }
// }


// Sample .eslintrc.js
module.exports = {
  parser: 'esprima', //default parser
  parserOptions: {
    ecmaVersion: 10,
    ecmaFeatures: {
      jsx: true,
    },
  },
  env: {
    browser: true,
    jest: true,
  },
  plugins: ['react', 'prettier'],
  extends: ['prettier', 'react-app',"airbnb", "prettier", "plugin:node/recommended"],
  rules: {
    'no-unreachable': 'error',
    'no-console': 'error',
    "prettier/prettier": "error",
    "spaced-comment": "off",
    "no-console": "warn",
    "consistent-return": "off",
    "func-names": "off",
    "object-shorthand": "off",
    "no-process-exit": "off",
    "no-param-reassign": "off",
    "no-return-await": "off",
    "no-underscore-dangle": "off",
    "class-methods-use-this": "off",
    "prefer-destructuring": ["error", { "object": true, "array": false }],
    "no-unused-vars": ["error", { "argsIgnorePattern": "req|res|next|val"} ]
  },
};