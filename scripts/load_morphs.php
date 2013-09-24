<?php
  include "../cgi-bin/db_start.php";
  $tile_amt = intval($_POST['amount']);
    $tile_amt = ($tile_amt > 0) ? $tile_amt : 15;
  $tile_type = intval($_POST['tile_kind']);
    $tile_type = ($tile_type > 0) ? $tile_type : 1;
  $map_type = intval($_POST['map_kind']);
    $map_type = ($map_type > 0) ? $map_type : 1;
    $map_type_phr = ($map_type == 3) ? "IN (1,2,3)" : "= ".$map_type;
  if ($_POST['old_tile']) {
    $oldTile = intval($_POST['old_tile']);
    $oldTile = ($oldTile > 0) ? $oldTile : 1;
    $oldTilePhr = " id != ".$oldTile." AND ";
  } else { $oldTilePhr = ""; }
  $exit = ($_POST['exit'] == "true") ? "has_exit = 1 AND " : "";
  $artists = ($_POST['artists']) ? "artist_id IN (" . mysql_real_escape_string($_POST['artists']) . ") AND " : "";
  $query = "SELECT id, image, artist_id FROM tiles WHERE ".$exit.$artists.$oldTilePhr."tile_type = ".$tile_type." AND map_type ".$map_type_phr." AND approved = 1 ORDER BY RAND() LIMIT ".$tile_amt;
  $tiledata = mysql_query($query);
  $rarr = Array();
  if (mysql_num_rows($tiledata) > 0) {
    while ($thistile = mysql_fetch_assoc($tiledata)) {
      $rarr[] = $thistile;
    }
  }
  echo json_encode($rarr);
  include "../cgi-bin/db_end.php";
?>
