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
}

*/

/*Test Commands

- HLA main category:
> loadCategory("wkp1wojk", [{"id": "6nj4xqjn", "value": "21gr0emq"}, {"id": "38dpr118", "value": "0q5p9zml"}]);

*/



var ready;
var gameId;
var currentCatIndex;
var currentVariables;
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

var categoryTabs;

var gameInfoImage;
var gameInfoYear;
var gameInfoPlatforms;

var platformsList;

function onGameDataLoad()
{
	gamesContainer = document.getElementById("games");
	categoriesContainer = document.getElementById("tabs")
	variablesContainer = document.getElementById("variables");
	runsContainer = document.getElementById("runs");

	runsTable = document.getElementById("runs-table");
	runsNone = document.getElementById("runs-none");
	runsLoading = document.getElementById("runs-loading");

	gameInfoImage = document.getElementById("game-image");
	gameInfoYear = document.getElementById("game-year");
	gameInfoPlatforms = document.getElementById("game-platforms");

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

	if (window.location.hash.length > 1)
	{
		var id = window.location.hash.substring(1)
		loadGame(id);
		gamesContainer.value = id;
	}
}

function loadAllGames()
{
	for (var i = 0; i < gamesArray.length; i++)
	{
		gamesContainer.innerHTML += '<option value="' + gamesArray[i].id + '">' + gamesArray[i].name + '</option>';
	}
}

function onGameChange(id)
{
	loadGame(id);
}

function loadGame(id)
{
	ready = false;

	gameId = id;
	window.location.hash = "#" + id;

	get("https://www.speedrun.com/api/v1/games/" + id)
	.then((data) =>
	{
		var game = (JSON.parse(data)).data;
		
		gameInfoImage.src = game.assets["cover-large"].uri;
		gameInfoYear.innerText = game.released;

		var tempPlatforms = [];
		for (var i = 0; i < game.platforms.length; i++)
		{			
			if (game.platforms[i] in platformsList)
			{
				tempPlatforms.push(platformsList[game.platforms[i]]);
			}
			else
			{
				tempPlatforms.push(plat.name);
			}
		}

		gameInfoPlatforms.innerText = tempPlatforms.join(", ");
	});

	get("https://www.speedrun.com/api/v1/games/" + id + "/categories")
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
						loadVariables(cats[i].links[j].uri, cats[i].id);

						break;
					}
				}
			}
		}
	});
}

function loadVariables(uri, category)
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
			displayCategoryTabs();
		}
	});
}

function displayCategoryTabs()
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

	displayCategory(0);
}

function displayCategory(index)
{
	currentCatIndex = index;

	for (var i = 0; i < categoryTabs.length; i++)
	{
		categoryTabs[i].classList.remove("is-active");
	}
	categoryTabs[index].classList.add("is-active");
	
	displayCategoryVariables(index);

	//loadRuns()
}

function displayCategoryVariables(index)
{
	variablesContainer.innerHTML = '';

	currentVariables = [];

	var vars = categories[index].variables;
	//console.log(categories[index].name);
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

	loadRuns(categories[currentCatIndex].id, currentVariables);
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

function loadRuns(id, variables)
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

	if (variables !== null)
	{
		for (var i = 0; i < variables.length; i++)
		{
			varString += "&var-" + variables[i].id + "=" + variables[i].value;
		}
	}

	get("https://www.speedrun.com/api/v1/leaderboards/" + gameId + "/category/" + id + "?embed=players,platforms" + varString)
	.then((data) =>
	{
		var json = (JSON.parse(data)).data;

		var players = [];
		var platforms = [];

		for (var i = 0; i < json.players.data.length; i++)
		{
			var p = json.players.data[i];
			if (p.rel == "guest") continue;
			players[p.id] = {"name": p.names.international, "colorFrom": p["name-style"]["color-from"].dark, "colorTo": p["name-style"]["color-to"].dark};
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

			var time = run.times.primary.replace('PT','').replace('H','h ').replace('M','m ');
			if (time.includes('.'))
			{
				time = time.replace('.', 's ').replace('S', 'ms');
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
				var chars = players[run.players[0].id].name.split('');

				var colors = interpolate(start, end, chars.length)

				for (var k = 0; k < chars.length; k++)
				{
					player += '<span style="color: ' + colors[k] + '">' + chars[k] + '</span>';
				}
			}
			else
			{
				player = run.players[0].name;
			}
			
			var platform = platforms[run.system.platform];

			var date = timeAgo(new Date(run.submitted));
			
			runsContainer.innerHTML += '<tr><td>' + place + '</td><td style="font-weight: bold">' + player + '</td><td>' + time + '</td><td>' + platform + '</td><td>' + date + '</td></tr>';
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
	});
}

function get(url) {
	return new Promise((resolve, reject) => {
		const req = new XMLHttpRequest();
		req.open('GET', url);
		req.onload = () => req.status === 200 ? resolve(req.response) : reject(Error(req.statusText));
		req.onerror = (e) => reject(Error(`Network Error: ${e}`));
		req.send();
	});
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