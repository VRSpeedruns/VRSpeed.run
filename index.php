<?php
ini_set('display_errors', '1');
ini_set('display_startup_errors', '1');
error_reporting(E_ALL);

include 'vrsrassets/php/oEmbedData.php'; ?>
<!DOCTYPE html>
<html lang="en">
<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
		
		<link rel="icon" href="/vrsrassets/images/fav.png">
		
		<title>VRSR</title>
		
		<meta property="og:site_name" content="VRSpeed.run">
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
			<div id="src-error-container" class="columns is-centered" style="display: none;">
				<div class="column is-6">
					<div class="notification is-danger">
						<p>There appears to be issues accessing the Speedrun.com API. If refreshing the page does not work, try coming back later.</p>
						<p>Error message: <span id="src-error-response"></span></p>
					</div>
				</div>
			</div>
			<div class="container" id="home-container" style="display: none;">
				<div class="columns is-centered">
					
					<div class="column is-6 has-text-centered" style="margin-bottom: 1em;">
						<figure class="image site-header">
							<img src="/vrsrassets/images/header.png">
						</figure>
						<a id="view-lb" href="">View the Leaderboards</a>
					</div>
				</div>
				<div class="columns is-centered is-multiline">
					<div class="column is-5">
						<div class="box">
							<h1 class="is-box-heading">Latest World Records</h1>
							<div class="divider thin"></div>
							<div id="world-records" class="columns is-multiline is-mobile"></div>
						</div>
					</div>
					<div class="column is-5">
						<div class="box" id="about-info">
							<h1 class="is-box-heading">About</h1>
							<div class="divider thin"></div>
							<p>VRSR is a central hub to view the leaderboards for the largest virtual reality games in speedrunning.</p>
							<p>If you'd like to hang out and discuss VR speedrunning, consider joining the <a href="https://discord.gg/7PKWZuW">VR Speedrunning Discord server</a>!</p>
							<p>If there's a game that you believe belongs on here (or you see a bug/error), please ping <span id="tippy-me" class="is-tooltip-text">me</span> in the above Discord server.</p>
							<p>For the latest VR world records, check out the <a href="https://twitter.com/VRSpeedruns">VRSR Twitter bot</a>!</p>
						</div>
					</div>
				</div>
			</div>
			<div class="container" id="main-container" style="display: none;">
				<div class="columns">
					<div class="column is-3 reverse-columns-mobile">
						<div class="box">
							<div class="select is-hidden-tablet">
								<select id="games" onchange="onGameChange(this.value)"></select>
							</div>
							<div class="game-selector is-hidden-mobile">
								<div id="game-selector-button" onclick="toggleGameSelector()" title=""></div>
								<div id="game-selector-menu">
									<div id="pc-games"></div>
								</div>
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
                            <div class="tabs is-boxed"><ul id="tabs"></ul><div id="misc-cats-container"></div></div>
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
					<p><a href="https://splits.io/" target="_blank">Splits.io</a> data accessed using the <a href="https://github.com/glacials/splits-io/blob/main/docs/api.md" target="_blank">Splits.io API</a>.</p>
				</div>
				<div class="column is-4 has-text-left-tablet">
					<div class="links">
						<p>
							<a href="/"><i class="fas fa-home" aria-hidden="true" style="margin-left: -1px;"></i>Home</a>
						</p>
						<p>
							<a href="https://github.com/VRSpeedruns" target="_blank"><i class="fab fa-github" aria-hidden="true"></i>GitHub</a>
						</p>
						<p>
							<a href="https://twitter.com/VRSpeedruns" target="_blank"><i class="fab fa-twitter" aria-hidden="true"></i>Twitter</a>
						</p>
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
			<script type="text/javascript" src="/vrsrassets/js/latestwrs.js"></script>
			<script type="text/javascript" src="/vrsrassets/js/main.js"></script>
			<style id="instance-style"></style>
		</section>
	</body>
</html>