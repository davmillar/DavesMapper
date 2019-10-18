var createCookie = function (name, value, days) {
    var date,
        expires;

    if (days) {
      date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = '; expires=' + date.toGMTString();
    } else {
      expires = '';
    }

    document.cookie = name + '=' + value + expires + '; path=/';
  },

  readCookie = function (name) {
    var nameEQ = name + '=',
        ca = document.cookie.split(';'),
        i,
        c;

    for (i = 0; i < ca.length; i += 1) {
      c = ca[i];

      while (c.charAt(0) === ' ') {
        c = c.substring(1, c.length);
      }

      if (c.indexOf(nameEQ) === 0) {
        return c.substring(nameEQ.length, c.length);
      }
    }

    return null;
  },

  toggleMobileMenu = function () {
    $('#sideBar').toggleClass('shown');
  },

  selectTileSets = function () {
    var newLineup = {};
    $('#artistsblock input').filter(':checked').each(function () {
      newLineup[$(this).val()] = true;
    });
    MAPPER.settings.lineup = newLineup;
    DM_TileLibrary.setFilter(MAPPER.settings.theme, MAPPER.settings.lineup);
    MAPPER.newMap();
  },

  /**
   * Callback for roster data being loaded, which parses it and uses it to
   * populate the settings for roster and lineup as well as generating the
   * artist selection GUI.
   *
   * @param  {String} responseString
   *     Response data as a string.
   */
  onRosterDataLoaded = function (responseString) {
    var settings = MAPPER.settings,
        displayHTML = '',
        data = $.parseJSON(responseString),
        artistsPresent = data.length,
        newLineup = {};

    // The roster is the list of all artists available for the current map theme.
    settings.roster = data;

    for (var p = 0; p < artistsPresent; p++) {
      newLineup[data[p].artist_id] = true;
      displayHTML +=
       '<input type="checkbox" name="tileset" class="panelChk" ' +
        ' id="chk' + data[p].artist_id + '" value="' + data[p].artist_id + '" checked />' +
        '<label for="chk' + data[p].artist_id + '" data-artist="' + data[p].artist_id + '">' +
        '<img src="../m_icons/' + data[p].icon + '.png" />' +
        '<span class="name">' +
          '<span class="nick">' + data[p].initials + '</span>' +
          '<span class="full">' + data[p].name + '</span>' +
        '</span>' +
      '</label>';
    }

    // The lineup is the list of selected artists for the current map being made.
    settings.lineup = newLineup;

    DM_TileLibrary.loadTiles(settings.theme, selectTileSets);

    $('#artistsblock').html(displayHTML);
  },

  loadRoster = function () {
    $.post('scripts/load_authors.php', {
      'map_kind': MAPPER.settings.theme
    }, onRosterDataLoaded);
  },

  exportMap = function () {
    var settings = MAPPER.settings,
        imageHolder = new Image(),
        tilePosition,
        tileRotation,
        tileHeight,
        tileWidth,
        dataURL;

    GUI.hideNotification();

    if (settings.mode === 4) {
      // Disallow cube export.
      GUI.showNotification('Export for cubes is currently not working. Please try your ' +
        'browser\'s print option instead.');
      ga('send', 'event', 'Export', 'Failed-Cube');
    } else if (
      (settings.mode === 1) ||
      (settings.mode === 3) ||
      (settings.theme === DM_THEMES.side)) {

      // Warn users if they're choosing to export a large map size.
      if ((settings.width * settings.height) > 36) {
        if (!confirm('Whoa there! Your browser might choke on saving a map of this size and ' +
          'crash the tab and/or window. Are you sure you want to let it run?')) {
          return false;
        }
      }

      // Establish canvas and canvas context.
      var exportCanvas = document.getElementById('drawingboard'),
          exportCanvasContext = exportCanvas.getContext('2d');

      //exportCanvasContext.clearRect(0,0,exportCanvas.width,exportCanvas.height);

      // Determine export size from app container size.
      // @TODO Find a better way to get this cached during map generation.
      if (settings.mode === 4) {
        exportCanvas.width = '900px';
        exportCanvas.height = '1235px';
      } else {
        exportCanvas.width = $('#tiles').width() - 2;
        exportCanvas.height = $('#tiles').height();
      }

      $('#tiles').find('img').each(function () {
        exportCanvasContext.save();
        tilePosition = $(this).position();
        tileRotation = $(this).data('rot');
        tileWidth = $(this).width();
        tileHeight = $(this).height();
        imageHolder.src = $(this).attr('src');
        tilePosition.left -= 22;
        tilePosition.top -= 22;
        if (settings.theme === DM_THEMES.side) {
          exportCanvasContext.translate(
            tilePosition.left + (tileWidth / 2),
            tilePosition.top + (tileHeight / 2)
          );
          if ((tileRotation % 2) === 1) {
            exportCanvasContext.scale(-1, 1);
          }
        } else {
          if ((tileRotation % 2) === 1 && tileWidth > 150 && tileHeight < 300) {
            tilePosition.left -= 150;
            tilePosition.top += 75;
          }
          exportCanvasContext.translate(
            tilePosition.left + (tileWidth / 2),
            tilePosition.top + (tileHeight / 2)
          );
          exportCanvasContext.rotate(tileRotation * Math.PI / 2);
        }
        exportCanvasContext.drawImage(
          imageHolder,
          -(tileWidth / 2),
          -(tileHeight / 2),
          tileWidth,
          tileHeight
        );
        exportCanvasContext.restore();
      });
      $('#grid').find('img').each(function () {
        exportCanvasContext.save();
        tilePosition = $(this).position();
        tileWidth = $(this).width();
        tileHeight = $(this).height();
        imageHolder.src = $(this).attr('src');
        exportCanvasContext.translate(
          tilePosition.left + (tileWidth / 2),
          tilePosition.top + (tileHeight / 2)
        );
        exportCanvasContext.drawImage(
          imageHolder,
          -(tileWidth / 2),
          -(tileHeight / 2),
          tileWidth,
          tileHeight
        );
        exportCanvasContext.restore();
      });
      dataURL = exportCanvas.toDataURL();
      window.open(dataURL, 'MapWindow', 'width=800,height=600,scrollbars=yes');
      exportCanvas.width = exportCanvas.width * 2 / 2;
      ga('send', 'event', 'Export', 'Canvas');
    } else {
      if ((settings.width * settings.height) > 64) {
        GUI.showNotification(
          'This map looks too big to export to PNG without causing an error. Sorry!'
        );
        ga('send', 'event', 'Export', 'Failed');
      } else {
        var encodedMap = '',
            tileValue,
            tileCode,
            tile,
            fullMapURL;

        GUI.hideNotification();

        $('#tiles img').each(function () {
          tile = $(this);
          // Max 36^4 / 4 = 419904 tiles
          tileValue = (tile.data('imgid') * 4) + tile.data('rot');
          tileCode = tileValue.toString(36);
          while (tileCode.length < 4) { tileCode = '0' + tileCode; }
          encodedMap += tileCode;
        });

        fullMapURL = '/export/' + encodedMap +
          '?w=' + settings.width +
          '&h=' + settings.height;

        fullMapURL += '&e=' + (settings.hasEndcaps ? '1' : '0');
        fullMapURL += '&c=' + (settings.hasCorners ? '1' : '0');
        fullMapURL += '&g=' + settings.gridType.toString();
        window.open(fullMapURL, 'MapWindow', 'width=800,height=600,scrollbars=yes');
      }
      ga('send', 'event', 'Export', 'PHP');
    }
  },

  replaceTile = function ($currentTile, hasExit) {
    var type = $currentTile.data('type'),
        newTile = DM_TileLibrary.draw(type);

    if (hasExit) {
      GUI.showNotification(
        'Exit tiles had to be temporarily disabled while optimizations were made ' +
        'to keep the site online. Sorry!'
      );
      return;
    }

    $currentTile
      .attr('src', '../tiles/' + newTile.image)
      .data('imgid', newTile.id)
      .data('artist', newTile.artist_id);

    ga('send', 'event', 'Replace Tile', type);
  },

  /**
   * Handler for image dragging to set up for drag/drop tile swapping.
   *
   * @param  {jQuery Event} event
   *     jQuery event for the start of the drag.
   */
  onImageDragStart = function (event) {
    event = event.originalEvent;
    if (MAPPER.isSwapping || !event) { return; }
    MAPPER.selectTile($(this));
    event.dataTransfer.effectAllowed = 'move';
    event.dataTransfer.setData('text/html','Swap');
    ga('send', 'event', 'Swap', 'Drag Start');
  },

  /**
   * Handler for image drop after dragging.
   *
   * @param  {jQuery Event} event
   *     jQuery event for the drop after dragging.
   */
  onImageDragDrop = function (event) {
    event = event.originalEvent;
    event.preventDefault();
    if (event.dataTransfer.getData('text/html') === 'Swap') {
      MAPPER.performSwap($(this));
      ga('send', 'event', 'Swap', 'Drop');
    }
  },

  /**
   * Handler for clicking an image on the map.
   */
  onImageClick = function () {
    // Ignore tabs from cube mode.
    if ($(this).data('type') === 'tab') {
      return;
    }

    // Perform swap if using swap tool, otherwise select tile.
    if (MAPPER.isSwapping) {
      MAPPER.performSwap($(this));
      ga('send', 'event', 'Swap', 'Tool Complete');
    } else {
      MAPPER.selectTile($(this));
    }
  },

  onTileDoubleClick = function (e) {
    var $target = $(this),
        oldRot,
        newRot;

    if (e.metaKey) {
      replaceTile($target);
      ga('send', 'event', 'Replace', 'Ctrl+DblClick');
    } else {
      oldRot = $(this).data('rot');
      newRot = (oldRot + 1) % 4;
      $(this).data('rot', newRot).removeClass('rot' + oldRot).addClass('rot' + newRot);
      ga('send', 'event', 'Rotate', 'DblClick');
    }
  },

  onEdgeDoubleClick = function (e) {
    if (e.metaKey) {
      var $target = $(this);

      replaceTile($target);
    }
  },

  onCornerDoubleClick = function (e) {
    if (e.metaKey) {
      var $target = $(this);

      replaceTile($target);
    }
  },

  onTopDoubleClick = function (e) {
    var $target = $(this),
        oldRot,
        newRot;

    if (e.metaKey) {
      replaceTile($target);
    } else {
      oldRot = $(this).data('rot');
      newRot = (oldRot + 1) % 2;
      $(this).data('rot', newRot).removeClass('rot' + oldRot).addClass('rot' + newRot);
    }
  },

  onTopCornerDoubleClick = function (e) {
    if (e.metaKey) {
      var $target = $(this);

      replaceTile($target);
    }
  },

  onBottomDoubleClick = function (e) {
    var $target = $(this),
        oldRot,
        newRot;

    if (e.metaKey) {
      replaceTile($target);
    } else {
      oldRot = $(this).data('rot');
      newRot = (oldRot + 1) % 2;
      $(this).data('rot', newRot).removeClass('rot' + oldRot).addClass('rot' + newRot);
    }
  },

  onBottomCornerDoubleClick = function (e) {
    if (e.metaKey) {
      var $target = $(this);

      replaceTile($target);
    }
  },

  onTileBoardClick = function (e) {
    if ($(this).hasClass('iconmode')) {
      var offset = $(this).offset(),
          theX = e.clientX - offset.left - 15,
          theY = e.clientY - offset.top - 15;

      $('<img />')
        .attr('src','../images/fab.png')
        .css({
          'top': theY + 'px',
          'left': theX + 'px',
          'width': '30px'
        })
        .appendTo($(this));
    }
  },

  /**
   * Setup for the app that is performed when the document is ready.
   */
  initApp = function () {
    var userAgentString = window.navigator.userAgent,
        $issafari = ((/Safari/i).test(window.navigator.appVersion));

    GUI.init();

    // Initialize click handler for mobile button.
    $('#mapTypeMenuBtn').click(toggleMobileMenu);

    // Close side panel when clicking off of the main content area.
    $('#sideBar').on('click tap', function (e) {
      if (e.target.tagName === 'SECTION') {
        $('#sideBar').removeClass('shown');
      }
    });

    // Add listeners to the artist seletion list.
    $('#artistsblock')
      .on('change', 'input', function (e) {
        if (e.metaKey) { $(this).prop('checked', true).siblings('input').prop('checked', false); }
        selectTileSets();
      })
      .on('dblclick', 'label', function () {
        var $target = $(this).attr('for');
        $('#' + $target).prop('checked', true).siblings('input').prop('checked', false);
        selectTileSets();
      });

    // Check if user has seen onboarding popup recently and display it if not.
    if (readCookie('popup') !== 'overlay') {
      GUI.showModal([
        '<h2>New to the Mapper?</h2>',
        '<ul>',
        '<li><strong>Make maps for tabletop RPGs</strong> including caverns, dungeons, ',
          'vertical dungeons, towns, and spaceships.</li>',
        '<li><strong>Configure your map</strong> using the toolbar above. Choose size, ',
          'type, layout, and more.</li>',
        '<li><strong>Click tiles</strong> and use the handy selection menu to fine-tune ',
          'your generated map.</li>',
        '<li><strong>Choose your map artist(s)</strong> by toggling them on the left-hand ',
          'panel. Double-click an artist or hit the heart button with a tile selected to ',
          'switch to a single artist.</li>',
        '<li><strong>On multitouch devices</strong> use two-finger twist to rotate tiles.',
          '</li>',
        '</ul>',
        '<p><em>Click anywhere to close.</em></p>'
      ].join(''));
      createCookie('popup', 'overlay', 90);
      ga('send', 'event', 'New User Overlay');
    }

    $('#newWindowB').click(exportMap);
    $('#newBtn').click(MAPPER.newMap);

    // Set mapViewControls to pass their input value into appleGridOverlay
    $('#mapViewControls').on('click tap', 'input', function () {
      MAPPER.applyGridOverlay($(this).val());
    });

    $('#rotateTile').click(function () {
      if (jQuery.inArray(MAPPER.selectedTile.data('type'), ['tile','top','btm']) < 0) {
        return false;
      }
      var oldRot = MAPPER.selectedTile.data('rot'),
        newRot = (oldRot + 1) % 4;
      MAPPER.selectedTile.data('rot', newRot).removeClass('rot' + oldRot).addClass('rot' + newRot);
      ga('send', 'event', 'Rotate', 'Click');
      return false;
    });
    $('#removeTile').click(function () {
      replaceTile(MAPPER.selectedTile);
      return false;
    });

    $('#width').val(2);
    $('#height').val(2);
    MAPPER.settings.mode = parseInt($('input:radio[name=mode]:checked').val(), 10);
    MAPPER.applyGridOverlay($('input:radio[name=grid]:checked').val());

    if (MAPPER.settings.theme === DM_THEMES.side) {
      $('#viewport').addClass('sv').removeClass('nm');
    } else {
      $('#viewport').addClass('nm').removeClass('sv');
    }
    if (($mobilemode) && (userAgentString.indexOf('Android') >= 0)) {
      var androidversion = parseFloat(userAgentString.slice(userAgentString.indexOf('Android')+8));
      if (androidversion < 3) {
        $('body').addClass('faildroid');
      }
    }

    if ($('canvas#grid').length > 0) {
      $('#grid').remove();
      $('<div id="grid"></div>').appendTo('#map');
    }

    // Add listeners to the tiles holder.
    $('#tiles')
      // Handle dragging a tile
      .on('dragstart', 'img', onImageDragStart)
      // Handle dropping a tile
      .on('dragover', 'img', function (event) {
        event.originalEvent.preventDefault();
      })
      .on('drop', 'img', onImageDragDrop)
      // Handle clicking on a tile
      .on('click tap', 'img', onImageClick)
      // Handle double-clicks, including modified double-clicks
      .on('dblclick', 'img.tile', onTileDoubleClick)
      .on('dblclick', 'img.edge', onEdgeDoubleClick)
      .on('dblclick', 'img.corner', onCornerDoubleClick)
      .on('dblclick', 'img.top', onTopDoubleClick)
      .on('dblclick', 'img.tco', onTopCornerDoubleClick)
      .on('dblclick', 'img.btm', onBottomDoubleClick)
      .on('dblclick', 'img.bco', onBottomCornerDoubleClick)
      .on('click', onTileBoardClick);

    // Handle the remove/replace with exit button
    $('#removeTileExit').on('click tap', function () {
      replaceTile(MAPPER.selectedTile);
      ga('send', 'event', 'Remove Tile', 'Exit');
      return false;
    });

    // Handle swapping button
    $('#swapTileBtn').on('click tap', function () {
      if (MAPPER.selectedTile.data('type') === 'tab') { return; }
      MAPPER.selectedTile.addClass('swapfirst');
      MAPPER.isSwapping = true;
      $('#swapTileBtn').addClass('down');
      ga('send', 'event', 'Swap', 'Tool Click');
      return false;
    });

    // Handle mancrush button
    $('#mancrush').on('click tap', function () {
      var $target = MAPPER.selectedTile.data('artist');

      $('#chk' + $target).prop('checked', true).siblings('input').prop('checked', false);
      ga('send', 'event', 'Heart', 'Click');
      selectTileSets();
    });

    // Redraw the map when width or height are changed
    $('#width, #height').on('change', MAPPER.newMap);

    // Change mode based on radio button value changing
    $('input:radio[name=mode]').on('click tap change', function () {
      MAPPER.settings.mode = parseInt($(this).val(), 10);
      MAPPER.newMap();
      ga('send', 'event', 'Mode', 'Change');
    });

    // Add "Add to Home" hint in appropriate browser settings.
    if ('standalone' in window.navigator &&
      !window.navigator.standalone &&
      $mobilemode && $issafari) {

      $('<link rel="stylesheet" href="/style/add2home.css" />').appendTo('body');
      $('<script src="/scripts/add2home.js"><\/s' + 'cript>').appendTo('body');
    }

    // Do initial theme detection and add listeners for theme changes.
    detectTheme();
    $('#mapTypeSelector').on('click tap', 'a', function (e) {
      var linkTheme = this.href.replace(/.*\//g, '');
      e.preventDefault();
      if (MAPPER.changeTheme(linkTheme, true)) {
        $(this).addClass('selected').siblings().removeClass('selected');
      }
    });

    window.onpopstate = detectTheme;
  },

  /**
   * Detect map theme selected and load it.
   * @param  {[type]} event [description]
   * @return {[type]}       [description]
   */
  detectTheme = function(event) {
    var theme = location.pathname.replace('/', '');
    if (MAPPER.changeTheme(theme)) {
      $('#mapTypeSelector a')
        .filter(function(index, link) { return link.href === location.href; })
        .addClass('selected')
        .siblings()
          .removeClass('selected');
    } else {
      location.replace('/');
    }
  },


  /**
   * Handler for when a detected multitouch performs rotation.
   * @param  {Object} event The event object
   */
  onHammerRotateDetected = function (event) {
    if (MAPPER.selectedTile.data('type') === 'tile') {
      var originalRotation = MAPPER.selectedTile.data('rot'),
          eventRotation = Math.round(event.gesture.rotation),
          normalizedEventRotation = ((originalRotation * 90) + eventRotation + 360) % 360,
          transformValue = 'rotateZ(' + normalizedEventRotation + 'deg)';

      MAPPER.isRotating = true;
      MAPPER.selectedTile
        .removeClass('rot' + originalRotation)
        .css({
          '-webkit-transform': transformValue,
          '-moz-transform': transformValue,
          '-ms-transform': transformValue,
          '-o-transform': transformValue,
          'transform': transformValue,
          '-webkit-transition': 'none',
          '-moz-transition': 'none',
          '-ms-transition': 'none',
          '-o-transition': 'none',
          'transition': 'none',
          'zoom': 1
        });

      event.gesture.preventDefault();
      ga('send', 'event', 'Rotate', 'Start Touch');
    }
  },

  /**
   * Handler for when a detected multitouch is released.
   * @param  {Object} event The event object
   */
  onHammerReleaseDetected = function (event) {
    if (MAPPER.isRotating) {
      MAPPER.isRotating = false;
      var selectedTile = MAPPER.selectedTile,
          originalRotation = selectedTile.data('rot'),
          eventRotation = Math.round(event.gesture.rotation),
          normalizedEventRotation = ((originalRotation * 90) + eventRotation + 360) % 360,
          newRotation = Math.round(normalizedEventRotation / 90) % 4;

      selectedTile
        .data('rot', newRotation)
        .removeClass('rot' + originalRotation)
        .addClass('rot' + newRotation)
        .css({
          '-webkit-transform': '',
          '-moz-transform': '',
          '-ms-transform': '',
          '-o-transform': '',
          'transform': '',
          '-webkit-transition': '',
          '-moz-transition': '',
          '-ms-transition': '',
          '-o-transition': '',
          'transition': '',
          'zoom': 1
        });

      ga('send', 'event', 'Rotate', 'Release Touch');
    }
  };

$(document)
  // Initialization
  .ready(initApp)
  // Multitouch goodness
  .hammer()
  // Generic whole-document listeners
  .on('rotate', onHammerRotateDetected)
  .on('release', onHammerReleaseDetected);
