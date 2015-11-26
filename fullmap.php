<?php
  define('PATH', dirname(__FILE__));

  include PATH . "/cgi-bin/db_start.php";

  // Decrypt base64-encoded map data to JSON string
  $data = base64_decode($_REQUEST['mapData']);
  // Decode JSON data string to a PHP object
  $dataObj = json_decode($data);

  // Get integer height and width and edge and corner flags and grid type from query string
  $width = intval($_REQUEST['w']);
  $height = intval($_REQUEST['h']);
  $edges = $_REQUEST['e'];
  $corners = $_REQUEST['c'];
  $gridtype = intval($_REQUEST['g']);

  // Calculate map height and width from flags and map height and width
  $mapwidth = ($width * 300) + ($edges ? 300 : 0);
  $mapheight = ($height * 300) + ($edges ? 300 : 0);

  // Die if the data doesn't make sense.
  if (($mapwidth == 0)||($mapheight == 0)) { die("Map data seems messed up."); }

  // Select all tiles needed for this map from the DB
  $tileData = array();
  $tileQuery = "SELECT image, id FROM tiles WHERE id IN (" . implode($dataObj->tiles, ",") . ")";
  $tileQueryResult = mysql_query($tileQuery);
  // Die if the result set has no rows
  if (mysql_num_rows($tileQueryResult) == 0) {
    die('An error occurred while gathering the tiles for your map. Please try again later.<br>'.$tileQuery.'<br>'.mysql_error());
  }
  // Translate the result data into an array where the ID is key and filename is value
  while ($tileDataRow = mysql_fetch_assoc($tileQueryResult)) {
    $tileData[intval($tileDataRow['id'])] = $tileDataRow['image'];
  }

  // Function for getting the tile data, opening the image file, and adding the image data to the map.
  function nextTile(&$img, &$tileData, &$data, $n, $dx, $dy, $tw = 300, $th = 300) {
    // Get tile ID from JSON data
    $tileId = intval($data->tiles[$n]);
    // Compose filename and die if it isn't there
    if ($tileData[$tileId] == "") {
      die('No filename found for tile #' . $tileId);
    }
    $fname = "tiles/" . $tileData[$tileId];
    if ((!$fname) || (!file_exists($fname))) {
      die($fname . " not found."); return;
    }
    // Calculate rotation in degrees
    $rot = ($data->rotation[$n] * -90) + 360;
    // Grab image data based on filetype.
    $ext = strtolower(substr($fname, -3));
    switch ($ext) {
      case "gif":
        $tileSrc = imagecreatefromgif($fname) or die('Could not create image from file ' . $fname);
        break;
      case "png":
        $tileSrc = imagecreatefrompng($fname) or die('Could not create image from file ' . $fname);
        break;
      case "jpg":
        $tileSrc = imagecreatefromjpeg($fname) or die('Could not create image from file ' . $fname);
        break;
    }
    // Append image data to map.
    if ($rot > 0) {
      $rotatedTile = imagerotate($tileSrc, $rot, 0) or die('Could not rotate ' . $fname . ' to ' . $rot . ' degrees.');
      $tileSrc = $rotatedTile;
    }
    if (($rot == 90)||($rot == 270)) { $a = $tw; $tw = $th; $th = $a; }
		$sw = imagesx($tileSrc); $sh = imagesy($tileSrc);
    imagecopyresampled($img, $tileSrc, $dx, $dy, 0, 0, $tw, $th, $sw, $sh);
    imagedestroy($tileSrc);
  }

  // Create image
  $canvas = imagecreatetruecolor($mapwidth, $mapheight);
  $nImg = 0;
  // Create top row if edges are in use
  if ($edges) {
    if ($corners) {
      $dest_x = 0;
      $dest_y = 0;
      nextTile($canvas, $tileData, $dataObj, $nImg, $dest_x, $dest_y, 150, 150); $nImg++;
    }
    for($x=0; $x<$width; $x++) {
      $dest_x = ($x*300) + ($edges ? 150 : 0);
      $dest_y = 0;
      nextTile($canvas, $tileData, $dataObj, $nImg, $dest_x, $dest_y, 300, 150); $nImg++;
    }
    if ($corners) {
      $dest_x = $width*300 + 150;
      $dest_y = 0;
      nextTile($canvas, $tileData, $dataObj, $nImg, $dest_x, $dest_y, 150, 150); $nImg++;
    }
  }
  // Create maze body
  for($y=0; $y<$height; $y++) {
    if ($edges) {
      $dest_x = 0;
      $dest_y = ($y*300) + 150;
      nextTile($canvas, $tileData, $dataObj, $nImg, $dest_x, $dest_y, 300, 150); $nImg++;
    }
    for($x=0; $x<$width; $x++) {
      $dest_x = ($x*300) + ($edges ? 150 : 0);
      $dest_y = ($y*300) + ($edges ? 150 : 0);
      nextTile($canvas, $tileData, $dataObj, $nImg, $dest_x, $dest_y); $nImg++;
    }
    if ($edges) {
      $dest_x = $width*300 + 150;
      $dest_y = ($y*300) + 150;
      nextTile($canvas, $tileData, $dataObj, $nImg, $dest_x, $dest_y, 300, 150); $nImg++;
    }
  }
  // Create bottom row if edges are turned on
  if ($edges) {
    if ($corners) {
      $dest_x = 0;
      $dest_y = $height*300 + 150;
      nextTile($canvas, $tileData, $dataObj, $nImg, $dest_x, $dest_y, 150, 150); $nImg++;
    }
    for($x=0; $x<$width; $x++) {
      $dest_x = ($x*300) + ($edges ? 150 : 0);
      $dest_y = ($height*300) + 150;
      nextTile($canvas, $tileData, $dataObj, $nImg, $dest_x, $dest_y, 300, 150); $nImg++;
    }
    if ($corners) {
      $dest_x = $width*300 + 150;
      $dest_y = $height*300 + 150;
      nextTile($canvas, $tileData, $dataObj, $nImg, $dest_x, $dest_y, 150, 150); $nImg++;
    }
  }

  // I don't remember why this is necessary.
  $color = 0x55FFFFFF;
  imageline($canvas, 0, 0, 0, 1, $color);

  // Create grid lines if desired
  $color = 0x5500CCFF;
  if ($gridtype) { $gridspacing = $gridtype * 15;
    for($x=0; $x<$mapwidth; $x+=$gridspacing) { imageline($canvas, $x, 0, $x, $mapheight, $color); }
    for($y=0; $y<$mapheight; $y+=$gridspacing) { imageline($canvas, 0, $y, $mapwidth, $y, $color); } }

  // Output image header
  header ('Content-type: image/png');
  imagepng($canvas);
  imagedestroy($canvas);

  include PATH . "/cgi-bin/db_end.php";
?>
