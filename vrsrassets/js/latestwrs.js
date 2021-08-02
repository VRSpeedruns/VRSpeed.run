var latestWRContainer;

function latestWRsLoad()
{
    latestWRContainer = document.getElementById("world-records");

    getLatest();
}

function getLatest()
{
    if (getCookie('latest_wrs') == "")
    {
        get('https://api.github.com/repos/VRSRBot/test/releases?per_page=4')
        .then((data) =>
        {
			if (!getErrorCheck(data)) return;

            var wrs = [];
            var _data = (JSON.parse(data));

            for (var i = 0; i < _data.length; i++)
            {
                wrs[i] = _data[i].tag_name;
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
    get(`https://www.speedrun.com/api/v1/runs/${id}?embed=players,platform,game,category`)
	.then((data) =>
	{
        if (!getErrorCheck(data)) return;

        var run = (JSON.parse(data)).data;

        var category = run.category.data.name;

        var time = runTimeFormat(run.times.primary);
        
        var player = "";
        var flag = "";
        if (run.players.data[0].rel == "user")
        {
            var temp = run.players.data[0];
            
            player = temp.names.international;

            player = `<b>${getGradientName(player,
                temp["name-style"]["color-from"].dark, 
                temp["name-style"]["color-to"].dark)}</b>`;
        }
        else
        {
            player = run.players.data[0].name;
        }

        if (temp.location !== null)
        {
            flag = `<img class="runs-flag small" src="https://www.speedrun.com/images/flags/${temp.location.country.code}.png">`;
        }

		var userIcon = `<img class="runs-usericon" src="/vrsrassets/php/userIcon.php?${temp.names.international}" onload="if (this.width == 1 && this.height == 1) this.remove();">`;

        var date = timeAgo(new Date(run.submitted));

        var game = '';
        var abbr = '';
        var color = '';
        for (var i = 0; i < gamesArray.length; i++)
        {
            if (gamesArray[i].id == run.game.data.abbreviation)
            {
                game = gamesArray[i].name;
                abbr = gamesArray[i].abbreviation;
                color = gamesArray[i].color;
                break;
            }
        }

        var link = `/${abbr}/run/${id}`;

        get(`https://www.speedrun.com/api/v1/categories/${run.category.data.id}/variables`)
        .then((data) =>
        {
			if (!getErrorCheck(data)) return;

            var variables = (JSON.parse(data)).data;

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

            var html = `<a class="wr-link" href="${link}"><div class="wr-wrapper" style="background-image: linear-gradient(var(--background-color-transparent), var(--background-color-transparent)), url('https://www.speedrun.com/themes/${run.game.data.abbreviation}/cover-256.png');">
                    <div class="wr-game">${game}</div>
                    <div class="wr-category">${category}</div>
                    <div class="wr-time">${time}</div>
                    <div class="wr-runner">${flag}${userIcon}${player}</div>
                    <div class="wr-date">${date}</div>
                   </div></a>`;

            document.getElementById(`wr-${id}`).style.backgroundColor = color;
            document.getElementById(`wr-${id}`).innerHTML = html;

            document.getElementById("instance-style").innerHTML += `#wr-${id}:before, #wr-${id}:after { background-color: ${color}; }`;
        });
    });
}