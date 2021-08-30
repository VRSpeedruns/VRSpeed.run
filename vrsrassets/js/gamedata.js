/*Object Structures

Category Object

{
	"id": "",
	"name": "",
	"misc": false
	"variables": [
		{
			... Variable Object ...
		},
		{
			...
		}
	],
	"verifiers": [
		... strings (user ids) ...
	]
}


Variable Object

{
	"id": "",
	"name": "",
	"default": ""
	"values": [
		{
			"id": "",
			"name: ""
		},
		{
			...
		}
	]
}*/

var homeContainer;
var mainContainer;

var reorderedGamesArray;

var ready;
var gameId;
var currentCatIndex;
var currentVariables;
var currentGame;
var currentGamePrimaryTiming;
var currentGameTimings;
var currentMods;
var cats;
var catIndex;
var categories;
var progress;
var catCount; 

var gamesContainer;
var categoriesContainer;
var variablesContainer;
var runsContainer;
var miscCatsContainer;
var miscTab;
var miscCategories;

var pcGamesContainer;
var gameSelectorMenu;
var gameSelectorButton;
var gameSelectorCurrentGame;
var gameSelectorTempCurrentGame;
var gameSelectorText;
var gameSelectorTextTime;

var runsTable;
var runsLoading;
var runsPlatformHardware;
var runsHardwareArray = [];
var runsTimePrimary;
var runsTimeSecondary;
var runsTimeTertiary;

var categoryTabs;

var gameInfoName;
var gameInfoImage;
var gameInfoPlatforms;
var gameInfoLinkLeaderboard;
var gameInfoLinkGuides;
var gameInfoLinkResources;
var gameInfoLinkForums;
var gameInfoLinkStatistics;
var gameInfoModerators;
var gameInfoFav;
var gameInfoFavTippy;

var platformsList;
var timingMethodNames;

var defaultIndex;

var catNameRegex = /[^a-zA-Z0-9-_]+/ig;

var lastIconsTippys = [];
var flagAndModTippys = [];
var gameInfoModTippys = [];

function onGameDataLoad()
{
	homeContainer = document.getElementById("home-container");
	mainContainer = document.getElementById("main-container");

	allContainers.push(homeContainer);
	allContainers.push(mainContainer);

	gamesContainer = document.getElementById("games");
	categoriesContainer = document.getElementById("tabs")
	variablesContainer = document.getElementById("variables");
	runsContainer = document.getElementById("runs");
	miscCatsContainer = document.getElementById("misc-cats-container")
	
	pcGamesContainer = document.getElementById("pc-games");
	gameSelectorMenu = document.getElementById("game-selector-menu");
	gameSelectorButton = document.getElementById("game-selector-button");
	gameSelectorText = '';
	gameSelectorTextTime = Date.now();

	runsTable = document.getElementById("runs-table");
	runsNone = document.getElementById("runs-none");
	runsLoading = document.getElementById("runs-loading");
	runsPlatformHardware = document.getElementById("runs-platform-hardware");
	runsTimePrimary = document.getElementById("runs-time-primary");
	runsTimeSecondary = document.getElementById("runs-time-secondary");
	runsTimeTertiary = document.getElementById("runs-time-tertiary");

	gameInfoName = document.getElementById("game-name");
	gameInfoImage = document.getElementById("game-image");
	gameInfoPlatforms = document.getElementById("game-platforms");
	gameInfoLinkLeaderboard = document.getElementById("game-links-leaderboard");
	gameInfoLinkGuides = document.getElementById("game-links-guides");
	gameInfoLinkResources = document.getElementById("game-links-resources");
	gameInfoLinkForums = document.getElementById("game-links-forums");
	gameInfoLinkStatistics = document.getElementById("game-links-statistics");
	gameInfoModerators = document.getElementById("game-moderators");
	gameInfoFav = document.getElementById("game-info-fav");

	gameInfoFavTippy = tippy("#game-info-fav", {
		content: 'Add to Favorites',
		placement: 'top',
		hideOnClick: false
	})[0];

	platformsList = [];
	platformsList["w89rwwel"] = "Vive";
	platformsList["4p9zq09r"] = "Oculus";
	platformsList["83exvv9l"] = "Index";
	platformsList["w89r4d6l"] = "WMR";
	platformsList["8gej2n93"] = "PC";
	platformsList["nzelkr6q"] = "PS4";
	platformsList["wxeo2d6r"] = "PSN";
	platformsList["nzeljv9q"] = "PS4 Pro";

	timingMethodNames = [];
	timingMethodNames["realtime"] = "Time with loads";
	timingMethodNames["realtime_noloads"] = "Time without loads";
	timingMethodNames["ingame"] = "In-game Time";

	setEvents();
	loadAllGames();

	defaultIndex = -1;
	for (var i = 0; i < reorderedGamesArray.length; i++)
	{
		if (reorderedGamesArray[i].id == 'hla')
		{
			defaultIndex = i;
			break;
		}
	}

	if (getGame() != null)
	{
		var id = getGame();

		if (id == "streams")
		{
			loadStreams();
			return;
		}
		else if (getUser())
		{
			loadUser(getUser());
			return;
		}

		var gameIndex = -1;
		for (var i = 0; i < reorderedGamesArray.length; i++)
		{
			if (reorderedGamesArray[i].abbreviation == id)
			{
				gameIndex = i;
				break;
			}
		}

		if (gameIndex > -1)
		{
			gamesContainer.selectedIndex = gameIndex;
			gameSelectorCurrentGame = document.getElementById(`game-${id}`);
			gameSelectorCurrentGame.classList.add("is-selected");
			gameSelectorButton.innerText = gameSelectorCurrentGame.firstChild.nodeValue;
			gameSelectorButton.title = gameSelectorButton.innerText;
			
			loadGame(id, true);
		}
		else
		{
			replaceState(null);
			
			
			hideAllContainers();
			homeContainer.style.display = "block";

			latestWRsLoad();
		}
	}
	else
	{
		hideAllContainers();
		homeContainer.style.display = "block";
	}
}

