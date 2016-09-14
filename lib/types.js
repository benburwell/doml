var stringToType = function(str, type) {
	switch (type) {
		case 'number':
			if (str.indexOf('.')) {
				return parseFloat(str);
			} else {
				return parseInt(str, 10);
			}
		case 'string':
			return str;
		case 'boolean':
			if (str === 'true') {
				return true;
			} else if (str === 'false') {
				return false;
			} else {
				throw new Error('Invalid boolean value ' + str);
			}
		default:
			throw new Error('type', type, 'is not defined');
	}
};
