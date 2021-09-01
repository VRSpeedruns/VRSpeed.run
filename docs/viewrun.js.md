# viewrun.js

## [View the file](https://github.com/VRSpeedruns/VRSR/blob/master/vrsrassets/js/viewrun.js)

### `onSingleRunLoad()`

This function is called on page load (from `onLoad()`). It instantiates page element variables.

### `openRun()`

This function loads a run by it's ID. It hits the Speedrun.com API's `runs` endpoint to get relevant information about the run.

On the first run of the function, the function checks to see if it can find the relevant page element with ID `run-<run id>`. If it doesn't find it, it'll call `loadRuns()` again to attempt to load the correct category and variable.

On the second run, it'll set `ignorePlace` to true, which will then skip over adding the run's place number to the run info.

If it's run a third time, it'll send an error notification.

It also hits the Speedrun.com API's `users` endpoint to get information about the verifier of the run.

If the given run has Splits.io splits, it will then call `loadSplits()`

### `closeRun()`

Simple function that hides the run page element.

### `loadSplits()`

Function that loads Splits.io splits for a run. It hits the Splits.io `runs` endpoint to get info about the run's splits.

It will display the correct default timing method first, and can switch between both real-time and game-time if the splits have both.

First, the splits bar is constructed by looping over all the splits. Then, the splits table is constructed by once again looping over all the splits. Headings and actual splits are parsed out if the splits include them.

### `msToTime()`

A function that takes a number of milliseconds and converts it to a timespan with the format "`hours`:`minutes`:`seconds`.`milliseconds`".

### `msToTimeAll()`

A function that takes a number of milliseconds and converts it to a timespan with the format "`hours`h `minutes`m `seconds`s `milliseconds`ms".

### `msToTimeSingle()`

A function that takes a number of milliseconds and converts it to a timespan similar in format to `msToTimeAll()`, but only shows the largest non-zero time value.

Ex: If `msToTimeAll()` returns `15m 10s 200ms`, `msToTimeSingle()` would return `15m`.