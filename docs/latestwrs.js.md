# latestwrs.js

## [View the file](https://github.com/VRSpeedruns/VRSR/blob/master/vrsrassets/js/latestwrs.js)

### `latestWRsLoad()`

This function is called on page load (from `onLoad()`) if currently on the homepage. This instantiates the WR container page element variable, then calls `getLatest()`.

### `getLatest()`

This function gets the 4 latest releases from the WR GitHub repo (if the `latest_wrs` cookie isn't set), and calls `loadWRs()` with an array of the run IDs.

### `loadWRs()`

This function creates the 4 run page elements in the WR container, then calls `loadWR()` on each of them.

### `loadWR()`

This function hits the speedrun.com API to get the relevant info about the given run. It constructs the HTML to display the run and adds it to that run's page element in the WR container.