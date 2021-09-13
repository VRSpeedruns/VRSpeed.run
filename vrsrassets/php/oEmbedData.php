<?php
$games = json_decode(file_get_contents('vrsrassets/other/games.json'));
	
$gameId = '';
$runId = '';
$user = '';
$substr = substr($_SERVER['REQUEST_URI'], 1);
if (strlen($substr) > 0)
{
    $expl = explode('/', $substr);
    $gameId = explode('?', $expl[0])[0];
    if (strpos($substr, '/run/') !== false)
    {
        $runId = $expl[2];

        if (strpos($runId, '?') !== false)
        {
            $runId = explode('?', $runId)[0];
        }
    }
    else if (strpos($substr, 'user/') !== false)
    {
        $user = $expl[1];

        if (strpos($user, '?') !== false)
        {
            $user = explode('?', $user)[0];
        }
    } 
}

$game = null;
$title = 'VR Speedrunning Leaderboards';
$image = 'https://vrspeed.run/vrsrassets/images/icon_square.png';
$color = '#FF9C00';
$description = 'VRSpeed.run is central hub to view the leaderboards for the largest virtual reality games in speedrunning. Currently providing data for ' . count($games) . ' games!';

$categoryId = '';

foreach ($games as $_game)
{
    if ($_game->abbreviation == $gameId)
    {
        $game = $_game;
        
        $title = $game->name . ' - VRSR';
        $description = "Check out the leaderboard for " . $game->name . "!";
        $image = 'https://www.speedrun.com/gameasset/' . $game->api_id . '/cover';
        $color = $game->color;

        break;
    }
}

if ($game == null)
{
    if ($gameId == "streams")
    {
        $description = "Find and watch Twitch streams for all tracked VR speedgames.";
    }
    else if ($gameId == "leaderboard")
    {
        $description = "Browse the leaderboards of the top VR speedgames.";
    }
}
else if ($runId != '')
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
else if ($user != '')
{
    $title = $user . ' - VRSR';
    $description = 'User page for ' . $user;

    $get = file_get_contents('https://www.speedrun.com/themes/user/' . $user . '/image.png');
    
    if (strlen($get) > 0)
    {
        $image = 'https://www.speedrun.com/themes/user/' . $user . '/image.png';
    }
}
?>