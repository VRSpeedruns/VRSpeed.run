# gamedata.js

* [`onGameDataLoad()`](#onGameDataLoad)
* [`loadAllGames()`](#loadAllGames)
* [`setEvents()`](#setEvents)
* [`toggleGameSelector()`](#toggleGameSelector)
* [`gameSelectorTypeDelay()`](#gameSelectorTypeDelay)
* [`onGameChange()`](#onGameChange)
* [`loadGame()`](#loadGame)
* [`loadVariables()`](#loadVariables)
* [`displayCategoryTabs()`](#displayCategoryTabs)
* [`miscTabToggle()`](#miscTabToggle)
* [`displayCategory()`](#displayCategory)
* [`displayCategoryVariables()`](#displayCategoryVariables)
* [`setVariable()`](#setVariable)
* [`loadRuns()`](#loadRuns)
* [`gameFavToggle()`](#gameFavToggle)
* [`nth()`](#nth)
* [`timeAgo()`](#timeAgo)
* [`runTimeFormat()`](#runTimeFormat)
* [`scrollIfNeeded()`](#scrollIfNeeded)

## [View the file](https://github.com/VRSpeedruns/VRSR/blob/master/vrsrassets/js/gamedata.js)

### `onGameDataLoad()`

This function is called on page load (from `onLoad()`). It instantiates page element variables and arrays related to platforms and timing methods.

It then determines what page the user is currently on.

* It gets the current game with `getGame()` (if it exists).
* If it's `/streams`, it loads the streams page with `loadStreams()`.
* If it's `/about`, it hides all containers and displays the about container.
* If it's a user page, load the user page with `loadUser(getUser())`.
* If it's `/leaderboard`, load the last game (if it exists).

If there's a game to load, it loads the game. Otherwise, it loads the homepage.

### `loadAllGames()`

Uses the array `gamesArray[]`, which is created on the server-end through PHP. It sorts the games alphabetically and moves favorited games to the top of the array, and then adds them to both the desktop and mobile game selectors.

### `setEvents()`

Adds some event listeners that handles closing the game selector if a user clicks away, the up and down arrow keys when in the selector, and hiding the misc. category tab if a user clicks away or scrolls the list of tabs.

### `toggleGameSelector()`

Function that toggles the game selector. It handles setting or resetting the selected game within the desktop selector.

### `gameSelectorTypeDelay()`

Used to reset the typed content when entering text into the game selector; text is reset after 2 seconds of no typing.

### `onGameChange()`

Function that's called whenever a game is selected, either in the desktop or mobile selectors.

### `loadGame()`

This function starts the process of loading a game's leaderboard.

At the start, it checks to see if an ID is even provided, and loads the home page if not. Then, it checks to see if we're actually on a user page, and it loads the user page instead.

At this point, we know we're loading a game and we display the game container.

Then, we get to this fun block of code. Instead of writing it out, I'm just gonna add comments to it below.

```
//If the game in the URL isn't the provided ID...
if (getGame() !== id)
{
    //...update the URL.
    pushState(id);
}
//Else, if
// (
// - This is being called from page load or state change,
// - OR
// - `currentGame` is set to the game trying to be loaded
// )
// AND
// `force` isn't true
else if ((!loadOrState || (currentGame !== undefined && currentGame.abbreviation == id)) && !force)
{
    // If we're current on a run page...
    if (getRun())
    {
        //...open the run.
        openRun(getRun(), loadOrState);
    }
    else
    {	
        //Set the page name, set the ID/anchor in the URL to the current category, then load the runs for that category.
		document.title = `${currentGame.name} - VRSR`;
        setHash(categories[currentCatIndex].name.replace(/ /g, '_').replace(catNameRegex, ''));
        loadRuns(categories[currentCatIndex].id, currentVariables, loadOrState);
    }

    return;
}
```

Then, if we're currently on a run page, we need to check to see what category the run belongs to, so we make a call to the `runs` endpoint of the Speedrun.com API to get this information, which is stored in the global variable `runLoadedCategory`. We then re-call `loadGame()` with the same parameters.

Then it sets the `currentGame` and `gameId` variables to the correct object/string respectively, and it sets both the desktop and mobile game selectors to the current game.

Then we determine if this game is in a user's favorites, and change the style of the favorite star accordingly.

Then we set the title of the page to the name of the game, set the proper CSS variables to the game's colors, and various page elements like game name and links to the correct values. Then we remove old Tippys (if any).

Now, it hits the Speedrun.com API's `games` endpoint to get important game data. We then set the game's image and determine the game's timing methods (and adjust the run table accordingly).

This API call embeds several things (`platforms,categories,categories.variables,categories.game,moderators`), which allows us to get all relevant game information in a single call:

* Platforms
* Categories + Category Variables
* Moderators + Full user information about each

By embedding the game within the categories, it allows us to get the unembedded moderator IDs and their respective roles (mod/super mod). It goes into the first category and store the id/role pair in an array.

We then loop through all the game's categories, store them in the `categories[]` array, and if the category has variables, call `loadVariables()` using that category's variables object. After the loop, it calls `displayCategoryTabs()`.

We then loop through all moderator objects in the embedded user list and load them into the game info sidebar with their correct name color/icon/flag/etc).

### `loadVariables()`

We hit the Speedrun.com API using the variables object provided from `loadGame()`. We then loop through all the variables, and if they're a subcategory we add it to the `variables` property of the relevant category object.

### `displayCategoryTabs()`

This function loops through all categories and creates the tab elements for each.

If a category is misc, it is sorted into a separate array, which is then displayed in a misc. dropdown.

The function then checks to see if `runLoadedCategory` is set, and loads that category if it is. If not, it checks to see if the page hash is set, and if it is it loads that category. If neither of these are set, it loads the first category.

### `miscTabToggle()`

Quick function that toggles the misc. categories dropdown. If it's enabling it, it calculates the position it should be at on screen.

### `displayCategory()`

This function starts the process of displaying a category. It starts by making sure this category's tab is the only one active (and if it's a misc. category, also make the main misc. tab itself active).

If this function was called by clicking on one of the tabs, we also set the hash for this category in the URL.

Then it calls `displayCategoryVariables()`.

### `displayCategoryVariables()`

This function goes through each category and adds the buttons related to each variable and it's values.

If a variable has only one value that isn't ignored, it sets it as the default and hides the button.

After each variable, `setVariable()` is called. After each variable has been set, `loadRuns()` is called.

### `setVariable()`

This function updates the variable values in the `currentVariables[]` array, and sets the correct variable button to active.

If the `loadAfter` parameter is `true`, then it runs `loadRuns()`.

### `loadRuns()`

This function loads all the runs for the currently active category and the currently active variables.

It starts by checking to see if there are any variables, and it creates a string of the currently set variables to be used in the URL of the api call. Then, any old Tippy elements are removed.

Then it makes a call to the `leaderboards` endpoint of the Speedrun.com API, specifically `leaderboards/<game id>/category/<category id>`. This API call stores players and platforms in arrays (for easier access later), then starts looping through all the runs.

In each run, we get relevant information about the run: the place, the times, the player, the platform or hardware variable name, and the date. It also formats all player names with their flag, moderator icon (if needed), and a user's custom icon (if it exists). The page also adds icons on the right if the run has a video attached, and/or if it has Splits.io splits attached. Tippy elements are also created here for all the various icons (not instantiated yet, the information is just stored in arrays for now).

After looping through all the runs, we check to see if there are any empty time columns, and we hide them if there are. Then, if we aren't on mobile, we isntantiate all the Tippy elements stored in the arrays populated when looping through the runs. Also, for each non-guest user, a hover card is added to their name using Tippy.

At the very end, it checks to see if the user is actually on a run page, and if they are it loads the run. There are two reasons why it loads all the runs even if we're just on a run page. The first is to get the run's place, as by itself a run does not have it's place included, because depending on the way the runs are filtered it could be in any place. The other is to make it much quicker to go from looking at an individual run to looking at all the runs in that category/subcategory (if a user is linked directly to a run rather than clicking on a run from the leaderboard itself).

If we aren't on a run page, we hide the loading animation and display the runs.

### `gameFavToggle()`

This function handles the adding/removing of a game to a user's favorites. The favorites are stored in a serialized array in the user's cookies.

### `nth()`

This is a simple function that takes a number and returns a string with the number followed by an ordinal indicator.

### `timeAgo()`

This function turns a date object into a relative date, such as "3 days ago," "two months ago," etc.

### `runTimeFormat()`

This function takes the string that the run object has for run time and parses it out to a more human-readable format (#h #m #s #ms).

### `scrollIfNeeded()`

This function will scroll an parent element to bring a child element into view. It is used in the desktop game selector.