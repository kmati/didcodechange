/*
 * This module performs the diffing for git
 */
var config = require('../configuration/config.json');
var child_process = require('child_process'),
	fs = require('fs'),
	path = require('path');
var gitPath = config.monitoring['git-executable'];

var jsdiff = require('diff');

var gitDiffer = {
	// callback: void function (err, diffArr)
	diffFile: function (filePath, callback) {
		var self = this;
		var dirPath = path.dirname(filePath);
	    child_process.exec(gitPath + " diff HEAD \"" + filePath + "\"", { cwd: dirPath }, function (error, output, stderr) {
	        if (error) {
	        	console.error('[diffFile.error] ',error);
	            callback(error);
	            return;
	        }

	        if (stderr) {
	        	console.error('[diffFile.stderr] ',stderr);
	        	callback(stderr);
	        	return;
	        }

	        console.log('[diffFile.stdout] ',output);

	        self.readFile(filePath, function (err, currentFileContent) {
	        	if (err) {
	        		callback(err);
	        		return;
	        	}

	        	var diffArr = jsdiff.diffChars(output, currentFileContent);
	        	callback(null, diffArr);
	        });
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
	}
};

for (var key in gitDiffer) {
	exports[key] = gitDiffer[key];
}
