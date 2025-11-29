/** Minimal ESLint config to enforce LazyImage usage */
module.exports = {
  root: true,
  plugins: ['lazy-image'],
  overrides: [
    {
      files: ['**/*.tsx','**/*.ts','**/*.jsx','**/*.js'],
      rules: {
        'lazy-image/require-lazy-image': 'warn'
      }
    }
  ],
  settings: {
    react: {
      version: 'detect'
    }
  }
};
