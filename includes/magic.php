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
  <div id="socialNavBar">
  	<div class="social">
  		<script src="https://connect.facebook.net/en_US/all.js#xfbml=1"></script>
  		<fb:like href="https://www.facebook.com/DavesMapper" layout="button_count" show_faces="false" width="90" font=""></fb:like>
  	</div>
  	<div class="social">
  		<g:plusone href="https://davesmapper.com" size="medium" expandTo="bottom"></g:plusone>
  	</div>
  	<div class="social">
  		<a href="https://twitter.com/share" class="twitter-share-button" data-url="https://davesmapper.com" data-via="davesmapper" data-lang="en">Tweet</a>
  		<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
  	</div>
  	<div class="social">
  		<script type="text/javascript" src="https://b.st-hatena.com/js/bookmark_button.js" charset="utf-8" async="async"></script>
  		<a href="https://b.hatena.ne.jp/entry/https://davesmapper.com" class="hatena-bookmark-button" data-hatena-bookmark-title="Dave's Mapper" data-hatena-bookmark-layout="standard-balloon" data-hatena-bookmark-lang="en" title="Bookmark Dave's Mapper on Hatena"><img src="https://b.st-hatena.com/images/entry-button/button-only@2x.png" alt="Bookmark Dave's Mapper on Hatena" width="20" height="20" style="border: none;" /></a>
  	</div>
  </div>
</div>
