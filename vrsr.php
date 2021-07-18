<?php include 'vrsrassets/php/oEmbedData.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
		
		<link rel="icon" href="/vrsrassets/images/fav.png">
		
		<title>VRSR</title>
		
		<meta property="og:site_name" content="Bigft.io">
		<meta property="og:title" content="<?= $title; ?>">
		<meta property="og:description" content="<?= $description; ?>">
		<meta name="description" content="<?= $description; ?>">
		<meta property="og:image" content="<?= $image; ?>">
		<meta name="theme-color" content="<?= $color; ?>">
		<meta name="keywords" content="VR Speedrun,VR,Speedrun,Speedrunning,VR Speedrunning,VR Running,Super Hot VR,Super Hot Speedrun, Super Hot VR Speedrun,Half Life, Half-Life, Half-Life: Alyx, Half-Life Alyx, Alyx,, HLA, HL: Alyx, HL:A">
		
		<link href="/assets/fa/css/all.css" rel="stylesheet">
		<link rel="stylesheet" href="/assets/css/bulma.min.css">
		<link rel="stylesheet" href="/vrsrassets/css/main.css">
		<link rel="stylesheet" href="/assets/css/googlefonts.css">
	</head>
	<body onload="onLoad();">
		<section class="section">
			<div class="container" id="home-container">
				<div class="has-text-centered" style="margin-bottom: 3em">
					<h1 class="title is-1">VR Speedrunning Leaderboards</h1>
					<a class="title is-4" href="/vrsr/hla">View the Leaderboards</a>
				</div>
				<div class="columns is-centered">
					<div class="column is-3 is-hidden-touch">
						<div class="box">
							<h1 class="is-box-heading">Recent World Records</h1>
							<div class="divider thin"></div>
							<div class="world-records">
								<div class="wr"> <!-- placeholder example -->
									<figure class="image is-2by1">
										<div class="wr-img" style="background-image: linear-gradient(0.75turn, transparent, var(--background-color)),
    url('https://www.speedrun.com/themes/hla/cover-256.png');"></div>
										<div class="wr-img-gradient"></div>
									</figure>
									<div class="wr-game">Half-Life: Alyx</div>
									<div class="wr-category">Any% (No Spin, FTP)</div>
									<div class="wr-time">14m 27s 50ms</div>
									<div class="wr-runner">Lemmons</div>
									<div class="wr-date">3 days ago</div>
									<div class="wr-link"><a>View Run <i class="fas fa-arrow-right"></i></a></div>
								</div>
							</div>
						</div>
					</div>
					<div class="column is-6">
						<div class="box">
							
						</div>
					</div>
					<div class="column is-3">
						<div class="box" id="about-info">
							<h1 class="is-box-heading">About</h1>
							<div class="divider thin"></div>
							<p>VRSR is a central hub to view the leaderboards for the largest virtual reality games in speedrunning.</p>
							<p>If there's a game that you believe belongs on here (or you see a bug/error), please ping me (bigfoot#0001) in the VR Speedrunning Discord server.</p>
							<p>If you'd like to hang out and discuss VR speedrunning, consider joining the <a href="https://discord.gg/7PKWZuW">VR Speedrunning Discord server</a>!</p>
							<p>For the latest VR world records, check out the <a href="https://twitter.com/VRSpeedruns">VRSR Twitter bot</a>!</p>
						</div>
					</div>
				</div>
			</div>
			<div class="container" id="main-container">
				<div class="columns">
					<div class="column is-3 reverse-columns-mobile">
						<div class="box">
							<div class="select">
								<select id="games" onchange="onGameChange(this.value)"></select>
							</div>
							<div class="game-info-container">
								<div class="game-image-container is-hidden-mobile"><img id="game-image" src=""></div>
								<div id="game-year" class="is-hidden-mobile">...</div>
								<div id="game-platforms" class="is-hidden-mobile">...</div>
								<div id="game-moderators" class="is-hidden-mobile">...</div>
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
						<div id="main-loading" class="loadingdiv" style="display: block;">
							<div>
								<div class="spinner"></div>
								<div class="belowspinner">Loading...</div>
							</div>
						</div>
						<div class="box" id="box-runs" style="display: none;">
                            <div class="tabs is-boxed"><ul id="tabs"></ul></div>
							<div id="variables"></div>
							<div id="runs-loading" class="loadingdiv" style="display: block;">
								<div>
									<div class="spinner"></div>
									<div class="belowspinner">Loading...</div>
								</div>
							</div>
							<div id="runs-none" class="has-text-centered" style="display: none;">
								<i>There are no runs in this category.</i>
							</div>
							<table id="runs-table" class="table is-narrow is-fullwidth">
								<thead>
									<tr>
										<th>Rank</th>
										<th>Player</th>
										<th>Time</th>
										<th id="runs-platform-hardware" class="is-hidden-mobile">Platform</th>
										<th class="is-hidden-mobile">Date</th>
										<th class="is-hidden-mobile"></th>
									</tr>
								</thead>
								<tbody id="runs"></tbody>
							</table>
						</div>
						<div class="box" id="box-single-run" style="display: none;">
							<div class="back-button">
								<a onclick="closeRun(); backFixUrl(); loadGame(getGame(), true);"><i class="fas fa-arrow-left"></i> Back to Game</a>
							</div>
							<div class="container">
								<div class="columns run-single-info-col is-mobile">
									<div class="column is-10">
										<div class="run-single-titles">
											<h1>
												<span id="run-single-game" style="font-weight: bold;"></span>
													<span class="is-hidden-mobile"> -</span><span class="is-hidden-tablet"><br></span>
												<span id="run-single-category"></span>
											</h1>
											<h2>
												<span id="run-single-time" style="font-weight: bold;"></span>
													<span class="is-hidden-mobile"> by</span><span class="is-hidden-tablet"><br></span>
												<span id="run-single-runner"></span><span id="run-single-place"></span>
											</h2>
										</div>
									</div>
									<div class="column is-2">
										<div class="buttons is-centered is-right-mobile">
											<a id="run-single-src" class="button-outer" href="" target="_blank">
												<div class="button is-dark"><span class="icon"><i class="fas fa-trophy"></i></span></div>
											</a>
											<a id="run-single-vid" class="button-outer" href="" target="_blank">
												<div class="button is-dark"><span class="icon"><i id="run-single-vid-icon" class=""></i></span></div>
											</a>
										</div>
									</div>
								</div>
								<div class="run-single-info-other">
									<p id="run-single-comment"></p>
									<p>Played using <span id="run-single-platform"></span> on <span id="run-single-date"></span></p>
									<p>Run verified by <span id="run-single-verifier"></span> on <span id="run-single-verifydate"></span></p>
								</div>
							</div>
							<div id="run-single-splits-container">
								<div class="divider"></div>
								<div id="variables">
									<div class="buttons has-addons" id="run-single-splits-timing">
										<button id="run-single-splits-rt" class="button is-small is-dark is-variable" onclick=""><i class="fas fa-globe-americas"></i> Real<span class="is-hidden-mobile">time</span></button>
										<button id="run-single-splits-gt" class="button is-small is-dark is-variable" onclick=""><i class="fas fa-gamepad"></i> Game<span class="is-hidden-mobile">time</span></button>
									</div>
									<div id="run-single-splits-middleinfo"></div>
									<div class="buttons has-addons variable-right">
										<a id="run-single-splits-url" class="button is-small is-dark is-variable" target="_blank"><i class="fas fa-external-link-alt"></i> Splits.io</a>
									</div>
								</div>
								<div id="run-single-splits-loading" class="loadingdiv" style="display: block;">
									<div>
										<div class="spinner"></div>
										<div class="belowspinner">Loading...</div>
									</div>
								</div>
								<div class="container" id="run-single-splits-inner">
									<div id="run-single-splits-bar-outer"><div id="run-single-splits-bar"></div></div>
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
			</div>
		</section>
		<section class="section is-footer">
			<div class="columns is-centered is-vcentered">
				<div class="column is-4 has-text-right-tablet">
					<p>Currently providing data for <?= count($games); ?> games.</p>
					<p>Made with <i class="fas fa-heart is-heart" aria-hidden="true"></i> by <a href="https://github.com/bigfoott" target="_blank">bigfoot</a>.</p>
				</div> 
				<div class="column is-4">
					<p><a href="https://www.speedrun.com/" target="_blank">Speedrun.com</a> data accessed using the <a href="https://github.com/speedruncomorg/api" target="_blank">SR.C REST API</a>.</p>
					<p><a href="https://www.speedrun.com/" target="_blank">Splits.io</a> data accessed using the <a href="https://github.com/glacials/splits-io/blob/master/docs/api.md" target="_blank">Splits.io API</a>.</p>
				</div>
				<div class="column is-4 has-text-left-tablet">
					<div class="links">
						<div>
							<a href="https://github.com/bigfoott/VRSR" target="_blank"><i class="fab fa-github" aria-hidden="true"></i>GitHub Repo</a>
						</div>
						<div>
							<a href="https://twitter.com/VRSpeedruns" target="_blank"><i class="fab fa-twitter" aria-hidden="true"></i>Twitter Bot</a>
						</div>
					</div> 
				</div>
			</div>

			<div id="js-mobile-check" class="is-hidden-mobile"></div>
			<script type="text/javascript">
				var gamesArray = <?= json_encode($games); ?>;
				var isMobile = window.getComputedStyle(document.getElementById("js-mobile-check")).getPropertyValue("display") == "none";
				var runLoadedCategory = "<?= $categoryId; ?>";
			</script>
			<script type="text/javascript" src="/assets/js/popper.min.js"></script>
			<script type="text/javascript" src="/assets/js/tippy-bundle.umd.js"></script> 
			<script type="text/javascript" src="/vrsrassets/js/colorinterpolation.js"></script>
			<script type="text/javascript" src="/vrsrassets/js/gamedata.js"></script>
			<script type="text/javascript" src="/vrsrassets/js/viewrun.js"></script>
			<script type="text/javascript" src="/vrsrassets/js/main.js"></script>
		</section>
	</body>
</html>