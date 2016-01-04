/*
 * This module is the alert queue that is used to transmit matches between alerts and diff packages
 */
var alertQueue = {
	enqueue: function (alert, diffPkg, callback) {
		var workItem = {
			alert: alert,
			diffPkg: diffPkg
		};

		// TODO: Enqueue the work item
	}
};

for (var key in alertQueue) {
	exports[key] = alertQueue[key];
}
