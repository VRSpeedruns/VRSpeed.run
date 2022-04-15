var boxRuns;
var boxSingleRun;

var runSingleGame;
var runSingleCategory;
var runSingleTime;
var runSingleRunner;
var runSinglePlace;
var runSingleComment;
var runSinglePlatform;
var runSingleDate;
var runSingleSubmittedDate;
var runSingleVerifyReject;

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
var runSingleSplitsTiming;
var runSingleSplitsMiddleInfo;

var splitsBarColors;

var lastSplitsTippys = [];
var singleFlagAndModTippys = [];
var splitsMiddleTippys = [];

var runLoadLastAttempt;
var runLoadAttempts;

function onSingleRunLoad()
{
    boxRuns = document.getElementById("box-runs");
    boxSingleRun = document.getElementById("box-single-run");

    runSingleGame = document.getElementById("run-single-game");
    runSingleCategory = document.getElementById("run-single-category");
    runSingleTime = document.getElementById("run-single-time");
    runSingleRunner = document.getElementById("run-single-runner");
    runSinglePlace = document.getElementById("run-single-place");
    runSingleComment = document.getElementById("run-single-comment");
    runSinglePlatform = document.getElementById("run-single-platform");
    runSingleVerifyReject = document.getElementById("run-single-verifyreject");
    runSingleDate = document.getElementById("run-single-date");
    runSingleSubmittedDate = document.getElementById("run-single-submitted-date");

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
    runSingleSplitsTiming = document.getElementById("run-single-splits-timing");
    runSingleSplitsMiddleInfo = document.getElementById("run-single-splits-middleinfo");

    loadRunAttempts = 0;

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
    if (runLoadLastAttempt != id)
    {
        runLoadLastAttempt = id;
        runLoadAttempts = 0;
    }
    runLoadAttempts++;

    if (runLoadAttempts > 2)
    {
        sendErrorNotification(`There was an error when trying to load run with ID "${id}."`);

        replaceState(getGame());
        loadGame(getGame(), true);
        return;
    }

    if (!loadOrState && runLoadAttempts == 1)
	{
        pushState(`${getGame()}/run/${id}`);
	}
    
    runSingleSplitsContainer.style.display = "none";
    
    for (var i = 0; i < singleFlagAndModTippys.length; i++)
    {
        singleFlagAndModTippys[i][0].destroy();
    }
    singleFlagAndModTippys = [];

    get(`https://www.speedrun.com/api/v1/runs/${id}?embed=players,platform,game`)
	.then((data) =>
	{
        if (!getErrorCheck(data)) return;
        
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

            player = getGradientName(rawPlayer, temp["name-style"]);
        }
        else
        {
            rawPlayer = run.players.data[0].name;
            player = rawPlayer;
        }

        var singleFlagAndModTippysInfo = [];


        var modIcon = '';
        var flag = '';
        var userIcon = '';
        if (run.players.data[0].id != undefined)
        {
            if (currentMods[run.players.data[0].id] != undefined)
            {
                if (currentMods[run.players.data[0].id] == "moderator")
                {
                    modIcon = `<img id="singleruns-${run.players.data[0].id}-modIcon" class="runs-usericon" src="https://www.speedrun.com/images/icons/mod.png">`;

                    singleFlagAndModTippysInfo.push({
                        "id": `#singleruns-${run.players.data[0].id}-modIcon`,
                        "text": "Mod"
                    });
                }
                else if (currentMods[run.players.data[0].id] == "super-moderator")
                {
                    if (currentGame.verifiers.includes(run.players.data[0].id))
                    {
                        modIcon = `<img id="singleruns-${run.players.data[0].id}-modIcon" class="runs-usericon" src="https://www.speedrun.com/images/icons/verifier.png">`;

                        singleFlagAndModTippysInfo.push({
                            "id": `#singleruns-${run.players.data[0].id}-modIcon`,
                            "text": "Verifier"
                        });
                    }
                    else
                    {
                        modIcon = `<img id="singleruns-${run.players.data[0].id}-modIcon" class="runs-usericon" src="https://www.speedrun.com/images/icons/super-mod.png">`;

                        singleFlagAndModTippysInfo.push({
                            "id": `#singleruns-${run.players.data[0].id}-modIcon`,
                            "text": "Super Mod"
                        });
                    }
                }
            }

            if (run.players.data[0].location !== null)
			{
				flag = `<img id="singleruns-${run.players.data[0].id}-userFlag" class="runs-flag" src="https://www.speedrun.com/images/flags/${run.players.data[0].location.country.code}.png">`;

                singleFlagAndModTippysInfo.push({
                    "id": `#singleruns-${run.players.data[0].id}-userFlag`,
                    "text": run.players.data[0].location.country.names.international
                });
			}

            if (run.players.data[0].assets.icon.uri)
            {
                userIcon += `<img class="runs-usericon" src="${run.players.data[0].assets.icon.uri}">`;
            }
            if (run.players.data[0].assets.supporterIcon && run.players.data[0].assets.supporterIcon.uri)
            {
                userIcon += `<img class="runs-usericon" src="${run.players.data[0].assets.supporterIcon.uri}">`;
            }
        }

        if (player != rawPlayer)
        {
            singleFlagAndModTippysInfo.push({
                "id": `#singleruns-${run.players.data[0].id}-card`,
                "text": getCardHTML(rawPlayer, run.players.data[0].assets.image.uri, `${flag}${userIcon}${player}`, getAverageColor(temp["name-style"]))
            });
            
            player = `<a class="player-link" id="singleruns-${run.players.data[0].id}-card" href="/user/${rawPlayer}">${modIcon}${flag}${userIcon}${player}</a>`;
        }
        else
            player = `<b>${player}</b>`;

        var place = '';
        var placeObj = document.getElementById(`run-${id}`);
        if (placeObj)
        {
            place = nth(parseInt(placeObj.dataset.place));
            if (place == "1st" || place == "2nd" || place == "3rd")
            {
                place = ` - <b class="place-${place}">${place}</b> place`;
            }
            else if (place == "0th")
            {
                place = "";
            }
            else
            {
                place = ` - ${place} place`;
            }
        }

        var srcLink = run.weblink;
        var vidLink = '';
        if (run.videos != null && run.videos.links != undefined)
        {
            vidLink = run.videos.links[0].uri;
            runSingleVid.style.display = "flex";
        }
        else
        {
            runSingleVid.style.display = "none";
        }

        var comment = '';
        runSingleComment.innerText = '';
        if (run.comment)
        {
            runSingleComment.style.display = "inline-block";
            comment = run.comment;
        }
        if (comment == '')
        {
            runSingleComment.style.display = "none";
        }

        var platform = run.platform.data.name;
        if (currentGame.hardware != "")
        {
            if (platform)
                platform = `using <b>${runsHardwareArray[run.values[currentGame.hardware]]}</b> (<i>${platform}</i>)`;
            else
                platform = `using <b>${runsHardwareArray[run.values[currentGame.hardware]]}</b>`;
        }
        else if (platform)
        {
            platform = `using <b>${platform}</b>`
        }
        else
            platform = '';

        var _date = new Date(run.date);
        var date = _date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
        var dateTitle = _date.toString();
        
        _date = new Date(run.status["verify-date"]);
        var verifyDate = _date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
        var verifyDateTitle = _date.toString();
        
        _date = new Date(run.submitted);
        var submittedDate = _date.toLocaleDateString("en-US", { year: 'numeric', month: 'long', day: 'numeric' });
        var submittedDateTitle = _date.toString();

        runSingleGame.innerText = game;
        runSingleCategory.innerText = category;
        runSingleTime.innerText = time;
        runSingleRunner.innerHTML = player;
        runSinglePlace.innerHTML = place;
        runSingleComment.innerText = comment;
        runSinglePlatform.innerHTML = platform;
        runSingleDate.innerText = date;
        runSingleDate.title = dateTitle;
        runSingleSubmittedDate.innerText = submittedDate;
        runSingleSubmittedDate.title = submittedDateTitle;

        document.title = `${categories[currentCatIndex].name} in ${time} by ${rawPlayer} - ${game} - VRSR`;

        runSingleSrc.href = srcLink;
        runSingleVid.href = vidLink;

        runSingleVidIcon.classList.remove('fab', 'fas', 'fa-youtube', 'fa-twitch', 'fa-video');

        runLoadLastAttempt = "";

        if (runSingleVid._tippy)
        {
            runSingleVid._tippy.destroy();
        }

        if (vidLink.includes("youtube.com") || vidLink.includes("youtu.be"))
        {
            runSingleVidIcon.classList.add('fab', 'fa-youtube');

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
            runSingleVidIcon.classList.add('fab', 'fa-twitch');
            
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
            runSingleVidIcon.classList.add('fas', 'fa-video');
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

        get(`https://www.speedrun.com/api/v1/users/${run.status.examiner}`)
        .then((__data) =>
        {
			if (!getErrorCheck(__data)) return;
            
            var _data = (JSON.parse(__data)).data;
            var verifier = getGradientName(_data.names.international, _data["name-style"]);

            var verifierModIcon = '';
            var verifierFlag = '';

            if (currentMods[_data.id] != undefined)
            {
                if (currentMods[_data.id] == "moderator")
                {
                    verifierModIcon = `<img id="singleruns-${_data.id}-verModIcon" class="runs-usericon" src="https://www.speedrun.com/images/icons/mod.png">`;

                    singleFlagAndModTippysInfo.push({
                        "id": `#singleruns-${_data.id}-verModIcon`,
                        "text": "Mod"
                    });
                }
                else if (currentMods[_data.id] == "super-moderator")
                {
                    if (currentGame.verifiers.includes(_data.id))
                    {
                        verifierModIcon = `<img id="singleruns-${_data.id}-verModIcon" class="runs-usericon" src="https://www.speedrun.com/images/icons/verifier.png">`;

                        singleFlagAndModTippysInfo.push({
                            "id": `#singleruns-${_data.id}-verModIcon`,
                            "text": "Verifier"
                        });
                    }
                    else
                    {
                        verifierModIcon = `<img id="singleruns-${_data.id}-verModIcon" class="runs-usericon" src="https://www.speedrun.com/images/icons/super-mod.png">`;

                        singleFlagAndModTippysInfo.push({
                            "id": `#singleruns-${_data.id}-verModIcon`,
                            "text": "Super Mod"
                        });
                    }
                }
            }

            if (_data.location !== null)
            {
                verifierFlag = `<img id="singleruns-${_data.id}-verFlag" class="runs-flag" src="https://www.speedrun.com/images/flags/${_data.location.country.code}.png">`;

                singleFlagAndModTippysInfo.push({
                    "id": `#singleruns-${_data.id}-verFlag`,
                    "text": _data.location.country.names.international
                });
            }

            verifierIcon = '';
            if (_data.assets.icon.uri)
            {
                verifierIcon = `<img class="runs-usericon" src="${_data.assets.icon.uri}"">`;
            }
            if (_data.assets.supporterIcon && _data.assets.supporterIcon.uri)
            {
                verifierIcon = `<img class="runs-usericon" src="${_data.assets.supporterIcon.uri}"">`;
            }
                
            var verifier = `<a class="player-link" href="/user/${_data.names.international}">${verifierModIcon}${verifierFlag}${verifierIcon}${verifier}</a>`;

            if (run.status.status == "verified")
            {
                runSingleVerifyReject.innerHTML = `<p class="head">Verified</p><p>by <span id="run-single-verifier">${verifier}</span> on <span title="${verifyDateTitle}">${verifyDate}</span>.</p>`;
            }
            else if (run.status.status == "rejected")
            {
                runSingleVerifyReject.innerHTML = `<p class="head"><i class="fas fa-exclamation-circle" style="color: #F14668"></i> Rejected</p><p>by <span id="run-single-verifier">${verifier}</span>.</p>`;
                runSinglePlace.innerHTML = ' - Rejected'
            }

            singleFlagAndModTippysInfo.push({
                "id": `#run-single-verifier`,
                "text": getCardHTML(_data.names.international, _data.assets.image.uri, verifier, getAverageColor(_data["name-style"]))
            });

            if (!isMobile)
            {
                for (var i = 0; i < singleFlagAndModTippysInfo.length; i++)
                {
                    if (singleFlagAndModTippysInfo[i].id.endsWith("-card") || singleFlagAndModTippysInfo[i].id == "#run-single-verifier")
                    {
                        singleFlagAndModTippys[i] = tippy(singleFlagAndModTippysInfo[i].id, {
                            content: singleFlagAndModTippysInfo[i].text,
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
                        singleFlagAndModTippys[i] = tippy(singleFlagAndModTippysInfo[i].id, {
                            content: singleFlagAndModTippysInfo[i].text,
                            placement: 'top'
                        });
                    }                
                }
            }
        });

        if (run.splits !== null)
        {
            var splitArr = run.splits.uri.split('/');
            var splitsId = splitArr[splitArr.length - 1];

            runSingleSplitsRT.setAttribute( 'onclick', `loadSplits("${splitsId}", "real")`);
            runSingleSplitsGT.setAttribute( 'onclick', `loadSplits("${splitsId}", "game")`);

            boxSingleRun.style.paddingBottom = "0";
            loadSplits(splitsId);
        }
        else
        {
            boxSingleRun.style.paddingBottom = "1.25rem";
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
    var _c = h2r(gameColors[currentGame.color].color);
    var _base = `rgba(${_c[0]}, ${_c[1]}, ${_c[2]}, `;
    splitsBarColors = [];
    for (var i = 1; i < 4; i++)
    {
        splitsBarColors.push(`${_base}${0.25 * i})`);
    }

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
        lastSplitsTippys[i].destroy();
    }
    lastSplitsTippys = [];
    
    runSingleSplitsUrl.href = `https://splits.io/${id}`;

    runSingleSplitsMiddleInfo.innerHTML = '';

    get(`https://splits.io/api/v4/runs/${id}`)
    .then((data) =>
    {
        if (!getErrorCheck(data)) return;
        
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

            if (run["gametime_duration_ms"] == 0)
            {
                runSingleSplitsTiming.style.display = "none";
            }
            else
            {
                runSingleSplitsTiming.style.display = "flex";
            }
        }
        else if (timing == "gametime")
        {
            runSingleSplitsGT.classList.add("is-active");
            runSingleSplitsRT.classList.remove("is-active");

            if (run["realtime_duration_ms"] == 0)
            {
                runSingleSplitsTiming.style.display = "none";
            }
            else
            {
                runSingleSplitsTiming.style.display = "flex";
            }
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

            var runName = seg["display_name"].replace("<", "&lt;").replace(">", "&gt;");

            var runDur = "—";
            var runFin = "—";
            
            if (!seg[`${timing}_skipped`])
            {
                runDur = msToTime(seg[`${timing}_duration_ms`]);
                runFin = msToTime(seg[`${timing}_end_ms`])
            }
            else
            {
                runName += " <i>(Skipped)</i>"
            }

            var row = `<tr${pbColor}><td>${(seg["segment_number"] + 1)}</td><td>${runName}</td><td>${runDur}</td><td>${runFin}</td></tr>`;

            var percent = (seg[`${timing}_duration_ms`] / totalDuration) * 100;
            var color = splitsBarColors[i % splitsBarColors.length];

            var newpb = '';
            if ((seg[timing + "_duration_ms"] - seg[timing + "_shortest_duration_ms"]) <= 0)
            {
                newpb = `<i class="fas fa-star new-pb-icon"></i>`;
            }
            
            runSingleSplitsBar.innerHTML += `<div id="bar-${i}" style="width: ${percent}%; background-color: ${color}">${newpb}<div><div>${seg["display_name"].replace("<", "&lt;").replace(">", "&gt;")}</div><div class="sp-time">${msToTime(seg[`${timing}_duration_ms`])}</div></div></div>`;
            
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
                
                runSingleSegments.innerHTML += `<tr${pbColor}><td>${seg["segment_number"] + 1}</td><td>${seg["display_name"].replace("<", "&lt;").replace(">", "&gt;")}</td><td>${msToTime(seg[`${timing}_duration_ms`])}</td><td>${msToTime(seg[`${timing}_end_ms`])}</td></tr>`;
            }
        }
        runSingleSegments.innerHTML += temp;

        var barPercentSum = 0;

        for (var i = 0; i < run.segments.length; i++)
        {
            var seg = run.segments[i];

            barPercentSum += seg[`${timing}_duration_ms`] / totalDuration;

            var dir = "left";
            if (barPercentSum > 0.5)
                dir = "right";
            
            var timesave = '';
            var _timesave = seg[timing + "_duration_ms"] - seg[timing + "_shortest_duration_ms"];
            if (_timesave > 0)
            {
                timesave = `${msToTimeSingle(_timesave)} of possible timesave.`;
            }
            else
            {
                timesave = '<span class="new-pb"><i class="fas fa-medal"></i> New personal best!</span>';
            }
            
            var content = `<div class="has-text-${dir}"><p class="has-text-weight-bold"><span class="sp-name-num">${seg["segment_number"] + 1}.</span> ${seg["display_name"].replace("<", "&lt;").replace(">", "&gt;")}</p><p class="sp-time">Duration: ${msToTime(seg[`${timing}_duration_ms`])}</p><p class="sp-time">Finished at: ${msToTime(seg[`${timing}_end_ms`])}</p><p class="sp-timesave">${timesave}</p></div>`;
            
            lastSplitsTippys[i] = tippy(`#bar-${i}`, {
                content: content
            })[0];
        }

        tippy.createSingleton(lastSplitsTippys, {
            offset: [0,7.5],
            delay: [0, 75],
            allowHTML: true,
            moveTransition: 'transform 0.175s ease-out'
        });

        for (var i = 0; i < splitsMiddleTippys.length; i++)
        {
            splitsMiddleTippys[i].destroy();
        }
        splitsMiddleTippys = [];
        runSingleSplitsMiddleInfo.innerHTML = '';

        var possibleTimesave = msToTimeAll(run[`${timing}_duration_ms`] - run[`${timing}_sum_of_best_ms`]);

        if (run["uses_autosplitter"])
        {
            runSingleSplitsMiddleInfo.innerHTML += '<i id="run-single-middle-autosplitter" class="fas fa-magic"></i>';

            
        }
        
        runSingleSplitsMiddleInfo.innerHTML += '<i id="run-single-middle-attempts" class="fas fa-redo-alt"></i>';
        runSingleSplitsMiddleInfo.innerHTML += '<i id="run-single-middle-sumofbest" class="fas fa-plus"></i>';

        if (possibleTimesave != '')
        {
            runSingleSplitsMiddleInfo.innerHTML += '<i id="run-single-middle-timesave" class="fas fa-clock"></i>';
        }

        if (run["uses_autosplitter"])
        {
            splitsMiddleTippys.push(tippy('#run-single-middle-autosplitter', {
                content: `<center><b>Used<br>Autosplitter</b></center>`,
                allowHTML: true,
                offset: [0,2],
                placement: 'top'
            })[0]);
        }

        splitsMiddleTippys.push(tippy('#run-single-middle-attempts', {
            content: `<center><b>Attempts</b><br>${run.attempts}</center>`,
            allowHTML: true,
            offset: [0,2],
            placement: 'top'
        })[0]);
        splitsMiddleTippys.push(tippy('#run-single-middle-sumofbest', {
            content: `<center><b>Sum of Best</b><br>${msToTimeAll(run[`${timing}_sum_of_best_ms`])}</center>`,
            allowHTML: true,
            offset: [0,2],
            placement: 'top'
        })[0]);

        if (possibleTimesave != '')
        {
            splitsMiddleTippys.push(tippy('#run-single-middle-timesave', {
                content: `<center><b>Possible Timesave</b><br>${possibleTimesave}</center>`,
                allowHTML: true,
                offset: [0,2],
                placement: 'top'
            })[0]);
        }

        tippy.createSingleton(splitsMiddleTippys, {
            delay: [0, 75],
            moveTransition: 'transform 0.175s ease-out',
            allowHTML: true,
            placement: 'top'
        });

        runSingleSplitsInner.style.display = "block";
        runSingleSplitsLoading.style.display = "none";
    });
}

function msToTime(duration) {
    var milliseconds = Math.floor((duration % 1000)),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);
  
    hours = (hours < 10) ? `0${hours}` : hours;
    minutes = (minutes < 10) ? `0${minutes}` : minutes;
    seconds = (seconds < 10) ? `0${seconds}` : seconds;
  
    return `${hours}:${minutes}:${seconds}.${milliseconds}`;
}

function msToTimeAll(duration) {
    var milliseconds = Math.floor((duration % 1000)),
        seconds = Math.floor((duration / 1000) % 60),
        minutes = Math.floor((duration / (1000 * 60)) % 60),
        hours = Math.floor((duration / (1000 * 60 * 60)) % 24);

    if (hours > 0)
    {
        return `${hours}h ${minutes}m ${seconds}s ${milliseconds}ms`;
    }
    else if (minutes > 0)
    {
        return `${minutes}m ${seconds}s ${milliseconds}ms`
    }
    else if (seconds > 0)
    {
        return `${seconds}s ${milliseconds}ms`;
    }
    else if (milliseconds > 0)
    {
        return `${milliseconds}ms`;
    }
    
    return '';
}

function msToTimeSingle(duration) {
    var milliseconds = Math.floor((duration % 1000)),
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
    
    return '<1ms';
}