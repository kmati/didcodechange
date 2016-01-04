/*
 * This module is the file checker
 */
var path = require('path');
var config = require('../configuration/config.json');
var gaze = require('gaze');
var differ = require('../diffing/differ-access.js').get();

var httpClient = {
    /*
     POSTs data to an Url
     opts   : The parameters
     url                 : The url to POST the data to
     data                : The data being posted (NOT a JSON string; pass in the actual object!!)
     headers             : An object whose properties are the headers to be copied over
                            Only the properties whose values are strings are copied over!!!
     fnOnChunkReceived   : The callback that is invoked when each chunk of the response is received; void function (string chunk)
     When the all of the response has been received then the function is called with null as the argument; fnOnChunkReceived(null)
     fnOnError           : The callback that is invoked when an error is received as the response; void function (Error error)
     */
    postData: function (opts) {
        var url = opts.url,
        data = JSON.stringify(opts.data),
        fnOnChunkReceived = opts.fnOnChunkReceived,
        fnOnError = opts.fnOnError;

        var http = httpLibAccess.getRequiredModule(url);
        var urlParts = urlLib.parse(url);

        var headers = {
            'Content-Type': 'application/json',
            'Content-Length': data.length
        };

        for (var h in opts.headers) {
            var v = opts.headers[h];
            if (typeof v === 'string') {
                headers[h] = v;
            }
        }

        var options = {
            hostname: urlParts.hostname,
            port: urlParts.port,
            path: urlParts.path,
            method: 'POST',
            headers: headers,
            rejectUnauthorized: false // don't fail with self-signed SSL cert!
        };

        var req = http.request(options, function(res) {
            res.on('data', function (chunk) {
                 var chunkStr = chunk.toString();
                 console.log(chunkStr);
                 if (fnOnChunkReceived){
                     fnOnChunkReceived(chunkStr);
                 }
             })
            .on('end', function(){
                 if (fnOnChunkReceived){
                     fnOnChunkReceived(null);
                 }
             })
         });

        req.on('error', function(e) {
            console.log('problem with request: ' + e.message);
            if (fnOnError){
                fnOnError(e);
            }
        });

        req.write(data);
        req.end();
    },
    
    /*
     POSTs data to an url and then returns an object or an error
     url        : The url to POST to
     data       : The data
     fnResult   : The callback that is invoked with the resulting object; void function (object result)
     fnError    : The callback that is invoked with an error; void function (object error)
     */
    postAndReceiveObject: function (url, data, fnResult, fnError) {
        var content = "";
        this.postData({
            url: url,
            data: data,
            fnOnChunkReceived: function (chunk) {
                if (chunk) {
                    content += chunk;
                } else {
                    try {
                        var result = JSON.parse(content);
                        fnResult(result);
                    } catch(e) {
                        fnError({ error: e.toString(), responseText: content });
                    }
                }
            },
            fnOnError: fnError
        });
    }
};

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
		console.log("[uploadDiffPackage] pkg = ",pkg);

		function onError(err) {
			callback(err);
		}

		function onSuccess(result) {
			console.log('[uploadDiffPackage] result = ',result);
			callback();
		}
		httpClient.postAndReceiveObject('/upload-diff', pkg, onSuccess, onError); 
	}
};

for (var key in fileChecker) {
	exports[key] = fileChecker[key];
}
