<div id="newnav">
  <a class="main" href="/"><h1>Dave's Mapper</h1></a>
  <a class="main" href="https://blog.davesmapper.com">Blog</a>
  <div class="downcontainer">
    <a class="main" href="/supporters">About Us</a>
    <div class="downpanel"><?php
      if(!defined('PATH')) {
        define('PATH', dirname(dirname(__FILE__)));
      }

      include PATH . "/cgi-bin/db_start.php";

      $navdata = $pdo->query("SELECT url_slug, name FROM dmillar_cartography.artists ORDER BY name ASC");
      if ($navdata->rowCount() > 0) {
        while ($nextguy = $navdata->fetch(PDO::FETCH_ASSOC)) {
          ?><a href="/supporters/<?php echo $nextguy['url_slug']?>"><?php echo $nextguy['name']?></a><?php
        }
      }
      $navdata->closeCursor();
    ?></div>
  </div>
  <a class="main" href="/submit">Submit Tiles</a>
  <a class="main" href="/help">Help</a>
  <div class="downcontainer">
    <a class="main" href="mailto:dave@davesmapper.com">Contact</a>
    <div class="downpanel">
      <a href="https://facebook.com/davesmapper">Facebook</a>
      <a href="https://twitter.com/davesmapper">Twitter</a>
    </div>
  </div>
</div>
