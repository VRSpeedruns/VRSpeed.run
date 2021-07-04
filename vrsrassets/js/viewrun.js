var boxRuns;
var boxSingleRun;

var runSingleTabInfo;
var runSingleTabSplits;

var runSingleGame;
var runSingleCategory;
var runSingleTime;
var runSingleRunner;
var runSingleSrc;
var runSingleVid;
var runSingleVidText;
var runSingleVidIcon;

var runSingleSegments;
var runSingleSplitsUrl;
var runSingleSplitsBar;
var runSingleSplitsRT;
var runSingleSplitsGT;

var splitsBarColors;

function onSingleRunLoad()
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
    runSingleVid = document.getElementById("run-single-vid");
    runSingleVidText = document.getElementById("run-single-vid-text");
    runSingleVidIcon = document.getElementById("run-single-vid-icon");

    runSingleSegments = document.getElementById("run-single-segments");
    runSingleSplitsUrl = document.getElementById("run-single-splits-url");
    runSingleSplitsBar = document.getElementById("run-single-splits-bar");
    runSingleSplitsRT = document.getElementById("run-single-splits-rt");
    runSingleSplitsGT = document.getElementById("run-single-splits-gt");

    splitsBarColors = ['#007bff', '#6f42c1', '#28a745', '#ffc107', '#dc3545', '#fd7e14'];
}

