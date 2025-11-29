module.exports = {
  rules: {
    // A lightweight rule that warns when a JSX <img> tag is used, encouraging LazyImage usage
    'require-lazy-image': {
      meta: {
        type: 'suggestion',
        docs: {
          description: 'Warn on <img> usage and suggest LazyImage component',
        },
        fixable: null
      },
      create(context) {
        return {
          JSXOpeningElement(node) {
            const name = node.name && node.name.name;
            if (name === 'img') {
              context.report({
                node,
                message: 'Use LazyImage instead of <img> for public assets',
              });
            }
          }
        };
      }
    }
  }
};
