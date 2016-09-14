HTMLCollection.prototype.map = function(fn) {
	var results = [];
	for (var idx = 0; idx < this.length; idx++) {
		results.push(fn(this.item(idx)));
	}
	return results;
};

HTMLCollection.prototype.forEach = function(fn) {
	for (var idx = 0; idx < this.length; idx++) {
		fn(this.item(idx));
	}
};
