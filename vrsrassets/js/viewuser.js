var userContainer;
var userRunsTable;

var userUsername;
var userPfp;
var userPronouns;
var userAccounts;
var userRunCount;
var userModeratorOf;
var userLinksSrc;
var userLinksInfo;

var userRunsLoading;

var userRunTippys = [];

function onUserLoad()
{
    userContainer = document.getElementById("user-container");
    allContainers.push(userContainer);
    userRunsTable = document.getElementById("user-runs-table");
    
    userUsername = document.getElementById("user-username");
    userPfp = document.getElementById("user-pfp");
    userPronouns = document.getElementById("user-pronouns");
    userAccounts = document.getElementById("user-accounts");
    userRunCount = document.getElementById("user-run-count");
    userModeratorOf = document.getElementById("user-moderator-of");
    userLinksSrc = document.getElementById("user-links-src");
    userLinksInfo = document.getElementById("user-links-info");

    userRunsLoading = document.getElementById("user-runs-loading");
}

function loadUser(username)
{
    hideAllContainers();
    userContainer.style.display = "block";

    for (var i = 0; i < userRunTippys.length; i++)
	{
		userRunTippys[i][0].destroy();
	}
	userRunTippys = [];

    get(`https://www.speedrun.com/api/v1/users/${username}`)
    .then((data) =>
    {
        if (!getErrorCheck(data)) return;

        var temp = (JSON.parse(data));
        if (temp.status == 404)
        {
            replaceState(null);
            loadGame(null);
            sendErrorNotification(`User "${username}" not found.`);
            latestWRsLoad();
            return;
        }

        var user = (JSON.parse(data)).data;
        
        document.title = `${user.names.international} - VRSR`;
        userLinksSrc.href = user.weblink;
        userLinksInfo.href = `${user.weblink}/info`;

        if (user.assets.image.uri)
        {
            userPfp.style.display = "inline-block";
            userPfp.src = user.assets.image.uri;
        }
        else
        {
            userPfp.style.display = "none";
        }

        var player = getGradientName(user.names.international, user["name-style"]);
        
        var color = getAverageColor(user["name-style"]);
        document.documentElement.style.setProperty('--primary-color', color);
		document.documentElement.style.setProperty('--primary-color-hover', color);

        var flag = '';
        if (user.location !== null)
        {
            flag = `<img id="user-${user.id}-userFlag" class="runs-flag" src="https://www.speedrun.com/images/flags/${user.location.country.code}.png">`;
        }
    
        var userIcon = '';

        if (user.assets.icon.uri)
            userIcon = `<img class="runs-usericon" src="${user.assets.icon.uri}">`;

        userUsername.innerHTML = `<b>${flag}${userIcon}${player}</b>`;

        if (!isMobile && user.location !== null)
        {
            userRunTippys.push(tippy(`#user-${user.id}-userFlag`, {
                content: user.location.country.names.international,
                placement: 'top'
            }));
        }

        var accounts = '';
        if (user.twitch)
        {
            accounts += `<a id="user-acc-twitch" href="${user.twitch.uri}"><i class="fab fa-twitch"></i></a>`;
        }
        if (user.youtube)
        {
            accounts += `<a id="user-acc-youtube" href="${user.youtube.uri}"><i class="fab fa-youtube"></i></a>`;
        }
        if (user.twitter)
        {
            accounts += `<a id="user-acc-twitter" href="${user.twitter.uri}"><i class="fab fa-twitter"></i></a>`;
        }

        userPronouns.innerHTML = user.pronouns;
        userAccounts.innerHTML = accounts;
        userRunCount.innerHTML = '';

        var accountTippy = [];
        if (user.twitch)
        {
            accountTippy.push(tippy('#user-acc-twitch', {
                content: 'Twitch'
            })[0]);
        }
        if (user.youtube)
        {
            accountTippy.push(tippy('#user-acc-youtube', {
                content: 'YouTube'
            })[0]);
        }
        if (user.twitter)
        {
            accountTippy.push(tippy('#user-acc-twitter', {
                content: 'Twitter'
            })[0]);
        }
        tippy.createSingleton(accountTippy, {
            delay: [0, 75],
            moveTransition: 'transform 0.175s ease-out'
        })

        loadUserRuns(user.id);
        loadUserModeratorOf(user.id);
    });    
}

