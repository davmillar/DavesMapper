<?php
  define('PATH', dirname(__FILE__));
  include PATH . "/cgi-bin/db_start.php";

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
		<title><?php echo $artistdata['name']?> | Dave's Mapper | RPG Map Generator</title>
		<meta name="description" content="Profile for RPG cartographer <?php echo $artistdata['name']?> on Dave's Mapper."/>
		<meta name="keywords" content="RPG,dungeons and dragons,DnD,D&D,OSR,roleplaying,risus,dungeon master,game master,mapping,web app" />
		<?php include "includes/head.php"; ?>
	</head>
	<body>
    <?php include "includes/magic.php"; ?>
		<section id="sidepanel"><form>
			<h2><?php echo $artistdata['name']?></h2>
			<p><?php echo $artistdata['bio']?></p>
			<?php if ($artistdata['url']) { ?><a href="<?php echo $artistdata['url']?>" target="_blank" class="widebutton"><?php echo $artistdata['name']?>'s Site</a><?php 	} ?>
		</form></section>
		<section id="viewport">
			<section id="about">
				<h2>Tiles Contributed by <?php echo $artistdata['name']?></h2>
					<?php

            $mtypes = Array(
              'Dungeon' => 1,
              'Cavern' => 2,
              'Dun/Cav Mix' => 3,
              'City' => 4,
              'Village' => 5,
              'Side View' => 6,
              'SciFi Ship' => 7,
              'Boardwalk' => 8,
              'SciFi City' =>  9
            );
            $ttypes = Array(
              'Full' => 1,
              'Edge' => 2,
              'Corner' => 3,
              'Top' => 4,
              'Top Corner' => 5,
              'Bottom' => 6,
              'Bottom Corner' => 7
            );
            $tabular = Array(
              1 => Array(),
              2 => Array(),
              3 => Array(),
              4 => Array(),
              5 => Array(),
              6 => Array(),
              7 => Array(),
              8 => Array(),
              9 => Array()
            );
						$totals = Array(0, 0, 0, 0, 0, 0, 0, 0);
						$tdata = mysql_query("SELECT COUNT(id) AS total, tile_type, map_type FROM tiles WHERE artist_id = '".$artistdata['id']."' GROUP BY map_type, tile_type");
						while ($td = mysql_fetch_array($tdata)) {
							$tabular[$td['map_type']][$td['tile_type']] = $td['total'];
						}
					?>
					<table id="cartomagic">
						<tr>
							<th></th>
							<?php foreach ($ttypes as $tname=>$tid) { ?><th class="maim"><?php echo $tname?></th><?php } ?>
							<th>Map Type Total</th>
						</tr>
						<?php foreach ($mtypes as $mname=>$mid) { ?>
							<?php $rowtotal = 0; ?>
							<tr><th><?php echo $mname?></th>
                <?php foreach ($ttypes as $tname=>$tid) { ?>
									<?php
                    if (!isset($tabular[$mid][$tid])) {
                      $tabular[$mid][$tid] = 0;
                    }
                    $rowtotal += $tabular[$mid][$tid];
										$totals[$tid] += $tabular[$mid][$tid];
                  ?>
                  <td class="showme" data-carto="<?php echo $artistdata['id']; ?>" data-ttype="<?php echo $tid; ?>" data-mtype="<?php echo $mid; ?>">
                    <?php echo $tabular[$mid][$tid]; ?>
                  </td>
								<?php } ?>
								<td><strong><?php echo $rowtotal?></strong></td>
							</tr>
						<?php } ?>
						<?php $rowtotal = 0; ?>
						<tr><th>Tile Type Total</th>
							<?php foreach ($totals as $tid=>$tsum) { ?>
								<td><strong><?php echo $tsum?></strong></td>
								<?php $rowtotal += $tsum; ?>
							<?php } ?>
							<td><strong><?php echo $rowtotal?></strong></td>
						</tr>
					</table>
					<div id="cartoload"></div>
					<div id="cartoloadanim"><img src="/images/ajax-loader.gif" alt="Loading..." /></div>
			</section>
		</section>
		<?php include "includes/footer.php"; ?>
	</body>
</html>
<?php
  include PATH . "/cgi-bin/db_end.php";
?>
