LazyImage Codemod and ESLint rule scaffold

What this adds:
- A Node-based codemod script at scripts/convert-img-to-lazy.js to automatically replace HTML <img> tags with the LazyImage component in TSX/JSX files under the project.
- A lightweight ESLint plugin (eslint-plugins/lazy-image) with a rule to warn on <img> usage and encourage LazyImage usage.
- A local ESLint config at .eslintrc.cjs to enable the rule.
- A script entry to run the codemod: npm run codemod (or node scripts/convert-img-to-lazy.js /path/to/target).

Usage:
- Run codemod on the repo:
  node scripts/convert-img-to-lazy.js /project/sandbox
- Lint with local config:
  npx eslint .

Notes:
- The codemod is a best-effort transform. It may need manual adjustments for complex attributes or dynamic JSX patterns.
