<?php include "/home/dmillar/public_html/cgi-bin/db_start.php"; ?>
<!DOCTYPE html>
<html lang="en" itemscope itemtype="http://schema.org/WebPage">
  <head>
    <title>Dave's Mapper | RPG Map Generator</title>
    <meta name="description" content="Geomorphic map generator web app for role-playing enthusiasts. Created by web designer and puzzle author David Millar."/>
    <meta name="keywords" content="RPG,dungeons and dragons,DnD,D&D,OSR,roleplaying,risus,dungeon master,game master,mapping,web app" />
    <?php include "includes/head.php"; ?>
    <script type="text/javascript" src="scripts/jquery.hotkeys.js"></script>
    <script type="text/javascript" src="scripts/mydate.js"></script>
    <script type="text/javascript" src="scripts/json2.js"></script>
    <script type="text/javascript" src="scripts/b64.js"></script>
		<style type="text/css">
			#maincontainer{
				margin:0 auto;
				-webkit-transform:scale(0.85);-moz-transform:scale(0.85);-ms-transform:scale(0.85);-o-transform:scale(0.85);transform:scale(0.85);
			}
			#rowa,#rowc,#rowe{
				margin:0 auto;
				-webkit-transform:scaleY(0.5);-moz-transform:scaleY(0.5);-ms-transform:scaleY(0.5);-o-transform:scaleY(0.5);transform:scaleY(0.5);
			}
			#rowacontainer,#rowccontainer,#rowecontainer{
				text-align:right;
				margin:0 auto;
				-moz-transform: rotate(45deg); -webkit-transform: rotate(45deg); -o-transform:rotate(45deg); -ms-transform: rotate(45deg); transform: rotate(45deg);
			}
			#rowacontainer,#rowecontainer{height:450px;width:450px;}
			#rowccontainer{height:900px;width:900px;}
			#rowc{clear:both;}
			#rowb{
				position:relative;
				margin:-20px auto;
			}
			#rowbleft{
				position:absolute;top:0;right:50%;
				width:450px;height:300px;
				margin:0 auto;
			}
			#rowbright{
				position:absolute;top:0;left:50%;
				width:450px;height:300px;
				margin:0 auto;
			}
			.leftslant{
				-webkit-transform: matrix(0.75,0.5,0,1,0,0);
				-moz-transform: matrix(0.75,0.5,0,1,0px,0px);
				-ms-transform: matrix(0.75,0.5,0,1,0,0);
				-o-transform: matrix(0.75,0.5,0,1,0,0);
				transform: matrix(0.75,0.5,0,1,0,0);}
			.rightslant{
				-webkit-transform: matrix(0.75,-0.5,0,1,0,0);
				-moz-transform: matrix(0.75,-0.5,0,1,0px,0px);
				-ms-transform: matrix(0.75,-0.5,0,1,0,0);
				-o-transform: matrix(0.75,-0.5,0,1,0,0);
				transform: matrix(0.75,-0.5,0,1,0,0);}
		</style>
  </head>
	<?php 
		$corners = Array(); $edges = Array(); $mains = Array(); $sides = Array(); $walls = Array();
		$cornersget = mysql_query("SELECT image FROM tiles WHERE map_type IN (1,2,3) AND tile_type = 3 ORDER BY RAND() LIMIT 4");
		while ($c = mysql_fetch_assoc($cornersget)) {	$corners[] = $c['image'];	}
		$edgesget = mysql_query("SELECT image FROM tiles WHERE map_type IN (1,2,3) AND tile_type = 2 ORDER BY RAND() LIMIT 8");
		while ($e = mysql_fetch_assoc($edgesget)) {	$edges[] = $e['image'];	}
		$mainsget = mysql_query("SELECT image FROM tiles WHERE map_type IN (1,2,3) AND tile_type = 1 ORDER BY RAND() LIMIT 5");
		while ($m = mysql_fetch_assoc($mainsget)) {	$mains[] = $m['image'];	}
		$sidesget = mysql_query("SELECT image FROM tiles WHERE map_type = 6 AND tile_type = 2 ORDER BY RAND() LIMIT 4");
		while ($s = mysql_fetch_assoc($sidesget)) {	$sides[] = $s['image'];	}
		$wallsget = mysql_query("SELECT image FROM tiles WHERE map_type = 6 AND tile_type = 1 ORDER BY RAND() LIMIT 4");
		while ($w = mysql_fetch_assoc($wallsget)) {	$walls[] = $w['image'];	}
	?>
  <body>
    <?php include "includes/magic.php"; ?>    
    <section id="notification"><span>The tile sets you selected do not contain the right tile mix for your selected map mode. Falling back to the closest possible map mode.</span> <a id="clearNoti" title="Clear this notification.">OK</a></section>
    <section id="tilepanel"><form>
      <a class="widebutton large" href="/" id="newBtn" title="Back to the Mapper">Dave's Mapper</a>
      <?php include "/home/dmillar/public_html/includes/nav.php"; ?>
      <!--h4>FB News Feed</h4>
      <section class="collapse" id="news">
      </section-->
    </form></section>
    <!--section id="notification">By popular demand, you can now select specific tile sets to mix and match, not just all-or-one. <a id="hideNote" title="Hide this message.">OK!</a></section-->
    <section id="viewport">
      <section id="map">
				<div id="maincontainer">
					<div id="rowa" class="nm">
						<div id="rowacontainer">
							<img src="/tiles/<?php echo $corners[0]?>" class="corner rot0" /><img src="/tiles/<?php echo $edges[0]?>" class="edge rot0" />
							<img src="/tiles/<?php echo $edges[1]?>" class="edge rot3" /><img src="/tiles/<?php echo $mains[0]?>" class="tile rot<?php echo rand(0,3)?>" />
						</div>
					</div>
					<div id="rowb" class="sv">
						<div id="rowbleft" class="leftslant">
							<img src="/tiles/<?php echo $sides[0]?>" class="edge rot0" /><img src="/tiles/<?php echo $walls[0]?>" class="tile rot<?php echo rand(0,1)?>" />
						</div>
						<div id="rowbright" class="rightslant">
							<img src="/tiles/<?php echo $walls[1]?>" class="tile rot<?php echo rand(0,1)?>" /><img src="/tiles/<?php echo $sides[1]?>" class="edge rot1" />
						</div>
					</div>
					<div id="rowc" class="nm">
						<div id="rowccontainer">
							<img src="/tiles/<?php echo $edges[2]?>" class="edge rot0" /><img src="/tiles/<?php echo $corners[1]?>" class="corner rot1" /><br/>
							<img src="/tiles/<?php echo $mains[1]?>" class="tile rot<?php echo rand(0,3)?>" /><img src="/tiles/<?php echo $edges[3]?>" class="edge rot1" /><br/>
							<div style="text-align:left;"><img src="/tiles/<?php echo $edges[4]?>" class="edge rot3" /><img src="/tiles/<?php echo $mains[2]?>" class="tile rot<?php echo rand(0,3)?>" /><img src="/tiles/<?php echo $mains[3]?>" class="tile rot<?php echo rand(0,3)?>" /><br/>
							<img src="/tiles/<?php echo $corners[2]?>" class="corner rot3" /><img src="/tiles/<?php echo $edges[5]?>" class="edge rot2" /></div>
						</div>
					</div>
					<div id="rowd" class="sv">
						<img src="/tiles/<?php echo $sides[2]?>" class="edge rot0 rightslant" />
						<img src="/tiles/<?php echo $walls[2]?>" class="tile leftslant" />
						<img src="/tiles/<?php echo $walls[3]?>" class="tile rightslant" />
						<img src="/tiles/<?php echo $sides[3]?>" class="edge rot1 leftslant" />
					</div>
					<div id="rowe" class="nm">
						<div id="rowecontainer">
							<img src="/tiles/<?php echo $edges[6]?>" class="edge rot1" /><br/>
							<img src="/tiles/<?php echo $edges[7]?>" class="edge rot2" /><img src="/tiles/<?php echo $corners[3]?>" class="corner rot2" />
						</div>
					</div>
				</div>
      </section>
    </section>
    <?php include "includes/footer.php"; ?>
  </body>
</html>
<?php include "/home/dmillar/public_html/cgi-bin/db_end.php"; ?>