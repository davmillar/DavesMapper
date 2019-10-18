<?php
  define('PATH', dirname(__FILE__));

  include PATH . "/cgi-bin/db_start.php";

  $iPod = stripos($_SERVER['HTTP_USER_AGENT'],"iPod");
  $iPhone = stripos($_SERVER['HTTP_USER_AGENT'],"iPhone");
  $iPad = stripos($_SERVER['HTTP_USER_AGENT'],"iPad");
  $Android= stripos($_SERVER['HTTP_USER_AGENT'],"Android");
  $webOS= stripos($_SERVER['HTTP_USER_AGENT'],"webOS");
?>
<!DOCTYPE html>
<html lang="en" itemscope itemtype="http://schema.org/WebPage">
  <head>
    <title>Dave's Mapper</title>
    <meta name="description" content="Geomorphic map generator web app for role-playing enthusiasts. Created by web designer and puzzle author David Millar.">
    <meta name="keywords" content="RPG,dungeons and dragons,DnD,D&amp;D,OSR,roleplaying,risus,dungeon master,game master,mapping,web app">
    <meta name="wot-verification" content="fb53c891a20198877c5e">
    <?php include "includes/head.php"; ?>
    <script src="scripts/hammer.min.js"></script>
    <script src="scripts/jquery.hammer.js"></script>
    <script src="assets/js/compiled_app.js?t=<?php echo filemtime("assets/js/compiled_app.js")?>"></script>
  </head>
  <body>
    <?php include "includes/magic.php"; ?>
    <div class="fieldset" id="actionButtons">
      <h4 class="legend" title="Commands to perform.">Options</h4>
      <a class="button" id="mapTypeMenuBtn" title="Change Map Type"><em class="sprite sprite-map-options"></em> Map</a>
      <a class="button" id="newBtn" title="Generate a New Map [n]"><em class="sprite spPNG"></em> New</a>
      <a class="button" id="newWindowB" title="Export to PNG"><em class="sprite spPNG"></em> Export</a>
    </div>
    <div class="fieldset" id="mapModeControls">
      <h4 class="legend" title="Choose between a classic style map, a staggered map, or a closed map.">Map Structure</h4>
      <div class="dropradio" id="mapModeDrop"><div>
        <input type="radio" class="btnDrp first" name="mode" value="0" id="normal">
          <label for="normal"><em class="sprite spOrig"></em> Open-Edge</label>
        <input type="radio" class="btnDrp" name="mode" value="1" id="stagger">
          <label for="stagger"><em class="sprite spStag"></em> Staggered</label>
        <input type="radio" class="btnDrp" name="mode" value="3" id="stagcap">
          <label for="stagcap"><em class="sprite spStagCap"></em> Staggered (Capped)</label>
        <input type="radio" class="btnDrp" name="mode" value="2" id="endBtn" checked>
          <label for="endBtn"><em class="sprite spFull"></em> Closed-Edge</label>
        <input type="radio" class="btnDrp last" name="mode" value="4" id="cubeBtn">
          <label for="cubeBtn"><em class="sprite spCube"></em> Cube</label>
      </div></div>
    </div>
    <div class="fieldset" id="mapSizeControls">
      <h4 class="legend" title="Choose your map's height and width.">Map Size</h4>
      <input type="number" min="1" max="25" id="width" required>
      <input type="number" min="1" max="25" id="height" required><br>
      <label for="width" class="labelTxt" title="Map size in tiles wide.">Width</label>
      <label for="height" class="labelTxt" title="Map size in tiles tall.">Height</label>
    </div>
    <div class="fieldset" id="mapViewControls">
      <h4 class="legend" title="Viewing options. Toggle through grid overlays with [g].">View Options</h4>
      <input type="radio" class="btnGrp first" name="grid" value="0" id="nogrid" checked>
        <label for="nogrid" title="Don't Use a Grid"><em class="sprite spX">No Grid</em></label>
      <input type="radio" class="btnGrp" name="grid" value="1" id="grid5">
        <label for="grid5" title="Use 5-foot Grid"><em class="sprite spGrid5">5-foot Grid</em></label>
      <input type="radio" class="btnGrp" name="grid" value="2" id="grid10">
        <label for="grid10" title="Use 10-foot Grid"><em class="sprite spGrid10">10-foot Grid</em></label>
      <input type="radio" class="btnGrp last" name="grid" value="3" id="gridhex">
        <label for="gridhex" title="Use Hex Grid"><em class="sprite spHex">Hex Grid</em></label>
    </div>
    <section id="notification"><span></span> <a id="clearNotificationButton" title="Clear this notification.">OK</a></section>
    <section id="popup"><div></div></section>
    <section id="sideBar"><form>
      <section id="mapTypeSelector">
        <a class="panelItem" href="/dungeon"><em class="sprite sprite-maptype-dungeon"></em> Dungeons</a>
        <a class="panelItem" href="/cavern"><em class="sprite sprite-maptype-cavern"></em> Caverns</a>
        <a class="panelItem" href="/"><em class="sprite sprite-maptype-hybrid"></em> Dungeons &amp; Caverns</a>
        <a class="panelItem" href="/side"><em class="sprite sprite-maptype-sideview"></em> Side-View Dungeon</a>
        <a class="panelItem" href="/village"><em class="sprite sprite-maptype-village"></em> Village</a>
        <a class="panelItem" href="/city"><em class="sprite sprite-maptype-city"></em> City</a>
        <a class="panelItem" href="/boardwalk"><em class="sprite sprite-maptype-boardwalk"></em> Boardwalk</a>
        <a class="panelItem" href="/scifi-ship"><em class="sprite sprite-maptype-spaceship"></em> Sci-Fi Ship</a>
        <a class="panelItem" href="/scifi-city"><em class="sprite sprite-maptype-spacecity"></em> Sci-Fi City</a>
      </section>
      <section id="artistsblock">
      </section>
    </form></section>
    <section id="viewport">
      <section id="map">
        <div id="selectionEdit">
          <input type="button" class="btnGrp first" name="rotateTile" value="Rotate" id="rotateTile" checked>
            <label for="rotateTile" title="Rotate Tile 90 Degrees" id="rotateBtn"><em class="sprite spRot">Rotate</em></label>
          <input type="button" class="btnGrp" name="swapTileBtn" value="Swap" id="swapTileBtn">
            <label for="swapTileBtn" title="Swap Tile with Another"><em class="sprite spSwap">Swap</em></label>
          <input type="button" class="btnGrp" name="mancrush" value="Admire" id="mancrush">
            <label for="mancrush" title="Build a Map by this Artist"><em class="sprite spCrush">Mancrush</em></label>
          <input type="button" class="btnGrp" name="removeTile" value="Remove" id="removeTile">
            <label for="removeTile" title="Remove Tile and Replace"><em class="sprite spX">Replace Tile</em></label>
          <input type="button" class="btnGrp last" name="removeTileExit" value="Remove with Exit" id="removeTileExit">
            <label for="removeTileExit" title="Remove Tile and Replace with Entrance/Exit"><em class="sprite spExit">Replace Tile with Exit</em></label>
        </div>
        <canvas id="drawingboard"></canvas>
        <div id="grid"></div>
        <div id="tiles"></div>
      </section>
    </section>
    <?php include "includes/footer.php"; ?>
    <script src="assets/js/keyboard.js?t=<?php echo filemtime("assets/js/keyboard.js")?>"></script>
  </body>
</html>

<?php include PATH . "/cgi-bin/db_end.php"; ?>