function loadUserRuns(id)
{
    get(`https://www.speedrun.com/api/v1/users/${id}/personal-bests?embed=game,category,category.variables,platform`)
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
            userRunsLoading.style.display = "none";
            userRunsTable.innerHTML = `<center style="padding-top: 0.9rem;">This user hasn't submitted any virtual reality speedruns.</center>`;
            loadUserRunCount();
            return;
        }
        
        loadUserRunCount(`https://www.speedrun.com/api/v1/runs?user=${id}&max=200&embed=game`);

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

            var html = `<div class="user-runs-container"><div class="user-runs-image"><a href="/${thisGame.abbreviation}"><img src="${games[i].game.assets["cover-large"].uri}" onload="setUserRunContainerSize(this);"></a></div>
            <div class="user-runs-heading"><a href="/${thisGame.abbreviation}" class="thick-underline" style="color: ${thisGame.color};">${thisGame.name}</a></div><table class="table is-narrow is-fullwidth"><tbody class="user-runs-tbody">`;

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

                var category = `<b>${run.category.name}</b>`;
                var subcats = [];

                for (var m = 0; m < run.category.variables.data.length; m++)
                {
                    var variable = run.category.variables.data[m];

                    if (variable["is-subcategory"])
                    {
                        var value = variable.values.values[run.values[variable.id]];
                        if (value)
                        {
                            subcats.push(value.label);
                        }
                    }
                }
                
                if (subcats.length > 0)
                {
                    category += ` (${subcats.join(", ")})`;
                }

                var time = runTimeFormat(run.times.primary);
                var platform = run.system.platform.name;
                if (!platform) platform = '—';
                var date = `<span title="${new Date(run.submitted).toDateString()}">${timeAgo(new Date(run.submitted))}</span>`;
                
                var icons = '';
                if (run.splits != null)
                {
                    icons += `<i id="run-${run.id}-splits" class="fas fa-stopwatch"></i>`;

                    if (!isMobile)
                    {
                        userRunTippysInfo.push({
                            "id": `#run-${run.id}-splits`,
                            "text": "Splits are available for this run."
                        });
                    }
                }
                if (run.videos != null && run.videos.links != undefined)
                {
                    icons += `<i id="run-${run.id}-video" class="fas fa-video"></i>`;

                    if (!isMobile)
                    {
                        userRunTippysInfo.push({
                            "id": `#run-${run.id}-video`,
                            "text": "Video is available for this run."
                        });
                    }
                }

                html += `<tr id="run-${run.id}" onclick="openUserRun('${thisGame.abbreviation}', '${run.id}')" data-place="${run.place}" data-runtarget="${thisGame.abbreviation}/run/${run.id}"><td>${place}</td><td>${category}</td><td>${time}</td><td class="is-hidden-mobile">${platform}</td><td class="is-hidden-mobile">${date}</td><td class="has-text-right is-hidden-mobile is-table-icons">${icons}</td></tr>`;
            }

            userRunsTable.innerHTML += html + '</tbody></table></div>';
        }
        
        userRunsLoading.style.display = "none";

        var iconSingletonObjs = [];
        var offset = userRunTippys.length;

        for (var i = 0; i < userRunTippysInfo.length; i++)
        {    
            userRunTippys[i + offset] = tippy(userRunTippysInfo[i].id, {
                content: userRunTippysInfo[i].text,
                placement: 'top'
            });

            iconSingletonObjs.push(userRunTippys[i + offset][0]);
        }

        tippy.createSingleton(iconSingletonObjs, {
            delay: [0, 75],
            moveTransition: 'transform 0.175s ease-out',
            placement: 'top'
        });
    });
}

function loadUserModeratorOf(id)
{
    userModeratorOf.innerHTML = '';
    get(`https://www.speedrun.com/api/v1/games?moderator=${id}&max=${gamesArray.length <= 200 ? gamesArray.length : 200}`)
    .then((data) =>
    {
        if (!getErrorCheck(data)) return;
        
        var modGames = (JSON.parse(data)).data;
        
        if (modGames.length > 0)
        {
            userModeratorOf.innerHTML = "Moderator of:<br>";
            var first = true;

            for (var i = 0; i < modGames.length; i++)
            {
                for (var k = 0; k < gamesArray.length; k++)
                {
                    if (modGames[i].abbreviation == gamesArray[k].id)
                    {
                        var comma = first ? '' : ', ';
                        userModeratorOf.innerHTML += `${comma}<a href="/${gamesArray[k].abbreviation}" style="color: ${gamesArray[k].color}">${gamesArray[k].name}</a>`;
                        first = false;
                        break;
                    }
                }
            }
        }
    });
}

function loadUserRunCount(link = "", count = 0)
{
    if (link == "")
    {
        userRunCount.innerHTML = 'Total VR Runs: <b>0</b>';
        return;
    }
    
    get(link)
    .then((data) =>
    {
        if (!getErrorCheck(data)) return;

        var runs = (JSON.parse(data));
        var pagination = runs.pagination;
        runs = runs.data;

        for (var i = 0; i < runs.length; i++)
        {
            if (gamesArray.filter(e => e.id == runs[i].game.data.abbreviation).length > 0)
            {
                count++;
            }
        }

        if (pagination.links.length > 0)
        {
            for (var i = 0; i < pagination.links.length; i++)
            {
                if (pagination.links[i].rel == "next")
                {
                    loadUserRunCount(pagination.links[i].uri, count);
                    return;
                }
            }
        }

        userRunCount.innerHTML = `Total VR Runs: <b>${count}</b>`;
    });
}

function setUserRunContainerSize(_this)
{
    _this.parentElement.parentElement.parentElement
         .style.minHeight = `${_this.offsetHeight}px`;
}

function openUserRun(game, run)
{
    window.open(`https://vrspeed.run/${game}/run/${run}`, '_self');
}