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
		<meta content="/images/vrsricon.png" property="og:image">
		<meta content="#0165fe" name="theme-color">
		
		<meta name="description" content="A central hub to view the leaderboards for the largest VR speedgames.">
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
								<div class="game-image-container is-hidden-touch"><img id="game-image" src=""></div>
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
						<div class="box" id="box-runs">
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
							<div class="back-button">
								<a onclick="closeRun();"><i class="fas fa-arrow-left"></i> Back</a>
							</div>
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
											<a id="run-single-yt" class="button is-dark is-fullwidth" href="", target="_blank">
												<span class="icon has-text"><i class="fab fa-youtube"></i></span>
												Watch run on YouTube
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
				var gamesArray = <?= json_encode(json_decode(file_get_contents('vrsrassets/other/games.json'))) ?>;
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