var mainLoading;
var aboutInfoToggle;
var aboutInfoMore;

var srcErrorContainer;
var srcErrorResponse;

var defaultGame = 'hla';

function onLoad()
{
    mainLoading = document.getElementById("main-loading");
    aboutInfoToggle = document.getElementById("about-info-toggle");
    aboutInfoMore = document.getElementById("about-info-more");
    
    srcErrorContainer = document.getElementById("src-error-container");
    srcErrorResponse = document.getElementById("src-error-response");

    if (window.location.href.includes("?"))
    {
        var url = window.location.href.substring(window.location.origin.length + 1);
        url = url.substring(0, url.indexOf("?"))
        replaceState(url);
    }

    if (window.location.pathname == "/")
    {
        replaceState(null);
        latestWRsLoad()
    }

    if (getCookie('last_game') != '')
    {
        defaultGame = getCookie('last_game');
    }

    document.getElementById("view-lb").href = `/${defaultGame}`;

    infoTippy();
    //latestWRsLoad();
    onUserLoad();
    onGameDataLoad();
    onSingleRunLoad();

    window.addEventListener('popstate', (e) =>
    {
		if (!getRun())
		{
            closeRun();
		}

        loadGame(getGame(), true);
	});

    if (isMobile)
    {
        var _about = document.getElementById("about-info");
        _about.parentElement.prepend(_about);
    }
}

function pushState(path)
{
    history.pushState(null, document.title, `/${path}`);
}
function replaceState(path)
{
    if (path)
    {
        history.replaceState(null, document.title, `/${path}`);
    }
    else
    {
        history.replaceState(null, document.title, "/");
    }
}
function setHash(hash)
{
    if (hash != "")
    {
        hash = `#${hash}`;
    }
    replaceState(getPath() + hash);
}
function getHash()
{
    return window.location.hash;
}
function getPath()
{
    return window.location.pathname.substring(1);
}
function getGame()
{
    if (getPath().length > 0)
    {
        return getPath().split('/')[0];
    }
    else
    {
        return null;
    }
}
function getRun()
{
    if (getPath().includes('/run/'))
    {
        return getPath().split('/')[2].split('/')[0];
    }
    else
    {
        return null;
    }
}
function getUser()
{
    if (getPath().length > 5 && getPath().substring(0, 5) == 'user/')
    {
        return getPath().substring(5);
    }
    else
    {
        return null;
    }
}

function backFixUrl()
{
    if (getRun())
    {
        pushState(getGame());
    }
}

function infoTippy()
{
    tippy.setDefaultProps({
        theme: 'vrsr-arrow',
        placement: 'bottom',
        duration: [150, 100]
    });

    if (isMobile) return;

    tippy('#tippy-me', {
        offset: [0,7.5],
        content: 'bigfoot#0001',
        placement: 'top'
    });


    tippy('#game-links-leaderboard', {
        offset: [0,7.5],
        content: 'View Leaderboard'
    });
    tippy('#game-links-guides', {
        offset: [0,7.5],
        content: 'View Guides'
    });
    tippy('#game-links-resources', {
        offset: [0,7.5],
        content: 'View Resources'
    });
    tippy('#game-links-forums', {
        offset: [0,7.5],
        content: 'View Forums'
    });
    tippy('#game-links-statistics', {
        offset: [0,7.5],
        content: 'View Statistics'
    });

    tippy('#user-links-src', {
        offset: [0,7.5],
        content: 'View User'
    });
    tippy('#user-links-info', {
        offset: [0,7.5],
        content: "View User's Info"
    });
    tippy('#user-links-forum', {
        offset: [0,7.5],
        content: "View User's Forum Posts"
    });
}

function get(url) {
	return new Promise((resolve, reject) => {
		const req = new XMLHttpRequest();
		req.open('GET', url);
		//req.onload = () => req.status === 200 ? resolve(req.response) : reject(Error(req.statusText));
        req.onload = () => resolve(req.response);
		req.onerror = (e) => reject(Error(`Network Error: ${e}`));
		req.send();
	});
}

var nonErrorCount = 0;
function getErrorCheck(data)
{
    var temp = (JSON.parse(data));
    if (temp.status == 420)
    {
        nonErrorCount = 0;

        srcErrorResponse.innerText = `"${temp.message}" (Error code ${temp.status})`
        srcErrorContainer.style.display = "flex";
        return false;
    }
    else
    {
        if (++nonErrorCount > 4)
        {
            srcErrorContainer.style.display = "none";
        }

        return true;
    }
}

function setCookie(cname, cvalue, minutes) {
    const d = new Date();
    d.setTime(d.getTime() + (minutes*60*1000));
    let expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
    let name = cname + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let ca = decodedCookie.split(';');
    for(let i = 0; i <ca.length; i++) {
      let c = ca[i];
      while (c.charAt(0) == ' ') {
        c = c.substring(1);
      }
      if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
      }
    }
    return "";
  }