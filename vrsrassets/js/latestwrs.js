var latestWRContainer;

function latestWRsLoad()
{
    latestWRContainer = document.getElementById("world-records");

    getLatest();
}

function getLatest()
{
    latestWRContainer.innerHTML = `<div id="latest-wr-loading" class="loadingdiv column is-12" style="display: block; margin-top: -2.5em;"><div><div class="spinner"></div><div class="belowspinner">Loading...</div></div></div>`;
    if (getCookie('latest_wrs') == "")
    {
        get('https://api.github.com/repos/VRSRBot/LatestWorldRecords/releases?per_page=4')
        .then((data) =>
        {
            var _data = (JSON.parse(data));
            if (_data.message && _data.message.startsWith("API rate limit exceeded"))
            {
                sendErrorNotification(`<b>The GitHub API rate limit was exceeded. The "Latest World Records" widget and the "Status" page may not load correctly.</b>`);
                return;
            }

            var wrs = [];

            for (var i = 0; i < _data.length; i++)
            {
                wrs[i] = _data[i].name;
            }

            setCookie('latest_wrs', JSON.stringify(wrs), 20);

            loadWRs(wrs);
        });
    }
    else
    {
        loadWRs(JSON.parse(getCookie('latest_wrs')));
    }
}


function loadWRs(wrs)
{
    for (var i = 0; i < wrs.length; i++)
    {
        latestWRContainer.innerHTML += `<div class="column is-6"><div class="wr" id="wr-${wrs[i]}"></div></div>`;
    }
    for (var i = 0; i < wrs.length; i++)
    {
        loadWR(wrs[i]);
    }
}
function loadWR(id)
{
    get(`https://www.speedrun.com/api/v1/runs/${id}?embed=players,platform,game,category,category.variables`)
	.then((data) =>
	{
        if (!getErrorCheck(data)) return;

        document.getElementById("latest-wr-loading").style.display = "none";

        var run = (JSON.parse(data)).data;

        var category = run.category.data.name;

        var time = runTimeFormat(run.times.primary);
        
        var player = "";
        var flag = "";
        if (run.players.data[0].rel == "user")
        {
            var temp = run.players.data[0];
            
            player = temp.names.international;

            player = `<b>${getGradientName(player, temp["name-style"])}</b>`;
        }
        else
        {
            player = `<b>${run.players.data[0].name}/b>`;
        }

        if (temp.location !== null)
        {
            flag = `<img class="runs-flag small" src="https://www.speedrun.com/images/flags/${temp.location.country.code}.png">`;
        }

        var userIcon = '';
        if (temp.assets.icon.uri)
		{
            userIcon += `<img class="runs-usericon" src="${temp.assets.icon.uri}">`;
        }
        if (temp.assets.supporterIcon && temp.assets.supporterIcon.uri)
		{
            userIcon += `<img class="runs-usericon" src="${temp.assets.supporterIcon.uri}">`;
        }

        var date = timeAgo(new Date(run.submitted));
        if (run.status["verify-date"])
        {
            date += ` • <span style="font-size: 0.7em;">Verified ${timeAgo(new Date(run.status["verify-date"]))}</span>`;
        }
        else
        {
            date += ` • <span style="font-size: 0.7em;"><i class="fas fa-exclamation-circle" style="color: #F14668;"></i> Run was rejected.</span>`;
        }

        var game = '';
        var abbr = '';
        var color = '';
        var colorDark = '';
        for (var i = 0; i < gamesArray.length; i++)
        {
            if (gamesArray[i].id == run.game.data.abbreviation)
            {
                game = gamesArray[i].name;
                abbr = gamesArray[i].abbreviation;
                color = gameColors[gamesArray[i].color].color;
                colorDark = gameColors[gamesArray[i].color].darkColor;
                break;
            }
        }

        var link = `/${abbr}/run/${id}`;

        var variables = run.category.data.variables.data;
        var subcats = [];

        for (var i = 0; i < variables.length; i++)
        {
            if (variables[i]["is-subcategory"])
            {
                if (run.values[variables[i].id])
                {
                    subcats.push(variables[i].values.values[run.values[variables[i].id]].label);
                }
            }
        }
        if (subcats.length > 0)
        {
            category += ` (${subcats.join(", ")})`;
        }

        var html = `<a class="wr-link" href="${link}"><div class="wr-wrapper" style="background-image: linear-gradient(var(--background-color-transparent), var(--background-color-transparent)), url('${run.game.data.assets["cover-large"].uri.replace("http://", "https://")}'); background-color: ${colorDark}">
                <div class="wr-game">${game}</div>
                <div class="wr-category">${category}</div>
                <div class="wr-time">${time}</div>
                <div class="wr-runner">${flag}${userIcon}${player}</div>
                <div class="wr-date">${date}</div>
                </div></a>`;

        document.getElementById(`wr-${id}`).style.backgroundColor = color;
        document.getElementById(`wr-${id}`).innerHTML = html;

        document.getElementById("wr-instance-style").innerHTML += `#wr-${id}:before, #wr-${id}:after { background-color: ${color}; } #wr-${id} > .wr-link { border: 2px solid ${color} }`;
    });
}