function loadAllGames()
{
	pcGamesContainer.innerHTML = '';
	gamesContainer.innerHTML = '';

	reorderedGamesArray = [];

	var favGames = [];
	if (getCookie('fav_games') != '')
	{
		favGames = JSON.parse(getCookie('fav_games'));

		var favGamesSorted = [];

		for (var i = 0; i < favGames.length; i++)
		{
			var game = gamesArray.filter(g => { return g.abbreviation == favGames[i]; })[0];
			if (game)
			{
				favGamesSorted.push(game);
			}
			else
			{
				favGames = favGames.filter(g => g !== game.abbreviation);
			}
		}

		favGamesSorted.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));

		for (var i = 0; i < favGamesSorted.length; i++)
		{
			reorderedGamesArray.push(favGamesSorted[i]);

			var game = favGamesSorted[i];
			// mobile/old selector
			gamesContainer.innerHTML += `<option value="${game.abbreviation}">${game.name}</option>`;


			// desktop selector
			var fav = '';
			if (i == 0)
			{
				fav = `<div class="letter-fav"><i class="fas fa-star"></i></div>`;
			}

			var bottomGap = '';
			if (i + 1 >= favGames.length)
			{
				bottomGap = `style="margin-bottom: 11px;" `;
			}

			var selected = '';
			if (currentGame && currentGame.abbreviation == game.abbreviation)
			{
				selected = ' is-selected';
			}

			var circleHTML = `<div class="circle" style="background-color: ${game.color}"></div>`;

			pcGamesContainer.innerHTML += `<div class="game${selected}" id="game-${game.abbreviation}" onclick="onGameChange('${game.abbreviation}', true); toggleGameSelector();" ${bottomGap}title="${game.name}">${game.name}${fav}${circleHTML}</div>`;
		}
	}

	gamesArray.sort((a,b) => (a.name > b.name) ? 1 : ((b.name > a.name) ? -1 : 0));
	var lastLetter = '';
	for (var i = 0; i < gamesArray.length; i++)
	{
		if (favGames.includes(gamesArray[i].abbreviation)) continue;

		reorderedGamesArray.push(gamesArray[i]);

		// mobile/old selector
		gamesContainer.innerHTML += `<option value="${gamesArray[i].abbreviation}">${gamesArray[i].name}</option>`;


		// desktop selector
		var letterHTML = '';
		if (gamesArray[i].name.substring(0, 1) != lastLetter)
		{
			lastLetter = gamesArray[i].name.substring(0, 1);
			letterHTML = `<div class="letter">${lastLetter}</div>`;
		}

		var selected = '';
		if (currentGame && currentGame.abbreviation == gamesArray[i].abbreviation)
		{
			selected = ' is-selected';
		}

		var circleHTML = `<div class="circle" style="background-color: ${gamesArray[i].color}"></div>`;

		pcGamesContainer.innerHTML += `<div class="game${selected}" id="game-${gamesArray[i].abbreviation}" onclick="onGameChange('${gamesArray[i].abbreviation}', true); toggleGameSelector();" title="${gamesArray[i].name}">${gamesArray[i].name}${letterHTML}${circleHTML}</div>`;
	}
}
function setEvents()
{
	//close selector if user clicks off
	document.addEventListener('click', (e) => {
		if (gameSelectorMenu.classList.contains("is-active"))
		{
			if (!gameSelectorMenu.contains(e.target) && e.target != gameSelectorMenu && e.target != gameSelectorButton)
			{
				if (gameSelectorTempCurrentGame)
				{
					gameSelectorTempCurrentGame.classList.remove("is-selected");
					gameSelectorTempCurrentGame = null;
				}
				if (gameSelectorCurrentGame)
				{
					gameSelectorButton.innerText = gameSelectorCurrentGame.firstChild.nodeValue;
				}
				else
				{
					gameSelectorButton.innerText = "Choose a game."
				}
				toggleGameSelector();
			}
		}
	});

	//handle up and down arrow keys
	document.addEventListener('keydown', (e) => {
		if (gameSelectorMenu.classList.contains("is-active"))
		{
			if (!gameSelectorTempCurrentGame)
			{
				gameSelectorTempCurrentGame = gameSelectorCurrentGame;
			}

			if (e.key == "ArrowUp" && gameSelectorTempCurrentGame.previousSibling)
			{
				e.preventDefault();

				gameSelectorTempCurrentGame.classList.remove("is-selected");

				gameSelectorTempCurrentGame = gameSelectorTempCurrentGame.previousSibling;

				gameSelectorTempCurrentGame.classList.add("is-selected");
				
				gameSelectorButton.innerText = gameSelectorTempCurrentGame.firstChild.nodeValue;

				scrollIfNeeded(gameSelectorTempCurrentGame, pcGamesContainer);
			}
			else if (e.key == "ArrowDown" && gameSelectorTempCurrentGame.nextSibling)
			{
				e.preventDefault();

				gameSelectorTempCurrentGame.classList.remove("is-selected");

				gameSelectorTempCurrentGame = gameSelectorTempCurrentGame.nextSibling;

				gameSelectorTempCurrentGame.classList.add("is-selected");
				
				gameSelectorButton.innerText = gameSelectorTempCurrentGame.firstChild.nodeValue;
				
				scrollIfNeeded(gameSelectorTempCurrentGame, pcGamesContainer);
			}
			else if (e.key == "Enter")
			{
				gameSelectorCurrentGame = gameSelectorTempCurrentGame;
				gameSelectorTempCurrentGame = null;
				gameSelectorCurrentGame.click();
				gameSelectorText = '';
			}
			else if (e.key == "Escape")
			{
				if (gameSelectorTempCurrentGame)
				{
					gameSelectorTempCurrentGame.classList.remove("is-selected");
					gameSelectorTempCurrentGame = null;
				}
				gameSelectorButton.innerText = gameSelectorCurrentGame.firstChild.nodeValue;
				toggleGameSelector();
			}
			else if (/[a-zA-Z0-9-_.,:; ]/.test(e.key))
			{
				e.preventDefault();

				gameSelectorText += e.key.toLowerCase();
				gameSelectorTypeDelay(Date.now());

				for (var i = 0; i < reorderedGamesArray.length; i++)
				{
					if (reorderedGamesArray[i].name.substring(0, gameSelectorText.length).toLowerCase() == gameSelectorText)
					{
						gameSelectorTempCurrentGame.classList.remove("is-selected");
						gameSelectorTempCurrentGame = document.getElementById(`game-${reorderedGamesArray[i].abbreviation}`);
						gameSelectorTempCurrentGame.classList.add("is-selected");
						scrollIfNeeded(gameSelectorTempCurrentGame, pcGamesContainer);
						gameSelectorButton.innerText = gameSelectorTempCurrentGame.firstChild.nodeValue;
						
						break;
					}
				}
			}
		}
	});

	//close misc tab if user clicks off
	document.addEventListener('mousedown', (e) => {
		if (miscCatsContainer.classList.contains("is-active"))
		{
			if (!miscCatsContainer.contains(e.target) && e.target != miscCatsContainer && !miscTab.contains(e.target) && e.target != miscTab)
			{
				miscCatsContainer.classList.remove("is-active");
			}
		}
	});

	//close misc tab if user scrolls category tabs row
	categoriesContainer.addEventListener('scroll', () => {
		if (miscCatsContainer.classList.contains("is-active"))
		{
			miscCatsContainer.classList.remove("is-active");
		}
	});
}
function toggleGameSelector()
{
	gameSelectorMenu.classList.toggle("is-active");
	
	if (gameSelectorCurrentGame)
	{
		if (gameSelectorMenu.classList.contains("is-active"))
		{
			gameSelectorCurrentGame.classList.add("is-selected");
			scrollIfNeeded(gameSelectorCurrentGame, pcGamesContainer);
		}
		else
		{
			gameSelectorButton.innerText = gameSelectorCurrentGame.firstChild.nodeValue;
			gameSelectorText = '';
		}
	}
	else
	{
		if (gameSelectorMenu.classList.contains("is-active"))
		{
			gameSelectorTempCurrentGame = pcGamesContainer.firstChild;
			gameSelectorTempCurrentGame.classList.add("is-selected");
			gameSelectorButton.innerText = gameSelectorTempCurrentGame.firstChild.nodeValue;
		}
		else
		{
			if (gameSelectorTempCurrentGame)
			{
				gameSelectorTempCurrentGame.classList.remove("is-selected");
				gameSelectorTempCurrentGame = null;
			}
			gameSelectorButton.innerText = "Choose a game.";
		}
	}
}
function gameSelectorTypeDelay(time)
{
	gameSelectorTextTime = time;
	setTimeout(function()
	{ 
		if (gameSelectorMenu.classList.contains("is-active") && gameSelectorTextTime == time)
		{
			gameSelectorText = '';
		}
	}, 2000);
}
function onGameChange(id, frompcselect = false)
{
	if (!currentGame)
	{
		window.open("/" + id ,"_self")
		return;
	}

	if (currentGame.id == id) return;

	if (frompcselect)
	{
		if (gameSelectorTempCurrentGame)
		{
			gameSelectorTempCurrentGame.classList.remove("is-selected");
			gameSelectorTempCurrentGame = null;
		}
	}

	closeRun();
	loadGame(id);
}

