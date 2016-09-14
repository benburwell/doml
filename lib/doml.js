(function() {
	var listFromHtmlCollection = function(collection) {
		var lst = [];
		for (var idx = 0; idx < collection.length; idx++) {
			lst.push(collection[idx]);
		}
		return lst;
	};
	
	var DomlEvaluator = function() {
		var me = this;

		// members of the Types object are functions that take a string and return
		// an appropriate value as a native type
		me.Types = {
			'number': function(val) {
				if (val.indexOf('.')) {
					return parseFloat(val);
				} else {
					return parseInt(val, 10);
				}
			},

			'string': function(val) {
				return val;
			},

			'boolean': function(val) {
				if (val === 'true') {
					return true;
				}
				if (val === 'false') {
					return false;
				}
				throw new Error('Invalid boolean value ' + val);
			}
		};

		// members of the BinaryOperators object are functions that take two arguments
		// and return the result of that operation
		me.BinaryOperators = {
			'!=': function(a, b) {
				return a != b;
			},

			'<': function(a, b) {
				return a < b;
			},

			'>': function(a, b) {
				return a > b;
			},

			'-': function(a, b) {
				return a - b;
			},

			'+': function(a, b) {
				return a + b;
			},

			'==': function(a, b) {
				return a == b;
			},

			'<=': function(a, b) {
				return a <= b;
			},

			'>=': function(a, b) {
				return a >= b;
			}
		};

		// members of the Statements object are functions that take a dataset, children, and context
		// and return the result of the statement
		me.Statements = {
			'statement-sequence': function(dataset, children, context) {
				var retval = null;
				children.forEach(function(child) {
					retval = me.evaluate(child, context);
				});
				return retval;
			},

			'while': function(dataset, children, context) {
				var condition = children[0];
				var body = children[1];
				while (me.evaluate(condition, context)) {
					me.evaluate(body, context);
				}
			},

			'compare': function(dataset, children, context) {
				var operator = me.BinaryOperators[dataset.op];
				var lhs = me.evaluate(children[0], context);
				var rhs = me.evaluate(children[1], context);
				var result = operator(lhs, rhs);
				return result;
			},

			'variable': function(dataset, children, context) {
				return context[dataset.name];
			},

			'constant': function(dataset, children, context) {
				return me.Types[dataset.type](dataset.val);
			},

			'branch': function(dataset, children, context) {
				if (me.evaluate(children[0], context)) {
					return me.evaluate(children[1], context);
				} else if (children.length > 2) {
					return me.evaluate(children[2], context);
				}
			},

			'assign': function(dataset, children, context) {
				context[dataset.name] = me.evaluate(children[0], context);
				return context[dataset.name];
			},

			'bin-op': function(dataset, children, context) {
				var operator = me.BinaryOperators[dataset.op];
				var lhs = me.evaluate(children[0], context);
				var rhs = me.evaluate(children[1], context);
				return operator(lhs, rhs);
			},

			'return': function(dataset, children, context) {
				return me.evaluate(children[0], context);
			},

			'print': function(dataset, children, context) {
				var args = children.map(function(child) {
					return me.evaluate(child, context);
				});
				console.log.apply(this, args);
			}
		};

		// members of the Readability object are functions which take an element
		// and return an array of additional text nodes which should be added
		// to enhance readability
		me.Decorators = {
			'assign': function(e) {
				return [ e.dataset.name ];
			},

			'variable': function(e) {
				return [ e.dataset.name ];
			},

			'constant': function(e) {
				return [ e.dataset.type + '(' + e.dataset.val + ')' ];
			},

			'compare': function(e) {
				return [ e.dataset.op ];
			},

			'bin-op': function(e) {
				return [ e.dataset.op ];
			}
		};

		me.evaluate = function(node, context) {
			if (typeof context === 'undefined') {
				context = {};
			}
			var value = me.Statements[node.className](node.dataset, listFromHtmlCollection(node.children), context);
			return value;
		};

		me.appendText = function(node, text) {
			var n = document.createElement('var');
			n.innerText = text;
			node.appendChild(n);
		};

		me.decorate = function(root) {
			var classes = Object.keys(me.Decorators);
			for (var idx = 0; idx < classes.length; idx++) {
				var klass = classes[idx];
				var els = listFromHtmlCollection(root.getElementsByClassName(klass));
				els.forEach(function(el) {
					me.Decorators[klass](el).forEach(function(text) {
						me.appendText(el, text);
					});
				});
			}
		};

		me.run = function(root) {
			var t0 = performance.now();
			me.evaluate(root);
			var t1 = performance.now();
			me.decorate(root);
			console.debug('Evaluated DOML program in ' + (t1 - t0) + 'ms');
		}
	};

	var Doml = {
		Evaluator: DomlEvaluator,
		runOnLoad: function(root) {
			document.addEventListener('DOMContentLoaded', function() {
				(new DomlEvaluator()).run(document.body.children[0]);
			});
		}
	};

	if (typeof module !== 'undefined' && typeof module.exports !== 'undefined') {
		module.exports = Doml;
	} else if (typeof window !== 'undefined') {
		window.Doml = Doml;
	} else {
		throw new Error('Unable to register Doml');
	}
})();

