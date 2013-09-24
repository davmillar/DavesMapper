<? include "cgi-bin/db_start.php"; ?>
<!DOCTYPE html>
<html lang="en" itemscope itemtype="http://schema.org/WebPage">
	<head>
		<title>Supporters | Dave's Mapper | RPG Map Generator</title>
		<meta name="description" content="Information on the people supporting the Dave's Mapper web app for role-playing enthusiasts. Includes information on the tile artists and mapper contributors."/>
		<meta name="keywords" content="RPG,dungeons and dragons,DnD,D&D,OSR,roleplaying,risus,dungeon master,game master,mapping,web app" />
		<? include "includes/head.php"; ?>
		<script type="text/javascript" src="scripts/script_about.js"></script>
	</head>
	<body>
    <? include "includes/magic.php"; ?>
		<section id="tilepanel"><form>
			<h4>Quick Links</h4>
			<section class="collapse">
				<h5>Jump to a Section</h5>
				<p>
					<a class="widebuttonlite" href="#alltiles" title="A grand total of all tiles submitted and included in the mapper.">Tiles Contributed</a>
					<a class="widebuttonlite" href="#dice" title="A mapping project that many contributors to the mapper have worked on.">DungeonMorph Dice</a>
					<a class="widebuttonlite" href="#authors" title="All of the cartographers who have created and offered up their tiles for inclusion.">Cartographers</a>
					<a class="widebuttonlite" href="#otherguys" title="Coders, graphic editors, and others who have helped in this endeavor.">Other Contributors</a>
					<a class="widebuttonlite" href="#donors">Donors</a>
					<a class="widebuttonlite" href="#sandwiches">Sandwich Gallery</a>
				</p>
			</section>
		</form></section>
		<section id="viewport">
			<section id="about">
        <h2 id="history">History</h2>
          <p>Dave's Mapper started out as an improvement on the mappers made by <a href="http://www.thefreerpgblog.com/" target="_blank">Rob Lang</a>. When I noticed that wide maps broke across lines rather than being the proper size, I wrote a line or two of code that could fix it, as well as a few lines to randomly rotate tiles for an extra feature.</p>
          <p>Shortly thereafter, I came up with my own set of tiles and thought it would be fun to make my own mapper for my tiles; one that would fix some of the issues and add the features not present in Rob's mappers. I soon asked a few other tile artists if they would be interested in having their tiles featured, and off I went building this mapper you see here. The support from the community has been awesome and I can't thank everyone enough!</p>
				<h2 id="alltiles">Tiles Contributed</h2>
					<?
						$mtypes = Array('Dungeon'=>1,'Cavern'=>2,'Dun/Cav Mix'=>3,'City'=>4, 'Side View'=>6, 'SciFi Ship'=>7);
						$ttypes = Array('Full'=>1,'Edge'=>2,'Corner'=>3,'Top'=>4,'Top Corner'=>5,'Bottom'=>6,'Bottom Corner'=>7);
						$tabular = Array(1=>Array(),2=>Array(),3=>Array(),4=>Array(),5=>Array());
						$totals = Array();
						$tdata = mysql_query("SELECT COUNT(id) AS total, tile_type, map_type FROM tiles GROUP BY map_type, tile_type");
						while ($td = mysql_fetch_array($tdata)) {
							$tabular[$td['map_type']][$td['tile_type']] = $td['total'];
						}
					?>
					<table>
						<tr>
							<th></th>
							<? foreach ($ttypes as $tname=>$tid) { ?><th class="maim"><?=$tname?></th><? } ?>
							<th>Map Type Total</th>
						</tr>
						<? foreach ($mtypes as $mname=>$mid) { ?>
							<? $rowtotal = 0; ?>
							<tr><th><?=$mname?></th>
								<? foreach ($ttypes as $tname=>$tid) { ?>
									<td><?=($tabular[$mid][$tid]) ? $tabular[$mid][$tid] : 0?></td>
									<? $rowtotal += (($tabular[$mid][$tid]) ? $tabular[$mid][$tid] : 0);
										$totals[$tid] += (($tabular[$mid][$tid]) ? $tabular[$mid][$tid] : 0); ?>
								<? } ?>
								<td><strong><?=$rowtotal?></strong></td>
							</tr>
						<? } ?>
						<? $rowtotal = 0; ?>
						<tr><th>Tile Type Total</th>
							<? foreach ($totals as $tid=>$tsum) { ?>
								<td><strong><?=$tsum?></strong></td>
								<? $rowtotal += $tsum; ?>
							<? } ?>
							<td><strong><?=$rowtotal?></strong></td>
						</tr>
					</table>
				<h2 id="dice"><a href="http://www.dungeonmorphs.com/">DungeonMorph Dice</a></h2>
					<p>The awesome concept and planning by Joe Wetzel of Inkwell Ideas turned into the <a href="http://www.dungeonmorphs.com/">DungeonMorph Dice</a> project. I'm glad to have been a part of it, and happy that the mapper played a small role in bringing together some of the contributors to his project. Check out the dice, cards, font, and other cool stuff Joe is making with map tiles over at <a href="http://www.dungeonmorphs.com/">DungeonMorphs.com</a>.</p>
				<h2 id="authors">Cartographers' Profiles</h2>
					<section class="columns"><ul>
					<?
						$artistdata = mysql_query("SELECT url_slug, name FROM artists ORDER BY name ASC");
						if (mysql_num_rows($artistdata) > 0) {
							while ($thisartist = mysql_fetch_array($artistdata)) { ?>
								<li><a href="/supporters/<?=$thisartist['url_slug']?>"><?=$thisartist['name']?></a></li>
							<? }
						}
					?></ul></section>

				<h2 id="otherguys">Other Contributors</h2>
					<section class="columns">
						<h3>Dan "Dante" Algstrand</h3>
							<p>A Swedish graphic designer into RPGs since 1982. He recently discovered a growing <em>faiblesse</em> for old school gaming and simply adoooores old style dungeon maps. Dan is assisting with some of the tile cleanup for new tiles being added to the mapper.</p>
						<h3>Paul MacDonald</h3>
							<p>Paul MacDonald has assisted with some of the tile cleanup for new tiles being added to the mapper.</p>
						<h3><a href="http://www.thefreerpgblog.com/" target="_blank">Rob Lang</a></h3>
							<p>The app's original functionality is based on the original Morph Mapper and Monkey Mapper written by <a href="http://www.thefreerpgblog.com/" target="_blank">Rob Lang</a>. Without Rob's work, none of this would have been possible.</p>
						<h3><a href="http://rocketpropelledgame.blogspot.com/2010/03/cubic-dungeon.html">Jarrah</a></h3>
							<p>Jarrah from Rock Propelled Game inspired the 3D cube layout option I added with <a href="http://rocketpropelledgame.blogspot.com/2010/03/cubic-dungeon.html">this blog post of a cubic dungeon</a>.
						<h3>Special thanks...</h3>
						<p>Special thanks to <a href="http://squarephoenix.com/">John Krull</a>, <a href="http://ch4productions.com/">Luke Schutt</a>, <a href="http://www.minube.com/">Jose Tamayo</a>, <a href="http://jquery.com">jQuery</a>, Jorik Tangelder (creator of <a href="http://eightmedia.github.com/hammer.js/">Hammer.js</a>), Jovanny Lemonad (creator of the <a href="http://www.google.com/webfonts/family?family=Philosopher&subset=latin">Philosopher</a> font), and everyone else who has supported the mapper or made something amazing that the mapper uses.</p>
					</section>
				<h2 id="donors">Donors</h2>
					<p>In early 2011, Dave's Mapper had a funding drive to get $200 for the costs of putting the mapper on a new domain and hosting plan. Thank you to all of the donors who helped reach the $200 goal and helped keep Dave's Mapper up and running for the next 3 years!</p>
				<h2 id="sandwiches">Tasty Sandwiches</h2>
					<p>Lots of people help me keep going by donating so I can get a tasty sub sandwich. (I used to get burgers, but sub sandwiches are tastier and better for you.) Here's a gallery of the sandwiches I've enjoyed so far:</p>
					<section class="columns key">
						<section class="keyimg"><img src="images/burgers/1.png" alt="Burger 1" />
							<h3>Aaron M.</h3>
							<p>Slamburger from Denny's.</p></section>
						<section class="keyimg"><img src="images/burgers/2.png" alt="Burger 2" />
							<h3>Olivia B.</h3>
							<p>Double Stacker from Burger King.</p></section>
						<section class="keyimg"><img src="images/burgers/3.png" alt="Burger 3" />
							<h3>Christian S.</h3>
							<p>Double Stacker with extra bacon and onions added from Burger King.</p></section>
						<section class="keyimg"><img src="images/burgers/4.png" alt="Burger 4" />
							<h3>Greg L.</h3>
							<p>Baconator Double from Wendy's.</p></section>
						<section class="keyimg"><img src="images/burgers/5.png" alt="Burger 5" />
							<h3>Sigurd J.</h3>
							<p>Mushroom Swissburger from Checkers.</p></section>
						<section class="keyimg"><img src="images/burgers/6.png" alt="Burger 6" />
							<h3>James G.</h3>
							<p>Mushroom Swissburger from Checkers.</p></section>
						<section class="keyimg"><p>Uneaten burger donations from Daniel S. (x2), Ryan S., Aron S., and Aaron P.</p></section>
						<section class="keyimg"><img src="images/sandwiches/1.png" alt="Sub Sandwich 1" />
							<h3>Alexander B.</h3>
							<p>Veggie with Guacamole on Honey Wheat from Our Town Deli</p></section>
						<section class="keyimg"><p>Uneaten sandwich donations from R. Lang, T K Backman , Alan D., and Forrest H.</p></section>
					</section>
					<p>As of 2012, I'm no longer asking for sandwich donations. Instead, I'm asking for any amount you'd like to give toward my personal medical expenses and/or donations toward the Crohn's and Colitis Foundation of America. Links for those are in the footer.</p>
				<hr/>
				<? include "includes/ad_468x60.php"; ?>
			</section>
		</section>
		<? include "includes/footer.php"; ?>
	</body>
</html>
<? include "cgi-bin/db_end.php"; ?>
