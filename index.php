<?php ?>
<!DOCTYPE html>
<html lang="en">
<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1">
		
		<link rel="icon" href="/images/vrsrfavicon.png">
		
		<title>VRSR</title>
		
		<meta content="Bigft.io" property="og:site_name">
		<meta content="VR Speedrunning Leaderboards" property="og:title">
		<meta content="A central hub to view the leaderboards for the largest VR speedgames." property="og:description">
		<meta content="https://bigft.io/images/vrsricon.png" property="og:image">
		<meta content="#0165fe" name="theme-color">
		
		<meta name="description" content="A central hub to view the leaderboards for the largest VR speedgames.">
		<meta name="keywords" content="VR Speedrun,VR,Speedrun,Speedrunning,VR Speedrunning,VR Running,Super Hot VR,Super Hot Speedrun, Super Hot VR Speedrun,Half Life, Half-Life, Half-Life: Alyx, Half-Life Alyx, Alyx,, HLA, HL: Alyx, HL:A">
		
		<script src="https://kit.fontawesome.com/d16c543bf8.js" crossorigin="anonymous"></script>
		<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bulma@0.8.0/css/bulma.min.css">
		<link rel="stylesheet" href="assets/css/main.css">

		<link rel="preconnect" href="https://fonts.gstatic.com">
		<link href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,400;0,700;1,400;1,700&display=swap" rel="stylesheet">
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
								<div class="game-image-container is-hidden-touch"><img id="game-image" src=""></div>
								<div id="game-year" class="is-hidden-touch">...</div>
								<div id="game-platforms" class="is-hidden-touch">...</div>
							</div>
						</div>
					</div>
					<div class="column is-9">
						<div class="box">
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
					</div>
				</div>
			</div>
		</section>
		<section class="section is-footer">
			<script type="text/javascript">
				var gamesArray = <?= json_encode(json_decode(file_get_contents('assets/other/games.json'))) ?>
			</script>
			<script type="text/javascript" src="assets/js/colorinterpolation.js"></script>
			<script type="text/javascript" src="assets/js/main.js"></script>
			<script type="text/javascript" src="assets/js/gamedata.js"></script>
		</section>
	</body>
</html>