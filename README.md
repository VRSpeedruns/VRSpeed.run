[![VRSpeed.run](https://vrspeed.run/vrsrassets/images/header.png)](https://vrspeed.run)

## About

VRSpeed.run is a central hub to view the leaderboards for the largest virtual reality games in speedrunning.

## Documentation

A writeup that describes the structure behind the JS that makes the site run. Mostly made for me when I need to bugfix this project in 3 months and don't remember how part of it works :)

* [main.js](https://github.com/VRSpeedruns/VRSR/tree/master/docs/main.js.md) - Holds core functions.
* [gamedata.js](https://github.com/VRSpeedruns/VRSR/tree/master/docs/gamedata.js.md) - Handles game data and run loading.
* [viewrun.js](https://github.com/VRSpeedruns/VRSR/tree/master/docs/viewrun.js.md) - Handles loading of individual runs.
* [latestwrs.js](https://github.com/VRSpeedruns/VRSR/tree/master/docs/latestwrs.js.md) - Handles displaying of latest world records.
* [viewuser.js](https://github.com/VRSpeedruns/VRSR/tree/master/docs/viewuser.js.md) - Handles loading of individual users.
* [viewstreams.js](https://github.com/VRSpeedruns/VRSR/tree/master/docs/viewstreams.js.md) - Handles loading of streams.
* [status.js](https://github.com/VRSpeedruns/VRSR/tree/master/docs/status.js.md) - Handles the status page.

## External Tools/Libraries

- [Speedrun.com REST API](https://github.com/speedruncomorg/api) under [CC-BY-NC 4.0](https://github.com/speedruncomorg/api#content-license)
- [Splits.io API](https://github.com/glacials/splits-io/blob/master/docs/api.md) under [AGPL-3.0](https://github.com/glacials/splits-io/blob/main/LICENSE)

Everything below is hosted locally.

- [Bulma](https://bulma.io/) (v0.7.1) - CSS Framework
- [Tippy.js](https://atomiks.github.io/tippyjs/) (v6.3.1) - JS Tooltips
- [Popper.js](https://popper.js.org/) (v2.9.2) - Used by Tippy.js
- [FontAwesome](https://fontawesome.com/) (v5.15.4) - Icons
- [Google Fonts](https://fonts.google.com/) - Fonts