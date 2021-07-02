var boxRuns;
var boxSingleRun;

var runSingleTabInfo;
var runSingleTabSplits;

var runSingleGame;
var runSingleCategory;
var runSingleTime;
var runSingleRunner;
var runSingleSrc;
var runSingleYT;

var runSingleSegments;

function onPopoutLoad()
{
    boxRuns = document.getElementById("box-runs");
    boxSingleRun = document.getElementById("box-single-run");

    runSingleInfo = document.getElementById("run-single-info");
    runSingleSplits = document.getElementById("run-single-splits");

    runSingleTabInfo = document.getElementById("run-single-infotab");
    runSingleTabSplits = document.getElementById("run-single-splitstab");

    runSingleGame = document.getElementById("run-single-game");
    runSingleCategory = document.getElementById("run-single-category");
    runSingleTime = document.getElementById("run-single-time");
    runSingleRunner = document.getElementById("run-single-runner");
    runSingleSrc = document.getElementById("run-single-src");
    runSingleYT = document.getElementById("run-single-yt");

    runSingleSegments = document.getElementById("run-single-segments");
}

function openRun(id)
{

    get("https://www.speedrun.com/api/v1/runs/" + id + "?embed=players,platform,game")
	.then((data) =>
	{
		var run = (JSON.parse(data)).data;
		
        var game = "";
		for (var i = 0; i < gamesArray.length; i++)
        {
            if (gamesArray[i].id == run.game.data.abbreviation)
            {
                game = gamesArray[i].name;
            }
        }

        var category = categories[currentCatIndex].name;
        var subcats = [];
        for (var i = 0; i < currentVariables.length; i++)
        {
            var _vars = categories[currentCatIndex].variables;
            for (var k = 0; k < _vars.length; k++)
            {
                if (_vars[k].id == currentVariables[i].id)
                {
                    for (var m = 0; m < _vars[k].values.length; m++)
                    {
                        //console.log(_vars[k].values[m].id);
                        if (_vars[k].values[m].id == currentVariables[i].value)
                        {
                            subcats.push(_vars[k].values[m].name);
                            break;
                        }
                    }
                    break;
                }
            }
        }
        if (subcats.length > 0)
        {
            category += " (" + subcats.join(", ") + ")";
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
        if (run.players.data[0].rel == "user")
        {
            var temp = run.players.data[0];
            player = getGradientName(temp.names.international,
                temp["name-style"]["color-from"].dark, 
                temp["name-style"]["color-to"].dark);

            if (temp.location !== null)
			{
				flag = '<img class="runs-flag" src="https://www.speedrun.com/images/flags/' + temp.location.country.code + '.png">';
                player = flag + player;
			}
        }
        else
        {
            player = run.players.data[0].name;
        }

        player = '<a class="player-link" href="' + run.players.data[0].weblink + '">' + player + '</a>';

        var srcLink = run.weblink;
        var ytLink = run.videos.links[0].uri;

        runSingleGame.innerText = game;
        runSingleCategory.innerText = category;
        runSingleTime.innerText = time;
        runSingleRunner.innerHTML = player;
        runSingleSrc.href = srcLink;
        runSingleYT.href = ytLink;
        
        boxRuns.style.display = "none";
        boxSingleRun.style.display = "block";

        get("https://www.speedrun.com/api/v1/users/" + run.status.examiner)
        .then((__data) =>
        {
            var _data = (JSON.parse(__data)).data;
            var verifier = getGradientName(_data.names.international,
                _data["name-style"]["color-from"].dark,
                _data["name-style"]["color-to"].dark);
        });

        loadSplits(run.splits.uri.replace("/v3/", "/v4/"));

        openRunTab(0);
	});
}

function closeRun()
{
    boxRuns.style.display = "block";
    boxSingleRun.style.display = "none";
}

function openRunTab(index)
{
    if (index == 0)
    {
        runSingleTabSplits.classList.remove("is-active");
        runSingleTabInfo.classList.add("is-active");

        runSingleInfo.style.display = "block";
        runSingleSplits.style.display = "none";
    }
    else if (index == 1)
    {
        runSingleTabInfo.classList.remove("is-active");
        runSingleTabSplits.classList.add("is-active");

        runSingleSplits.style.display = "block";
        runSingleInfo.style.display = "none";
    }
}

function loadSplits(uri, timing = "realtime")
{
    runSingleSegments.innerHTML = '';

    get(uri)
    .then((data) =>
    {
        var run = (JSON.parse(data)).run;

        var temp = '';
        var duration = 0;
        for (var i = 0; i < run.segments.length; i++)
        {
            var seg = run.segments[i];
            duration += seg[timing + "_duration_ms"];

            var row = '<tr><td>' + (seg["segment_number"] + 1) + '</td><td>' + seg["display_name"] + '</td><td>' + msToTime(seg[timing + "_duration_ms"]) + '</td><td>' + msToTime(seg[timing + "_end_ms"]) + '</td></tr>';
            
            if (seg.name.substring(0, 1) == "-")
            {
                temp += row;
            }
            else if (seg.name.substring(0, 1) == "{")
            {
                temp += row;
                
                var catName = seg.name.substring(1).split("}")[0];
                temp = '<tr><td></td><td>' + catName + '</td><td>' + msToTime(duration) + '</td><td>' + msToTime(seg[timing + "_end_ms"]) + '</td></tr>' + temp;

                runSingleSegments.innerHTML += temp;
                temp = '';
                duration = 0;
            }
            else
            {
                duration -= seg[timing + "_duration_ms"];
                
                runSingleSegments.innerHTML += '<tr><td>' + (seg["segment_number"] + 1) + '</td><td>' + seg["display_name"] + '</td><td>' + msToTime(seg[timing + "_duration_ms"]) + '</td><td>' + msToTime(seg[timing + "_end_ms"]) + '</td></tr>';
            }
        }
    });
}

function msToTime(duration) {
    var milliseconds = Math.floor((duration % 1000) / 10),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? "0" + hours : hours;
    minutes = (minutes < 10) ? "0" + minutes : minutes;
    seconds = (seconds < 10) ? "0" + seconds : seconds;
  
    return hours + ":" + minutes + ":" + seconds + "." + milliseconds;
}