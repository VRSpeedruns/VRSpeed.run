var boxRuns;
var boxSingleRun;

var runSingleGame;
var runSingleCategory;
var runSingleTime;
var runSingleRunner;
var runSingleComment;
var runSinglePlatform;
var runSingleVerifier;
var runSingleDate;
var runSingleVerifyDate;

var runSingleSrc;
var runSingleVid;
var runSingleVidIcon;

var runSingleSplitsContainer;
var runSingleSplitsInner;
var runSingleSplitsLoading;
var runSingleSegments;
var runSingleSplitsUrl;
var runSingleSplitsBar;
var runSingleSplitsRT;
var runSingleSplitsGT;

var splitsBarColors;

var lastSplitsTippys = [];

function onSingleRunLoad()
{
    boxRuns = document.getElementById("box-runs");
    boxSingleRun = document.getElementById("box-single-run");

    runSingleGame = document.getElementById("run-single-game");
    runSingleCategory = document.getElementById("run-single-category");
    runSingleTime = document.getElementById("run-single-time");
    runSingleRunner = document.getElementById("run-single-runner");
    runSingleComment = document.getElementById("run-single-comment");
    runSinglePlatform = document.getElementById("run-single-platform");
    runSingleVerifier = document.getElementById("run-single-verifier");
    runSingleDate = document.getElementById("run-single-date");
    runSingleVerifyDate = document.getElementById("run-single-verifydate");

    runSingleSrc = document.getElementById("run-single-src");
    runSingleVid = document.getElementById("run-single-vid");
    runSingleVidIcon = document.getElementById("run-single-vid-icon");

    runSingleSplitsContainer = document.getElementById("run-single-splits-container");
    runSingleSplitsInner = document.getElementById("run-single-splits-inner");
    runSingleSplitsLoading = document.getElementById("run-single-splits-loading");
    runSingleSegments = document.getElementById("run-single-segments");
    runSingleSplitsUrl = document.getElementById("run-single-splits-url");
    runSingleSplitsBar = document.getElementById("run-single-splits-bar");
    runSingleSplitsRT = document.getElementById("run-single-splits-rt");
    runSingleSplitsGT = document.getElementById("run-single-splits-gt");

    if (!isMobile)
    {
        tippy('#run-single-src', {
            content: "View the run on Speedrun.com",
            placement: 'top',
            offset: [0,7.5]
        });
    }
}

