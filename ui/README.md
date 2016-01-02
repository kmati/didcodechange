ui
==

The UI performs these functions:

* Allows the user to set up alerts
* Portrays the notifications received for the user

Architecture for alerts
=======================

Persisting alerts
-----------------

* ui: alert form:

```
- Notify me when anyone changes code that calls this function
- Notify me when anyone changes a function referenced by my changes
- Notify me when anyone changes a function referenced in the same function as my changes
```

* Persist the alert from the ui alert form


Reporting alerts
----------------

* Get notifications that match alerts and display briefs on each on screen
* When user clicks on link in notification brief the user gets the full notification info