function loadGame(id, loadOrState = false, force = false)
{
	if (!id)
	{
		document.documentElement.style.setProperty('--primary-color', '#FF9C00')
		document.documentElement.style.setProperty('--primary-color-hover', '#FFBB4D')
		document.documentElement.style.setProperty('--primary-color-hover', '#D18100')

		hideAllContainers();
		homeContainer.style.display = "block";

		return;
	}
	else if (getUser())
	{
		loadUser(getUser());
		return;
	}

    hideAllContainers();
	mainContainer.style.display = "block";

	if (getGame() !== id)
	{
		pushState(id);
	}
	else if ((!loadOrState || (currentGame !== undefined && currentGame.abbreviation == id)) && !force)
	{
		if (getRun())
		{
			openRun(getRun(), loadOrState);
		}
		else
		{	
			if (!getRun())
			{
				setHash(categories[currentCatIndex].name.replace(/ /g, '_').replace(catNameRegex, ''));
			}
			loadRuns(categories[currentCatIndex].id, currentVariables, loadOrState);
		}

		return;
	}

	if (getRun() && runLoadedCategory == '')
	{
		get(`https://www.speedrun.com/api/v1/runs/${getRun()}`)
		.then((data) =>
		{
			if (!getErrorCheck(data)) return;

			var temp = (JSON.parse(data));
			if (temp.status == 404)
			{
				replaceState(getGame());
				loadGame(getGame());
				return;
			}

			var game = '';
			for (var i = 0; i < gamesArray.length; i++)
			{
				if (gamesArray[i].api_id == temp.data.game)
				{
					game = gamesArray[i].abbreviation;
					break;
				}
			}
			
			runLoadedCategory = temp.data.category;
			loadGame(game, loadOrState, force);
		});
		return;
	}
	
	ready = false;

	for (var i = 0; i < reorderedGamesArray.length; i++)
	{
		if (reorderedGamesArray[i].abbreviation == id)
		{
			currentGame = reorderedGamesArray[i];
			gameId = currentGame.id;

			if (gamesContainer.selectedIndex !== i)
			{
				gamesContainer.selectedIndex = i;
			}

			if (gameSelectorCurrentGame)
			{
				gameSelectorCurrentGame.classList.remove("is-selected");
			}
			gameSelectorCurrentGame = document.getElementById(`game-${reorderedGamesArray[i].abbreviation}`);
			gameSelectorCurrentGame.classList.add("is-selected");
			gameSelectorButton.innerText = gameSelectorCurrentGame.firstChild.nodeValue;
			gameSelectorButton.title = gameSelectorButton.innerText;

			break;
		} 
	}

	var favGames = [];
	if (getCookie("fav_games") != "")
		favGames = JSON.parse(getCookie("fav_games"));
	
	if (favGames.includes(currentGame.abbreviation))
	{
		gameInfoFav.firstChild.classList.add("fas");
		gameInfoFav.firstChild.classList.remove("far");
		gameInfoFavTippy.setContent("Remove from Favorites");
	}
	else
	{
		gameInfoFav.firstChild.classList.add("far");
		gameInfoFav.firstChild.classList.remove("fas");
		gameInfoFavTippy.setContent("Add to Favorites");
	}

	setCookie('last_game', id, 10080); //7 days

	document.title = `${currentGame.name} - VRSR`;

	if (boxRuns)
	{
		boxRuns.style.display = "none";
		mainLoading.style.display = "block";
	}
	
	document.documentElement.style.setProperty('--primary-color', currentGame.color)
	document.documentElement.style.setProperty('--primary-color-hover', currentGame.hoverColor)
	document.documentElement.style.setProperty('--primary-color-dark', currentGame.darkColor)

	gameInfoName.innerText = currentGame.name;
	gameInfoImage.src = '';
	gameInfoPlatforms.innerText = '...';
	gameInfoLinkLeaderboard.href = `https://www.speedrun.com/${gameId}/full_game`;
	gameInfoLinkGuides.href = `https://www.speedrun.com/${gameId}/guides`;
	gameInfoLinkResources.href = `https://www.speedrun.com/${gameId}/resources`;
	gameInfoLinkForums.href = `https://www.speedrun.com/${gameId}/forum`;
	gameInfoLinkStatistics.href = `https://www.speedrun.com/${gameId}/gamestats`;
	gameInfoModerators.innerHTML = 'Moderated by:<br>';

	for (var i = 0; i < gameInfoModTippys.length; i++)
	{
		gameInfoModTippys[i][0].destroy();
	}
	gameInfoModTippys = [];

	get(`https://www.speedrun.com/api/v1/games/${gameId}?embed=platforms,categories`)
	.then((data) =>
	{
		if (!getErrorCheck(data)) return;

		var game = (JSON.parse(data)).data;
		gameInfoImage.src = game.assets["cover-large"].uri;

		currentGamePrimaryTiming = game.ruleset["default-time"];
		currentGameTimings = game.ruleset["run-times"];
		currentGameTimings.splice(currentGameTimings.indexOf(currentGamePrimaryTiming), 1);


		if (currentGameTimings.length > 0)
		{
			runsTimePrimary.innerText = timingMethodNames[currentGamePrimaryTiming];

			runsTimeSecondary.style.display = "table-cell";
			runsTimeSecondary.innerText = timingMethodNames[currentGameTimings[0]];

			if (currentGameTimings.length > 1)
			{
				runsTimeTertiary.style.display = "table-cell";
				runsTimeTertiary.innerText = timingMethodNames[currentGameTimings[1]];
			}
			else
			{
				runsTimeTertiary.style.display = "none";
			}
		}
		else
		{
			runsTimePrimary.innerText = "Time";
			runsTimeSecondary.style.display = "none";
			runsTimeTertiary.style.display = "none";
		}

		var tempPlatforms = [];
		for (var i = 0; i < game.platforms.data.length; i++)
		{			
			if (game.platforms.data[i].id in platformsList)
			{
				tempPlatforms.push(platformsList[game.platforms.data[i].id]);
			}
		}
		gameInfoPlatforms.innerText = tempPlatforms.join(", ");

		cats = game.categories.data;
		catIndex = [];
		categories = [];
		progress = 0;
		catCount = 0;
		
		currentMods = [];
		for (var id in game.moderators)
		{
			currentMods[id] = game.moderators[id];
		}

		for (var i = 0; i < cats.length; i++)
		{
			if (cats[i].type == "per-game")
			{
				categories[catCount] = {
					"id": cats[i].id,
					"name": cats[i].name,
					"misc": cats[i].miscellaneous,
					"variables": []
				};
				catIndex[cats[i].id] = catCount++;

				for (var j = 0; j < cats[i].links.length; j++)
				{
					if (cats[i].links[j].rel == "variables")
					{
						loadVariables(cats[i].links[j].uri, cats[i].id, loadOrState);

						break;
					}
				}
			}
		}

		get(`https://www.speedrun.com/api/v1/games/${gameId}?embed=moderators`)
		.then((data) =>
		{
			if (!getErrorCheck(data)) return;

			var mods = (JSON.parse(data)).data.moderators.data;

			var gameInfoModTippysInfo = [];

			gameInfoModerators.innerHTML = 'Moderated by:<br>';
			for (var i = 0; i < mods.length; i++)
			{
				var name = getGradientName(mods[i].names.international, mods[i]["name-style"]);

				var modIcon = '';
				var flag = '';

				if (currentMods[mods[i].id] == "super-moderator")
				{
					if (currentGame.verifiers.includes(mods[i].id))
					{
						modIcon = `<img id="gameinfo-mods-${mods[i].id}-modIcon" class="runs-usericon small" src="https://www.speedrun.com/images/icons/verifier.png">`;

						gameInfoModTippysInfo.push({
							"id": `#gameinfo-mods-${mods[i].id}-modIcon`,
							"text": "Verifier"
						});
					}
					else
					{
						modIcon = `<img id="gameinfo-mods-${mods[i].id}-modIcon" class="runs-usericon small" src="https://www.speedrun.com/images/icons/super-mod.png">`;

						gameInfoModTippysInfo.push({
							"id": `#gameinfo-mods-${mods[i].id}-modIcon`,
							"text": "Super Mod"
						});
					}
				}
				else //"moderator"
				{
					modIcon = `<img id="gameinfo-mods-${mods[i].id}-modIcon" class="runs-usericon small" src="https://www.speedrun.com/images/icons/mod.png">`;

					gameInfoModTippysInfo.push({
						"id": `#gameinfo-mods-${mods[i].id}-modIcon`,
						"text": "Mod"
					});
				}

				if (mods[i].location !== null)
				{
					flag = `<img id="gameinfo-mods-${mods[i].id}-userFlag" class="runs-flag small" src="https://www.speedrun.com/images/flags/${mods[i].location.country.code}.png">`;

					gameInfoModTippysInfo.push({
						"id": `#gameinfo-mods-${mods[i].id}-userFlag`,
						"text": mods[i].location.country.names.international
					});
				}

				var userIcon = '';
				if (mods[i].assets.icon.uri)
					userIcon = `<img class="runs-usericon small" src="${mods[i].assets.icon.uri}">`;

				var _comma = '';
				if (i + 1 < mods.length)
					_comma = ',&nbsp;'

				gameInfoModerators.innerHTML += `<span><a class="player-link thin" id="gameinfo-mods-${mods[i].id}-card" href="/user/${mods[i].names.international}">${modIcon}${flag}${userIcon}${name}</a>${_comma}</span>`;
							
				gameInfoModTippysInfo.push({
					"id": `#gameinfo-mods-${mods[i].id}-card`,
					"text": getCardHTML(mods[i].names.international, mods[i].assets.image.uri, `${flag.replace(" small", "")}${userIcon.replace(" small", "")}${name}` , getAverageColor(mods[i]["name-style"]))
				});
			}

			if (!isMobile)
			{
				for (var i = 0; i < gameInfoModTippysInfo.length; i++)
				{
					if (gameInfoModTippysInfo[i].id.endsWith("-card"))
					{
						gameInfoModTippys[i] = tippy(gameInfoModTippysInfo[i].id, {
							content: gameInfoModTippysInfo[i].text,
							placement: 'bottom',
							delay: [700, 0],
							offset: [0, 0],
							theme: 'clear',
							allowHTML: true,
							interactive: true,
							appendTo: document.body
						});
					}
					else
					{
						gameInfoModTippys[i] = tippy(gameInfoModTippysInfo[i].id, {
							content: gameInfoModTippysInfo[i].text,
							placement: 'top'
						});
					}
				}
			}
		});
	});
}

