var randInt = function (min, max) {
	return Math.floor(Math.random() * (max-min+1)) + min;
};

$(document).ready(function(){	
	// Make tile panel parts toggleable
	$("#tilepanel h4").click(function(event) { $(this).next().slideToggle("fast"); });
		
	// Clear notification bar
	$("#clearNoti").click(function(event) { $("#notification").slideUp("fast"); });
	
	// Smooth scrolling for # links
	$("a[href*=#]").click(function() {
		if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
			var $target = $(this.hash);
			$target = $target.length && $target || $('[name=' + this.hash.slice(1) +']');
			if ($target.length) {
				var targetOffset = $target.offset().top - 125;
				$('html,body').animate({scrollTop: targetOffset}, 1000);
				return false;
			}
		}
	});
		
	// Handle tables in profile pages
	$("#cartoloadanim, #cartoload").hide();
	$(".showme").click(function() {
		$("#cartoload").fadeOut("fast").html("");
		$("#cartoloadanim").fadeIn("fast");
		$me = $(this);
		cid = $me.data('carto');
		tid = $me.data('ttype');
		mid = $me.data('mtype');
		$.getJSON('/ajax/carto_tiles.php', { cart_id: cid, ttype: tid, mtype: mid }, function(data) {
			var items = [];

			$.each(data, function(key, val) {
				items.push('<img src="/tiles/' + val + '" data-id="' + key + '" />');
			});
			
			var showit = (items.length > 0) ? items.join('') : "No tiles of this type to display.";

			$("#cartoload").html(showit).fadeIn("fast");
			$("#cartoloadanim").fadeOut("fast");
		});
	});
	
	if ((/iphone|ipod|ipad/gi).test(navigator.platform) == false) {
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

var _gaq = _gaq || []; _gaq.push(['_setAccount', 'UA-5344894-8']); _gaq.push(['_trackPageview']);
(function() {
	var ga = document.createElement('script'); ga.type = 'text/javascript'; ga.async = true;
	ga.src = ('https:' == document.location.protocol ? 'https://ssl' : 'http://www') + '.google-analytics.com/ga.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(ga, s);
})();
(function() {
	var po = document.createElement('script'); po.type = 'text/javascript'; po.async = true;
	po.src = 'https://apis.google.com/js/plusone.js';
	var s = document.getElementsByTagName('script')[0]; s.parentNode.insertBefore(po, s);
})();