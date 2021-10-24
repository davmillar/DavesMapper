<?php
  if(!defined('PATH')) {
    define('PATH', dirname(__FILE__));
  }
  include PATH . "/cgi-bin/db_start.php";
?>
<!DOCTYPE html>
<html lang="en" itemscope itemtype="http://schema.org/WebPage">
  <head>
    <title>Contribute | Dave's Mapper | RPG Map Generator</title>
    <meta name="description" content="Information on how to contribute to the mapper, including tile contribution specs."/>
    <meta name="keywords" content="RPG,dungeons and dragons,DnD,D&D,OSR,roleplaying,risus,dungeon master,game master,mapping,web app" />
    <?php include "includes/head.php"; ?>
  </head>
  <body class="single">
    <?php include "includes/magic.php"; ?>
    <section id="about">
      <h2 id="contrib">How to Contribute</h2>
        <section class="columns">
          <p>Want me to add your tiles? We'd be happy to have them! To make it as easy as possible for Dave to add them, try to keep to the following guidelines:</p>
          <h3>Proper Sizing</h3>
            <ul>
              <li><strong>300x300px:</strong> All Base tiles, Side-View Tops and Bottoms</li>
              <li><strong>150x300px:</strong> Side-View Edges, Top- and Bottom-Corners, oriented portrait with horizontal exits pointing to the right</li>
              <li><strong>300x150px:</strong> Standard Edges &#8212; oriented landscape with exits on the sides and down</li>
              <li><strong>150x150px:</strong> Standard Corners (with exits on the right side and bottom)</li>
            </ul>
          <h3>A Readable Format</h3>
            <p>GIF, PNG, or JPEG are preferred. (If you can compress them, all the better.)<p>
          <h3>Proper Exits</h3>
            <p>Every set of tiles has the same pattern along the edges so they match up when placed in the mapper. Basically, for every 5 grid squares, the middle square is part of a path, door, exit, etc. See below:</p>
          <section class="keyimg"><img src="images/tileex.png" alt="Edge Example" />
            <h3>Example Tile Edge.</h3></section>
            <p>For side-view tops and top corners, ground level should be directly between grid squares 5 and 6 on the right and left edges of the tiles in order to  match up.</p>
          <h3>Borderless</h3>
            <p>If at all possible, create your tiles with extra hashing or fill past the tile boundary, then crop it to the appropriate size. This ensures that the hashing looks a bit more seamless when maps are generated.</p>
          <h3>Send 'em in!</h3>
            <p>Not sure if you can do all that? No worries &#8212; get as close as you can and Dave and his crew will help you from there.</p>
            <p>Send your tiles to <a href="mailto:dave@davesmapper.com">dave@davesmapper.com</a> along with your desired display name, initials, a short bio, your blog or site's link, and a description of the tiles you're sending.</p>
            <p>If you have graphical skills and want to help format others' tiles, send Dave an email as well.</p>
          <h3>Templates</h3>
            <ul>
              <li><a href="/assets/pdf/template_full.pdf">Full Tile Template</a> and <a href="/assets/pdf/template_edge.pdf">Edge and Corner Tile Template</a> by Kevin Campbell.</li>
              <li><a href="/templates/mapTile_templates.pdf">Basic Template</a> by Marc Gelp&iacute; Mateu, who has graciously released the template under <a href="http://creativecommons.org/licenses/by-nc-sa/3.0/">Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License</a>.</li>
            </ul>
        </section>
      <hr/>
      <?php include "includes/ad_468x60.php"; ?>
    </section>
    <?php include "includes/footer.php"; ?>
  </body>
</html>
<?php include PATH . "/cgi-bin/db_end.php"; ?>