function loadVariables(uri, category, loadOrState = false)
{
	get(uri)
	.then((data) =>
	{
		if (!getErrorCheck(data)) return;

		var _vars = (JSON.parse(data)).data;
		
		if (_vars.length > 0)
		{
			var vars = [];

			for (var i = 0; i < _vars.length; i++)
			{
				if (_vars[i]["is-subcategory"] == true)
				{
					vars.push(_vars[i]);
				}
			}

			if (vars.length > 0)
			{
				var variables = [];
				
				var tempIndex = 0;
				for (var i = 0; i < vars.length; i++)
				{
					variables[i] = {
						"id": vars[i].id,
						"name": vars[i].name,
						"default": vars[i].values.default,
						"values": []
					};
					
					var tempIndex = 0;
					for (var id in vars[i].values.values)
					{
						var skip = false;
						for (var k = 0; k < currentGame.ignoredVariables.length; k++)
						{
							if (currentGame.ignoredVariables[k].id != vars[i].id)
							{
								continue;
							}
							if (currentGame.ignoredVariables[k].value == id)
							{
								skip = true;
								break;
							}
						}
						if (skip)
						{
							continue;
						}

						variables[i].values[tempIndex] = {
							"id": id,
							"name": vars[i].values.values[id].label
						};

						tempIndex++;
					}
				}
				
				categories[catIndex[category]].variables = variables;
			}
		}
		progress++;
		
		if (progress == catCount && !ready)
		{
			ready = true;
			displayCategoryTabs(loadOrState);
		}
	});
}

