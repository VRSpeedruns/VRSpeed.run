<?php
include 'vrsrassets/php/oEmbedData.php';
$version = '1_2_0'; //way to force cache reset for css/js files if necessary
 ?>
<!DOCTYPE html>
<html lang="en">
<head>
		<meta charset="utf-8">
		<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no">
		
		<link rel="icon" href="/vrsrassets/images/fav.png">
		
		<title>VR Speedrunning Leaderboards</title>
		
		<meta property="og:site_name" content="VRSpeed.run">
		<meta property="og:title" content="<?= $title; ?>">
		<meta property="og:description" content="<?= $description; ?>">
		<meta property="og:image" content="<?= $image; ?>">
		<meta name="theme-color" content="<?= $color; ?>">

		<meta property="twitter:card" content="summary">
		<meta property="twitter:title" content="<?= $title; ?>">
		<meta property="twitter:description" content="<?= $description; ?>">
		<meta property="twitter:image" content="<?= $image; ?>">
		
		<meta name="description" content="<?= $description; ?>">
		<meta name="robots" content="index,follow">

		<meta name="keywords" content="VR Speedrun,VR,Speedrun,Speedrunning,VR Speedrunning,VR Running,Super Hot VR,Super Hot Speedrun,Super Hot VR Speedrun,SHVR Speedrun,SHVR,Half Life,Half-Life,Half-Life: Alyx,Half-Life Alyx,Alyx,HLA,HL: Alyx,HL:A,VRSpeed.run,VRS.R,VRSR,VRSpeed run">
		
		<link href="/assets/fa/css/all.css" rel="stylesheet">
		<link rel="stylesheet" href="/assets/css/bulma.min.css">
		<link rel="stylesheet" href="/vrsrassets/css/main.css<?= '?'.$version; ?>">
		<link rel="stylesheet" href="/assets/css/googlefonts.css">
	</head>
	<body onload="onLoad();" class="has-navbar-fixed-top">
		<nav class="navbar is-fixed-top">
			<div>
				<div class="navbar-brand">
					<a class="navbar-item in-brand" href="/">
						<img src="/vrsrassets/images/icon.png">
						<span class="brand-text">VRSPEED.RUN</span>
					</a>
					<a role="button" class="navbar-burger" onclick="navbarMobileToggle()">
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
						<span aria-hidden="true"></span>
					</a>
				</div>
				<div class="navbar-menu" id="navbar-menu">
					<div class="navbar-start">
						<a href="/leaderboard" class="navbar-item" id="nav-leaderboard">Leaderboard</a>
						<div class="navbar-item has-dropdown">
							<a class="navbar-link is-arrowless" onclick="toggleNavDropdown(this.parentElement);">Community <i class="fas fa-sort-down"></i></a>
							<div class="navbar-dropdown">
								<a class="navbar-item in-dropdown" href="https://www.speedrun.com/" target="_blank"><i class="fas fa-trophy"></i> Speedrun.com</a>
								<a class="navbar-item in-dropdown" href="https://splits.io/" target="_blank"><i class="fas fa-stopwatch"></i> Splits.io</a>
								<hr class="navbar-divider">
								<a class="navbar-item in-dropdown" href="https://discord.gg/g36fNmU3nA" target="_blank"><i class="fab fa-discord"></i> VR Speedrunning Discord</a>
								<a class="navbar-item in-dropdown" href="https://discord.gg/0h6sul1ZwHVpXJmK" target="_blank"><i class="fab fa-discord"></i> Speedrun.com Discord</a>
							</div>
						</div>
						<div class="navbar-item has-dropdown">
							<a class="navbar-link is-arrowless" onclick="toggleNavDropdown(this.parentElement);">More... <i class="fas fa-sort-down"></i></a>
							<div class="navbar-dropdown">
								<a class="navbar-item in-dropdown" href="/about"><i class="fas fa-info-circle"></i> About</a>
								<a class="navbar-item in-dropdown" href="/status"><i class="fas fa-signal"></i> Status</a>
								<hr class="navbar-divider">
								<a class="navbar-item in-dropdown" href="https://github.com/VRSpeedruns" target="_blank"><i class="fab fa-github"></i> GitHub</a>
								<a class="navbar-item in-dropdown" href="https://twitter.com/VRSpeedruns" target="_blank"><i class="fab fa-twitter"></i> Twitter</a>
								<!--<hr class="navbar-divider">
								<a class="navbar-item in-dropdown" href="https://ko-fi.com/bigfoott" target="_blank"><i class="fas fa-heart"></i> Support Me</a>-->
							</div>
						</div>
					</div>
					<div class="navbar-end">
						<div class="navbar-item is-game-sel-item">
							<div class="select is-hidden-tablet">
								<select id="games" onchange="onGameChange(this.value)"></select>
							</div>
							<div class="game-selector is-hidden-mobile">
								<div id="game-selector-button" onclick="toggleGameSelector()" title="">Choose a game.</div>
								<div id="game-selector-menu">
									<div id="pc-games"></div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		</nav>
		<section class="section" id="main-section">
			<div id="error-container"></div>
			<div id="fullpage-loading" class="loadingdiv" style="display: none;">
				<div>
					<div class="spinner"></div>
					<div class="belowspinner">Loading...</div>
				</div>
			</div>
			<div class="container" id="home-container" style="display: none;">
				<div class="columns is-centered">
					<div class="column is-6 has-text-centered">
						<figure class="image site-header">
							<img src="/vrsrassets/images/header.png">
						</figure>
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
						<div class="box about home">
							<h1 class="is-box-heading">About</h1>
							<div class="divider thin"></div>
							<p>VRSpeed.run is a central hub to view the leaderboards for the largest virtual reality games in speedrunning.</p>
							<p>If you'd like to hang out and discuss VR speedrunning, consider joining the <a href="https://discord.gg/g36fNmU3nA" target="_blank">VR Speedrunning Discord server</a>!</p>
							<p>For the latest VR world records and any updates regarding this site, check out the <a href="https://twitter.com/VRSpeedruns" target="_blank">@VRSpeedruns Twitter account</a>!</p>
							<p>If there's a game that you believe belongs here (or you see a bug/error), please submit an issue on <a href="https://github.com/VRSpeedruns/VRSpeed.run/issues/new/choose" target="_blank">GitHub</a>.</p>
							<p>The site is open source! Check out the various repositories on <a href="https://github.com/VRSpeedruns" target="_blank">GitHub</a>.</p>
							<p>Read more about the site on the <a href="about">About</a> page!</p>
						</div>
					</div>
				</div>
			</div>
			<div class="container" id="about-container" style="display: none;">
				<div class="columns is-centered">
					<div class="column is-10">
						<div class="box about">
							<h1 class="is-box-heading">About</h1>
							<div class="divider thin"></div>
								<h2>The Site</h1>
								<p>This site was built as a place to view the leaderboards for the top VR games in speedrunning in the most convenient way possible. Rather than save bookmarks for all the games you're interested in, you can simply pull up this site and all the games are here to view, and switching between them is as easy as clicking on one in the game selector.</p>
								<p>If you'd like to hang out and discuss virtual reality speedrunning, consider joining the <a href="https://discord.gg/g36fNmU3nA" target="_blank">VR Speedrunning Discord server</a>!</p>
								<p>Also, if there's a game that you believe belongs here (or you see a bug/error), please submit an issue on <a href="https://github.com/VRSpeedruns/VRSpeed.run/issues/new/choose" target="_blank">GitHub</a>.</p>
								<h2>Core Projects</h1>
								<p>The main repository for this site is available at <a href="https://github.com/VRSpeedruns/VRSpeed.run" target="_blank">VRSpeedruns/VRSpeed.run</a>.</p>
								<p>For the latest VR world records and any updates regarding this site, check out the <a href="https://twitter.com/VRSpeedruns" target="_blank">@VRSpeedruns Twitter account</a>! The repository for the Twitter bot is available at <a href="https://github.com/VRSpeedruns/Twitter" target="_blank">VRSpeedruns/Twitter</a>.</p>
								<p>In addition to the Twitter bot above, there is also a Discord bot in the VR Speedrunning server above that will post WR's in the <code>#latest-world-records</code> channel if you'd rather be notified there instead. The bot also handles assigning roles based on what VR gear a user owns. The repository for the Discord bot is available at <a href="https://github.com/VRSpeedruns/Discord" target="_blank">VRSpeedruns/Discord</a>.</p>
								<p>Both the Twitter and Discord bots get the latest WRs from a separate program that detects new world records and posts them as GitHub releases. The repository for this project is available at <a href="https://github.com/VRSpeedruns/WorldRecords" target="_blank">VRSpeedruns/WorldRecords</a>.</p>
								<h2>Data & Credits</h1>
								<p>All relevant data (game information, run information, game and user images, etc.) is retrieved from the <a href="https://github.com/speedruncomorg/api" target="_blank">Speedrun.com REST API</a>. For runs with included splits, split data is retrieved from the <a href="https://github.com/glacials/splits-io/blob/main/docs/api.md" target="_blank">Splits.io API</a>.</p>
								<p>The new logo is a commission from the amazing <a href="https://twitter.com/Sixelona" target="_blank">@Sixelona</a>!</p>
								<!--<p>I maintain this site completely for fun. If you'd like to support me, consider checking out <a href="https://ko-fi.com/bigfoott" target="_blank">my Ko-fi page</a>! 😊</p>-->
							</div>				
						</div>
					</div>
				</div>
			</div>
			<div class="container" id="status-container" style="display: none;">
				<div class="columns is-centered">
					<div class="column is-10">
						<div class="box about">
							<h1 class="is-box-heading">Status</h1>
							<div class="divider thin"></div>
							<div class="columns is-multiline has-text-centered" id="status-inner"></div>
						</div>
					</div>
				</div>
			</div>
			<div class="container" id="main-container" style="display: none;">
				<div class="columns">
					<div class="column is-3">
						<div class="box">
							<div class="game-info-container">
								<span id="game-info-fav" onclick="gameFavToggle();"><i class="far fa-star"></i></span>
								<div id="game-name"></div>
								<div class="game-image-container is-hidden-mobile"><img id="game-image" src=""></div>
								<div id="game-platforms">...</div>
								<div id="game-moderators">...</div>
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
						<div class="box latest-runs is-hidden-mobile">
							<h1 class="is-box-heading">Latest Runs</h1>
							<div class="divider thin"></div>
							<table class="table is-narrow is-fullwidth">
								<thead><tr><th>Player/Date</th><th>Category/Time</th></tr></thead>
								<tbody id="latest-runs-table"></tbody>
							</table>
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
                            <div class="tabs"><ul id="tabs"></ul><div id="misc-cats-container"></div></div>
							<div class="divider tabdiv"></div>
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
										<th id="runs-time-primary"></th>
										<th id="runs-time-secondary" class="is-hidden-mobile"></th>
										<th id="runs-time-tertiary" class="is-hidden-mobile"></th>
										<th id="runs-platform-hardware" class="is-hidden-mobile">Platform</th>
										<th class="is-hidden-mobile">Date</th>
										<th class="is-hidden-mobile"></th>
									</tr>
								</thead>
								<tbody id="runs"></tbody>
							</table>
						</div>
						<div class="box" id="box-single-run" style="display: none;">
							<div id="back-button">
								<a onclick="closeRun(); backFixUrl(); loadGame(getGame(), true);"><i class="fas fa-arrow-left"></i> Back to Game</a>
							</div>
							<div class="buttons is-right" id="single-run-buttons">
								<a id="run-single-vid" class="button-outer" href="" target="_blank">
									<div class="button is-dark"><span class="icon"><i id="run-single-vid-icon" class=""></i></span></div>
								</a>
								<a id="run-single-src" class="button-outer" href="" target="_blank">
									<div class="button is-dark"><span class="icon"><i class="fas fa-trophy"></i></span></div>
								</a>
							</div>
							<div class="container">
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
								<div id="run-single-comment-outer"><span id="run-single-comment"></span></div>
								<div class="columns run-single-info-other">
									<div class="column is-4"><p class="head">Submitted</p><p>on <span id="run-single-submitted-date"></span>.</p></div>
									<div class="column is-4"><p class="head">Played</p><p><span id="run-single-platform"></span> on <span id="run-single-date"></span>.</p></div>
									<div class="column is-4"><span id="run-single-verifyreject"></span></div>
								</div>
							</div>
							<div id="run-single-splits-container">
								<div class="divider mid-thin"></div>
								<div id="variables">
									<div class="buttons has-addons" id="run-single-splits-timing">
										<button id="run-single-splits-rt" class="button is-small is-dark is-variable" onclick=""><i class="fas fa-globe-americas"></i> Real<span class="is-hidden-mobile">-time</span></button>
										<button id="run-single-splits-gt" class="button is-small is-dark is-variable" onclick=""><i class="fas fa-gamepad"></i> Game<span class="is-hidden-mobile">-time</span></button>
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
										<table id="run-single-segments-table" class="table is-narrow is-fullwidth">
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
			<div class="container" id="user-container" style="display: none;">
				<div class="columns">
					<div class="column is-3">
						<div class="box">
							<div class="has-text-centered">
								<div id="user-username"></div>
								<div style="margin: 0 auto;"><img id="user-pfp" style="height: 128px" src=""></div>
								<div id="user-pronouns"></div>
								<div id="user-accounts"></div>
								<div id="user-run-count"></div>
								<div id="user-moderator-of"></div>
								<div class="buttons is-centered">
									<a id="user-links-src" class="button-outer" href="" target="_blank">
										<div class="button is-dark"><span class="icon"><i class="fas fa-trophy"></i></span></div>
									</a>
									<a id="user-links-info" class="button-outer" href="" target="_blank">
										<div class="button is-dark"><span class="icon"><i class="fas fa-info-circle"></i></span></div>
									</a>
								</div>
							</div>
						</div>
						<div class="box latest-runs is-hidden-mobile">
							<h1 class="is-box-heading">Latest Runs</h1>
							<div class="divider thin"></div>
							<table class="table is-narrow is-fullwidth">
								<thead><tr><th>Game/Date</th><th>Category/Time</th></tr></thead>
								<tbody id="latest-user-runs-table"></tbody>
							</table>
						</div>
					</div>
					<div class="column is-9">
						<div class="box">
							<div id="user-runs-loading" class="loadingdiv" style="display: block;">
								<div>
									<div class="spinner"></div>
									<div class="belowspinner">Loading...</div>
								</div>
							</div>
							<div id="user-runs-table"></div>
						</div>
					</div>
				</div>
			</div>
		</section>
		<section class="section is-footer">
			<div class="columns is-centered is-vcentered is-multiline">
				<div class="column is-5 has-text-right-tablet">
					<p>Currently providing data for <?= count($games); ?> games.</p>
					<p>Made with <i class="fas fa-heart is-heart" aria-hidden="true"></i> by <a href="https://github.com/bigfoott" target="_blank">bigfoot</a>.</p>
				</div>
				<div class="column is-2 is-hidden-mobile">
					<p>© 2019-<?= date("Y") ?> <a href="https://bigft.io" target="_blank">bigft.io</a></p>
				</div>
				<div class="column is-5 has-text-left-tablet">
				<p><a href="https://www.speedrun.com/" target="_blank">Speedrun.com</a> data from <a href="https://github.com/speedruncomorg/api" target="_blank">SR.C REST API</a>.</p>
					<p><a href="https://splits.io/" target="_blank">Splits.io</a> data from <a href="https://github.com/glacials/splits-io/blob/main/docs/api.md" target="_blank">Splits.io API</a>.</p>
				</div>
				<div class="column is-2 is-hidden-tablet">
					<p>© 2019-<?= date("Y") ?> <a href="https://bigft.io" target="_blank">bigft.io</a></p>
				</div>
			</div>

			<div id="js-mobile-check" class="is-hidden-mobile"></div>
			<script type="text/javascript">
				var gamesArray = <?= json_encode($games); ?>;
				var gameColors = <?= json_encode($gameColors); ?>;
				var isMobile = window.getComputedStyle(document.getElementById("js-mobile-check")).getPropertyValue("display") == "none";
				var runLoadedCategory = "<?= $categoryId; ?>";
				var allContainers = [];
			</script>
			<script type="text/javascript" src="/assets/js/popper.min.js"></script>
			<script type="text/javascript" src="/assets/js/tippy-bundle.umd.js"></script> 
			<script type="text/javascript" src="/vrsrassets/js/colorinterpolation.js<?= '?'.$version; ?>"></script>
			<script type="text/javascript" src="/vrsrassets/js/viewuser.js<?= '?'.$version; ?>"></script>
			<script type="text/javascript" src="/vrsrassets/js/gamedata.js<?= '?'.$version; ?>"></script>
			<script type="text/javascript" src="/vrsrassets/js/viewrun.js<?= '?'.$version; ?>"></script>
			<script type="text/javascript" src="/vrsrassets/js/latestwrs.js<?= '?'.$version; ?>"></script>
			<script type="text/javascript" src="/vrsrassets/js/status.js<?= '?'.$version; ?>"></script>
			<script type="text/javascript" src="/vrsrassets/js/main.js<?= '?'.$version; ?>"></script>
			<style id="wr-instance-style"></style>
		</section>
	</body>
</html>