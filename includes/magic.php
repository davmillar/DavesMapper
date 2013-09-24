<div id="newnav">
	<a class="main" href="/"><h1>Dave's Mapper</h1></a>
	<a class="main" href="/blog">Blog</a>
	<div class="downcontainer">
		<a class="main" href="/supporters">About Us</a>
		<div class="downpanel"><?
			if (!$dbestablished) {
				include "/home/dmillar/public_html/cgi-bin/db_start.php";
			}
			$navdata = mysql_query("SELECT url_slug, name FROM dmillar_cartography.artists ORDER BY name ASC");
			if (mysql_num_rows($navdata) > 0) {
				while ($nextguy = mysql_fetch_array($navdata)) {
					?><a href="/supporters/<?=$nextguy['url_slug']?>"><?=$nextguy['name']?></a><?
				}
			}
		?></div>
	</div>
	<a class="main" href="/submit">Submit Tiles</a>
	<a class="main" href="/submit#TileThursday">#TileThursday</a>
	<a class="main" href="/help">Help</a>
	<div class="downcontainer">
	<a class="main" href="mailto:dave@davesmapper.com">Contact</a>
		<div class="downpanel">
			<a href="http://facebook.com/davesmapper">Facebook</a>
			<a href="https://plus.google.com/107206980364478824224">Google +</a>
			<a href="http://twitter.com/davesmapper">Twitter</a>
		</div>
	</div>
	<div class="social">
		<script src="http://connect.facebook.net/en_US/all.js#xfbml=1"></script>
		<fb:like href="http://www.facebook.com/DavesMapper" layout="button_count" show_faces="false" width="90" font=""></fb:like>
	</div>
	<div class="social">
		<g:plusone href="http://davesmapper.com" size="medium" expandTo="bottom"></g:plusone>
	</div>
	<div class="social">
		<a href="https://twitter.com/share" class="twitter-share-button" data-url="http://davesmapper.com" data-via="davesmapper" data-lang="en">Tweet</a>
		<script>!function(d,s,id){var js,fjs=d.getElementsByTagName(s)[0];if(!d.getElementById(id)){js=d.createElement(s);js.id=id;js.src="https://platform.twitter.com/widgets.js";fjs.parentNode.insertBefore(js,fjs);}}(document,"script","twitter-wjs");</script>
	</div>
	<div class="social">
		<script type="text/javascript" src="http://b.st-hatena.com/js/bookmark_button.js" charset="utf-8" async="async"></script>
		<a href="http://b.hatena.ne.jp/entry/http://davesmapper.com" class="hatena-bookmark-button" data-hatena-bookmark-title="Dave's Mapper" data-hatena-bookmark-layout="standard-balloon" data-hatena-bookmark-lang="en" title="Bookmark Dave's Mapper on Hatena"><img src="http://b.st-hatena.com/images/entry-button/button-only@2x.png" alt="Bookmark Dave's Mapper on Hatena" width="20" height="20" style="border: none;" /></a>
	</div>
</div>