function displayCategoryTabs(loadOrState = false)
{
	categoriesContainer.innerHTML = '';
	miscCatsContainer.innerHTML = '';
	categoryTabs = [];
	var miscCats = [];
	miscCategories = [];

	for (var i = 0; i < categories.length; i++)
	{
		if (categories[i].misc)
		{
			miscCategories.push(i);
			miscCats.push(`<li id="category-${i}"><a onclick="displayCategory(${i}, false, true); miscTabToggle();">${categories[i].name}</a></li>`);
		}
		else
		{
			categoriesContainer.innerHTML += `<li id="category-${i}"><a onclick="displayCategory(${i}, false, true);">${categories[i].name}</a></li>`;
		}
	}
	if (miscCats.length > 0)
	{
		categoriesContainer.innerHTML += '<li id="category-misc"><a onclick="miscTabToggle();">Misc. <i class="fas fa-chevron-down"></i></a></li>';

		miscTab = document.getElementById("category-misc");

		for (var i = 0; i < miscCats.length; i++)
		{
			miscCatsContainer.innerHTML += miscCats[i];
		}
	}
	for (var i = 0; i < categories.length; i++)
	{
		var cat = document.getElementById(`category-${i}`);
		if (cat)
		{
			categoryTabs.push(cat);
		}
	}

	if (runLoadedCategory != '')
	{
		for (var i = 0; i < categories.length; i++)
		{
			if (categories[i].id == runLoadedCategory)
			{
				displayCategory(i, loadOrState);
				runLoadedCategory = '';
				break;
			}
		}
	}
	else if (getHash())
	{
		var hashName = getHash().substring(1).replace(/ /g, '_').replace(catNameRegex, '');

		for (var i = 0; i < categories.length; i++)
		{
			var catName = categories[i].name.replace(/ /g, '_').replace(catNameRegex, '');
			
			if (hashName == catName)
			{
				displayCategory(i, loadOrState);
				return;
			}
		}
		displayCategory(0, loadOrState);
	}
	else
	{
		displayCategory(0, loadOrState);
	}
}

