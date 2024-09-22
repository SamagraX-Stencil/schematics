module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: 'tsconfig.json', // specify the path to tsconfig.json
    tsconfigRootDir: __dirname, // specify the root directory for tsconfig.json
    sourceType: 'module',
    extraFileExtensions: [".json"],
  },
  plugins: ['@typescript-eslint/eslint-plugin'],
  extends: [
    'plugin:@typescript-eslint/eslint-recommended',
    'plugin:@typescript-eslint/recommended',
    'prettier',
  ],
  root: true,
  env: {
    node: true,
    jest: true,
  },
  rules: {
    '@typescript-eslint/interface-name-prefix': 'off',
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'off',
    '@typescript-eslint/explicit-module-boundary-types': 'off',
    '@typescript-eslint/no-use-before-define': 'off',
    'strict': ['error', 'global'], // Added strict mode for additional typesafety
    'indent': ['error', 2], // Indentation style of your code should be with 2 spaces
    'max-len': ['error', { 'code': 120 }], // Set max length to 120
    
    // Add more rules as needed
  }
};
