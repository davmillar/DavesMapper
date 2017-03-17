<?php
  define('PATH', dirname(__FILE__));
	$map_type = intval($_POST['map_kind']);
  $map_type = ($map_type > 0) ? $map_type : 1;
  $datafile = "./datacache/" . $map_type . ".json";
  if (file_exists($datafile) && (time() - filemtime($datafile) >= 60 * 60 *24 * 5)) {
    include($datafile);
  } else {
    include PATH . "/../cgi-bin/db_start.php";
	  $map_type_phr = ($map_type == 3) ? "IN (1,2,3)" : "= ". $map_type;

		$query = "SELECT id, image, artist_id, tile_type FROM tiles WHERE map_type ".$map_type_phr." AND approved = 1";
		$tiledata = mysql_query($query);
		$rarr = Array();
		if (mysql_num_rows($tiledata) > 0) {
		  while ($thistile = mysql_fetch_assoc($tiledata)) {
			  $tt = intval($thistile['tile_type']);
			  if (!isset($rarr[$tt])) { $rarr[$tt] = Array(); }
		    $rarr[$tt][] = $thistile;
		  }
		}
		$our_json = json_encode($rarr);
		file_put_contents($datafile, $our_json);
  	include PATH . "/../cgi-bin/db_end.php";
	  echo $our_json;
  }
?>
