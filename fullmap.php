<?php
  define('PATH', dirname(__FILE__));

  include PATH . "/cgi-bin/db_start.php";

  // Get integer height and width and edge and corner flags and grid type from query string
  $width = intval($_REQUEST['w']);
  $height = intval($_REQUEST['h']);
  $edges = $_REQUEST['e'];
  $corners = $_REQUEST['c'];
  $gridtype = intval($_REQUEST['g']);
  $side = isset($_REQUEST['side']) ? intval($_REQUEST['side']) : 0;

  $topHeight = $edges ? ($side ? 300 : 150) : 0;

  // Calculate map height and width from flags and map height and width
  $mapwidth = ($width * 300) + ($edges ? 300 : 0);
  $mapheight = ($height * 300) + ($edges ? $topHeight * 2 : 0);

  // Die if the data doesn't make sense.
  if (($mapwidth == 0)||($mapheight == 0)) { die("Map data seems messed up."); }

  // Check if using newest export method.
  $exportType = isset($_REQUEST['exportType']) ? intval($_REQUEST['exportType']) : 0;

  if ($exportType == 36) {
    // Decrypt base64-encoded map data to JSON string
    $data = $_REQUEST['mapData'];

    // Decode JSON data string to a PHP object
    $data_chunks = str_split($data, 4);

    $dataObj = Array(
      'tiles' => Array(),
      'rotation' => Array()
    );

    foreach ($data_chunks as $chunk) {
      $decoded_chunk = base_convert($chunk, 36, 10);
      $tile_rotation = $decoded_chunk % 4;
      $tile_id = ($decoded_chunk - $tile_rotation) / 4;
      $dataObj['rotation'][] = $tile_rotation;
      $dataObj['tiles'][] = $tile_id;
    }

    if (sizeof($dataObj['tiles']) > 0) {
      $tileQuery = "SELECT image, id FROM tiles WHERE id IN (" . implode(",", $dataObj['tiles']) . ")";
    } else {
      die("Unable to generate map at this time. Try using your browser's Print option to save to a PDF instead.");
    }
  } else {
    die("Invalid map export type.");
  }


  $tileData = array();
  // Select all tiles needed for this map from the DB
  $tileQueryResult = $pdo->query($tileQuery);
  // Die if the result set has no rows
  if ($tileQueryResult->rowCount() == 0) {
    die('An error occurred while gathering the tiles for your map. Please try again later.<br>'.$tileQuery.'<br>'.$pdo->errorInfo());
  }
  // Translate the result data into an array where the ID is key and filename is value
  while ($tileDataRow = $tileQueryResult->fetch(PDO::FETCH_ASSOC)) {
    $tileData[intval($tileDataRow['id'])] = $tileDataRow['image'];
  }

  // Create image
  $canvas = imagecreatetruecolor($mapwidth, $mapheight);
  $nImg = 0;

  // Function for getting the tile data, opening the image file, and adding the image data to the map.
  function nextTile($dx, $dy, $tw = 300, $th = 300) {
    global $side, $tileData, $dataObj, $nImg, $canvas;

    $n = $nImg;
    $nImg++;

    // Get tile ID from JSON data
    $tileId = intval($dataObj['tiles'][$n]);
    // Compose filename and die if it isn't there
    if ($tileData[$tileId] == "") {
      die('No filename found for tile #' . $tileId);
    }
    $fname = "tiles/" . $tileData[$tileId];
    if ((!$fname) || (!file_exists($fname))) {
      die($fname . " not found."); return;
    }
    // Calculate rotation in degrees
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
    if ($side) {
      if (intval($dataObj['rotation'][$n]) % 2 > 0) {
        imageflip($tileSrc, IMG_FLIP_HORIZONTAL) or die('Could not flip ' . $fname . '.');
      }
    } else {
      $rot = ($dataObj['rotation'][$n] * -90) + 360;
      if ($rot > 0) {
        $rotatedTile = imagerotate($tileSrc, $rot, 0) or die('Could not rotate ' . $fname . ' to ' . $rot . ' degrees.');
        $tileSrc = $rotatedTile;
      }
    }

		$sw = imagesx($tileSrc); $sh = imagesy($tileSrc);
    imagecopyresampled($canvas, $tileSrc, $dx, $dy, 0, 0, $tw, $th, $sw, $sh);
    imagedestroy($tileSrc);
  }

  // Create top row if edges are in use
  if ($edges) {
    if ($corners) {
      $dest_x = 0;
      nextTile($dest_x, 0, 150, $topHeight);
    }
    for($x=0; $x<$width; $x++) {
      $dest_x = ($x*300) + ($edges ? 150 : 0);
      nextTile($dest_x, 0, 300, $topHeight);
    }
    if ($corners) {
      $dest_x = $width*300 + 150;
      nextTile($dest_x, 0, 150, $topHeight);
    }
  }
  // Create map body
  for($y=0; $y<$height; $y++) {
    $dest_y = ($y*300) + $topHeight;
    if ($edges) {
      $dest_x = 0;
      nextTile($dest_x, $dest_y, 150, 300);
    }
    for($x=0; $x<$width; $x++) {
      $dest_x = ($x*300) + ($edges ? 150 : 0);
      nextTile($dest_x, $dest_y, 300, 300);
    }
    if ($edges) {
      $dest_x = $width*300 + 150;
      nextTile($dest_x, $dest_y, 150, 300);
    }
  }
  // Create bottom row if edges are turned on
  if ($edges) {
    $dest_y = ($height * 300) + $topHeight;
    if ($corners) {
      $dest_x = 0;
      nextTile($dest_x, $dest_y, 150, $topHeight);
    }
    for($x=0; $x<$width; $x++) {
      $dest_x = ($x*300) + ($edges ? 150 : 0);
      nextTile($dest_x, $dest_y, 300, $topHeight);
    }
    if ($corners) {
      $dest_x = $width*300 + 150;
      nextTile($dest_x, $dest_y, 150, $topHeight);
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
