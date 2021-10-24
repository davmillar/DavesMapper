<?php
  if(!defined('PATH')) {
    define('PATH', dirname(dirname(__FILE__) ));
  }

  include PATH . "/cgi-bin/db_start.php";

  $map_type = intval($_REQUEST['map_kind']);
    $map_type = ($map_type > 0) ? $map_type : 1;
    $map_type_phrase = ($map_type == 3) ? "IN (1,2,3)" : "= ".$map_type;

  $data = $pdo->query("SELECT * FROM artists a LEFT JOIN
    (SELECT COUNT(id) AS tiles, artist_id FROM tiles
     WHERE map_type ".$map_type_phrase." AND approved = 1 GROUP BY artist_id) t
    ON a.id = t.artist_id ORDER BY a.name");

  $authorData = Array();

  if ($data->rowCount() > 0) {
    while ($author = $data->fetch(PDO::FETCH_ASSOC)) {
      if (($author['tiles']) > 0) {
        $authorData[] = $author;
      }
    }
  }
  $data->closeCursor();
  echo json_encode($authorData);

  include PATH . "/cgi-bin/db_end.php";
?>
