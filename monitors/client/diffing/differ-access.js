/*
 * The diffing accessor
 */
var config = require('../configuration/config.json');
var path = require('path');

var access = {
	// gets the configured differ
	get: function () {
		var differName = config.monitoring['scm-type'];
		var modulePath = path.join(__dirname, differName + '-differ.js');
		console.log('modulePath = ',modulePath);
		return require(modulePath);
	}
};

for (var key in access) {
	exports[key] = access[key];
}