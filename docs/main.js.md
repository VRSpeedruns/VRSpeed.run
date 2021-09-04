# main.js

* [`onLoad()`](#onLoad)
* [`setMainEvents()`](#setMainEvents)
* [`pushState()`, `replaceState()`](#pushState-replaceState)
* [`setHash()`, `getHash()`](#setHash-getHash)
* [`getGame()`](#getGame)
* [`getRun()`](#getRun)
* [`getUser()`](#getUser)
* [`backFixUrl()`](#backFixUrl)
* [`navbarMobileToggle()`, `toggleNavDropdown()`](#navbarMobileToggle-toggleNavDropdown)
* [`hideAllContainers()`](#hideAllContainers)
* [`infoTippy()`](#infoTippy)
* [`getCardHTML()`](#getCardHTML)
* [`makeUnique()`](#makeUnique)
* [`get()`](#get)
* [`getErrorCheck()`](#getErrorCheck)
* [`sendErrorNotification()`, `closeErrorNotification()`](#sendErrorNotification-closeErrorNotification)
* [`setCookie()`, `getCookie()`](#setCookie-getCookie)

## [View the file](https://github.com/VRSpeedruns/VRSR/blob/master/vrsrassets/js/main.js)

### `onLoad()`

This is the first function called when the page loads. It instantiates a few page element variables, then removes any query strings from the path.

Then, it checks if it's loading on the homepage, loads latest world records.

Then it loads some Tippy elements that don't need to be changed, and then triggers several other onLoad functions for each of the other JS files.

### `setMainEvents()`

Adds some event listeners that handles loading games on popstate, opening runs from the runs table, and closing dropdowns when clicking away from them.

### `pushState()`, `replaceState()`

These functions are shorthand for the `history.pushState()` and `history.replaceState()`. These are only used to modify the page path, so these functions make it a bit easier to work with them by providing default values for everything except the path value.

### `setHash()`, `getHash()`

`setHash()` is used to modify the hash in the url using `replaceState()`. `getHash()` is used to check the hash when loading leaderboards with the category in the URL.

### `getGame()`

This function parses the current url to get the current game abbreviation , which sometimes isn't actually a game (on the "stream" page, `getGame()` returns "stream")

### `getRun()`

This function parses the current url to get id of the current run.

### `getUser()`

This function parses the current url to get the name of the current user.

### `backFixUrl()`

This function fixes the url when the back button on run pages is pressed.

### `navbarMobileToggle()`, `toggleNavDropdown()`

Functions that toggle the "is-active" class for use on the navbar.

### `hideAllContainers()`

This function hides the main containers of the site (`home-container`, `main-container`, `user-container`, `streams-container`)

### `infoTippy()`

Loads some Tippy elements that don't have any dynamic content.

### `getCardHTML()`

Formats and returns the HTML for the hover card elements on user links.

### `makeUnique()`

As the server-side cache appears to be unpredictable in how often it updates, this method adds a number based on the current epoch time to the end of query strings, which bypasses the server-side cache. Retrieved data is now accurate every five minutes.

### `get()`

Makes a XMLHttpRequest that returns a promise.

### `getErrorCheck()`

Quick function that checks to make sure the Speedrun.com API didn't error out, and if it did, send a notification.

### `sendErrorNotification()`, `closeErrorNotification()`

`sendErrorNotification()` sends an error notification that appears in the top right. `closeErrorNotification()` closes the notification.

### `setCookie()`, `getCookie()`

Set or get cookies in a user's browser.