module.exports = {
  root: true,
  env: {
    node: true
  },
  extends: [
    'plugin:vue/vue3-essential',
    '@vue/airbnb'
  ],
  parserOptions: {
    parser: 'babel-eslint'
  },
  rules: {
    'no-console': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'no-debugger': process.env.NODE_ENV === 'production' ? 'warn' : 'off',
    'linebreak-style': 0,
    semi: [2, 'never'],
    'comma-dangle': ['error', 'never'],
    'no-trailing-spaces': ['error', { ignoreComments: true, skipBlankLines: true }],
    'no-underscore-dangle': ['error', { allow: ['_id'] }],
    'arrow-body-style': [2, 'as-needed'],
    'max-len': ['error', { code: 120 }],
    'no-use-before-define': ['error', { functions: false }]
  }
}
