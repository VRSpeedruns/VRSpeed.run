<?php 
    if (intval(filemtime($_SERVER['DOCUMENT_ROOT'] . '/../data/lastStreamCheck.json') / 60) !== intval(time() / 60))
    {
        include $_SERVER['DOCUMENT_ROOT'] . '/../data/twitchauth.php';

        //get game ids
        $games = json_decode(file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/vrsrassets/other/games.json'));
        $url = 'https://api.twitch.tv/helix/games?name=' . urlencode($games[0]->twitch_name);

        for ($i = 1; $i < count($games); $i++)
        {
            $url .= '&name=' . urlencode($games[$i]->twitch_name);
        }

        $ch = curl_init();
        curl_setopt($ch, CURLOPT_URL, $url);
        curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
        curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
        $result = json_decode(curl_exec($ch));
        curl_close($ch);

        //get all streams using game ids

        if (count($result->data) > 0)
        {
            $url = 'https://api.twitch.tv/helix/streams?game_id=' . $result->data[0]->id;

            for ($i = 1; $i < count($result->data); $i++)
            {
                $url .= '&game_id=' . $result->data[$i]->id;
            }

            $ch = curl_init();
            curl_setopt($ch, CURLOPT_URL, $url);
            curl_setopt($ch, CURLOPT_HTTPHEADER, $headers);
            curl_setopt($ch, CURLOPT_RETURNTRANSFER, 1);
            $result = json_decode(curl_exec($ch));
            curl_close($ch);

            file_put_contents($_SERVER['DOCUMENT_ROOT'] . '/../data/lastStreamCheck.json', json_encode($result, JSON_PRETTY_PRINT));
            echo json_encode($result);
        }
    }
    else
    {
        echo file_get_contents($_SERVER['DOCUMENT_ROOT'] . '/../data/lastStreamCheck.json');
    }
?>