function openRun(id, loadOrState = false)
{
    if (!loadOrState)
	{
        pushState(`${getGame()}/run/${id}`);
	}
    
    runSingleSplitsContainer.style.display = "none";

    var _c = h2r(currentGame.color);
    var _base = `rgba(${_c[0]}, ${_c[1]}, ${_c[2]}, `;
    splitsBarColors = [];
    for (var i = 1; i < 4; i++)
    {
        splitsBarColors.push(`${_base}${0.25 * i})`);
    }

    get(`https://www.speedrun.com/api/v1/runs/${id}?embed=players,platform,game`)
	.then((data) =>
	{
        if (currentCatIndex == undefined)
        {
            openRun(id, loadOrState);
            return;
        }

		var run = (JSON.parse(data)).data;
		
        if (currentGame.id !== run.game.data.abbreviation)
        {
            replaceState(getGame());
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
            category += ` (${subcats.join(", ")})`;
        }

        var time = runTimeFormat(run.times.primary);

        var player = "";
        var rawPlayer = "";
        var flag = "";
        if (run.players.data[0].rel == "user")
        {
            var temp = run.players.data[0];
            
            rawPlayer = temp.names.international;

            player = getGradientName(rawPlayer,
                temp["name-style"]["color-from"].dark, 
                temp["name-style"]["color-to"].dark);

            if (temp.location !== null)
			{
				flag = `<img class="runs-flag" src="https://www.speedrun.com/images/flags/${temp.location.country.code}.png">`;
			}
        }
        else
        {
            rawPlayer = run.players.data[0].name;
            player = rawPlayer;
        }
        
        var userIcon = `<img class="runs-usericon" src="https://bigft.io/vrsrassets/php/userIcon?${rawPlayer}" onload="if (this.width == 1 && this.height == 1) this.remove();">`;

        player = `<a class="player-link" href="${run.players.data[0].weblink}" target="_blank">${flag}${userIcon}${player}</a>`;

        var srcLink = run.weblink;
        var vidLink = '';
        if (run.videos != null)
        {
            vidLink = run.videos.links[0].uri;
            runSingleVid.style.display = "flex";
        }
        else
        {
            runSingleVid.style.display = "none";
        }

        var comment = '';
        runSingleComment.innerHTML = '';
        if (run.comment)
        {
            comment = `"${run.comment}"`;
        }

        var platform = run.platform.data.name;
        if (currentGame.hardware != "")
        {
            platform = `<b>${runsHardwareArray[run.values[currentGame.hardware]]}</b> (<i>${platform}</i>)`;
        }
        else
        {
            platform = `<b>${platform}</b>`
        }

        var _date = new Date(run.date);
        var date = _date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
        
        _date = new Date(run.status["verify-date"]);
        var verifyDate = _date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });

        runSingleGame.innerText = game;
        runSingleCategory.innerText = category;
        runSingleTime.innerText = time;
        runSingleRunner.innerHTML = player;
        runSingleComment.innerText = comment;
        runSinglePlatform.innerHTML = platform;
        runSingleDate.innerText = date;
        runSingleVerifyDate.innerText = verifyDate;

        runSingleSrc.href = srcLink;
        runSingleVid.href = vidLink;

        runSingleVidIcon.classList.remove('fab');
        runSingleVidIcon.classList.remove('fas');
        runSingleVidIcon.classList.remove('fa-youtube');
        runSingleVidIcon.classList.remove('fa-twitch');
        runSingleVidIcon.classList.remove('fa-video');

        if (runSingleVid._tippy)
        {
            runSingleVid._tippy.destroy();
        }

        if (vidLink.includes("youtube.com") || vidLink.includes("youtu.be"))
        {
            runSingleVidIcon.classList.add('fab');
            runSingleVidIcon.classList.add('fa-youtube');

            if (!isMobile)
            {
                tippy('#run-single-vid', {
                    content: "Watch the run on YouTube",
                    placement: 'top',
                    offset: [0,7.5]
                });
            }
        }
        else if (vidLink.includes("twitch.tv"))
        {
            runSingleVidIcon.classList.add('fab');
            runSingleVidIcon.classList.add('fa-twitch');
            
            if (!isMobile)
            {
                tippy('#run-single-vid', {
                    content: "Watch the run on Twitch",
                    placement: 'top',
                    offset: [0,7.5]
                });
            }
        }
        else
        {
            runSingleVidIcon.classList.add('fas');
            runSingleVidIcon.classList.add('fa-video');
            if (!isMobile)
            {
                tippy('#run-single-vid', {
                    content: "Watch the run",
                    placement: 'top',
                    offset: [0,7.5]
                });
            }
        }
        
        boxRuns.style.display = "none";
        boxSingleRun.style.display = "block";
        mainLoading.style.display = "none";

        runSingleVerifier.innerText = '...';

        get(`https://www.speedrun.com/api/v1/users/${run.status.examiner}`)
        .then((__data) =>
        {
            var _data = (JSON.parse(__data)).data;
            var verifier = getGradientName(_data.names.international,
                _data["name-style"]["color-from"].dark,
                _data["name-style"]["color-to"].dark);

            var verifierFlag = '';
            if (_data.location !== null)
            {
                verifierFlag = `<img class="runs-flag" src="https://www.speedrun.com/images/flags/${_data.location.country.code}.png">`;
            }

            var verifierIcon = `<img class="runs-usericon" src="https://bigft.io/vrsrassets/php/userIcon?${_data.names.international}" onload="if (this.width == 1 && this.height == 1) this.remove();">`;
                
            runSingleVerifier.innerHTML = `<a class="player-link" href="${_data.weblink}" target="_blank">${verifierFlag}${verifierIcon}${verifier}</a>`;
        });

        if (run.splits !== null)
        {
            var splitArr = run.splits.uri.split('/');
            var splitsId = splitArr[splitArr.length - 1];

            runSingleSplitsRT.setAttribute( 'onclick', `loadSplits("${splitsId}", "real")`);
            runSingleSplitsGT.setAttribute( 'onclick', `loadSplits("${splitsId}", "game")`);

            loadSplits(splitsId);
        }

        if (getHash() != '')
        {
            setHash('');
        }
	});
}

function closeRun()
{
    boxSingleRun.style.display = "none";
    mainLoading.style.display = "block";
}

