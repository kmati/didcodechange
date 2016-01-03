var fileChecker = require('../monitors/client/file-checking/file-checker.js');
fileChecker.monitor(function () {
	console.log("All done");
});
