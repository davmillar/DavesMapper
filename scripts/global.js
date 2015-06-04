var $appmode = window.navigator.standalone,
		$mobilemode = ((/iphone|ipod|ipad|android/gi).test(window.navigator.platform)),
		randInt = function (min, max) {
			return ~~(Math.random() * (max-min+1)) + min;
		};

$(document)
	.on("click", "#tilepanel h4", function(event){
		$(this).next().slideToggle("fast");
	})
	.on("click", "#clearNoti", function(event){
		$("#notification").slideUp("fast");
	})
	.on("click", "a[href*=#]", function(event){
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var $target = $(this.hash);
			$target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
			if ($target.length) {
				$('html,body').animate({scrollTop: ($target.offset().top - 125)}, 1000);
				event.preventDefault();
			}
		}
	})
	.on("click", ".showme", function(){
		var $me = $(this),
				cid = $me.data('carto'),
				tid = $me.data('ttype'),
				mid = $me.data('mtype');

		$("#cartoload").fadeOut("fast").html("");
		$("#cartoloadanim").fadeIn("fast");
		$.getJSON('/ajax/carto_tiles.php', { cart_id: cid, ttype: tid, mtype: mid }, function(data) {
			var items = [],
					showit;

			$.each(data, function(key, val) {
				items.push('<img src="/tiles/' + val + '" data-id="' + key + '" />');
			});

			showit = (items.length > 0) ? items.join('') : "There are no tiles of this type to display.";

			$("#cartoload").html(showit).fadeIn("fast");
			$("#cartoloadanim").fadeOut("fast");
		});
	})
	.ready(function(){
		$("#cartoloadanim, #cartoload").hide();

		if ($mobilemode === false) {
			$('header a,header label,#imgMenu a,#imgMenu label,clearNoti,div.fieldset h4').not(".dropped").qtip({
				position: {
					my: 'top center',
					at: 'bottom center',
					viewport: $(window)
				},
				style: {
					tip: true,
					classes: 'ui-tooltip-dark ui-tooltip-rounded'
				}
			});

			$('#tilepanel a').qtip({
				position: {
					my: 'center left',
					at: 'center right',
					viewport: $(window)
				},
				style: {
					tip: true,
					classes: 'ui-tooltip-dark ui-tooltip-rounded'
				}
			});
		}
	});

(function(i,s,o,g,r,a,m){
	i.GoogleAnalyticsObject=r;
	i[r]=i[r]||function(){
		(i[r].q=i[r].q||[]).push(arguments);
	};
	i[r].l=1*new Date();
	a=s.createElement(o);
	m=s.getElementsByTagName(o)[0];
	a.async=1;
	a.src=g;
	m.parentNode.insertBefore(a,m);
})(window,document,'script','//www.google-analytics.com/analytics.js','ga');

ga('create', 'UA-5344894-8', 'davesmapper.com');
ga('send', 'pageview');

(function() {
	var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
	po.src = 'https://apis.google.com/js/plusone.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();