function loadSplits(id, timing = "default")
{
    runSingleSplitsInner.style.display = "none";
    runSingleSplitsLoading.style.display = "block";
    runSingleSplitsContainer.style.display = "block";

    if (timing == "real")
    {
        runSingleSplitsRT.classList.add("is-active");
        runSingleSplitsGT.classList.remove("is-active");
    }
    else if (timing == "game")
    {
        runSingleSplitsGT.classList.add("is-active");
        runSingleSplitsRT.classList.remove("is-active");
    }

    for (var i = 0; i < lastSplitsTippys.length; i++)
    {
        lastSplitsTippys[i][0].destroy();
    }
    lastSplitsTippys = [];
    
    runSingleSplitsUrl.href = `https://splits.io/${id}`;

    get(`https://splits.io/api/v4/runs/${id}`)
    .then((data) =>
    {
        var run = (JSON.parse(data)).run;

        if (timing == "default")
        {
            timing = run['default_timing'];
        }
        
        runSingleSplitsUrl.href = `https://splits.io/${id}?timing=${timing}`;

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

        var totalDuration = run[`${timing}_duration_ms`];

        runSingleSegments.innerHTML = '';
        runSingleSplitsBar.innerHTML = '';

        var temp = '';
        var duration = 0;
        for (var i = 0; i < run.segments.length; i++)
        {
            var seg = run.segments[i];
            duration += seg[`${timing}_duration_ms`];
            
            var pbColor = '';
            if (seg[`${timing}_gold`])
            {
                pbColor = ' class="new-pb has-text-weight-bold"';
            }

            var row = `<tr${pbColor}><td>${(seg["segment_number"] + 1)}</td><td>${seg["display_name"]}</td><td>${msToTime(seg[`${timing}_duration_ms`])}</td><td>${msToTime(seg[`${timing}_end_ms`])}</td></tr>`;

            var percent = (seg[`${timing}_duration_ms`] / totalDuration) * 100;
            var color = splitsBarColors[i % splitsBarColors.length];
            
            runSingleSplitsBar.innerHTML += `<div id="bar-${i}" style="width: ${percent}%; background-color: ${color}"><div><div>${seg["display_name"]}</div><div class="sp-time">${msToTime(seg[`${timing}_duration_ms`])}</div></div></div>`;
            
            if (seg.name.substring(0, 1) == "-")
            {
                temp += row;
            }
            else if (seg.name.substring(0, 1) == "{")
            {
                temp += row;
                
                var catName = seg.name.substring(1).split("}")[0];
                var head = `<tr class="sp-heading"><td></td><td>${catName}</td><td>${msToTime(duration)}</td><td>${msToTime(seg[`${timing}_end_ms`])}</td></tr>`;

                runSingleSegments.innerHTML += head + temp;
                temp = '';
                duration = 0;
            }
            else
            {
                duration -= seg[`${timing}_duration_ms`];
                
                runSingleSegments.innerHTML += `<tr${pbColor}><td>${seg["segment_number"] + 1}</td><td>${seg["display_name"]}</td><td>${msToTime(seg[`${timing}_duration_ms`])}</td><td>'${msToTime(seg[`${timing}_end_ms`])}</td></tr>`;
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
                timesave = `${msToTimeSingle(_timesave)} of possible timesave.`;
            }
            else
            {
                timesave = '<span class="new-pb">New personal best!</span>';
            }
            
            var content = `<div class="has-text-${dir}"><p class="has-text-weight-bold"><span class="sp-name-num">${seg["segment_number"] + 1}.</span> ${seg["display_name"]}</p><p class="sp-time">Duration: ${msToTime(seg[`${timing}_duration_ms`])}</p><p class="sp-time">Finished at: ${msToTime(seg[`${timing}_end_ms`])}</p><p class="sp-timesave">${timesave}</p></div>`;
            
            lastSplitsTippys[i] = tippy(`#bar-${i}`, {
                content: content,
                allowHTML: true,
                offset: [0,7.5],
                duration: [0, 0]
            });
        }

        runSingleSplitsInner.style.display = "block";
        runSingleSplitsLoading.style.display = "none";
    });
}

function msToTime(duration) {
    var milliseconds = Math.floor((duration % 1000) / 10),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? `0${hours}` : hours;
    minutes = (minutes < 10) ? `0${minutes}` : minutes;
    seconds = (seconds < 10) ? `0${seconds}` : seconds;
  
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function msToTimeSingle(duration) {
    var milliseconds = Math.floor((duration % 1000) / 10),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
    
    if (hours > 0)
    {
        return `${hours}h`;
    }
    else if (minutes > 0)
    {
        return `${minutes}m`
    }
    else if (seconds > 0)
    {
        return `${seconds}s`;
    }
    else if (milliseconds > 0)
    {
        return `${milliseconds}ms`;
    }
    
    return '1ms';
}