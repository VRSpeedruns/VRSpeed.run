<?php
    $type = preg_replace("/[^a-zA-Z0-9\s._]/", "", $_GET['t']);
    $user = preg_replace("/[^a-zA-Z0-9\s._]/", "", $_GET['u']);

    $url = '';

    if ($type == "i") //icon
    {
        $url = 'https://www.speedrun.com/userasset/'.$user.'/icon';
    }
    else if ($type == "p") //profile pic
    {
        $url = 'https://www.speedrun.com/userasset/'.$user.'/image';
    }

    $get = file_get_contents($url);
    
    if ($get !== FALSE)
    {
        //image found

        $fp = fopen($url, 'rb');
        header("Content-Type: image/png");
        header("Content-Length: " . filesize($url));
        fpassthru($fp);
        exit;
    }
    else
    {
        //image not found; return empty image

        $fp = fopen('https://vrspeed.run/vrsrassets/images/noUserIcon.png', 'rb');
        header("Content-Type: image/png");
        header("Content-Length: " . filesize($url));
        fpassthru($fp);
        exit;
    }

?>