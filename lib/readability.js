var appendText = function(node, text) {
	var n = document.createElement('var');
	n.innerText = text;
	node.appendChild(n);
};

var readability = {
	'assign': function(e) {
		return e.dataset.name;
	},

	'variable': function(e) {
		return e.dataset.name;
	},

	'constant': function(e) {
		return e.dataset.type + '(' + e.dataset.val + ')';
	},

	'compare': function(e) {
		return e.dataset.op;
	},

	'bin-op': function(e) {
		return e.dataset.op;
	}
};

var makeReadable = function(root) {
	var classes = Object.keys(readability);
	for (var idx = 0; idx < classes.length; idx++) {
		var klass = classes[idx];
		var els = root.getElementsByClassName(klass);
		els.forEach(function(el) {
			appendText(el, readability[klass](el));
		});
	}
};
