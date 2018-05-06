<div id="newnav">
	<a class="main" href="/"><h1>Dave's Mapper</h1></a>
	<a class="main" href="/blog">Blog</a>
	<div class="downcontainer">
		<a class="main" href="/supporters">About Us</a>
		<div class="downpanel"><?php
			if (!$dbestablished) {
				include "/home/dmillar/public_html/cgi-bin/db_start.php";
			}
			$navdata = mysql_query("SELECT url_slug, name FROM dmillar_cartography.artists ORDER BY name ASC");
			if (mysql_num_rows($navdata) > 0) {
				while ($nextguy = mysql_fetch_array($navdata)) {
					?><a href="/supporters/<?php echo $nextguy['url_slug']?>"><?php echo $nextguy['name']?></a><?php
				}
			}
		?></div>
	</div>
	<a class="main" href="/submit">Submit Tiles</a>
	<a class="main" href="/help">Help</a>
	<div class="downcontainer">
		<a class="main" href="mailto:dave@davesmapper.com">Contact</a>
		<div class="downpanel">
			<a href="https://facebook.com/davesmapper">Facebook</a>
			<a href="https://plus.google.com/107206980364478824224">Google +</a>
			<a href="https://twitter.com/davesmapper">Twitter</a>
		</div>
	</div>
</div>
