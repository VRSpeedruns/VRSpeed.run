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

var categoriesContainer;
var variablesContainer;
var runsContainer;

var categoryTabs;

function onGameDataLoad()
{
	categoriesContainer = document.getElementById("tabs")
	variablesContainer = document.getElementById("variables");
	runsContainer = document.getElementById("runs");
}

function loadGame(id)
{
	ready = false;
	gameId = id;

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
						loadVariables(cats[i].links[j].uri);

						break;
					}
				}
			}
		}
	});
}

function loadVariables(uri)
{
	get(uri)
	.then((data) =>
	{
		var vars = (JSON.parse(data)).data;

		if (vars.length > 0)
		{
			var variables = [];
		
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

			categories[catIndex[vars[0].category]].variables = variables;
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
			temp += '<button id="' + vars[i].id + '-' + vars[i].values[k].id + '" class="button is-dark is-variable" onclick="setVariable(\'' + vars[i].id + '\',\'' + vars[i].values[k].id + '\');">' + vars[i].values[k].name + '</button>';
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
	}

	var varString = "";

	if (variables !== null)
	{
		for (var i = 0; i < variables.length; i++)
		{
			varString += "&var-" + variables[i].id + "=" + variables[i].value;
		}
	}

	get("https://www.speedrun.com/api/v1/leaderboards/" + gameId + "/category/" + id + "?embed=players" + varString)
	.then((data) =>
	{
		var json = (JSON.parse(data)).data;

		var players = [];

		for (var i = 0; i < json.players.data.length; i++)
		{
			var p = json.players.data[i];
			if (p.rel == "guest") continue;
			
			players[p.id] = p.names.international;
		}

		runsContainer.innerHTML = '';

		for (var i = 0; i < json.runs.length; i++)
		{
			var run = json.runs[i].run;

			var place = json.runs[i].place;

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
				player = players[run.players[0].id];
			}
			else
			{
				player = run.players[0].name;
			}
			
			runsContainer.innerHTML += '<br>' + place + ". " + time + " by " + player
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