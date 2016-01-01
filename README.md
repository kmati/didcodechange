didcodechange
=============

This is a project about taking care of the following concerns that JavaScript software developers have:

* Who is working on code that depends on the code I am working on?
* Who is working on code that my code depends on?
* What are the various pieces of code that are related to this particular function?


Why is this important?
======================

Ever change JS code and worry what else might be affected? You don't want to mess things up but you have no way
of knowing what the effects will be. If it's a really large project then you may want to know who else is working
on code that is related to that bit of code your dealing with.


Only JavaScript?
================

Yes, for now this project is only related to JavaScript. Will that change in future? Maybe...


Parts of the system
===================

The 2 major parts are:

* monitors
* ui


monitors
========

These are the file monitoring services that are run locally on developer workstations. They check to see who is working on what piece of code and when.

ui
==

This is where you set and receive alerts for any bits of code you care about or are working on. You can also query
the JS codebase to find out what bits of code are related to others. The recommended use of the ui is to set up the
alerts and then let them roll in. That way you can get on with your work and only need to respond when you are alerted
to the fact that someone else is dealing with code that is depended on or is a dependency.
