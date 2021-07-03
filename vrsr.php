<?php
	$games = json_decode(file_get_contents('vrsrassets/other/games.json'));
	
	$gameId = '';
	$runId = '';
	$substr = substr($_SERVER['REQUEST_URI'], 6);
	if (strlen($substr) > 0)
	{
		$expl = explode('/', $substr);
		$gameId = $expl[0];
		if (count($expl) > 1)
		{
			$runId = $expl[1];
		}
	}

	$title = 'VR Speedrunning Leaderboards';
	$image = '/images/vrsricon.png';
	$description = 'A central hub to view the leaderboards for the largest VR speedgames.';

	foreach ($games as $game)
	{
		if ($game->abbreviation == $gameId)
		{
			$title = $game->name . ' - VRSR';
			$image = 'https://www.speedrun.com/themes/' . $game->id . '/cover-256.png';
		}
	}
	if ($runId != '')
	{
		$run = json_decode(file_get_contents('https://www.speedrun.com/api/v1/runs/'.$runId.'?embed=players,category,game'))->data;

		if ($game->data->abbreviation == $gameId)
		{
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
<!DOCTYPE html>
<html lang="en">
<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		
		<link rel="icon" href="/images/vrsrfavicon.png">
		
		<title>VRSR</title>
		
		<meta content="Bigft.io" property="og:site_name">
		<meta content="<?= $title; ?>" property="og:title">
		<meta content="<?= $description; ?>" property="og:description">
		<meta content="<?= $image; ?>" property="og:image">
		<meta content="#0165fe" name="theme-color">
		
		<meta name="description" content="<?= $description; ?>">
		<meta name="keywords" content="VR Speedrun,VR,Speedrun,Speedrunning,VR Speedrunning,VR Running,Super Hot VR,Super Hot Speedrun, Super Hot VR Speedrun,Half Life, Half-Life, Half-Life: Alyx, Half-Life Alyx, Alyx,, HLA, HL: Alyx, HL:A">
		
		<script src="https://kit.fontawesome.com/d16c543bf8.js" crossorigin="anonymous"></script>
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css">
		<link rel="stylesheet" href="/vrsrassets/css/main.css">

		<link rel="preconnect" href="https://fonts.gstatic.com">
		<link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
    	<link href="https://fonts.googleapis.com/css2?family=Inconsolata:wght@600&display=block" rel="stylesheet">
	</head>
	<body onload="onLoad();">
		<section class="section">
			<div class="container">
				<div class="columns">
					<div class="column is-3">
						<div class="box">
							<div class="select">
								<select id="games" onchange="onGameChange(this.value)"></select>
							</div>
							<div class="game-info-container">
								<div class="game-image-container is-hidden-touch"><a id="game-image-link" href=""><img id="game-image" src=""></a></div>
								<div id="game-year" class="is-hidden-touch">...</div>
								<div id="game-platforms" class="is-hidden-touch">...</div>
								<div class="buttons is-centered">
									<a id="game-links-leaderboard" class="button-outer" href="" target="_blank">
										<div class="button is-dark"><span class="icon"><i class="fas fa-trophy"></i></span></div>
									</a>
									<a id="game-links-guides" class="button-outer" href="" target="_blank">
										<div class="button is-dark"><span class="icon"><i class="fas fa-book"></i></span></div>
									</a>
									<a id="game-links-resources" class="button-outer" href="" target="_blank">
										<div class="button is-dark"><span class="icon"><i class="fas fa-link"></i></span></div>
									</a>
									<a id="game-links-forums" class="button-outer" href="" target="_blank">
										<div class="button is-dark"><span class="icon"><i class="fas fa-comments"></i></span></div>
									</a>
									<a id="game-links-statistics" class="button-outer" href="" target="_blank">
										<div class="button is-dark"><span class="icon"><i class="fas fa-chart-line"></i></span></div>
									</a>
								</div>
							</div>
						</div>
					</div>
					<div class="column is-9">
						<div class="box" id="box-runs" style="display: none;">
                            <div class="tabs is-boxed"><ul id="tabs"></ul></div>
							<div id="variables"></div>
							<div id="runs-loading" style="display: block;">
								<div>
									<div class="spinner"></div>
									<div class="belowspinner">Loading...</div>
								</div>
							</div>
							<div id="runs-none" style="display: none;">
								<i>There are no runs in this category.</i>
							</div>
							<table id="runs-table" class="table is-narrow is-fullwidth">
								<thead>
									<tr>
										<th>Rank</th>
										<th>Player</th>
										<th>Time</th>
										<th id="runs-platform-hardware" class="is-hidden-touch">Platform</th>
										<th class="is-hidden-touch">Date</th>
									</tr>
								</thead>
								<tbody id="runs"></tbody>
							</table>
						</div>
						<div class="box" id="box-single-run" style="display: none;">
							<div class="tabs is-boxed"><ul id="run-single-tabs">
								<li id="run-single-infotab"><a onclick="openRunTab(0);">Info</a></li>
								<li id="run-single-splitstab"><a onclick="openRunTab(1);">Splits</a></li>
							</ul></div>
							<div id="run-single-info">
								<div class="columns">
									<div class="column is-8">
										<div class="run-modal-titles">
											<h1>
												<span id="run-single-game" style="font-weight: bold;"></span> -
												<span id="run-single-category"></span>
											</h1>
											<h2>
												<span id="run-single-time" style="font-weight: bold;"></span> by
												<span id="run-single-runner"></span>
											</h2>
										</div>
									</div>
									<div class="column is-4">
										<div>
											<a id="run-single-src" class="button is-dark is-fullwidth" href="", target="_blank">
												<span class="icon has-text"><i class="fas fa-trophy"></i></span>
												View on Speedrun.com
											</a>
											<a id="run-single-vid" class="button is-dark is-fullwidth" href="", target="_blank">
												<span class="icon has-text"><i id="run-single-vid-icon" class="fab"></i></span>
												<span id="run-single-vid-text">Watch on </span>
											</a>
										</div>
									</div>
								</div>
							</div>
							<div id="run-single-splits">
								<div id="variables">
									<a id="run-single-splits-url" class="button is-small is-dark is-variable" onclick="">View on Splits.io</a>
								</div>
								<div id="run-single-splits-bar"></div>
								<div>
									<table class="table is-narrow is-fullwidth">
										<thead>
											<tr>
												<th>#</th>
												<th>Name</th>
												<th>Duration</th>
												<th>Finished At </th>
											</tr>
										</thead>
										<tbody id="run-single-segments"></tbody>
									</table>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="section is-footer">
			<div id="js-mobile-check" class="is-hidden-mobile"></div>
			<script type="text/javascript">
				var gamesArray = <?= json_encode($games); ?>;
				var isMobile = window.getComputedStyle(document.getElementById("js-mobile-check")).getPropertyValue("display") == "none";
			</script>
			<script src="https://unpkg.com/@popperjs/core@2/dist/umd/popper.min.js"></script>
			<script src="https://unpkg.com/tippy.js@6/dist/tippy-bundle.umd.js"></script> 
			<script type="text/javascript" src="/vrsrassets/js/colorinterpolation.js"></script>
			<script type="text/javascript" src="/vrsrassets/js/gamedata.js"></script>
			<script type="text/javascript" src="/vrsrassets/js/viewrun.js"></script>
			<script type="text/javascript" src="/vrsrassets/js/main.js"></script>
		</section>
	</body>
</html>