function openRun(id, loadOrState = false)
{
    if (!loadOrState)
	{
		pushState(getGame() + "/" + id);
	}

    get("https://www.speedrun.com/api/v1/runs/" + id + "?embed=players,platform,game")
	.then((data) =>
	{
		var run = (JSON.parse(data)).data;
		
        if (currentGame.id !== run.game.data.abbreviation)
        {
            history.replaceState(null, document.title, pathPrefix + getGame());
            loadGame(currentGame.abbreviation, false, true);
            return;
        }

        var game = currentGame.name;

        var category = categories[currentCatIndex].name;
        var subcats = [];
        for (var i = 0; i < currentVariables.length; i++)
        {
            setVariable(currentVariables[i].id, run.values[currentVariables[i].id], false);

            var _vars = categories[currentCatIndex].variables;
            for (var k = 0; k < _vars.length; k++)
            {
                if (_vars[k].id == currentVariables[i].id)
                {
                    for (var m = 0; m < _vars[k].values.length; m++)
                    {
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
        var vidLink = run.videos.links[0].uri;

        runSingleGame.innerText = game;
        runSingleCategory.innerText = category;
        runSingleTime.innerText = time;
        runSingleRunner.innerHTML = player;
        runSingleSrc.href = srcLink;
        runSingleVid.href = vidLink;

        if (vidLink.includes("youtube.com") || vidLink.includes("youtu.be"))
        {
            runSingleVidText.innerText = 'Watch on YouTube';
            runSingleVidIcon.classList.add('fa-youtube');
        }
        else if (vidLink.includes("twitch.tv"))
        {
            runSingleVidText.innerText = 'Watch on Twitch';
            runSingleVidIcon.classList.add('fa-twitch');
        }
        
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

        if (run.splits !== null)
        {
            runSingleTabSplits.style.display = "block";

            var splitArr = run.splits.uri.split('/');
            var splitsId = splitArr[splitArr.length - 1];

            runSingleSplitsRT.setAttribute( 'onclick', 'loadSplits("' + splitsId + '", "real")' );
            runSingleSplitsGT.setAttribute( 'onclick', 'loadSplits("' + splitsId + '", "game")' );

            loadSplits(splitsId);
        }
        else
        {
            runSingleTabSplits.style.display = "none";
        }

        openRunTab(0);
	});
}

function closeRun()
{
    //boxRuns.style.display = "block";
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

function loadSplits(id, timing = "default")
{
    var uri = 'https://splits.io/api/v4/runs/' + id;

    get(uri)
    .then((data) =>
    {
        var run = (JSON.parse(data)).run;

        if (timing == "default")
        {
            timing = run['default_timing'];
        }

        runSingleSplitsUrl.href = 'https://splits.io/' + id + '?timing=' + timing;
        
        timing += "time";

        if (timing == "realtime")
        {
            runSingleSplitsRT.classList.add("is-active");
            runSingleSplitsGT.classList.remove("is-active");
        }
        else if (timing == "gametime")
        {
            runSingleSplitsGT.classList.add("is-active");
            runSingleSplitsRT.classList.remove("is-active");
        }

        var totalDuration = run[timing + "_duration_ms"];

        runSingleSegments.innerHTML = '';
        runSingleSplitsBar.innerHTML = '';

        var temp = '';
        var duration = 0;
        for (var i = 0; i < run.segments.length; i++)
        {
            var seg = run.segments[i];
            duration += seg[timing + "_duration_ms"];
            
            var pbColor = '';
            if (seg[timing + "_gold"])
            {
                pbColor = ' class="new-pb has-text-weight-bold"';
            }

            var row = '<tr' + pbColor + '><td>' + (seg["segment_number"] + 1) + '</td><td>' + seg["display_name"] + '</td><td>' + msToTime(seg[timing + "_duration_ms"]) + '</td><td>' + msToTime(seg[timing + "_end_ms"]) + '</td></tr>';

            var percent = (seg[timing + "_duration_ms"] / totalDuration) * 100;
            var color = splitsBarColors[i % splitsBarColors.length];
            runSingleSplitsBar.innerHTML += '<div id="bar-' + i + '" style="width: ' + percent + '%; background-color: ' + color + '"><div>' + seg["display_name"] + '</div><div class="sp-time">' + msToTime(seg[timing + "_duration_ms"]) + '</div></div>';
            
            if (seg.name.substring(0, 1) == "-")
            {
                temp += row;
            }
            else if (seg.name.substring(0, 1) == "{")
            {
                temp += row;
                
                var catName = seg.name.substring(1).split("}")[0];
                var head = '<tr class="sp-heading"><td></td><td>' + catName + '</td><td>' + msToTime(duration) + '</td><td>' + msToTime(seg[timing + "_end_ms"]) + '</td></tr>';

                runSingleSegments.innerHTML += head + temp;
                temp = '';
                duration = 0;
            }
            else
            {
                duration -= seg[timing + "_duration_ms"];
                
                runSingleSegments.innerHTML += '<tr' + pbColor + '><td>' + (seg["segment_number"] + 1) + '</td><td>' + seg["display_name"] + '</td><td>' + msToTime(seg[timing + "_duration_ms"]) + '</td><td>' + msToTime(seg[timing + "_end_ms"]) + '</td></tr>';
            }
        }
        runSingleSegments.innerHTML += temp; //in case there's anything left over in temp for some reason

        for (var i = 0; i < run.segments.length; i++)
        {
            var seg = run.segments[i];

            var dir = "left";
            if (i >= run.segments.length / 2)
                dir = "right";
            
            var timesave = '';
            var _timesave = seg[timing + "_duration_ms"] - seg[timing + "_shortest_duration_ms"];
            if (_timesave > 0)
            {
                timesave = msToTimeSingle(_timesave) + ' of possible timesave';
            }
            else
            {
                timesave = '<span class="new-pb">New personal best!</span>';
            }
            
            var content = '<div class="has-text-' + dir + '"><p class="has-text-weight-bold"><span class="sp-name-num">' + (seg["segment_number"] + 1) + '.</span> ' + seg["display_name"] + '</p><p class="sp-time">Duration: ' + msToTime(seg[timing + "_duration_ms"]) + '</p><p class="sp-time">Finished at: ' + msToTime(seg[timing + "_end_ms"]) + '</p><p class="sp-timesave">' + timesave + '</p></div>';

            tippy('#bar-' + i, {
                theme: 'vrsr-arrow',
                content: content,
                allowHTML: true,
                placement: 'bottom',
                offset: [0,7.5],
                duration: [0, 0]
            });
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

function msToTimeSingle(duration) {
    var milliseconds = Math.floor((duration % 1000) / 10),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    
    if (hours > 0)
    {
        return hours + "h ";
    }
    else if (minutes > 0)
    {
        return minutes + "m "
    }
    else if (seconds > 0)
    {
        return seconds + "s ";
    }
    else if (milliseconds > 0)
    {
        return milliseconds + "ms";
    }
    
    return '';
}