(function() {
	var evaluate = function(node, context) {
		if (typeof context === 'undefined') {
			context = {};
		}
		return statementEvaluators[node.className](node.dataset, node.children, context);
	};

	var statementEvaluators = getStatementEvaluators(evaluate);

	document.addEventListener('DOMContentLoaded', function() {
		var t0 = performance.now();
		evaluate(document.body.children[0]);
		var t1 = performance.now();
		makeReadable(document.body);
		var t2 = performance.now();
		console.debug('Evaluated in ' + (t1 - t0) + 'ms');
		console.debug('Rendered in ' + (t2 - t1) + 'ms');
	});
})();
