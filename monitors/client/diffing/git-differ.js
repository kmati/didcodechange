/*
 * This module performs the diffing of a file for git
 */
var config = require('../configuration/config.json');
var child_process = require('child_process'),
	fs = require('fs'),
	path = require('path');
var gitPath = config.monitoring['git-executable'];

// test for relative path in the project-root, if that fails then interpret it as an absolute path!
var projectRootRaw = config.monitoring['project-root'];
var projectRoot = path.join(__dirname, projectRootRaw);
if (!fs.existsSync(projectRoot)) {
	projectRoot = projectRootRaw;
}

var jsdiff = require('diff');

var gitDiffer = {
	// callback: void function (err, diffArr, repositoryUrl)
	diffFile: function (filePath, callback) {
		var self = this;

		function onGotLastRevisionNumber(err, revisionNumber) {
			if (err) {
				callback(err);
				return;
			}

			function onGotFileAtRevision(err, originalFileContent) {
				if (err) {
					callback(err);
					return;
				}

		        self.readFile(filePath, function (err, currentFileContent) {
		        	if (err) {
		        		callback(err);
		        		return;
		        	}

		        	var diffArr = jsdiff.diffChars(originalFileContent, currentFileContent);

		        	self.getRepositoryUrl(function (err, repositoryUrl) {
			        	callback(null, diffArr, repositoryUrl, revisionNumber, currentFileContent);
		        	});
		        });
			}

			if (!revisionNumber) {
				// there is no prior revision
				onGotFileAtRevision(null, '');
			} else {
				// there is a prior revision
				self.getFileAtRevision(filePath, revisionNumber, onGotFileAtRevision);
			}
		}

		this.getLastRevisionNumber(filePath, onGotLastRevisionNumber);
	},


	// callback: void function (err, revisionNumber)
	getLastRevisionNumber: function (filePath, callback) {
		var dirPath = path.dirname(filePath);
	    child_process.exec(gitPath + " log \"" + filePath + "\"", { cwd: projectRoot }, function (error, output, stderr) {
	        if (error) {
	        	console.error('[getLastRevisionNumber.error] ',error);
	            callback(error);
	            return;
	        }

	        if (stderr) {
	        	if (stderr.indexOf('unknown revision') > -1) {
	        		callback(null, null);
	        		return;
	        	}

	        	console.error('[getLastRevisionNumber.stderr] ',stderr);
	        	callback(stderr);
	        	return;
	        }

	        var loc = output.indexOf('commit');
	        var locSP = output.indexOf(' ', loc);
	        var locNL = output.indexOf('\n', loc);
	        var revisionNumber = output.substr(locSP + 1, locNL - locSP - 1).trim();
	        callback(null, revisionNumber);
	    });
	},

	// callback: void function (err, fileContent)
	getFileAtRevision: function (filePath, revisionNumber, callback) {
		var relativeFilePath = filePath.replace(projectRoot + '/', '').replace(projectRoot + '\\', '');
		var dirPath = path.dirname(filePath);
	    child_process.exec(gitPath + " show \"" + revisionNumber + ":" + relativeFilePath + "\"", { cwd: projectRoot }, function (error, output, stderr) {
	        if (error) {
	        	console.error('[getFileAtRevision.error] ',error);
	            callback(error);
	            return;
	        }

	        if (stderr) {
	        	console.error('[getFileAtRevision.stderr] ',stderr);
	        	callback(stderr);
	        	return;
	        }

	        callback(null, output);
	    });
	},

	// callback: void function (err, str)
	readFile: function (filePath, callback) {
		fs.readFile(filePath, function (err, data) {
			if (err) {
				callback(err);
				return;
			}

			callback(null, data.toString());
		});
	},

	getRepositoryUrl: function (callback) {
	    child_process.exec(gitPath + " remote show origin", { cwd: projectRoot }, function (error, output, stderr) {
	        if (error) {
	        	console.error('[getRepositoryUrl.error] ',error);
	            callback(error);
	            return;
	        }

	        if (stderr) {
	        	console.error('[getRepositoryUrl.stderr] ',stderr);
	        	callback(stderr);
	        	return;
	        }

	        var loc = output.indexOf('Fetch URL:');
	        var locSP = output.indexOf(':', loc);
	        var locNL = output.indexOf('\n', loc);
	        var repositoryUrl = output.substr(locSP + 1, locNL - locSP - 1).trim();
	        callback(null, repositoryUrl);
	    });
	}
};

for (var key in gitDiffer) {
	exports[key] = gitDiffer[key];
}
