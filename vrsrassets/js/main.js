var pathPrefix;

function onLoad()
{
    pathPrefix = window.location.pathname.substring(0, 5) + "/";

    infoTippy();
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
}

function pushState(path)
{
    history.pushState(null, document.title, pathPrefix + path);
}
function replaceState(path)
{
    history.replaceState(null, document.title, pathPrefix + path);
}
function setHash(hash)
{
    if (hash != "")
    {
        hash = '#' + hash;
    }

    replaceState(getPath() + hash);
}
function getPath()
{
    return window.location.pathname.substring(6);
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

function backFixUrl()
{
    if (getRun())
    {
        pushState(getGame());
    }
}

function infoTippy()
{
    if (isMobile) return;

    tippy('#game-links-leaderboard', {
        theme: 'vrsr-arrow',
        content: 'View Leaderboard',
        placement: 'bottom',
        offset: [0,7.5],
        duration: [150, 100]
    });
    tippy('#game-links-guides', {
        theme: 'vrsr-arrow',
        content: 'View Guides',
        placement: 'bottom',
        offset: [0,7.5],
        duration: [150, 100]
    });
    tippy('#game-links-resources', {
        theme: 'vrsr-arrow',
        content: 'View Resources',
        placement: 'bottom',
        offset: [0,7.5],
        duration: [150, 100]
    });
    tippy('#game-links-forums', {
        theme: 'vrsr-arrow',
        content: 'View Forums',
        placement: 'bottom',
        offset: [0,7.5],
        duration: [150, 100]
    });
    tippy('#game-links-statistics', {
        theme: 'vrsr-arrow',
        content: 'View Statistics',
        placement: 'bottom',
        offset: [0,7.5],
        duration: [150, 100]
    });
}

function get(url) {
	return new Promise((resolve, reject) => {
		const req = new XMLHttpRequest();
		req.open('GET', url);
		req.onload = () => req.status === 200 ? resolve(req.response) : reject(Error(req.statusText));
		req.onerror = (e) => reject(Error(`Network Error: ${e}`));
		req.send();
	});
}