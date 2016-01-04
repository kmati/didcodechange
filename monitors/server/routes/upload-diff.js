/*
 * The upload-diff web service API.
 */
var httpUtils = require('../http-utils.js');
var notificationComparer = require('../notifications/notification-comparer.js');

var handlers = {
	// Binds the routes handled inside this module to the Express app
	// app	: The Express app
	bindRoutes: function (app) {
	    app.post('/upload-diff', this.post);
	},
	
	/*
	req.body looks like this:
	{
		'edited-by': 'kmati',
		'edited-at': '2016-01-03T13:24:57.000Z',
		'path': '/users/thedude/some/path/some-file.js',
		'repository-url': 'https://some-account/some-repo.git",
		'revision-number': '0298127aa',
		'content': 'The content of the new edit made by kmati',
		'diff': [<An array of diffs>]
	}
	*/
	"post": function (req, res) {
		var diffPkg = req.body;

		notificationComparer.compare(diffPkg, function (err) {
			if (err) {
				httpUtils.writeHead500(res);
				res.end(JSON.stringify({
					"error" : err.toString()
				}));
				return;
			}

			httpUtils.writeHead200(res);
			res.end(JSON.stringify({
				'edited-by': diffPkg['edited-by'],
				'edited-at': diffPkg['edited-at'],
				'path': diffPkg['path'],
				'repository-url': diffPkg['repository-url'],
				'revision-number': diffPkg['revision-number'],
				'status': 'Enqueued for alert dispatch'
			}));
		});
	}
};

for (var key in handlers) {
    exports[key] = handlers[key];
}