function miscTabToggle()
{
	miscCatsContainer.classList.toggle("is-active");

	if (miscCatsContainer.classList.contains("is-active"))
	{
		var left = miscTab.getBoundingClientRect().left - miscTab.parentElement.getBoundingClientRect().left;
		left += miscTab.getBoundingClientRect().right - miscTab.getBoundingClientRect().left;
		var top = miscTab.getBoundingClientRect().bottom - miscTab.getBoundingClientRect().top;

		miscCatsContainer.style.left = `${left}px`;
		miscCatsContainer.style.top = `${top}px`;
	}
}

function displayCategory(index, loadOrState = false, buttonClick = false)
{
	currentCatIndex = index;

	var catName = categories[currentCatIndex].name.replace(/ /g, '_').replace(catNameRegex, '');
	gameInfoLinkLeaderboard.href = `${gameInfoLinkLeaderboard.href.split('#')[0]}#${catName}`;

	for (var i = 0; i < categoryTabs.length; i++)
	{
		categoryTabs[i].classList.remove("is-active");
	}
	categoryTabs[currentCatIndex].classList.add("is-active");

	if (miscCategories.includes(index))
	{
		miscTab.classList.add("is-active");
	}
	else if (miscTab)
	{
		miscTab.classList.remove("is-active");
	}
	

	if (buttonClick)
	{
		setHash(categories[currentCatIndex].name.replace(/ /g, '_').replace(catNameRegex, ''));
	}
	
	displayCategoryVariables(index, loadOrState);
}

function displayCategoryVariables(index, loadOrState = false)
{
	variablesContainer.innerHTML = '';

	currentVariables = [];

	var vars = categories[index].variables;
	for (var i = 0; i < vars.length; i++)
	{
		var temp = '';
		for (var k = 0; k < vars[i].values.length; k++)
		{
			temp += `<button id="${vars[i].id}-${vars[i].values[k].id}" class="button is-small is-dark is-variable" onclick="setVariable('${vars[i].id}','${vars[i].values[k].id}');">${vars[i].values[k].name}</button>`;
		}

		if (vars[i].values.length < 2)
		{
			temp = `<div class="buttons has-addons" style="display: none;">${temp}</div>`;
		}
		else
		{
			temp = `<div class="buttons has-addons">${temp}</div>`;
		}

		variablesContainer.innerHTML += temp;

		var defaultVal = vars[i].default;
		if (!defaultVal)
		{
			defaultVal = vars[i].values[0].id;
		}
		else
		{
			for (var k = 0; k < currentGame.ignoredVariables.length; k++)
			{
				if (currentGame.ignoredVariables[k].id == vars[i].id && currentGame.ignoredVariables[k].value == defaultVal)
				{
					defaultVal = vars[i].values[0].id;
					break;
				}
			}
		}

		setVariable(vars[i].id, defaultVal, false)
	}

	loadRuns(categories[currentCatIndex].id, currentVariables, loadOrState);
}

function setVariable(id, value, loadAfter = true)
{
	if (id != undefined && value != undefined)
	{
		var found = false;
		for (var i = 0; i < currentVariables.length; i++)
		{
			if (currentVariables[i].id == id)
			{
				document.getElementById(`${id}-${currentVariables[i].value}`).classList.remove("is-active");
				document.getElementById(`${id}-${value}`).classList.add("is-active");

				currentVariables[i].value = value;
				found = true;
				break;
			}
		}
		if (!found)
		{
			currentVariables.push({"id": id, "value": value});
			
			var ele = document.getElementById(`${id}-${value}`);
			if (ele)
			{
				ele.classList.add("is-active");
			}
		}
	}

	if (loadAfter)
	{
		loadRuns(categories[currentCatIndex].id, currentVariables);
	}
}

