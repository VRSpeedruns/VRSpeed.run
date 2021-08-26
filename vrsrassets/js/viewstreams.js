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
    hideAllContainers();
    streamsContainer.style.display = "block";

    get(`/vrsrassets/php/twitch.php`)
    .then((data) =>
    {
        streamsInnerContainer.innerHTML = '';
        var streams = (JSON.parse(data)).data;
        
        streamsCount.innerText = `${streams.length} streams currently live.`;

        for (var i = 0; i < streams.length; i++)
        {
            var streamUrl = "https://twitch.tv/" + streams[i].user_login;

            var gameImage = '';

            var game = gamesArray.filter(g => streams[i]["game_name"].toLowerCase().startsWith(g["twitch_name"].toLowerCase()));
            
            if (game.length > 0)
            {
                gameImage = `<div class="game-cover" title="${game[0].name}" style="background-color: ${game[0].color}"><a href="${"/" + game[0].abbreviation}"><img src="https://www.speedrun.com/gameasset/${game[0]["api_id"]}/cover"></a></div>`;
            }

            streamsInnerContainer.innerHTML += `<div class="column is-3 is-stream-col"><div class="stream-top">
                    <a class="image is-16by9" href="${streamUrl}"><img src="https://static-cdn.jtvnw.net/previews-ttv/live_user_${streams[i].user_login}-320x180.jpg"></a>
                    ${gameImage}
                </div>
                <div class="stream-bottom">
                    <a href="${streamUrl}" title="${streams[i].title}">${streams[i].title}</a>
                    <p><span class="has-text-weight-bold">${streams[i]["viewer_count"]}</span> watching <span class="has-text-weight-bold">${streams[i]["user_name"]}</span></p>
                </div></div>`
        }
    });
}