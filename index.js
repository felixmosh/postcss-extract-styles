var postcss = require('postcss');

function extend(a, b) {
	for (var key in b)
		if (b.hasOwnProperty(key))
			a[key] = b[key];
	return a;
}

module.exports = postcss.plugin('postcss-extract-styles', function (opts) {
	opts = extend({
		remove: false,
		pattern: false
	}, opts);

	function handleDeclarations(rule, newRule, options) {
		rule.walkDecls(function (decl) {
			if (options.pattern.test(decl.toString())) {
				var newDecl = decl.clone();
				newDecl.raws = decl.raws;
				newRule.append(newDecl);

				if (options.remove) {
					decl.remove();

					if (rule.nodes.length === 0) {
						rule.remove();
					}
				}
			}
		});
	}

	function cloneRule(rule) {
		var newRule = rule.clone();

		newRule.removeAll();

		return newRule;
	}

	function cloneAtRole(rule) {
		var newAtRule = rule.clone();

		newAtRule.removeAll();

		return newAtRule;
	}

	function extractStyles(css, newcss, opts) {
		css.each(function (rule) {
			if (rule.type === 'atrule' && rule.walkRules) {
				var newAtRule = cloneAtRole(rule);
				extractStyles(rule, newAtRule, opts);

				if (newAtRule.nodes.length) {
					newcss.append(newAtRule);
				}
				if (opts.remove && rule.nodes.length === 0) {
					rule.remove();
				}
			}
			else if (rule.type === 'rule' && rule.walkDecls) {
				var newRule = cloneRule(rule);

				handleDeclarations(rule, newRule, opts);
				if (newRule.nodes.length) {
					newcss.append(newRule);
				}
			}
		});

	}


	return function (css, result) {
		var newcss = postcss.root();

		extractStyles(css, newcss, opts);

		result.root = opts.remove ? css : newcss;
	};
});
