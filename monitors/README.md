didcodechange monitors
======================

What are the monitors?
======================

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

* File monitor: reads files on-file-changed and sends notification to server
* Notification persister: persists the notification


on-file-changed workflow
------------------------

Executed on the client

1. git diff local file against last local repo commit
2. create diff package to contain the diff
3. add meta data (see above) to diff package
4. upload diff package to server


on-upload-received workflow
---------------------------

Executed on the server

1. extract diff package
2. invoke notificationComparer -> yields 0+ matches (see notificationComparer section below for details)
3. the matches are added to the alertQueue
4. the alertQueue will broadcast to subscribers (e.g. alerts log file, external alert listener or UI)



notificationComparer
--------------------

Inputs:

1. diff package
2. alerts

Process:

1. foreach alert, compare requirements against diff package
- use esprima to parse AST for JS code
- use AST to detect references
- if match then alert is yielded
- 0+ alerts may match a single diff package
-> a match = [diff package reference] + [alert reference]


alertQueue
----------

This subsystem can be registered to via an http endpoint.
It's function is to broadcast the matches (see above) to external systems.
