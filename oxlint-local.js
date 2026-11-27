const wrappedArrowBraces = {
  meta: {
    type: 'layout',
    fixable: 'code',
    messages: { wrap: 'Wrapped arrow body must use braces and return.' }
  },
  create: (context) => {
    const src = context.sourceCode;
    return {
      ArrowFunctionExpression: (node) => {
        const body = node.body;
        if (['BlockStatement', 'ArrayExpression', 'ObjectExpression'].includes(body.type)) {
          return;
        }
        if (node.loc.start.line === body.loc.end.line) {
          return;
        }
        context.report({
          node: body,
          messageId: 'wrap',
          fix: (fixer) => {
            const before = src.getTokenBefore(body);
            const after = src.getTokenAfter(body);
            const parenthesized = before?.value === '(' && after?.value === ')';
            const range = parenthesized ? [before.range[0], after.range[1]] : body.range;
            return fixer.replaceTextRange(range, `{\n  return ${src.getText(body)};\n}`);
          }
        });
      }
    };
  }
};

export default {
  meta: { name: 'local' },
  rules: { 'wrapped-arrow-braces': wrappedArrowBraces }
};
