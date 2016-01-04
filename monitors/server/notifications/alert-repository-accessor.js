/*
 * This module is the alert repository accessor which persists the alerts.

 A sample alert:
 {
 	'reference': {
		'file': 'The path to the source file of the function we care to be alerted for',
		'functionQualifiedName': 'Partial or fully qualified name of the function we care to be alerted for'
 	}
 }
 */
var alertRepositoryAccessor = {
	// callback: void function (alertsArray)
	all: function (callback) {

	},

	// callback: void function (err)
	save: function (alert, callback) {

	}
};

for (var key in alertRepositoryAccessor) {
	exports[key] = alertRepositoryAccessor[key];
}
