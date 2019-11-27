<?php
  define('PATH', dirname(__FILE__));
  include PATH . "/cgi-bin/db_start.php";

  if ($_REQUEST['artist']) {
    $thisartist = $_REQUEST['artist'];
    $artist_query = $pdo->query("SELECT * FROM artists WHERE url_slug = '".$thisartist."'");
    $artistdata = $artist_query->fetch(PDO::FETCH_ASSOC);
    if (!$artistdata['id']) {
      header("Location: /supporters");
      exit;
    }
    $artist_query->closeCursor();
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
    <section id="about">
      <?php if ($artistdata['url']) { ?>
        <h2><a href="<?php echo $artistdata['url']?>" target="_blank"><?php echo $artistdata['name']?></a></h2>
      <?php } else { ?>
        <h2><?php echo $artistdata['name']?></h2>
      <?php } ?>
      <p><?php echo $artistdata['bio']?></p>
      <h2>Tiles Contributed by <?php echo $artistdata['name']?></h2>
        <?php

          $map_styles = Array(
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
          $tile_types = Array(
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
          $totals_by_type = Array(
            1 => 0,
            2 => 0,
            3 => 0,
            4 => 0,
            5 => 0,
            6 => 0,
            7 => 0
          );
          $tdata = $pdo->query("SELECT COUNT(id) AS total, tile_type, map_type FROM tiles WHERE artist_id = '".$artistdata['id']."' GROUP BY map_type, tile_type");
          while ($td = $tdata->fetch(PDO::FETCH_ASSOC)) {
            $tabular[$td['map_type']][$td['tile_type']] = $td['total'];
          }
          $tdata->closeCursor();
        ?>
        <table id="cartomagic">
          <tr>
            <th></th>
            <?php foreach ($tile_types as $tname=>$tid) { ?><th class="maim"><?php echo $tname?></th><?php } ?>
            <th>Map Type Total</th>
          </tr>
          <?php foreach ($map_styles as $mname=>$mid) { ?>
            <?php $rowtotal = 0; ?>
            <tr><th><?php echo $mname; ?></th>
              <?php foreach ($tile_types as $tname=>$tid) { ?>
                <?php
                  if (!isset($tabular[$mid][$tid])) {
                    $tabular[$mid][$tid] = 0;
                  }
                  $rowtotal += $tabular[$mid][$tid];
                  $totals_by_type[$tid] += $tabular[$mid][$tid];
                ?>
                <td class="showme" data-carto="<?php echo $artistdata['id']; ?>" data-ttype="<?php echo $tid; ?>" data-mtype="<?php echo $mid; ?>">
                  <?php echo $tabular[$mid][$tid]; ?>
                </td>
              <?php } ?>
              <td><strong><?php echo $rowtotal; ?></strong></td>
            </tr>
          <?php } ?>
          <?php $rowtotal = 0; ?>
          <tr><th>Tile Type Total</th>
            <?php foreach ($totals_by_type as $tid=>$tsum) { ?>
              <td><strong><?php echo $tsum; ?></strong></td>
              <?php $rowtotal += $tsum; ?>
            <?php } ?>
            <td><strong><?php echo $rowtotal; ?></strong></td>
          </tr>
        </table>
        <div id="cartoload"></div>
        <div id="cartoloadanim"><img src="/images/ajax-loader.gif" alt="Loading..." /></div>
    </section>
    <?php include "includes/footer.php"; ?>
  </body>
</html>
<?php
  include PATH . "/cgi-bin/db_end.php";
?>
