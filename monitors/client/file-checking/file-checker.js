/*
 * This module is the file checker
 */
var path = require('path');
var config = require('../configuration/config.json');
var gaze = require('gaze');
var differ = require('../diffing/differ-access.js').get();

var fileChecker = {
	// Starts monitoring the configured directory
	monitor: function (callback) {
		var self = this;
		var projectRoot = path.join(__dirname, config.monitoring['project-root']);
		gaze('**/*.js', { cwd: projectRoot }, function(err, watcher) {
			// On file changed
			this.on('changed', function(filepath) {
				console.log(filepath + ' was changed');
				self.diffFile(filepath, function (err) {
					if (err) {
						console.error(err);
					}
				});
			});

			// On file added
			this.on('added', function(filepath) {
				console.log(filepath + ' was added');
				self.diffFile(filepath, function (err) {
					if (err) {
						console.error(err);
					}
				});
			});

			// On file deleted
			this.on('deleted', function(filepath) {
				console.log(filepath + ' was deleted');
				self.diffFile(filepath, function (err) {
					if (err) {
						console.error(err);
					}
				});
			});

			// watcher is closed
			this.on('end', function () {
				callback();
			});
		});
	},

	// callback: void function (err)
	diffFile: function (filepath, callback) {
		var self = this;
		differ.diffFile(filepath, function (err, diffArr, repositoryUrl, revisionNumber, currentFileContent) {
			if (err) {
				callback(err);
				return;
			}

			self.packageDiffs(filepath, diffArr, repositoryUrl, revisionNumber, currentFileContent, callback);
		});
	},

	// callback: void function (err)
	packageDiffs: function (filepath, diffArr, repositoryUrl, revisionNumber, currentFileContent, callback) {
		var pkg = {
			'edited-by': config.monitoring['username'],
			'edited-at': new Date().toISOString(),
			'path': filepath,
			'repository-url': repositoryUrl,
			'revision-number': revisionNumber,
			'content': currentFileContent,
			'diff': diffArr
		};
		this.uploadDiffPackage(pkg, callback);
	},

	// callback: void function (err)
	uploadDiffPackage: function (pkg, callback) {
		console.log("[packageDiffs] the pkg = ",pkg);
		// TODO: Implement the upload
		callback();
	}
};

for (var key in fileChecker) {
	exports[key] = fileChecker[key];
}