function loadRuns(id, variables, loadOrState = false)
{
	if (!ready){
		console.error("Category tried to load before ready.")
		return;
	}

	runsTable.style.display = 'none';
	runsNone.style.display = 'none';
	runsLoading.style.display = 'block';
	runsContainer.innerHTML = '';

	var varString = "";

	if (variables !== null && variables !== undefined && variables.length > 0)
	{
		for (var i = 0; i < variables.length; i++)
		{
			varString += `&var-${variables[i].id}=${variables[i].value}`;
		}
	}

	for (var i = 0; i < lastIconsTippys.length; i++)
	{
		lastIconsTippys[i].destroy();
	}
	lastIconsTippys = [];
	for (var i = 0; i < flagAndModTippys.length; i++)
	{
		flagAndModTippys[i][0].destroy();
	}
	flagAndModTippys = [];

	get(`https://www.speedrun.com/api/v1/leaderboards/${gameId}/category/${id}?embed=players,platforms,variables${varString}`)
	.then((data) =>
	{
		if (!getErrorCheck(data)) return;

		var json = (JSON.parse(data)).data;

		var players = [];
		var platforms = [];

		for (var i = 0; i < json.players.data.length; i++)
		{
			var p = json.players.data[i];
			if (p.rel == "guest") continue;

			var loc = "";
			var locName = "";
			if (p.location !== null)
			{
				loc = p.location.country.code;
				locName = p.location.country.names.international;
			}

			players[p.id] = p;
		}

		for (var i = 0; i < json.platforms.data.length; i++)
		{
			var p = json.platforms.data[i];
			platforms[p.id] = p.name;
		}

		runsContainer.innerHTML = '';
		
		runsHardwareArray = [];
		var flagAndModTippysInfo = [];

		for (var i = 0; i < json.runs.length; i++)
		{
			var run = json.runs[i].run;

			var place = nth(json.runs[i].place);
			if (place == "1st" || place == "2nd" || place == "3rd")
			{
				place = `<b class="place-${place}">${place}</b>`;
			}
			else if (place == "0th")
			{
				place = "—";
			}

			var allTimes = [];
			var mobileTime = null;
			if (run.times[currentGamePrimaryTiming])
			{
				allTimes.push(`<td>${runTimeFormat(run.times[currentGamePrimaryTiming])}</td>`);
				mobileTime = `<td>${runTimeFormat(run.times[currentGamePrimaryTiming])}</td>`;
			}
			else
			{
				allTimes.push(`<td class="run-time-primary-empty"></td>`);
			}

			if (currentGameTimings.length > 0 && run.times[currentGameTimings[0]])
			{
				allTimes.push(`<td>${runTimeFormat(run.times[currentGameTimings[0]])}</td>`);
				if (!mobileTime) mobileTime = `<td>${runTimeFormat(run.times[currentGameTimings[0]])}</td>`;
			}
			else
			{
				allTimes.push(`<td class="run-time-secondary-empty"></td>`);
			}
			

			if (currentGameTimings.length > 1 && run.times[currentGameTimings[1]])
			{
				allTimes.push(`<td>${runTimeFormat(run.times[currentGameTimings[1]])}</td>`);
				if (!mobileTime) mobileTime = `<td>${runTimeFormat(run.times[currentGameTimings[1]])}</td>`;
			}
			else
			{
				allTimes.push(`<td class="run-time-tertiary-empty"></td>`);
			}
			
			if (isMobile && allTimes.length > 1)
			{
				allTimes = [ mobileTime ];
				runsTimePrimary.innerText = "Time";
			}

			var playerObj = players[run.players[0].id];

			var player = "";
			var rawPlayer = "";
			if (playerObj)
			{
				rawPlayer = playerObj.names.international;
				player = getGradientName(rawPlayer, playerObj["name-style"]);
			}
			else
			{
				rawPlayer = run.players[0].name;
				player = rawPlayer;
			}
			
			var platform = platforms[run.system.platform];
			if (!platform) platform = "—";

			if (currentGame.hardware != "")
			{
				var val = run.values[currentGame.hardware];

				var allVars = json.variables.data;
				for (var k = 0; k < allVars.length; k++)
				{
					if (allVars[k].id == currentGame.hardware)
					{
						platform = allVars[k].values.values[val].label;
						runsPlatformHardware.innerText = "Hardware";

						if (runsHardwareArray.length == 0)
						{
							for (var id in allVars[k].values.values)
							{
								runsHardwareArray[id] = allVars[k].values.values[id].label;
							}
						}
						
						break;
					}
				}
			}
			else
			{
				runsPlatformHardware.innerText = "Platform";
			}

			var date = `<span title="${new Date(run.submitted).toDateString()}">${timeAgo(new Date(run.submitted))}</span>`;

			var modIcon = '';
			var flag = '';
			var userIcon = '';
			if (playerObj)
			{
				if (currentMods[playerObj.id] != undefined)
				{
					if (currentMods[playerObj.id] == "moderator")
					{
						modIcon = `<img id="runs-${playerObj.id}-modIcon" class="runs-usericon" src="https://www.speedrun.com/images/icons/mod.png">`;
						
						flagAndModTippysInfo.push({
							"id": `#runs-${playerObj.id}-modIcon`,
							"text": "Mod"
						});
					}
					else if (currentMods[playerObj.id] == "super-moderator")
					{
						if (currentGame.verifiers.includes(playerObj.id))
						{
							modIcon = `<img id="runs-${playerObj.id}-modIcon" class="runs-usericon" src="https://www.speedrun.com/images/icons/verifier.png">`;
							
							flagAndModTippysInfo.push({
								"id": `#runs-${playerObj.id}-modIcon`,
								"text": "Verifier"
							});
						}
						else
						{
							modIcon = `<img id="runs-${playerObj.id}-modIcon" class="runs-usericon" src="https://www.speedrun.com/images/icons/super-mod.png">`;
							
							flagAndModTippysInfo.push({
								"id": `#runs-${playerObj.id}-modIcon`,
								"text": "Super Mod"
							});
						}
					}
				}

				if (playerObj.assets.icon.uri)
				{
					userIcon = `<img class="runs-usericon" src="${playerObj.assets.icon.uri}">`;
				}
				
				if (playerObj.location)
				{
					flag = `<img id="runs-${run.players[0].id}-userFlag" class="runs-flag" src="https://www.speedrun.com/images/flags/${playerObj.location.country.code}.png">`;
					
					flagAndModTippysInfo.push({
						"id": `#runs-${playerObj.id}-userFlag`,
						"text": playerObj.location.country.names.international
					});
				}
			}

			var icons = '';
			if (run.splits != null)
			{
				icons += `<i id="run-${run.id}-splits" class="fas fa-stopwatch"></i>`;
			}
			if (run.videos != null && run.videos.links != undefined)
			{
				icons += `<i id="run-${run.id}-video" class="fas fa-video"></i>`;
			}

			var fullPlayer = '';
			if (player != rawPlayer)
				fullPlayer = `<a class="player-link thin" id="runs-${run.id}-usercard" href="/user/${rawPlayer}" onclick="event.stopPropagation();">${modIcon}${flag}${userIcon}${player}</a>`;
			else
				fullPlayer = `<b>${player}</b>`
			
			runsContainer.innerHTML += `<tr id="run-${run.id}" onclick="openRun('${run.id}')" data-place="${json.runs[i].place}" data-runtarget="${currentGame.abbreviation}/run/${run.id}"><td>${place}</td><td style="font-weight: bold">${fullPlayer}</td>${allTimes.join("")}<td class="is-hidden-mobile">${platform}</td><td class="is-hidden-mobile">${date}</td><td class="has-text-right is-hidden-mobile is-table-icons">${icons}</td></tr>`;
			
			if (playerObj)
			{
				flagAndModTippysInfo.push({
					"id": `#runs-${run.id}-usercard`,
					"text": getCardHTML(rawPlayer, playerObj.assets.image.uri, `${flag}${userIcon}${player}`, getAverageColor(playerObj["name-style"]))
				});
			}
		}

		var colTypes = ["primary", "secondary", "tertiary"];
		for (var i = 0; i < colTypes.length; i++)
		{
			var column = document.getElementsByClassName(`run-time-${colTypes[i]}-empty`);
			if (column.length == json.runs.length)
			{
				document.getElementById(`runs-time-${colTypes[i]}`).style.display = "none";
				for (var k = 0; k < column.length; k++)
				{
					column[k].style.display = "none";
				}
			}
			else
			{
				document.getElementById(`runs-time-${colTypes[i]}`).style.display = "table-cell";
			}
		}
		
		if (!isMobile)
		{
			var tippyCount = 0;
			for (var i = 0; i < json.runs.length; i++)
			{
				if (json.runs[i].run.splits != null)
				{
					lastIconsTippys[tippyCount] = tippy(`#run-${json.runs[i].run.id}-splits`, {
						content: 'Splits are available for this run.',
						placement: 'top'
					})[0];
					tippyCount++;
				}
				if (json.runs[i].run.videos != null && json.runs[i].run.videos.links != undefined)
				{
					lastIconsTippys[tippyCount] = tippy(`#run-${json.runs[i].run.id}-video`, {
						content: 'Video is available for this run.',
						placement: 'top'
					})[0];
					tippyCount++;
				}
			}

			tippy.createSingleton(lastIconsTippys, {
				delay: [0, 75],
				moveTransition: 'transform 0.175s ease-out',
				placement: 'top'
			});

			for (var i = 0; i < flagAndModTippysInfo.length; i++)
			{
				if (flagAndModTippysInfo[i].id.endsWith("-usercard"))
				{
					flagAndModTippys[i] = tippy(flagAndModTippysInfo[i].id, {
						content: flagAndModTippysInfo[i].text,
						placement: 'bottom',
						delay: [700, 0],
						offset: [0, 0],
						theme: 'clear',
						allowHTML: true,
						interactive: true,
						appendTo: document.body
					});
				}
				else
				{
					flagAndModTippys[i] = tippy(flagAndModTippysInfo[i].id, {
						content: flagAndModTippysInfo[i].text,
						placement: 'top'
					});
				}
			}
		}

		runsLoading.style.display = 'none';
		if (json.runs.length > 0)
		{
			runsTable.style.display = 'table';
		}
		else
		{
			runsNone.style.display = 'block';
		}

		if (getRun())
		{
			openRun(getRun(), loadOrState);
		}
		else
		{
			boxRuns.style.display = "block";
			mainLoading.style.display = "none";
		}
	});
}

