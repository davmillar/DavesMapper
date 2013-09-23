<?
	header('Cache-Control: no-cache, must-revalidate');
	header('Expires: Wed, 8 Jun 1988 05:00:00 GMT');
	header('Content-type: application/json');
	
	include "../cgi-bin/db_start.php";
	$carto = intval($_REQUEST['cart_id']);
	$ttype = intval($_REQUEST['ttype']);
	$mtype = intval($_REQUEST['mtype']);
	
	$ninjadata = mysql_query("SELECT image, id FROM tiles WHERE artist_id = ".$carto." AND map_type = ".$mtype." AND tile_type = ".$ttype);
	$ninjaarr = Array();
	
	while ($ninja = mysql_fetch_assoc($ninjadata)){
		$ninjaarr[] = '"'.$ninja['id'].'": "'.$ninja['image'].'"';
	}
	echo '{' . implode(',',$ninjaarr) . '}';
	
	include "../cgi-bin/db_end.php";
?>
