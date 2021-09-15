# status.js

* [`onStatusLoad()`](#onStatusLoad)
* [`statusStart()`](#statusStart)
* [`runStatus()`](#runStatus)
* [`loadStatus()`](#loadStatus)

## [View the file](https://github.com/VRSpeedruns/VRSR/blob/master/vrsrassets/js/status.js)

### `onStatusLoad()`

This function is called on page load (from `onLoad()`). It instantiates a page element variable.

### `statusStart()`

This function begins the process of displaying status info. It displays a loading animation, then calles `runStatus()`, followed by creating an interval that calls `runStatus()` every 10 seconds.

### `runStatus()`

This function will either call the GitHub API to get the heartbeat data, or get this data from the existing `last_status` cookie. If it calls the GitHub API, it formats the info down into an array of objects, then calls `loadStatus()`.

### `loadStatus()`

This function takes the status objects and creates page elements for each.