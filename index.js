const postcss = require('postcss');

module.exports = postcss.plugin('postcss-extract-styles', (opts) => {
  return (css, result) => {
    const extractedCSS = postcss.root();

    extractStyles(css, extractedCSS, opts);

    result.root = css;
    result.extracted = extractedCSS.toString();
  };
});

function extractStyles(css, newcss, opts) {
  css.each((rule) => {
    if (rule.type === 'atrule' && rule.walkRules && rule.nodes) {
      const newAtRule = cloneRule(rule);

      extractStyles(rule, newAtRule, opts);
      appendIfNotEmpty(newAtRule, newcss);
      removeIfEmpty(rule);
    }
    else if (rule.type === 'rule' && rule.walkDecls) {
      const newRule = cloneRule(rule);

      extractFromDeclarations(rule, newRule, opts);
      appendIfNotEmpty(newRule, newcss);
    }
  });
}

function extractFromDeclarations(rule, newRule, options) {
  rule.walkDecls((decl) => {
    if (options.pattern.test(decl.toString())) {
      const newDecl = decl.clone();
      newDecl.raws = decl.raws;
      newRule.append(newDecl);

      decl.remove();
      removeIfEmpty(rule);
    }
  });
}

function cloneRule(rule) {
  const newRule = rule.clone();

  newRule.removeAll();

  return newRule;
}

function appendIfNotEmpty(rule, newcss) {
  if (rule.nodes.length) {
    newcss.append(rule);
  }
}

function removeIfEmpty(rule) {
  if (rule.nodes.length === 0) {
    rule.remove();
  }
}