/** Minimal ESLint config to enforce LazyImage usage (via no-restricted-syntax) */
module.exports = {
  root: true,
  extends: ['next/core-web-vitals'],
  overrides: [
    {
      files: ['**/*.tsx','**/*.ts','**/*.jsx','**/*.js'],
      excludedFiles: ['**/components/ui/LazyImage.tsx'],
      rules: {
        'no-restricted-syntax': [
          'error',
          {
            selector: "JSXOpeningElement[name.name='img']",
            message: 'Use LazyImage instead of <img> for public assets'
          }
        ]
      }
    },
    {
      files: ['**/components/ui/LazyImage.tsx'],
      rules: {
        'no-restricted-syntax': 'off',
        '@next/next/no-img-element': 'off'
      }
    }
  ],
  settings: {
    react: {
      version: 'detect'
    }
  }
};
