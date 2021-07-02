function onLoad()
{
    infoTippy();
    onGameDataLoad();
    onPopoutLoad();
}

function infoTippy()
{
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