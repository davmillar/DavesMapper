<?
	include "cgi-bin/db_start.php";
	if ($_REQUEST['artist']) {
		$thisartist = $_REQUEST['artist'];
		$artistdata = mysql_fetch_assoc(mysql_query("SELECT * FROM artists WHERE url_slug = '".$thisartist."'"));
		if (!$artistdata['id']) {		
			header("Location: /supporters");
			exit;
		}
	} else {
		header("Location: /supporters");
		exit;
	}
?>
<!DOCTYPE html>
<html lang="en" itemscope itemtype="http://schema.org/WebPage">
	<head>
		<title><?=$artistdata['name']?> | Dave's Mapper | RPG Map Generator</title>
		<meta name="description" content="Profile for RPG cartographer <?=$artistdata['name']?> on Dave's Mapper."/>
		<meta name="keywords" content="RPG,dungeons and dragons,DnD,D&D,OSR,roleplaying,risus,dungeon master,game master,mapping,web app" />
		<? include "includes/head.php"; ?>
		<script type="text/javascript" src="scripts/script_about.js"></script>
	</head>
	<body>
    <? include "includes/magic.php"; ?>		
		<section id="sidepanel"><form>
			<h2><?=$artistdata['name']?></h2>
			<p><?=$artistdata['bio']?></p>
			<? if ($artistdata['url']) { ?><a href="<?=$artistdata['url']?>" target="_blank" class="widebutton"><?=$artistdata['name']?>'s Site</a><?	} ?>
		</form></section>
		<section id="viewport">
			<section id="about">
				<h2>Tiles Contributed by <?=$artistdata['name']?></h2>
					<?
						$mtypes = Array('Dungeon'=>1,'Cavern'=>2,'Dun/Cav Mix'=>3,'City'=>4, 'Village'=>5, 'Side View'=>6, 'SciFi Ship'=>7, 'Boardwalk'=>8);
						$ttypes = Array('Full'=>1,'Edge'=>2,'Corner'=>3,'Top'=>4,'Top Corner'=>5,'Bottom'=>6,'Bottom Corner'=>7);
						$tabular = Array(1=>Array(),2=>Array(),3=>Array(),4=>Array(),5=>Array());
						$totals = Array();
						$tdata = mysql_query("SELECT COUNT(id) AS total, tile_type, map_type FROM tiles WHERE artist_id = '".$artistdata['id']."' GROUP BY map_type, tile_type");
						while ($td = mysql_fetch_array($tdata)) {
							$tabular[$td['map_type']][$td['tile_type']] = $td['total'];
						}
					?>
					<table id="cartomagic">
						<tr>
							<th></th>
							<? foreach ($ttypes as $tname=>$tid) { ?><th class="maim"><?=$tname?></th><? } ?>
							<th>Map Type Total</th>
						</tr>
						<? foreach ($mtypes as $mname=>$mid) { ?>
							<? $rowtotal = 0; ?>
							<tr><th><?=$mname?></th>
								<? foreach ($ttypes as $tname=>$tid) { ?>
									<td class="showme" data-carto="<?=$artistdata['id']?>" data-ttype="<?=$tid?>" data-mtype="<?=$mid?>">
										<?=($tabular[$mid][$tid]) ? $tabular[$mid][$tid] : 0?>
									</td>
									<? $rowtotal += (($tabular[$mid][$tid]) ? $tabular[$mid][$tid] : 0);
										$totals[$tid] += (($tabular[$mid][$tid]) ? $tabular[$mid][$tid] : 0); ?>
								<? } ?>
								<td><strong><?=$rowtotal?></strong></td>
							</tr>
						<? } ?>
						<? $rowtotal = 0; ?>
						<tr><th>Tile Type Total</th>
							<? foreach ($totals as $tid=>$tsum) { ?>
								<td><strong><?=$tsum?></strong></td>
								<? $rowtotal += $tsum; ?>
							<? } ?>
							<td><strong><?=$rowtotal?></strong></td>
						</tr>
					</table>
					<div id="cartoload"></div>
					<div id="cartoloadanim"><img src="/images/ajax-loader.gif" alt="Loading..." /></div>
			</section>
		</section>
		<? include "includes/footer.php"; ?>
	</body>
</html>
<? include "cgi-bin/db_end.php"; ?>
