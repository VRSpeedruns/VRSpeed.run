var userContainer;
var userRunsTable;

var userUsername;
var userPfp;
var userLinksSrc;
var userLinksInfo;
var userLinksForum;

var userRunsLoading;

var userRunTippys = [];

function onUserLoad()
{
    userContainer = document.getElementById("user-container");
    userRunsTable = document.getElementById("user-runs-table");
    
    userUsername = document.getElementById("user-username");
    userPfp = document.getElementById("user-pfp");
    userLinksSrc = document.getElementById("user-links-src");
    userLinksInfo = document.getElementById("user-links-info");
    userLinksForum = document.getElementById("user-links-forum");

    userRunsLoading = document.getElementById("user-runs-loading");
}

function loadUser(username)
{
    homeContainer.style.display = "none";
    mainContainer.style.display = "none";
    userContainer.style.display = "block";

    for (var i = 0; i < userRunTippys.length; i++)
	{
		userRunTippys[i][0].destroy();
	}
	userRunTippys = [];

    get(`https://www.speedrun.com/api/v1/users/${username}`)
    //get(`https://vrspeed.run/vrsrassets/other/temp2.json`)
    .then((data) =>
    {
        if (!getErrorCheck(data)) return;

        var temp = (JSON.parse(data));
        if (temp.status == 404)
        {
            replaceState(null);
            loadGame(null);
            return;
        }

        var user = (JSON.parse(data)).data;
        
        document.title = `${user.names.international} - VRSR`;
        userLinksSrc.href = user.weblink;
        userLinksInfo.href = `${user.weblink}/info`;
        userLinksForum.href = `${user.weblink}/allposts`;

        userPfp.src = `/vrsrassets/php/userIcon.php?t=p&u=${user.names.international}`;

        var player = getGradientName(user.names.international,
            user["name-style"]["color-from"].dark, 
            user["name-style"]["color-to"].dark);
        
        var flag = '';
        if (user.location !== null)
        {
            flag = `<img id="user-${user.id}-userFlag" class="runs-flag" src="https://www.speedrun.com/images/flags/${user.location.country.code}.png">`;
        }
    
        var userIcon = `<img class="runs-usericon" src="/vrsrassets/php/userIcon.php?t=i&u=${user.names.international}" onload="handleIconLoad(this);">`;

        userUsername.innerHTML = `${flag}${userIcon}${player}`;

        if (user.location !== null)
        {
            userRunTippys.push(tippy(`#user-${user.id}-userFlag`, {
                content: user.location.country.names.international,
                placement: 'top'
            }));
        }

        loadUserRuns(username);
    });    
}

function loadUserRuns(username)
{
    get(`https://www.speedrun.com/api/v1/users/${username}/personal-bests?embed=game,category,platform`)
    //get(`https://vrspeed.run/vrsrassets/other/temp.json`)
    .then((data) =>
    {
        if (!getErrorCheck(data)) return;
        
        var runs = (JSON.parse(data)).data;
        var gameCheck = [];
        var games = [];
        
        for (var i = 0; i < runs.length; i++)
        {
            if (runs[i].category.data.type != 'per-game') continue;

            var isVR = false;
            for (var k = 0; k < gamesArray.length; k++)
            {
                if (runs[i].game.data.abbreviation == gamesArray[k].id)
                {
                    isVR = true;
                    break;
                }
            }
            if (isVR && !gameCheck.includes(runs[i].run.game))
            {
                gameCheck.push(runs[i].run.game);
                games.push({"game": runs[i].game.data, "runs": []});
            }
        }
        if (gameCheck.length == 0)
        {
            userRunsTable.innerHTML = "<center>This user hasn't submitted any virtual reality speedruns.</center>";
            return;
        }

        for (var i = 0; i < runs.length; i++)
        {
            if (runs[i].category.data.type != 'per-game') continue;

            var run = runs[i].run;
            run.category = runs[i].category.data;
            run.system.platform = runs[i].platform.data;
            run.place = runs[i].place;

            for (var k = 0; k < games.length; k++)
            {
                if (games[k].game.id == run.game)
                {
                    games[k].runs.push(run);
                    break;
                }
            }
        }

        var userRunTippysInfo = [];

        for (var i = 0; i < games.length; i++)
        {
            var thisGame = null;
            for (var k = 0; k < gamesArray.length; k++)
            {
                if (games[i].game.abbreviation == gamesArray[k].id)
                {
                    thisGame = gamesArray[k];
                    break;
                }
            }

            var html = `<div class="user-runs-container"><div class="user-runs-image"><img src="https://www.speedrun.com/themes/${games[i].game.abbreviation}/cover-256.png"></div>
            <div class="user-runs-heading"><a href="/${thisGame.abbreviation}" class="thick-underline" style="color: ${thisGame.color};">${games[i].game.names.international}</a></div><table id="user-runs-table" class="table is-narrow is-fullwidth"><tbody class="user-runs-tbody">`;

            for (var k = 0; k < games[i].runs.length; k++)
            {
                var run = games[i].runs[k];

                var place = nth(run.place);
                if (place == "1st" || place == "2nd" || place == "3rd")
                {
                    place = `<b class="place-${place}">${place}</b>`;
                }
                else if (place == "0th")
                {
                    place = "—";
                }

                var time = runTimeFormat(run.times.primary);
                var platform = run.system.platform.name;
                var date = `<span title="${new Date(run.submitted).toDateString()}">${timeAgo(new Date(run.submitted))}</span>`;
                
                var icons = '';
                if (run.splits != null)
                {
                    icons += `<i id="run-${run.id}-splits" class="fas fa-stopwatch"></i>`;

                    userRunTippysInfo.push({
                        "id": `#run-${run.id}-splits`,
                        "text": "Splits are available for this run."
                    });
                }
                if (run.videos != null && run.videos.links != undefined)
                {
                    icons += `<i id="run-${run.id}-video" class="fas fa-video"></i>`;

                    userRunTippysInfo.push({
                        "id": `#run-${run.id}-video`,
                        "text": "Video is available for this run."
                    });
                }

                html += `<tr id="run-${run.id}" onclick="openUserRun('${thisGame.abbreviation}', '${run.id}')" data-place="${run.place}"><td>${place}</td><td style="font-weight: bold">${run.category.name}</td><td>${time}</td><td class="is-hidden-mobile">${platform}</td><td class="is-hidden-mobile">${date}</td><td class="has-text-right is-hidden-mobile is-table-icons">${icons}</td></tr>`;
            }

            userRunsTable.innerHTML += html + '</tbody></table></div>';
        }
        
        userRunsLoading.style.display = "none";

        for (var i = 0; i < userRunTippysInfo.length; i++)
        {    
            userRunTippys.push(tippy(userRunTippysInfo[i].id, {
                content: userRunTippysInfo[i].text,
                placement: 'top'
            }));
        }
    });
}

function openUserRun(game, run)
{
    window.open(`https://vrspeed.run/${game}/run/${run}`, '_self');
}