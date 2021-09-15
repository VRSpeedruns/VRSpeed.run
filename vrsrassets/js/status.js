var statusInner;

function onStatusLoad()
{
    statusInner = document.getElementById("status-inner");
}

function statusStart()
{
    //statusInner.innerHTML = `<div id="status-loading" class="loadingdiv column is-12" style="display: block; margin-top: -2.5em;"><div><div class="spinner"></div><div class="belowspinner">Loading...</div></div></div>`;
    if (getCookie('last_status') == "")
    {
        get('https://api.github.com/repos/VRSRBot/Heartbeats/releases')
        .then((data) =>
        {
			if (!getErrorCheck(data)) return;

            var _data = (JSON.parse(data));

            var objs = [];

            for (var i = 0; i < _data.length; i++)
            {
                objs.push({ "n": _data[i].name, "e": _data[i].body });
            }

            console.log(JSON.stringify(objs));

            setCookie('last_status', JSON.stringify(objs), 3);

            loadStatus(objs);
        });
    }
    else
    {
        loadStatus(JSON.parse(getCookie('last_status')));
    }
}

function loadStatus(objs)
{
    for (var i = 0; i < objs.length; i++)
    {
        var diff = Math.trunc((Date.now() / 1000) - parseInt(objs[i].e));
        var date = new Date(parseInt(objs[i].e + "000"));
        var icon = "", status = "";

        if (objs[i].n == "WorldRecords")
        {
            icon = '<i class="fas fa-trophy"></i>';
        }
        else
        {
            icon = `<i class="fab fa-${objs[i].n.toLowerCase()}"></i>`;
        }

        // heartbeat is once every 5 minutes; cookie resets every 3 minutes

        if (diff > 600) // 10 minutes; it's down
        {
            status = `<span class="status offline">Offline</span>`;
        }
        else // less than 5 min, it's not down
        {
            status = `<span class="status online">Online</span>`;
        }

        statusInner.innerHTML += `<div class="column is-4 is-status">
                                      <div class="icon">${icon}</div>
                                      <div class="name">${objs[i].n} is ${status}</div>
                                      <div class="heartbeat">Last heartbeat was ${timeAgo(date).toLowerCase()}.</div>
                                      <div><a href="https://github.com/VRSpeedruns/${objs[i].n}" target="_blank">View project repository</a></div>
                                  </div>`;
    }
}