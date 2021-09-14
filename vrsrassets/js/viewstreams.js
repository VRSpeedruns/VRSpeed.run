var streamsContainer;

var streamsInnerContainer;
var streamsCount;

function onStreamsLoad()
{
    streamsContainer = document.getElementById("streams-container");
	allContainers.push(streamsContainer);

    streamsInnerContainer = document.getElementById("streams-inner-container");
    streamsCount = document.getElementById("streams-count");
}

function loadStreams()
{
    if (getPath() != "streams")
    {
        replaceState("streams");
    }

    hideAllContainers();
    streamsContainer.style.display = "block";

    get(`/vrsrassets/php/twitch.php`)
    .then((data) =>
    {
        streamsInnerContainer.innerHTML = '';
        document.getElementById("streams-instance-style").innerHTML = '';
        var streams = (JSON.parse(data)).data;
        var count = streams.length;

        for (var i = 0; i < streams.length; i++)
        {
            if (document.getElementById(`stream-${streams[i].id}`))
            {
                count--;
                continue;
            }

            var streamUrl = "https://twitch.tv/" + streams[i].user_login;

            var gameImage = '';

            var game = gamesArray.filter(g => streams[i]["game_name"].toLowerCase().startsWith(g["twitch_name"].toLowerCase()));
            
            if (game.length > 0)
            {
                gameImage = `<div class="game-cover" title="${game[0].name}" style="background-color: ${gameColors[game[0].color].color}; border-color: ${gameColors[game[0].color].color};"><a href="${"/" + game[0].abbreviation}"><img src="https://www.speedrun.com/gameasset/${game[0]["api_id"]}/cover"></a></div>`;
            }

            streamsInnerContainer.innerHTML += `<div class="column is-3 is-stream-col"><div id="stream-${streams[i].id}" class="stream-top">
                    <div>
                        <a class="image is-16by9" href="${streamUrl}" target="_blank"><img src="https://static-cdn.jtvnw.net/previews-ttv/live_user_${streams[i].user_login}-320x180.jpg"></a>
                        ${gameImage}
                    </div>
                </div>
                <div class="stream-bottom">
                    <a href="${streamUrl}" title="${streams[i].title}" target="_blank">${streams[i].title}</a>
                    <p><i class="fas fa-users"></i> <span class="has-text-weight-bold">${streams[i]["viewer_count"]}</span> watching <span class="has-text-weight-bold">${streams[i]["user_name"]}</span></p>
                </div></div>`;

                document.getElementById("streams-instance-style").innerHTML += `#stream-${streams[i].id}, #stream-${streams[i].id}:before, #stream-${streams[i].id}:after { background-color: ${gameColors[game[0].color].color}; } #stream-${streams[i].id} > div { border: 2px solid ${gameColors[game[0].color].color}; }`
        }
        
        streamsCount.innerText = `${count} streams currently live.`;
    });
}