var userContainer;
var userRunsTable;

var userRunTippys = [];

function onUserLoad()
{
    userContainer = document.getElementById("user-container");
    userRunsTable = document.getElementById("user-runs-table");
}

function loadUser(username)
{
    homeContainer.style.display = "none";
    mainContainer.style.display = "none";
    userContainer.style.display = "block";

    var user = null;

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

        user = (JSON.parse(data)).data;
        
        document.title = `${user.names.international} - VRSR`
    });

    get(`https://www.speedrun.com/api/v1/users/${username}/personal-bests?embed=game,category,platform`)
    //get(`https://vrspeed.run/vrsrassets/other/temp.json`)
    .then((data) =>
    {
        if (!getErrorCheck(data)) return;

        var runs = (JSON.parse(data)).data;
        var gameOrder = [];
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
            if (isVR && !gameOrder.includes(runs[i].run.game))
            {
                gameOrder.push(runs[i].run.game);
                games.push({"game": runs[i].game.data, "runs": []});
            }
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
            var html = `<div class="user-runs-container"><div class="user-runs-image"><img src="https://www.speedrun.com/themes/${games[i].game.abbreviation}/cover-256.png"></div>
            <div class="user-runs-heading">${games[i].game.names.international}</div><table id="user-runs-table" class="table is-narrow is-fullwidth"><tbody class="user-runs-tbody">`;

            var thisGame = null;
            for (var k = 0; k < gamesArray.length; k++)
            {
                if (games[i].game.abbreviation == gamesArray[k].id)
                {
                    thisGame = gamesArray[k];
                    break;
                }
            }

            for (var k = 0; k < games[i].runs.length; k++)
            {
                var run = games[i].runs[k];

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

                html += `<tr id="run-${run.id}" onclick="openUserRun('${thisGame.abbreviation}', '${run.id}')" data-place="${run.place }"><td style="font-weight: bold">${run.category.name}</td><td>${run.place}</td><td>${time}</td><td class="is-hidden-mobile">${platform}</td><td class="is-hidden-mobile">${date}</td><td class="has-text-right is-hidden-mobile is-table-icons">${icons}</td></tr>`;
            }

            userRunsTable.innerHTML += html + '</tbody></table></div>';
        }

        for (var i = 0; i < userRunTippysInfo.length; i++)
        {    
            userRunTippys[i] = tippy(userRunTippysInfo[i].id, {
                content: userRunTippysInfo[i].text,
                placement: 'top'
            });
        }
    });
}

function openUserRun(game, run)
{
    window.open(`https://vrspeed.run/${game}/run/${run}`, '_self');
}