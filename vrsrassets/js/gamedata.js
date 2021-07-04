/*Object Structures

Category Object

{
	"id": "",
	"name": "",
	"variables": [
		{
			... Variable Object ...
		},
		{
			...
		}
	]
}


Variable Object

{
	"id": "",
	"name": "",
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

var ready;
var gameId;
var currentCatIndex;
var currentVariables;
var currentGame;
var cats;
var catIndex;
var categories;
var progress;
var catCount;

var gamesContainer;
var categoriesContainer;
var variablesContainer;
var runsContainer;

var runsTable;
var runsLoading;
var runsPlatformHardware;

var categoryTabs;

var gameInfoImage;
var gameInfoYear;
var gameInfoPlatforms;
var gameInfoLinkLeaderboard;
var gameInfoLinkGuides;
var gameInfoLinkResources;
var gameInfoLinkForums;
var gameInfoLinkStatistics;

var platformsList;

var defaultIndex;

var catNameRegex = /[^a-zA-Z0-9-_]+/ig;

function onGameDataLoad()
{
	gamesContainer = document.getElementById("games");
	categoriesContainer = document.getElementById("tabs")
	variablesContainer = document.getElementById("variables");
	runsContainer = document.getElementById("runs");

	runsTable = document.getElementById("runs-table");
	runsNone = document.getElementById("runs-none");
	runsLoading = document.getElementById("runs-loading");
	runsPlatformHardware = document.getElementById("runs-platform-hardware");

	gameInfoImage = document.getElementById("game-image");
	gameInfoYear = document.getElementById("game-year");
	gameInfoPlatforms = document.getElementById("game-platforms");
	gameInfoLinkLeaderboard = document.getElementById("game-links-leaderboard");
	gameInfoLinkGuides = document.getElementById("game-links-guides");
	gameInfoLinkResources = document.getElementById("game-links-resources");
	gameInfoLinkForums = document.getElementById("game-links-forums");
	gameInfoLinkStatistics = document.getElementById("game-links-statistics");

	platformsList = [];
	platformsList["w89rwwel"] = "Vive";
	platformsList["4p9zq09r"] = "Oculus";
	platformsList["83exvv9l"] = "Index";
	platformsList["w89r4d6l"] = "WMR";
	platformsList["8gej2n93"] = "PC";
	platformsList["nzelkr6q"] = "PS4";
	platformsList["wxeo2d6r"] = "PSN";
	platformsList["nzeljv9q"] = "PS4 Pro";


	loadAllGames();

	defaultIndex = -1;
	for (var i = 0; i < gamesArray.length; i++)
	{
		if (gamesArray[i].id == 'hla')
		{
			defaultIndex = i;
			break;
		}
	}

	if (getGame() != null || window.location.hash.length > 1)
	{
		var id = getGame();
		if (id == null)
		{
			id = window.location.hash.substring(1);
			history.replaceState(null, document.title, pathPrefix + getPath());
		}

		var gameIndex = -1;
		for (var i = 0; i < gamesArray.length; i++)
		{
			if (gamesArray[i].abbreviation == id)
			{
				gameIndex = i;
				break;
			}
		}

		if (gameIndex > -1)
		{
			gamesContainer.selectedIndex = gameIndex;
			loadGame(id, true);
		}
		else
		{
			gamesContainer.selectedIndex = defaultIndex;
			loadGame('hla', true);
		}
	}
	else
	{
		gamesContainer.selectedIndex = defaultIndex;
		loadGame('hla', true);
	}
}

function loadAllGames()
{
	for (var i = 0; i < gamesArray.length; i++)
	{
		gamesContainer.innerHTML += '<option value="' + gamesArray[i].abbreviation + '">' + gamesArray[i].name + '</option>';
	}
}

function onGameChange(id)
{
	closeRun();
	loadGame(id);
}

function loadGame(id, loadOrState = false, force = false)
{
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
			history.replaceState(null, document.title, pathPrefix + getPath() + '#' + categories[currentCatIndex].name.replace(/ /g, '_').replace(catNameRegex, ''));
			loadRuns(categories[currentCatIndex].id, currentVariables, loadOrState);
		}

		return;
	}

	if (getRun() && runLoadedCategory == '')
	{
		get("https://www.speedrun.com/api/v1/runs/" + getRun())
		.then((data) =>
		{
			runLoadedCategory = (JSON.parse(data)).data.category;
			loadGame(id, loadOrState, force);
			return;
		});
	}
	
	ready = false;

	for (var i = 0; i < gamesArray.length; i++)
	{
		if (gamesArray[i].abbreviation == id)
		{
			currentGame = gamesArray[i];
			gameId = currentGame.id;

			if (gamesContainer.selectedIndex !== i)
			{
				gamesContainer.selectedIndex = i;
			}

			break;
		}
	}

	document.title = currentGame.name + " - VRSR";

	if (boxRuns)
	{
		boxRuns.style.display = "none";
	}
	
	document.documentElement.style.setProperty('--primary-color', currentGame.color)
	document.documentElement.style.setProperty('--primary-color-hover', currentGame.hoverColor)

	gameInfoImage.src = '';
	gameInfoLinkLeaderboard.href = "https://www.speedrun.com/" + gameId + "/full_game";
	gameInfoLinkGuides.href = "https://www.speedrun.com/" + gameId + "/guides";
	gameInfoLinkResources.href = "https://www.speedrun.com/" + gameId + "/resources";
	gameInfoLinkForums.href = "https://www.speedrun.com/" + gameId + "/forum";
	gameInfoLinkStatistics.href = "https://www.speedrun.com/" + gameId + "/gamestats";

	get("https://www.speedrun.com/api/v1/games/" + gameId + "?embed=platforms")
	.then((data) =>
	{
		var game = (JSON.parse(data)).data;
		
		gameInfoImage.src = game.assets["cover-large"].uri;
		gameInfoYear.innerText = game.released;

		var tempPlatforms = [];
		for (var i = 0; i < game.platforms.data.length; i++)
		{			
			if (game.platforms.data[i].id in platformsList)
			{
				tempPlatforms.push(platformsList[game.platforms.data[i].id]);
			}
			else
			{
				tempPlatforms.push(game.platforms.data[i].name);
			}
		}

		gameInfoPlatforms.innerText = tempPlatforms.join(", ");
	});

	get("https://www.speedrun.com/api/v1/games/" + gameId + "/categories")
	.then((data) =>
	{
		cats = (JSON.parse(data)).data;
		catIndex = [];
		categories = [];
		progress = 0;
		catCount = 0;
		
		for (var i = 0; i < cats.length; i++)
		{
			if (cats[i].type == "per-game")
			{
				categories[catCount] = {
					"id": cats[i].id,
					"name": cats[i].name,
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
	});
}

function loadVariables(uri, category, loadOrState = false)
{
	get(uri)
	.then((data) =>
	{
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
						"values": []
					};
					
					var tempIndex = 0;
					for (var id in vars[i].values.values)
					{
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
	categoryTabs = [];

	for (var i = 0; i < categories.length; i++)
	{
		categoriesContainer.innerHTML += '<li id="category-' + i + '"><a onclick="displayCategory(' + i + ')">' + categories[i].name + '</a></li>';
	}
	for (var i = 0; i < categories.length; i++)
	{
		categoryTabs.push(document.getElementById("category-" + i));
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
	else if (window.location.hash)
	{
		var hashName = window.location.hash.substring(1).replace(/ /g, '_').replace(catNameRegex, '');

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

function displayCategory(index, loadOrState = false)
{
	currentCatIndex = index;

	for (var i = 0; i < categoryTabs.length; i++)
	{
		categoryTabs[i].classList.remove("is-active");
	}
	categoryTabs[currentCatIndex].classList.add("is-active");

	setHash(categories[currentCatIndex].name.replace(/ /g, '_').replace(catNameRegex, ''));
	
	displayCategoryVariables(index, loadOrState);
}

function displayCategoryVariables(index, loadOrState = false)
{
	variablesContainer.innerHTML = '';

	currentVariables = [];

	var vars = categories[index].variables;
	for (var i = 0; i < vars.length; i++)
	{
		var temp = '<div class="buttons has-addons">';

		for (var k = 0; k < vars[i].values.length; k++)
		{
			temp += '<button id="' + vars[i].id + '-' + vars[i].values[k].id + '" class="button is-small is-dark is-variable" onclick="setVariable(\'' + vars[i].id + '\',\'' + vars[i].values[k].id + '\');">' + vars[i].values[k].name + '</button>';
		}

		variablesContainer.innerHTML += temp += '</div>';
		
		setVariable(vars[i].id, vars[i].values[0].id, false)
	}

	loadRuns(categories[currentCatIndex].id, currentVariables, loadOrState);
}

function setVariable(id, value, loadAfter = true)
{
	var found = false;
	for (var i = 0; i < currentVariables.length; i++)
	{
		if (currentVariables[i].id == id)
		{
			document.getElementById(id + "-" + currentVariables[i].value).classList.remove("is-active");
			document.getElementById(id + "-" + value).classList.add("is-active");

			currentVariables[i].value = value;
			found = true;
			break;
		}
	}
	if (!found)
	{
		currentVariables.push({"id": id, "value": value});
		document.getElementById(id + "-" + value).classList.add("is-active");
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
			varString += "&var-" + variables[i].id + "=" + variables[i].value;
		}
	}

	get("https://www.speedrun.com/api/v1/leaderboards/" + gameId + "/category/" + id + "?embed=players,platforms,variables" + varString)
	.then((data) =>
	{
		var json = (JSON.parse(data)).data;

		var players = [];
		var platforms = [];

		for (var i = 0; i < json.players.data.length; i++)
		{
			var p = json.players.data[i];
			if (p.rel == "guest") continue;

			var loc = "";
			if (p.location !== null)
				loc = p.location.country.code;

			players[p.id] = {
				"name": p.names.international,
				"colorFrom": p["name-style"]["color-from"].dark,
				"colorTo": p["name-style"]["color-to"].dark,
				"region": loc,
				"link": p.weblink
			};
		}

		for (var i = 0; i < json.platforms.data.length; i++)
		{
			var p = json.platforms.data[i];
			platforms[p.id] = p.name;
		}

		runsContainer.innerHTML = '';

		for (var i = 0; i < json.runs.length; i++)
		{
			var run = json.runs[i].run;

			var place = nth(json.runs[i].place);
			if (place == "1st" || place == "2nd" || place == "3rd")
			{
				place = '<b class="place-' + place + '">' + place + '</b>';
			}
			else if (place == "0th")
			{
				place = "—";
			}

			var time = run.times.primary.replace('PT','').replace('H','h ').replace('M','m ');
			if (time.includes('.'))
			{
				time = time.replace('.', 's ').replace('S', 'ms');
				var ms = time.split('s ')[1].split('ms')[0];
				ms = ms.replace(/^0+/, '');

				time = time.split('s ')[0] + "s " + ms + "ms";
				
			}
			else
			{
				time = time.replace('S','s');
			}

			var player = "";
			if (run.players[0].rel == "user")
			{
				var start = players[run.players[0].id].colorFrom;
				var end = players[run.players[0].id].colorTo;
				
				player = getGradientName(players[run.players[0].id].name, start, end);
			}
			else
			{
				player = run.players[0].name;
			}
			
			var platform = platforms[run.system.platform];

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
						break;
					}
				}
			}
			else
			{
				runsPlatformHardware.innerText = "Platform";
			}

			var date = timeAgo(new Date(run.submitted));

			var flag = '';
			if (run.players[0].id != undefined && players[run.players[0].id].region != '')
			{
				flag = '<img class="runs-flag" src="https://www.speedrun.com/images/flags/' + players[run.players[0].id].region + '.png">';
			}

			var icons = '';
			if (run.splits != null)
			{
				icons += '<i class="fas fa-stopwatch"></i>';
			}
			
			runsContainer.innerHTML += '<tr id="run-' + run.id + '" onclick="openRun(\'' + run.id + '\')"><td>' + place + '</td><td style="font-weight: bold">' + flag + player + '</td><td>' + time + '</td><td class="is-hidden-touch">' + platform + '</td><td class="is-hidden-touch">' + date + '</td><td id="run-' + run.id + '-splits" class="has-text-right">' + icons + '</td></tr>';
		}
		
		if (!isMobile)
		{
			for (var i = 0; i <json.runs.length; i++)
			{
				if (json.runs[i].run.splits != null)
				{
					tippy('#run-' + json.runs[i].run.id + '-splits', {
						theme: 'vrsr-arrow',
						content: 'Splits are available for this run.',
						placement: 'right',
						offset: [0,5],
						delay: [225, 0],
						duration: [150, 0]
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
		}
	});
}

function getGradientName(name, start, end)
{
	var player = "";

	var chars = name.split('');

	var colors = interpolate(start, end, chars.length)

	for (var k = 0; k < chars.length; k++)
	{
		player += '<span style="color: ' + colors[k] + '">' + chars[k] + '</span>';
	}

	return player;
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

const NOW = new Date()
const times = [["day", 86400], ["month", 2592000], ["year", 31536000]]

function timeAgo(date) {

	var seconds = Math.floor((new Date() - date) / 1000);
  
	var interval = seconds / 31536000;
	var _s = "s";

	if (interval > 1) {
		if (Math.floor(interval) == 1) {
			_s = "";
		}

	  	return Math.floor(interval) + " year" + _s + " ago";
	}
	interval = seconds / 2592000;
	if (interval > 1) {
		if (Math.floor(interval) == 1) {
			_s = "";
		}

	  	return Math.floor(interval) + " month" + _s + " ago";
	}
	interval = seconds / 86400;
	if (interval > 1) {
		
		if (Math.floor(interval) == 1) {
			_s = "";
		}

	  	return Math.floor(interval) + " day" + _s + " ago";
	}
	interval = seconds / 3600;
	if (interval > 1) {
		if (Math.floor(interval) == 1) {
			_s = "";
		}

	  	return Math.floor(interval) + " hour" + _s + " ago";
	}
	interval = seconds / 60;
	if (interval > 1) {
		if (Math.floor(interval) == 1) {
			_s = "";
		}

	  	return Math.floor(interval) + " minute" + _s + " ago";
	}
	return "Just now";
}