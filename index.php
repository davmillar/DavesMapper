<?php
  define('PATH', dirname(__FILE__));

	include PATH . "/cgi-bin/db_start.php";

	$iPod = stripos($_SERVER['HTTP_USER_AGENT'],"iPod");
	$iPhone = stripos($_SERVER['HTTP_USER_AGENT'],"iPhone");
	$iPad = stripos($_SERVER['HTTP_USER_AGENT'],"iPad");
	$Android= stripos($_SERVER['HTTP_USER_AGENT'],"Android");
	$webOS= stripos($_SERVER['HTTP_USER_AGENT'],"webOS");
?>
<!DOCTYPE html>
<html lang="en" itemscope itemtype="http://schema.org/WebPage">
	<head>
		<title>Dave's Mapper</title>
		<meta name="description" content="Geomorphic map generator web app for role-playing enthusiasts. Created by web designer and puzzle author David Millar.">
		<meta name="keywords" content="RPG,dungeons and dragons,DnD,D&amp;D,OSR,roleplaying,risus,dungeon master,game master,mapping,web app">
		<meta name="wot-verification" content="fb53c891a20198877c5e">
		<?php include "includes/head.php"; ?>
		<script src="scripts/jquery.hammer.min.js"></script>
		<script src="assets/js/compiled_app.js?t=<?php echo filemtime("assets/js/compiled_app.js")?>"></script>
	</head>
	<body>
		<?php include "includes/magic.php"; ?>
		<header id="site-head"><form>
			<div class="fieldset">
				<h4 class="legend" title="Choose between different map types.">Map Type</h4>
				 <!--[if lte IE 8]>
					<label for="mt_dun" class="shitblock">
						<input type="radio" name="maptype" value="1" id="mt_dun" checked><br>Dungeons
					</label>
					<label for="mt_cav" class="shitblock">
						<input type="radio" name="maptype" value="2" id="mt_cav"><br>Caverns
					</label>
					<label for="mt_mix" class="shitblock">
						<input type="radio" name="maptype" value="3" id="mt_mix"><br>Dun/Cav Mix
					</label>
					<label for="mt_city" class="shitblock">
						<input type="radio" name="maptype" value="4" id="mt_city"><br>City
					</label>
					<label for="mt_vil" class="shitblock">
						<input type="radio" name="maptype" value="5" id="mt_vil"><br>Village
					</label>
					<label for="mt_side" class="shitblock" title="Doesn't work in IE 8 or older.">
						<input type="radio" name="maptype" value="6" id="mt_side" disabled><br>Side View
					</label>
					<label for="mt_ship" class="shitblock">
						<input type="radio" name="maptype" value="7" id="mt_ship"><br>SciFi Ship
					</label>
					<label for="mt_jet" class="shitblock">
						<input type="radio" name="maptype" value="8" id="mt_jet"><br>Boardwalk
					</label>
					<![endif]-->
				<!--[if (gt IE 8)|!(IE)]><!-->
				<div class="dropradio" id="mapTypeDrop"><div>
					<input type="radio" class="btnDrp mtBtn first" name="maptype" value="1" id="mt_dun" checked>
						<label for="mt_dun" class="dropped">Dungeons</label>
					<input type="radio" class="btnDrp mtBtn" name="maptype" value="2" id="mt_cav">
						<label for="mt_cav" class="dropped">Caverns</label>
					<input type="radio" class="btnDrp mtBtn" name="maptype" value="3" id="mt_mix">
						<label for="mt_mix" class="dropped">Dun/Cav Mix</label>
					<input type="radio" class="btnDrp mtBtn" name="maptype" value="4" id="mt_city">
						<label for="mt_city" class="dropped">City</label>
					<input type="radio" class="btnDrp mtBtn" name="maptype" value="5" id="mt_vil">
						<label for="mt_vil" class="dropped">Village</label>
					<input type="radio" class="btnDrp mtBtn" name="maptype" value="6" id="mt_side">
						<label for="mt_side" class="dropped">Side View</label>
					<input type="radio" class="btnDrp mtBtn" name="maptype" value="7" id="mt_ship">
						<label for="mt_ship" class="dropped">SciFi Ship</label>
					<input type="radio" class="btnDrp mtBtn last" name="maptype" value="8" id="mt_jet">
						<label for="mt_jet" class="dropped">Boardwalk</label>
				</div></div>
				<!--<![endif]-->
				<a class="button" id="newBtn" title="Generate a New Map [n]"><em class="sprite spPNG"></em> New Map</a>
			</div><div class="fieldset">
				<h4 class="legend" title="Choose between a classic style map, a staggered map, or a closed map.">Map Modes</h4>
				<!--[if IE 8]>
					<label for="normal" class="shitblock" title="Normal Map [shift+n]">
						<input type="radio" name="mode" value="0" id="normal"><br>
						<img src="m_icons/tb_normal.png" alt="Normal"></label>
					<label for="stagger" class="shitblock" title="Stagger Map Rows [s]">
						<input type="radio" name="mode" value="1" id="stagger"><br>
						<img src="m_icons/tb_staggered.png" alt="Stagger"></label>
					<label for="stagcap" class="shitblock" title="Stagger Map Rows, Short Rows Capped [shift+s]">
						<input type="radio" name="mode" value="3" id="stagcap"><br>
						<img src="m_icons/tb_staggeredcap.png" alt="Stagger and Cap"></label>
					<label for="endBtn" class="shitblock" title="Close Off Dungeon Edges [c]">
						<input type="radio" name="mode" value="2" id="endBtn" checked><br>
						<img src="m_icons/tb_capped.png" alt="Cap Ends"></label>
					<label for="cubeBtn" class="shitblock" title="Foldable Cube">
						<input type="radio" name="mode" value="4" id="cubeBtn"><br>
						<img src="m_icons/tb_cube.png" alt="Cube"></label>
				<![endif]-->
				<!--[if (gt IE 8)|!(IE)]><!-->
				<div class="dropradio" id="mapModeDrop"><div>
					<input type="radio" class="btnDrp first" name="mode" value="0" id="normal">
						<label for="normal"><em class="sprite spOrig"></em> Open-Edge</label>
					<input type="radio" class="btnDrp" name="mode" value="1" id="stagger">
						<label for="stagger"><em class="sprite spStag"></em> Staggered</label>
					<input type="radio" class="btnDrp" name="mode" value="3" id="stagcap">
						<label for="stagcap"><em class="sprite spStagCap"></em> Staggered (Capped)</label>
					<input type="radio" class="btnDrp" name="mode" value="2" id="endBtn" checked>
						<label for="endBtn"><em class="sprite spFull"></em> Closed-Edge</label>
					<input type="radio" class="btnDrp last" name="mode" value="4" id="cubeBtn">
						<label for="cubeBtn"><em class="sprite spCube"></em> Cube</label>
				</div></div>
				<!--<![endif]-->
			</div><div class="fieldset">
				<h4 class="legend" title="Choose your map's height and width.">Map Size</h4>
				<input type="number" min="1" max="25" id="width" required>
				<input type="number" min="1" max="25" id="height" required><br>
				<label for="width" class="labelTxt" title="Map size in tiles wide.">Width</label>
				<label for="height" class="labelTxt" title="Map size in tiles tall.">Height</label>
			</div><div class="fieldset selectionEdit">
				<h4 class="legend selHeader" title="Change up the selected tile.">Selection</h4>
				<input type="button" class="btnGrp first" name="rotateTile" value="Rotate" id="rotateTile" checked>
					<label for="rotateTile" title="Rotate Tile 90 Degrees" id="rotateBtn"><em class="sprite spRot">Rotate</em></label>
				<input type="button" class="btnGrp" name="swapTile" value="Swap" id="swapTile">
					<label for="swapTile" title="Swap Tile with Another"><em class="sprite spSwap">Swap</em></label>
				<input type="button" class="btnGrp" name="mancrush" value="Admire" id="mancrush">
					<label for="mancrush" title="Build a Map by this Artist"><em class="sprite spCrush">Mancrush</em></label>
				<input type="button" class="btnGrp" name="removeTile" value="Remove" id="removeTile">
					<label for="removeTile" title="Remove Tile and Replace"><em class="sprite spX">Replace Tile</em></label>
				<input type="button" class="btnGrp last" name="removeTileExit" value="Remove with Exit" id="removeTileExit">
					<label for="removeTileExit" title="Remove Tile and Replace with Entrance/Exit"><em class="sprite spExit">Replace Tile with Exit</em></label>
			</div><div class="fieldset">
				<h4 class="legend" title="Viewing options. Toggle through grid overlays with [g].">View Options</h4>
				<!--[if LTE IE 8]>
					<label for="nogrid" class="shitblock" title="Don't Use a Grid">
						<input type="radio" name="grid" value="0" id="nogrid" checked><br>
						<em class="sprite spX">No Grid</em></label>
					<label for="grid5" class="shitblock" title="Use 5-foot Grid">
						<input type="radio" name="grid" value="1" id="grid5"><br>
						<em class="sprite spGrid5">5-foot Grid</em></label>
					<label for="grid10" class="shitblock" title="Use 10-foot Grid">
						<input type="radio" name="grid" value="2" id="grid10"><br>
						<em class="sprite spGrid10">10-foot Grid</em></label>
					<label for="gridhex" class="shitblock" title="Use 10-foot Grid">
						<input type="radio" name="grid" value="3" id="gridhex"><br>
						<em class="sprite spHex">Hex Grid</em></label>
				<![endif]-->
				<!--[if (gt IE 8)|!(IE)]><!-->
				<input type="radio" class="btnGrp first" name="grid" value="0" id="nogrid" checked>
					<label for="nogrid" title="Don't Use a Grid"><em class="sprite spX">No Grid</em></label>
				<input type="radio" class="btnGrp" name="grid" value="1" id="grid5">
					<label for="grid5" title="Use 5-foot Grid"><em class="sprite spGrid5">5-foot Grid</em></label>
				<input type="radio" class="btnGrp" name="grid" value="2" id="grid10">
					<label for="grid10" title="Use 10-foot Grid"><em class="sprite spGrid10">10-foot Grid</em></label>
				<input type="radio" class="btnGrp last" name="grid" value="3" id="gridhex">
					<label for="gridhex" title="Use Hex Grid"><em class="sprite spHex">Hex Grid</em></label>
				<!--<![endif]-->
				<a class="button" id="newWindowB" title="Export to PNG"><em class="sprite spPNG"></em> Export</a>
			</div>
		</form></header>
		<section id="notification"><span>The tile sets you selected do not contain the right tile mix for your selected map mode. Falling back to the closest possible map mode.</span> <a id="clearNoti" title="Clear this notification.">OK</a></section>
		<section id="popup"><div>
			<h2>New to the Mapper?</h2>
			<ul>
				<li><strong>Make maps for tabletop RPGs</strong> including caverns, dungeons, vertical dungeons, towns, and spaceships.</li>
				<li><strong>Configure your map</strong> using the toolbar above. Choose size, type, layout, and more.</li>
				<li><strong>Click tiles</strong> and use the handy selection menu to fine-tune your generated map.</li>
				<li><strong>Choose your map artist(s)</strong> by toggling them on the left-hand panel. Double-click an artist or hit the heart button with a tile selected to switch to a single artist.</li>
				<li><strong>On multitouch devices</strong> use two-finger twist to rotate tiles.</li>
				<li><em>Learn more about how to submit your own tiles, who made the tiles here, and more about supporting the mapper using the navigation bar at the top of this app.</em></li>
			</ul>
			<p><em>Click anywhere to close.</em></p>
		</div></section>
		<section id="tilepanel"><form>
			<h4 class="tilegroup">Artists</h4>
				<section class="collapse" id="artistsblock">
				</section>
			<h4>Stocker</h4>
			<section class="collapse collapsed" id="stocker">
				<h5>Room Contents</h5>
				<ul id="roomcont">
					<li>Monster(s)</li>
					<li>Monster(s)</li>
					<li>Monster(s)</li>
					<li>Monster(s)</li>
					<li>Monster(s)</li>
				</ul>
				<a class="widebutton" id="roomBtn" title="Stock 5 More Rooms">Restock</a>
			</section>
		</form></section>
		<section id="viewport">
			<section id="map">
				<canvas id="drawingboard"></canvas>
				<div id="grid"></div>
				<div id="tiles"></div>
			</section>
		</section>
		<?php include "includes/footer.php"; ?>
	</body>
</html>
<?php include PATH . "/cgi-bin/db_end.php"; ?>
