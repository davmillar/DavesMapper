<?php
  define('PATH', dirname(__FILE__));
  include PATH . "/cgi-bin/db_start.php";
?>
<!DOCTYPE html>
<html lang="en" itemscope itemtype="http://schema.org/WebPage">
  <head>
    <title>Supporters | Dave's Mapper | RPG Map Generator</title>
    <meta name="description" content="Information on the people supporting the Dave's Mapper web app for role-playing enthusiasts. Includes information on the tile artists and mapper contributors."/>
    <meta name="keywords" content="RPG,dungeons and dragons,DnD,D&amp;D,OSR,roleplaying,risus,dungeon master,game master,mapping,web app" />
    <?php include "includes/head.php"; ?>
  </head>
  <body class="single">
    <?php include "includes/magic.php"; ?>
    <section id="about">
      <h2>Contributors' Projects</h2>
        <section class="columns">
          <p>Many of the contributors to Dave's Mapper have other role-playing projects that can be of great use to game masters.</p>
          <h3><a href="https://www.patreon.com/dysonlogos">Dyson Logos on Patreon</a></h3>
            <p>The originator of the geomorph map movement, Dyson Logos, is using Patreon to keep his art flowing. Sponsoring him means a steady supply of new, high-quality maps will be available to GMs and DMs for years to come. If you've enjoyed his tiles here, please <a href="https://www.patreon.com/dysonlogos">pledge to Dyson Logos on Patreon</a> &#8212; you won't regret it.</p>
          <h3><a href="http://www.dungeonmorphs.com/">DungeonMorph Dice</a></h3>
            <p>The awesome concept and planning by Joe Wetzel of Inkwell Ideas turned into the <a href="http://www.dungeonmorphs.com/">DungeonMorph Dice</a> project. I'm glad to have been a part of it, and happy that the mapper played a small role in bringing together some of the contributors to his project. Check out the dice, cards, font, and other cool stuff Joe is making with map tiles over at <a href="http://www.dungeonmorphs.com/">DungeonMorphs.com</a>.</p>
        </section>
      <h2>Cartographers' Profiles</h2>
        <section class="columns"><ul>
        <?php
          $artistdata = $pdo->query("SELECT url_slug, name FROM artists ORDER BY name ASC");
          if ($artistdata->rowCount() > 0) {
            while ($thisartist = $artistdata->fetch(PDO::FETCH_ASSOC)) { ?>
              <li><a href="/supporters/<?php echo $thisartist['url_slug']?>"><?php echo $thisartist['name']?></a></li>
            <?php }
          }
          $artistdata->closeCursor();
        ?></ul></section>

      <h2>Other Contributors</h2>
        <section class="columns">
          <h3>Dan "Dante" Algstrand</h3>
            <p>A Swedish graphic designer into RPGs since 1982. He recently discovered a growing <em>faiblesse</em> for old school gaming and simply adoooores old style dungeon maps. Dan is assisting with some of the tile cleanup for new tiles being added to the mapper.</p>
          <h3>Paul MacDonald</h3>
            <p>Paul MacDonald has assisted with some of the tile cleanup for new tiles being added to the mapper.</p>
          <h3><a href="http://www.thefreerpgblog.com/">Rob Lang</a></h3>
            <p>The app's original functionality is based on the original Morph Mapper and Monkey Mapper written by <a href="http://www.thefreerpgblog.com/" target="_blank">Rob Lang</a>. Without Rob's work, none of this would have been possible.</p>
          <h3><a href="http://rocketpropelledgame.blogspot.com/2010/03/cubic-dungeon.html">Jarrah</a></h3>
            <p>Jarrah from Rock Propelled Game inspired the 3D cube layout option I added with <a href="http://rocketpropelledgame.blogspot.com/2010/03/cubic-dungeon.html">this blog post of a cubic dungeon</a>.
          <h3>Special thanks...</h3>
          <p>Special thanks to <a href="http://squarephoenix.com/">John Krull</a>, <a href="http://ch4productions.com/">Luke Schutt</a>, <a href="http://www.minube.com/">Jose Tamayo</a>, <a href="http://jquery.com">jQuery</a>, Jorik Tangelder (creator of <a href="http://eightmedia.github.com/hammer.js/">Hammer.js</a>), Jovanny Lemonad (creator of the <a href="http://www.google.com/webfonts/family?family=Philosopher&subset=latin">Philosopher</a> font), and everyone else who has supported the mapper or made something amazing that the mapper uses.</p>
        </section>
      <h2>History</h2>
        <p>Dave's Mapper started out as an improvement on the mappers made by <a href="http://www.thefreerpgblog.com/" target="_blank">Rob Lang</a>. When I noticed that wide maps broke across lines rather than being the proper size, I wrote a line or two of code that could fix it, as well as a few lines to randomly rotate tiles for an extra feature.</p>
        <p>Shortly thereafter, I came up with my own set of tiles and thought it would be fun to make my own mapper for my tiles; one that would fix some of the issues and add the features not present in Rob's mappers. I soon asked a few other tile artists if they would be interested in having their tiles featured, and off I went building this mapper you see here. The support from the community has been awesome and I can't thank everyone enough!</p>
      <h2>Donors</h2>
        <p>In early 2011, Dave's Mapper had a funding drive to get $200 for the costs of putting the mapper on a new domain and hosting plan. Thank you to all of the donors who helped reach the $200 goal and helped keep Dave's Mapper up and running for the next 3 years!</p>
        <p>If you would like to help support the mapper, please consider donations toward Dave's personal medical bills or a donation to the Crohn's and Colitis Foundation of America. Links for those are in the footer.</p>
      <hr />
      <h2>Tiles Contributed</h2>
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
          $tdata = $pdo->query("SELECT COUNT(id) AS total, tile_type, map_type FROM tiles GROUP BY map_type, tile_type");
          while ($td = $tdata->fetch(PDO::FETCH_ASSOC)) {
            $tabular[$td['map_type']][$td['tile_type']] = $td['total'];
          }
          $tdata->closeCursor();
        ?>
        <table>
          <tr>
            <th></th>
            <?php foreach ($tile_types as $tname=>$tid) { ?><th class="maim"><?php echo $tname; ?></th><?php } ?>
            <th>Map Type Total</th>
          </tr>
          <?php foreach ($map_styles as $mname=>$mid) { ?>
            <?php $rowtotal = 0; ?>
            <tr><th><?php echo $mname; ?></th>
              <?php
                foreach ($tile_types as $tname=>$tid) {
                  if (!isset($tabular[$mid][$tid])) {
                    $tabular[$mid][$tid] = 0;
                  }

                  ?><td><?php echo $tabular[$mid][$tid]; ?></td><?php
                  $rowtotal += $tabular[$mid][$tid];
                  $totals_by_type[$tid] += $tabular[$mid][$tid];
                }
              ?>
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
      <hr/>
      <?php include "includes/ad_468x60.php"; ?>
    </section>
    <?php include "includes/footer.php"; ?>
  </body>
</html>
<?php include PATH . "/cgi-bin/db_end.php"; ?>
