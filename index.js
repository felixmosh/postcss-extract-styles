const postcss = require('postcss');

module.exports = postcss.plugin('postcss-extract-styles', (opts) => {

	function handleDeclarations(rule, newRule, options) {
		rule.walkDecls((decl) => {
			if (options.pattern.test(decl.toString())) {
				const newDecl = decl.clone();
				newDecl.raws = decl.raws;
				newRule.append(newDecl);

				decl.remove();

				if (rule.nodes.length === 0) {
					rule.remove();
				}

			}
		});
	}

	function cloneRule(rule) {
		const newRule = rule.clone();

		newRule.removeAll();

		return newRule;
	}

	function extractStyles(css, newcss, opts) {
		css.each((rule) => {
			if (rule.type === 'atrule' && rule.walkRules && rule.nodes) {
				const newAtRule = cloneRule(rule);
				extractStyles(rule, newAtRule, opts);

				if (newAtRule.nodes.length) {
					newcss.append(newAtRule);
				}
				if (rule.nodes.length === 0) {
					rule.remove();
				}
			}
			else if (rule.type === 'rule' && rule.walkDecls) {
				const newRule = cloneRule(rule);

				handleDeclarations(rule, newRule, opts);
				if (newRule.nodes.length) {
					newcss.append(newRule);
				}
			}
		});
	}

	return (css, result) => {
		const extractedCSS = postcss.root();

		extractStyles(css, extractedCSS, opts);

		result.root = css;
		result.extracted = extractedCSS.toString();
	};
});
