/*
 * This is the notification comparer that is responsible for vetting the diff packages against the registered alerts.
 */
// TODO: Gets the alerts that have been registered
var alerts = {};

var notificationComparer = {
	/*
	 * TODO: Compare diffPkg against alerts
	 * TODO: Find matches: alert + diffPkg
	 * TODO: Enqueue the matches onto the alert queue
	 * TODO: Invoke callback
	 */
	// callback: void function (err)
	compareDiff: function (diffPkg, callback) {

	}
};

for (var key in notificationComparer) {
	exports[key] = notificationComparer[key];
}
