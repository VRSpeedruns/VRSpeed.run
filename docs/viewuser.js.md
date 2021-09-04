# viewuser.js

* [`onUserLoad()`](#onUserLoad)
* [`loadUser()`](#loadUser)
* [`loadUserRuns()`](#loadUserRuns)
* [`loadUserModeratorOf()`](#loadUserModeratorOf)
* [`loadUserRounCount()`](#loadUserRounCount)
* [`setUserRunContainerSize()`](#setUserRunContainerSize)
* [`openUserRun()`](#openUserRun)

## [View the file](https://github.com/VRSpeedruns/VRSR/blob/master/vrsrassets/js/viewuser.js)

### `onUserLoad()`

This function is called on page load (from `onLoad()`). It instantiates page element variables.

### `loadUser()`

This function hits the Speedrun.com API's `users/<user>` endpoint to get information about the given user. It creates a display of the user's name, profile picture (if exists), pronouns, social links, etc.

It then calls `loadUserRuns()` and `loadUserModeratorOf()`.

### `loadUserRuns()`

This function hits the Speedrun.com API's `users/<user>/personal-bests` endpoint to get all of a user's personal bests. It creates a list of all of a user's runs, grouped by game, that shows categories, times, etc.

It also calls `loadUserRunCount()`.

### `loadUserModeratorOf()`

This function hits the Speedrun.com API's `games` endpoint to determine which games the given user is a moderator of. It then filters the games down to just VR games on the site, and displays them with the other user info from `loadUser()`.

### `loadUserRounCount()`

This function hits the Speedrun.com API's `runs` endpoint to determine how many runs in VR games on the site a given user has done. If the number of user runs (in general) exceeds the limits of the API (`max=200`), it will use the given pagination links to continue to count runs until done.

### `setUserRunContainerSize()`

This function sets the `min-height` value of each of the individual game tables in user runs to the size of the game's cover image, which improves the look of the page.

### `openUserRun()`

Simple function to open user runs when clicked.