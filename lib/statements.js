var getStatementEvaluators = function(evaluate) {
	return {
		'statement-sequence': function(dataset, children, context) {
			var retval = null;
			children.forEach(function(child) {
				retval = evaluate(child, context);
			});
			return retval;
		},

		'while': function(dataset, children, context) {
			var condition = children[0];
			var body = children[1];
			while (evaluate(condition, context)) {
				evaluate(body, context);
			}
		},

		'compare': function(dataset, children, context) {
			var operator = binaryOperators[dataset.op];
			var lhs = evaluate(children[0], context);
			var rhs = evaluate(children[1], context);
			var result = operator(lhs, rhs);
			return result;
		},

		'variable': function(dataset, children, context) {
			return context[dataset.name];
		},

		'constant': function(dataset, children, context) {
			return stringToType(dataset.val, dataset.type);
		},

		'branch': function(dataset, children, context) {
			var condition = children[0];
			var ifBody = children[1];

			// else is optional
			if (children.length > 2) {
				var elseBody = children[2];
			}

			if (evaluate(condition, context)) {
				return evaluate(ifBody, context);
			} else if (elseBody) {
				return evaluate(elseBody, context);
			}
		},

		'assign': function(dataset, children, context) {
			context[dataset.name] = evaluate(children[0], context);
			return context[dataset.name];
		},

		'bin-op': function(dataset, children, context) {
			var operator = binaryOperators[dataset.op];
			var lhs = evaluate(children[0], context);
			var rhs = evaluate(children[1], context);
			return operator(lhs, rhs);
		},

		'return': function(dataset, children, context) {
			return evaluate(children[0], context);
		},

		'print': function(dataset, children, context) {
			var args = children.map(function(child) {
				return evaluate(child, context);
			});
			console.log.apply(this, args);
		}
	};
};
