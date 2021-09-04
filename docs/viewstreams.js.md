# viewstreams.js

* [`onStreamsLoad()`](#onStreamsLoad)
* [`loadStreams()`](#loadStreams)

## [View the file](https://github.com/VRSpeedruns/VRSR/blob/master/vrsrassets/js/viewstreams.js)

### `onStreamsLoad()`

This function is called on page load (from `onLoad()`). It instantiates page element variables.

### `loadStreams()`

This function loads all the streams on the page. The JSON data is accessed from the `twitch.php` script.

We loop through each stream object and construct HTML elements for each, whcih are added to the page.