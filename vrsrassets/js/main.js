var pathPrefix;

function onLoad()
{
    pathPrefix = window.location.pathname.substring(0, 5) + "/";

    infoTippy();
    onGameDataLoad();
    onPopoutLoad();

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
    if (getPath().includes('/'))
    {
        return getPath().split('/')[1].split('/')[0]; 
    }
    else
    {
        return null;
    }
}

function infoTippy()
{
    if (isMobile) return;

    tippy('#game-links-leaderboard', {
        theme: 'vrsr',
        content: 'View Leaderboard',
        placement: 'bottom',
        offset: [0,7.5],
        duration: [150, 100]
    });
    tippy('#game-links-guides', {
        theme: 'vrsr',
        content: 'View Guides',
        placement: 'bottom',
        offset: [0,7.5],
        duration: [150, 100]
    });
    tippy('#game-links-resources', {
        theme: 'vrsr',
        content: 'View Resources',
        placement: 'bottom',
        offset: [0,7.5],
        duration: [150, 100]
    });
    tippy('#game-links-forums', {
        theme: 'vrsr',
        content: 'View Forums',
        placement: 'bottom',
        offset: [0,7.5],
        duration: [150, 100]
    });
    tippy('#game-links-statistics', {
        theme: 'vrsr',
        content: 'View Statistics',
        placement: 'bottom',
        offset: [0,7.5],
        duration: [150, 100]
    });
}