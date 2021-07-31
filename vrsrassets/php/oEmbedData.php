<?php
$games = json_decode(file_get_contents('vrsrassets/other/games.json'));
	
$gameId = '';
$runId = '';
$substr = substr($_SERVER['REQUEST_URI'], 1);
if (strlen($substr) > 0)
{
    $expl = explode('/', $substr);
    $gameId = $expl[0];
    if (strpos($substr, '/run/') !== false)
    {
        $runId = $expl[2];
    }
}

$game = null;
$title = 'VR Speedrunning Leaderboards';
$image = '/vrsrassets/images/logo.png';
$color = '#0165fe';
$description = 'A central hub to view the leaderboards for the largest virtual reality games in speedrunning.';

$categoryId = '';

foreach ($games as $_game)
{
    $game = $_game;
    if ($game->abbreviation == $gameId)
    {
        $title = $game->name . ' - VRSR';
        $image = 'https://www.speedrun.com/themes/' . $game->id . '/cover-256.png';
        $color = $game->color;
        break;
    }
}
if ($title != 'VR Speedrunning Leaderboards' &&  $runId != '')
{
    $run = json_decode(file_get_contents('https://www.speedrun.com/api/v1/runs/'.$runId.'?embed=players,category,game'))->data;

    if ($game->abbreviation == $gameId)
    {
        $categoryId = $run->category->data->id;

        $time = str_replace('PT', '', $run->times->primary);
        $time = str_replace('H', 'h ', $time);
        $time = str_replace('M', 'm ', $time);
        
        $player = '';
        if ($run->players->data[0]->rel == 'user')
        {
            $player = $run->players->data[0]->names->international;
        }
        else
        {
            $player = $run->players->data[0]->name;
        }

        if (strpos($time, '.') !== false)
        {
            $time = str_replace('S', 'ms', str_replace('.', 's ', $time));
            
            $ms = explode('ms', explode('s ', $time)[1])[0];
            $ms = preg_replace('/^0+/', '', $ms);

            $time = explode('s ', $time)[0] . 's ' . $ms . 'ms';
        }

        $description = $run->category->data->name . ' completed in ' . $time . ' by ' . $player;
    }
}
?>