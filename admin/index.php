<?
	include "../cgi-bin/db_start.php";
	session_start();
	
	function bounceOut(){ header("Location: http://davesmapper.com/admin"); exit; }
	
	if ($_GET['action'] == 'log_me_out') {
		session_destroy();
		session_start();
		$_SESSION['message'] = "<p>Bye!</p>";
		bounceOut();
	}
	
	if ($_POST['action'] == 'log_me_in') {
		$myquery = mysql_query("SELECT * FROM artists WHERE email = '".mysql_real_escape_string($_POST['aemail'])."' AND password = '".sha1($_POST['aemail']."bacon".$_POST['apass'])."'");
		if (mysql_num_rows($myquery) > 0) {
			$mystuff = mysql_fetch_assoc($myquery);
			$_SESSION['liuser'] = $mystuff['id'];
			$_SESSION['liusername'] = $mystuff['name'];
			$_SESSION['liuseremail'] = $mystuff['email'];
			$_SESSION['message'] = "<p>Welcome back, ".$mystuff['name']."!</p>";
		} else {
			$_SESSION['message'] = "<p>No such user found.</p>";
		}
		bounceOut();
	}
	
	if ($_POST['action'] == "add_tile_full") {
		if ($_SESSION['liuser'] && $_SESSION['liuser']>0) {
			if ($_FILES['tileImg']) {
				$upDirectory = dirname(__FILE__) . '/../tiles/';
				$upFilename = str_replace(" ","_","uploads/" . time() . $_FILES['tileImg']['name']);
				move_uploaded_file($_FILES['tileImg']['tmp_name'], $upDirectory.$upFilename);
				
				$hexit = (isset($_POST['hasexit']) && $_POST['hasexit'] == "1") ? 1 : 0;
				mysql_query("INSERT INTO tiles (image, tile_type, map_type, artist_id, has_exit, approved)
										 VALUES ('".mysql_real_escape_string($upFilename)."', ".intval($_POST['ttype']).", ".intval($_POST['mtype']).", ".intval($_POST['artist']).", ".$hexit.",1)");
				$result = mysql_insert_id();
				$_SESSION['artist'] = intval($_POST['artist']);
				if ($result) {
					$_SESSION['message'] = "<p>Tile successfully added to the site.</p><br/>
						<img src='/tiles/".$upFilename."' alt='Tile Preview' style='width:100px;' />";
				} else {
					$_SESSION['message'] = "<p>An error occurred while adding to the database.</p>";
				}
			} else {
				$_SESSION['message'] = "<p>No file went through.</p>";
			}
		} else {
			$_SESSION['message'] = "<p>You've got to be logged in to do that.</p>";
		}
		bounceOut();
	}
	
	if ($_POST['action'] == "change_it") {
		if ($_SESSION['liuser'] && $_SESSION['liuser']>0) {
			if ($_POST['apass'] == $_POST['apass2']) {
				mysql_query("UPDATE artists SET password = '".sha1($_SESSION['liuseremail']."bacon".$_POST['apass'])."' WHERE id = '".$_SESSION['liuser']."'");
				$_SESSION['message'] = "<p>All set!</p>";
			} else {
				$_SESSION['message'] = "<p>Those gotta be the same.</p>";
			}
		} else {
			$_SESSION['message'] = "<p>You've got to be logged in to do that.</p>";
		}
		bounceOut();
	}
	if ($_POST['action'] == "add_carto") {
		mysql_query("INSERT INTO artists (name, url_slug, initials, icon, url, bio, email)
								 VALUES ('".mysql_real_escape_string($_POST['aname'])."', '".mysql_real_escape_string($_POST['aurlslug'])."', '".mysql_real_escape_string($_POST['ainit'])."', '".mysql_real_escape_string($_POST['aicon'])."', '".mysql_real_escape_string($_POST['alink'])."', '".mysql_real_escape_string($_POST['abio'])."', '".mysql_real_escape_string($_POST['aemail'])."')");
		$result = mysql_insert_id();
		if ($result) {
			$_SESSION['message'] = "<p>" .  $_POST['aname'] . " added to list of users.</p>";
		} else {
			$_SESSION['message'] = "<p>An error occurred while adding ".$_POST['aname']." to the database.</p>";
		}
		bounceOut();
	}
?>
<!DOCTYPE html>
<html lang="en" itemscope itemtype="http://schema.org/WebPage">
  <head>
    <title>Admin Area | Dave's Mapper | RPG Map Generator</title>
    <meta name="robots" content="noindex,nofollow" />
    <? include "/home/dmillar/public_html/includes/head.php"; ?>
  </head>
  <body>
    <? include "/home/dmillar/public_html/includes/magic.php"; ?>
    <section id="sidepanel">
		
		</section>
    <section id="viewport">
      <section id="about">
        <h1>Cartographer Tools</h1>
        <?
					if ($_SESSION['message']) {
						echo $_SESSION['message'];
						?><hr /><?
						unset($_SESSION['message']);
					}
					if ($_SESSION['liuser'] && $_SESSION['liuser']>0) {
						$tileprefix = "";
						if ($_POST['action'] == "add_tile_m") {
							?><h2>Results</h2><?
							$hexit = (isset($_POST['hasexit_m']) && $_POST['hasexit_m'] == "1") ? 1 : 0;
							$imagebit = mysql_real_escape_string($_POST['imagefn_m']);
							$r_start = intval($_POST['start_m']);
							$r_end = intval($_POST['end_m']);
							$deci = intval($_POST['deci_m']);
							for ($i = $r_start; $i <= $r_end; $i++) {
								$full_name = str_replace("#",str_pad("".$i, $deci, "0", STR_PAD_LEFT),$imagebit);
								mysql_query("INSERT INTO tiles (image, tile_type, map_type, artist_id, has_exit, approved)
														 VALUES ('".$full_name."', ".intval($_POST['ttype_m']).", ".intval($_POST['mtype_m']).", ".intval($_POST['artist_m']).", ".$hexit.", 1)");
								$result = mysql_insert_id();
								if ($result) {
									?><img src="/tiles/<?=$full_name?>" alt="Tile Preview" style="width:100px;" /><?
								}
							}
							$tileprefix = substr($_POST['imagefn_m'],0,strrpos($_POST['imagefn_m'],"/",-1)+1);
							?><hr/><?
						}
						
						if (isset($_POST['artist'])) {
							$currentartistid = intval($_POST['artist']);
						} else if (isset($_POST['artist_m'])) {
							$currentartistid = intval($_POST['artist_m']);
						} else if ($_POST['action'] == "add_carto") {
							$currentartistid = intval($result);
						} else if ($_SESSION['artist']) {
							$currentartistid = $_SESSION['artist'];
						} else {
							$currentartistid = 0;
						}
						
						if (isset($_POST['mtype'])) { 
							$mmtype = $_POST['mtype'];
						} else if (isset($_POST['mtype_m'])) {
							$mmtype = $_POST['mtype_m'];
						} else {
							$mmtype = 1;
						}
						
						if ($_POST['ttype']) { 
							$tttype = $_POST['ttype'];
						} else if ($_POST['ttype_m']) {
							$tttype = $_POST['ttype_m'];
						} else {
							$tttype = 1;
						}
						
						?><h2>Fully Upload Tile</h2>
							<form method="post" action="/admin/" class="admin" enctype="multipart/form-data">
								<div class="fieldset">
									<h4 class="legend">Image Upload</h4>
									<input type="file" name="tileImg" id="tileImg" /><br/>
										<label for="tileImg" class="labelTxt tBox">Image Path</label>
								</div>
								<? if ($_SESSION['liuser'] == 17) { ?>
									<div class="fieldset">
										<h4 class="legend">Tile Artist</h4>
										<select name="artist" id="artist"><?
											$artistdata = mysql_query("SELECT name, id FROM artists ORDER BY name ASC");
											if (mysql_num_rows($artistdata) > 0) {
												while ($thisartist = mysql_fetch_array($artistdata)) { ?>
													<option value="<?=$thisartist['id']?>" <?=(($currentartistid == intval($thisartist['id'])) ? 'selected' : '')?>><?=$thisartist['name']?></option>
												<? }
											}
										?></select><br/>
											<label for="artist" class="labelTxt">Artist</label>
									</div>
								<? } else { ?>
									<input type="hidden" name="artist" value="<?=$_SESSION['liuser']?>" />
								<? } ?>
								<div class="fieldset">
									<h4 class="legend">Tile Data</h4>
									<select name="mtype" id="mtype">
										<option value="1" <?=(($mmtype == 1) ? 'selected' : '')?>>Dungeon</option>
										<option value="2" <?=(($mmtype == 2) ? 'selected' : '')?>>Cavern</option>
										<option value="3" <?=(($mmtype == 3) ? 'selected' : '')?>>Dun/Cav Mix</option>
										<option value="4" <?=(($mmtype == 4) ? 'selected' : '')?>>City</option>
										<option value="5" <?=(($mmtype == 5) ? 'selected' : '')?>>Village</option>
										<option value="7" <?=(($mmtype == 7) ? 'selected' : '')?>>SciFi Ship</option>
										<option value="6" <?=(($mmtype == 6) ? 'selected' : '')?>>Side-View Dun/Cav</option>
									</select>
									<select name="ttype" id="ttype">
										<optgroup label="Regular" id="nmbits">
											<option value="1" <?=(($tttype == 1) ? 'selected' : '')?>>Tile (300x300px)</option>
											<option value="2" <?=(($tttype == 2) ? 'selected' : '')?>>Edge (300x150px)</option>
											<option value="3" <?=(($tttype == 3) ? 'selected' : '')?>>Corner (150x150px)</option>
										</optgroup>
										<optgroup label="Side View" id="svbits" style="display:none;">
											<option value="4" <?=(($tttype == 4) ? 'selected' : '')?>>Top (300x300px)</option>
											<option value="5" <?=(($tttype == 5) ? 'selected' : '')?>>Top Corner (150x300px)</option>
											<option value="1" <?=(($tttype == 1) ? 'selected' : '')?>>Tile (300x300px)</option>
											<option value="2" <?=(($tttype == 2) ? 'selected' : '')?>>Edge (150x300px)</option>
											<option value="6" <?=(($tttype == 6) ? 'selected' : '')?>>Bottom (300x300px)</option>
											<option value="7" <?=(($tttype == 7) ? 'selected' : '')?>>Bottom Corner (150x300px)</option>
										</optgroup>
									</select><br/>
										<label for="mtype" class="labelTxt">Map Type</label>
										<label for="ttype" class="labelTxt">Tile Type</label>
								</div>
								<div class="fieldset">
									<h4 class="legend">Exit?</h4>
									<input type="checkbox" class="btnChk" name="hasexit" value="1" id="hasexit" />
										<label for="hasexit">Has Exit</label>
								</div>
								<div class="fieldset">
									<h4 class="legend">Finish!</h4>
									<input type="hidden" name="action" value="add_tile_full" />      
									<input type="submit" value="Add Tile" />
								</div>
							</form>
							<section id="nminfo">
								<img src="/images/nminfo1.png" style="height:300px;" />
							</section>
							<section id="svinfo" style="display:none;">
								<img src="/images/svinfo1.png" style="height:300px;" />
								<img src="/images/svinfo2.png" style="height:300px;" />
								<img src="/images/svinfo3.png" style="height:300px;" />
							</section><?
						if ($_SESSION['liuser'] == 17) {
							?><h2>Add Tile Range to DB</h2>
							<form method="post" action="/admin/" class="admin">
								<div class="fieldset">
									<h4 class="legend">Image Path</h4>
									<input type="text" name="imagefn_m" id="imagefn_m" autocomplete="off" value="<?=$tileprefix?>" />
									<input type="number" name="start_m" id="start_m" autocomplete="off" />
									<input type="number" name="end_m" id="end_m" autocomplete="off" />
									<input type="number" name="deci_m" id="deci_m" autocomplete="off" /><br/>
										<label for="imagefn_m" class="labelTxt tBox">Image Path</label>
										<label for="start_m" class="labelTxt nBox">Start</label>
										<label for="end_m" class="labelTxt nBox">End</label>
										<label for="deci_m" class="labelTxt nBox">Places</label>
								</div>
								<? if ($_SESSION['liuser'] == 17) { ?>
									<div class="fieldset">
										<h4 class="legend">Tile Artist</h4>
										<select name="artist_m" id="artist_m"><?
											$artistdata = mysql_query("SELECT name, id FROM artists ORDER BY name ASC");
											if (mysql_num_rows($artistdata) > 0) {
												while ($thisartist = mysql_fetch_array($artistdata)) { ?>
													<option value="<?=$thisartist['id']?>" <?=(($currentartistid == intval($thisartist['id'])) ? 'selected' : '')?>><?=$thisartist['name']?></option>
												<? }
											}
										?></select><br/>
											<label for="artist_m" class="labelTxt">Artist</label>
									</div>
								<? } else { ?>
									<input type="hidden" name="artist_m" value="<?=$_SESSION['liuser']?>" />
								<? } ?>
								<div class="fieldset">
									<h4 class="legend">Tile Data</h4>
									<select name="mtype_m" id="mtype_m">
										<option value="1" <?=(($mmtype == 1) ? 'selected' : '')?>>Dungeon</option>
										<option value="2" <?=(($mmtype == 2) ? 'selected' : '')?>>Cavern</option>
										<option value="3" <?=(($mmtype == 3) ? 'selected' : '')?>>Dun/Cav Mix</option>
										<option value="4" <?=(($mmtype == 4) ? 'selected' : '')?>>City</option>
										<option value="5" <?=(($mmtype == 5) ? 'selected' : '')?>>Village</option>
										<option value="7" <?=(($mmtype == 7) ? 'selected' : '')?>>SciFi Ship</option>
										<option value="6" <?=(($mmtype == 6) ? 'selected' : '')?>>Side-View Dun/Cav</option>
									</select>
									<select name="ttype_m" id="ttype_m">
										<optgroup label="All">
											<option value="1" <?=(($tttype == 1) ? 'selected' : '')?>>Tile (300x300px)</option>
											<option value="2" <?=(($tttype == 2) ? 'selected' : '')?>>Edge (300x150px)</option>
											<option value="3" <?=(($tttype == 3) ? 'selected' : '')?>>Corner (150x150px)</option>
										</optgroup>
										<optgroup label="Side View">
											<option value="4" <?=(($tttype == 4) ? 'selected' : '')?>>Top (300x300px)</option>
											<option value="5" <?=(($tttype == 5) ? 'selected' : '')?>>Top Corner (300x150px)</option>
											<option value="6" <?=(($tttype == 6) ? 'selected' : '')?>>Bottom (300x300px)</option>
											<option value="7" <?=(($tttype == 7) ? 'selected' : '')?>>Bottom Corner (300x150px)</option>
										</optgroup>
									</select><br/>
										<label for="mtype_m" class="labelTxt">Map Type</label>
										<label for="ttype_m" class="labelTxt">Tile Type</label>
								</div>
								<div class="fieldset">
									<h4 class="legend">Exit?</h4>
									<input type="checkbox" class="btnChk" name="hasexit_m" value="1" id="hasexit_m" />
										<label for="hasexit_m">Has Exit</label>
								</div>
								<div class="fieldset">
									<h4 class="legend">Finish!</h4>
									<input type="hidden" name="action" value="add_tile_m" />      
									<input type="submit" value="Add Tile Series" />
								</div>
							</form>
							<h2>Add New Cartographer</h2>
								<form method="post" action="/admin/" class="admin">
									<div class="fieldset">
										<h4 class="legend">Name</h4>
										<input type="text" name="aname" id="aname" autocomplete="off" />
										<input type="text" name="aurlslug" id="aurlslug" autocomplete="off" />
										<input type="text" name="ainit" id="ainit" class="little" autocomplete="off" /><br/>
											<label for="aname" class="labelTxt tBox">Name</label>
											<label for="aurlslug" class="labelTxt tBox">URL Slug</label>
											<label for="ainit" class="labelTxt nBox">Initials</label>
									</div>
									<div class="fieldset">
										<h4 class="legend">Info</h4>
										<input type="text" name="alink" id="alink" autocomplete="off" />
										<input type="text" name="aemail" id="aemail" autocomplete="off" />
										<input type="text" name="aicon" id="aicon" class="little" autocomplete="off" /><br/>
											<label for="alink" class="labelTxt tBox">Link URL</label>
											<label for="aemail" class="labelTxt tBox">Email</label>
											<label for="aicon" class="labelTxt nBox">.png</label>
									</div>
									<div class="fieldset">
										<h4 class="legend">Bio</h4>
										<textarea name="abio" id="abio" style="width:300px;"></textarea>
									</div>
									<div class="fieldset">
										<h4 class="legend">Finish!</h4>
										<input type="hidden" name="action" value="add_carto" />      
										<input type="submit" value="Add Cartographer" />
									</div>
								</form><?
						}
						?><h2>Change Password</h2>
							<form method="post" action="/admin/" class="admin">
								<div class="fieldset">
									<h4 class="legend">Type it Below</h4>
									<input type="password" name="apass" id="apass" />
									<input type="password" name="apass2" id="apass2" /><br/>
										<label for="apass" class="labelTxt tBox">Password</label>
										<label for="apass2" class="labelTxt tBox">Again!</label>
								</div>
								<div class="fieldset">
									<h4 class="legend">Finish!</h4>
									<input type="hidden" name="action" value="change_it" />      
									<input type="submit" value="Change it!" />
								</div>
							</form>
							
							<a href="/admin/?action=log_me_out" class="widebuttonlite">Log Out</a><?
					} else {
						?><h2>Cartographer Login</h2>
							<form method="post" action="/admin/" class="admin">
								<div class="fieldset">
									<h4 class="legend">Email</h4>
									<input type="email" name="aemail" id="aemail" />
									<input type="password" name="apass" id="apass" /><br/>
										<label for="aemail" class="labelTxt tBox">Email</label>
										<label for="apass" class="labelTxt tBox">Password</label>
								</div>
								<div class="fieldset">
									<h4 class="legend">Finish!</h4>
									<input type="hidden" name="action" value="log_me_in" />      
									<input type="submit" value="Log Me In" />
								</div>
							</form><?
					}
				?>
			</section>
    </section>
		<script>
			$(document).on("change", "#mtype", function () {
				if (parseInt($(this).val(), 10) === 6) {
					$("#svbits,#svinfo").show();
					$("#nmbits,#nminfo").hide();
				} else {
					$("#svbits,#svinfo").hide();
					$("#nmbits,#nminfo").show();
				}
			});
		</script>
  </body>
</html>
<? include "../cgi-bin/db_end.php"; ?>