function gameFavToggle()
{
	var favGames = [];
	if (getCookie("fav_games") != "")
		favGames = JSON.parse(getCookie("fav_games"));

	if (favGames.includes(currentGame.abbreviation))
	{
		favGames = favGames.filter(g => g !== currentGame.abbreviation);
		gameInfoFav.firstChild.classList.add("far");
		gameInfoFav.firstChild.classList.remove("fas");
		gameInfoFavTippy.setContent("Add to Favorites");
	}
	else
	{
		favGames.push(currentGame.abbreviation);
		gameInfoFav.firstChild.classList.add("fas");
		gameInfoFav.firstChild.classList.remove("far");
		gameInfoFavTippy.setContent("Remove from Favorites");
	}

	setCookie("fav_games", JSON.stringify(favGames), 5256000);
	loadAllGames();
	gameSelectorCurrentGame = document.getElementById(`game-${currentGame.abbreviation}`);
}


function nth(d) {
	if (d > 3 && d < 21) return d + 'th'; 
	switch (d % 10) {
		case 1:  return d + "st";
		case 2:  return d + "nd";
		case 3:  return d + "rd";
		default: return d + "th";
	}
}

function timeAgo(date) {

	var seconds = Math.floor((new Date() - date) / 1000);
  
	var interval = seconds / 31536000;
	var _s = "s";

	if (interval > 1) {
		if (Math.floor(interval) == 1) {
			_s = "";
		}

		return `${Math.floor(interval)} year${_s} ago`;
	}
	interval = seconds / 2592000;
	if (interval > 1) {
		if (Math.floor(interval) == 1) {
			_s = "";
		}

		return `${Math.floor(interval)} month${_s} ago`;
	}
	interval = seconds / 86400;
	if (interval > 1) {
		
		if (Math.floor(interval) == 1) {
			_s = "";
		}

		return `${Math.floor(interval)} day${_s} ago`;
	}
	interval = seconds / 3600;
	if (interval > 1) {
		if (Math.floor(interval) == 1) {
			_s = "";
		}

		return `${Math.floor(interval)} hour${_s} ago`;
	}
	interval = seconds / 60;
	if (interval > 1) {
		if (Math.floor(interval) == 1) {
			_s = "";
		}

		return `${Math.floor(interval)} minute${_s} ago`;
	}
	return "Just now";
}

function runTimeFormat(time)
{
	time = time.replace('PT','').replace('H','h ').replace('M','m ');

	if (time.includes('.'))
	{
		time = time.replace('.', 's ').replace('S', 'ms');
		var ms = time.split('s ')[1].split('ms')[0];
		ms = ms.replace(/^0+/, '');

		time = `${time.split('s ')[0]}s ${ms}ms`;
		
	}
	else
	{
		time = time.replace('S','s');
	}

	if (time.includes("m") && !time.includes("s"))
	{
		time += " 0s";
	}
	
	return time;
}

function scrollIfNeeded(element, container)
{
	if (element.offsetTop < container.scrollTop)
	{
	  	container.scrollTop = element.offsetTop;
	}
	else
	{
		const offsetBottom = element.offsetTop + element.offsetHeight;
		const scrollBottom = container.scrollTop + container.offsetHeight;
		if (offsetBottom > scrollBottom) {
			container.scrollTop = offsetBottom - container.offsetHeight;
		}
	}
}
