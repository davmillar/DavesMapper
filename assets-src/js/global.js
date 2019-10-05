var $appmode = window.navigator.standalone,
    $mobilemode = ((/iphone|ipod|ipad|android/gi).test(window.navigator.platform)),

    randInt = function (min, max) {
      return ~~(Math.random() * (max-min+1)) + min;
    },

    _trackInstalling = function (worker) {
      worker.addEventListener('statechange', function() {
        if (worker.state == 'installed') {
          _updateReady(worker);
        }
      });
    },

    _updateReady = function (worker) {
      var promptResponse = confirm('Dave\'s Mapper has an update available. Want to reload the app?');

      if (promptResponse) {
        console.log('New ServiceWorker skipping waiting.');
        worker.postMessage({action: 'skipWaiting'});
      }
    },

    _installServiceWorker = function () {
      window.addEventListener('load', function() {
        navigator.serviceWorker.register('/sw.js').then(function(registration) {
          console.log('ServiceWorker registration successful with scope: ', registration.scope);
          if (!navigator.serviceWorker.controller) {
            return;
          }

          if (registration.waiting) {
            _updateReady(registration.waiting);
            return;
          }

          if (registration.installing) {
            _trackInstalling(registration.installing);
            return;
          }

          registration.addEventListener('updatefound', function() {
            _trackInstalling(registration.installing);
          });
        })['catch'](function(err) {
          console.log('ServiceWorker registration failed: ', err);
        });

        var refreshing;

        navigator.serviceWorker.addEventListener('controllerchange', function() {
          if (refreshing) return;
          window.location.reload();
          refreshing = true;
        });
      });
    };

if ('serviceWorker' in navigator) {
  _installServiceWorker();
}

$(document)
  .on("click", "a[href*=\\#]", function(event){
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
