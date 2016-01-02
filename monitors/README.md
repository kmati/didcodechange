didcodechange monitors
======================

What does this do?
==================

The monitors are:

* File monitor for JavaScript source files

The data grabbed by the monitor is sent via notification (done when on-file-changed event is raised):

```
{
	"edited-by": "kmati",
	"edited-at": "2016-01-05T12:34:59",
	"path": "$/foo/bar/baz.js",
	"content": "<The actual source code of the file as it currently exists on kmati's machine>",
	"repository-url": "<The url to the scm repository>",
	"revision-number": "<The revision # of the last revision that the user is working on>",
	"diff": [<The diffs (line based) that show what the user has actually changed]
}
```

The file monitor sends the notifications to the other clients every time there is a change in the monitored files.


Architecture
============

+--------------+
| File monitor | reads files on-file-changed and sends notification to server
+--------------+

+------------------------+
| Notification persister | persists the notification
+------------------------+
