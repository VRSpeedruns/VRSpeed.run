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
								<select id="dropdown-select" onchange="dropdownChange(this.value)">
								</select>
							</div>
						</div>
					</div>
					<div class="column is-9">
						<div class="box">
							<div class="tabs is-boxed">
								<ul id="tabs">
									<li class="is-active"><a>Test</a></li>
									<li><a>Test2</a></li>
								</ul>
							</div>
							<div id="variables">
								<div class="buttons has-addons">
									<button class="button is-dark is-selected">No Spin</button>
									<button class="button is-dark">Spin</button>
								</div>
								<div class="buttons has-addons">
									<button class="button is-dark">FTP</button>
									<button class="button is-dark">No FTP</button>
								</div>
							</div>
							<div id="runs">
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="section is-footer">
			<script type="text/javascript" src="assets/js/main.js"></script>
			<script type="text/javascript" src="assets/js/gamedata.js"></script>
		</section>
	</body>
</html>