// http://eslint.org/docs/user-guide/configuring

module.exports = {
  root: true,
  parser: 'babel-eslint',
  parserOptions: {
    sourceType: 'module'
  },
  env: {
    browser: true,
  },
  extends: 'airbnb-base',
  // required to lint *.vue files
  plugins: [
    'html'
  ],
  // check if imports actually resolve
  'settings': {
    'import/resolver': {
      'webpack': {
        'config': 'build/webpack.base.conf.js'
      }
    }
  },
  // add your custom rules here
  'rules': {
    // don't require .vue extension when importing
    'import/extensions': ['error', 'always', {
      'js': 'never',
      'vue': 'never'
    }],
    // allow optionalDependencies
    'import/no-extraneous-dependencies': ['error', {
      'optionalDependencies': ['test/unit/index.js']
    }],
    // allow debugger during development
    'no-debugger': process.env.NODE_ENV === 'production' ? 2 : 0,
    // allow paren-less arrow functions
    'arrow-parens': 0,
    // allow async-await
    'generator-star-spacing': 0,
    'eol-last': 0,
    'space-before-function-paren': 0,
    'guard-for-in': 0,
    'no-restricted-syntax': 0,
    'no-param-reassign': 0,
    'prefer-template': 0,
    'no-console': 0,
    'no-shadow': 0,
    'no-underscore-dangle': 0,
    'no-plusplus': 0,
    'arrow-body-style': 0,
    'no-unused-expressions': 0,
    'comma-dangle': 0,
    'prefer-spread': 0,
    'prefer-rest-params': 0,
    'no-bitwise': 0,
    'radix': 0
  }
}
