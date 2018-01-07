(function(mapper){
  mapper.isRotating = false;
  mapper.isSwapping = false;
  mapper.selectedTile = undefined;
  mapper.staggeredCappedMode = undefined;
  mapper.settings = {
    structure: -1,
    theme: 1,
    height: 2,
    width: 2,
    hasEndcaps: false,
    hasCorners: false,
    gridType: 0,
    /**
     * @type {Object}
     * The lineup is an object containing boolean flags
     * indicating which roster members are currently selected.
     */
    lineup: {},
    /**
     * @type {Array}
     * The roster is the list of all artists available
     * for the current map theme.
     */
    roster: []
  };

  /**
   * Selects a tile by setting the selectedTile of this class
   * to the tile and managing the selected-tile class that
   * visibly indicates the selected tile.
   *
   * @param  {DOMElement} tile
   *    Newly-selected tile.
   */
  mapper.selectTile = function (tile) {
    var me = mapper;

    // Unselect old selection.
    if (me.selectedTile) {
      me.selectedTile.removeClass('selected-tile');
    }

    me.selectedTile = tile;

    if (me.selectedTile) {
      me.selectedTile.addClass('selected-tile');

      // Visually disable rotate tool for tile types that don't support it.
      // @TODO: Link appearance with enabled/disabled status.
      if (jQuery.inArray(MAPPER.selectedTile.data('type'), ['tile', 'top', 'btm']) > -1) {
        $('#rotateBtn').fadeTo('fast', 1);
      } else {
        $('#rotateBtn').fadeTo('fast', 0.5);
      }
    }
  };

  /**
   * Swap the location and rotation of two tiles.
   *
   * @param  {DOMElement} targetTile
   *     Target tile for swap.
   */
  mapper.performSwap = function (targetTile) {
    var tileA = this.selectedTile,
        tileB = targetTile,
        tileAData,
        tileBData;

    // Tiles must be same type to swap.
    if (tileA.data('type') !== tileB.data('type')) {
      return false;
    }

    tileAData = {
      image: tileA.attr('src'),
      id: tileA.data('imgid'),
      artist: tileA.data('artist'),
      rotation: tileA.data('rot')
    };

    tileBData = {
      image: tileB.attr('src'),
      id: tileB.data('imgid'),
      artist: tileB.data('artist'),
      rotation: tileB.data('rot')
    };

    tileA
      .attr('src', tileBData.image)
      .data('imgid', tileBData.id)
      .data('artist', tileBData.artist)
      .removeClass('swapfirst');

    tileB
      .attr('src', tileAData.image)
      .data('imgid', tileAData.id)
      .data('artist', tileAData.artist);

    if (tileB.data('type') === 'tile') {
      tileA
        .data('rot', tileBData.rotation)
        .removeClass('rot'+tileAData.rotation)
        .addClass('rot'+tileBData.rotation);

      tileB
        .data('rot', tileAData.rotation)
        .removeClass('rot'+tileBData.rotation)
        .addClass('rot'+tileAData.rotation);
    }

    this.isSwapping = false;

    $('#swapTileBtn').removeClass('down');
  };

  /**
   * Detects the user's selected map structure and returns it,
   * as well as caching it in the settings object.
   *
   * @return {Number}
   *     Map structure number.
   *
   * @todo Deprecate this and rely on changes bubbling from user action.
   */
  mapper.detectStructure = function () {
    var me = mapper;

    me.settings.structure = parseInt($('input:radio[name=mode]:checked').val(), 10);

    return me.settings.structure;
  };

  mapper.appendTab = function (rotation) {
    var newTab = document.createElement('img'),
        tilesElement = document.getElementById('tiles');

    newTab.classList.add('tab');
    newTab.classList.add('rot' + rotation);

    newTab.setAttribute('data-rot', rotation);
    newTab.setAttribute('data-type', 'tab');
    newTab.setAttribute('src', '../images/tab.png');

    tilesElement.appendChild(newTab);
  };

  mapper.appendTile = function (type, rotation) {
    var newTile = DM_TileLibrary.draw(type),
        newTileImage = document.createElement('img'),
        tilesElement = document.getElementById('tiles');

    newTileImage.classList.add(type);
    newTileImage.classList.add('rot' + rotation);

    newTileImage.setAttribute('data-rot', rotation);
    newTileImage.setAttribute('data-type', type);
    newTileImage.setAttribute('data-imgid', newTile.id);
    newTileImage.setAttribute('data-artist', newTile.artist_id);
    newTileImage.setAttribute('src', '../tiles/' + newTile.image);
    newTileImage.setAttribute('draggable', 'true');

    tilesElement.appendChild(newTileImage);
  };

  /**
   * Create a new map based on the current user settings.
   */
  mapper.newMap = function () {
    var me = mapper,
        doc = document,
        tileDiv = doc.getElementById('tiles'),
        requestedStructure = me.detectStructure(),
        settings = me.settings,
        staggeredRow = 0,
        bottomCorners,
        topCorners,
        fullWidth,
        height,
        width,
        tops,
        btms,
        i,
        j,
        edgerotationa;

    me.selectTile();
    me.isSwapping = false;

    // Cube maps are always this size.
    if (requestedStructure === 4) {
      height = 4;
      width = 3;
    } else {
      height = parseInt($('#height').val(), 10);
      width = parseInt($('#width').val(), 10);
    }

    settings.width = width;
    settings.height = height;

    me.staggeredCappedMode = ((DM_TileLibrary.has('edge')) && (requestedStructure === 3));
    settings.hasEndcaps = ((DM_TileLibrary.has('edge')) && (requestedStructure === 2));
    settings.hasCorners = ((DM_TileLibrary.has('corner')) && (requestedStructure === 2));

    if (settings.theme === 6) {
      // Side-view maps have additional requirements.
      tops = ((DM_TileLibrary.has('top')) && (requestedStructure === 2));
      topCorners = ((DM_TileLibrary.has('tco')) && (requestedStructure === 2));
      btms = ((DM_TileLibrary.has('btm')) && (requestedStructure === 2));
      bottomCorners = ((DM_TileLibrary.has('bco')) && (requestedStructure === 2));
      $('#viewport').removeClass('nm').addClass('sv');
      GUI.hideNotification();
    } else {
      // Top-down maps.
      $('#viewport').removeClass('sv').addClass('nm');
      if (((requestedStructure === 2) || (requestedStructure === 3)) &&
          ((!DM_TileLibrary.has('edge')) || (!DM_TileLibrary.has('corner')))) {
        GUI.showNotification(
          'The tile sets you selected do not contain the right tile mix for your selected map ' +
          'structure. Falling back to the closest possible map structure.');
      } else {
        GUI.hideNotification();
      }
    }

    // Prepare Drawing Area
    if (requestedStructure !== 4) {
      fullWidth = 300 * width + 2;
      if (settings.hasEndcaps) { fullWidth += 300; }
      $('#map, #tiles').width(fullWidth + 'px');

      while(tileDiv.firstChild) {
        tileDiv.removeChild(tileDiv.firstChild);
      }

      // Top row of map tiles.
      if (settings.theme !== 6) {
        // Top-Down Maps
        if (settings.hasEndcaps) {
          if (settings.hasCorners) {
            me.appendTile('corner', 0);
          }

          for (j = 0; j < width - staggeredRow; j += 1) {
            me.appendTile('edge', 0);
          }

          if (settings.hasCorners) {
            me.appendTile('corner', 1);
          }

          tileDiv.appendChild(doc.createElement('br'));
        }
      } else {
        // Side-View Maps
        if (tops) {
          if (topCorners) { me.appendTile('tco', 0); }
          for (j = 0; j < width - staggeredRow; j += 1) { me.appendTile('top', 0); }
          if (topCorners) { me.appendTile('tco', 1); }
          tileDiv.appendChild(doc.createElement('br'));
        }
      }

      // Middle of map.
      for (i = 0; i < height; i += 1) {
        edgerotationa = (settings.theme === 6) ? 0 : 3;

        if (settings.hasEndcaps || (me.staggeredCappedMode && (staggeredRow === 1))) {
          me.appendTile('edge', edgerotationa);
        }

        for (j = 0; j < width - staggeredRow; j += 1) {
          me.appendTile('tile', randInt(0, 3));
        }

        if (settings.hasEndcaps || (me.staggeredCappedMode && (staggeredRow === 1))) {
          me.appendTile('edge', 1);
        }

        if ((requestedStructure === 1) || (requestedStructure === 3)) {
          staggeredRow = 1 - staggeredRow;
        }

        tileDiv.appendChild(doc.createElement('br'));
      }

      // Bottom row of map tiles
      if (settings.theme !== 6) {
        // Top-Down Maps
        if (settings.hasEndcaps) {
          if (settings.hasCorners) { me.appendTile('corner', 3); }
          for (j = 0; j < width - staggeredRow; j += 1) { me.appendTile('edge', 2); }
          if (settings.hasCorners) { me.appendTile('corner', 2); }
          tileDiv.appendChild(doc.createElement('br'));
        }
      } else {
        // Side-View Maps
        if (btms) {
          if (bottomCorners) { me.appendTile('bco', 0); }
          for (j = 0; j < width - staggeredRow; j += 1) { me.appendTile('btm', 0); }
          if (bottomCorners) { me.appendTile('bco', 1); }
          tileDiv.appendChild(doc.createElement('br'));
        }
      }
    } else {
      $('#map, #tiles').width('902px');

      var tiles = doc.getElementById('tiles');

      while (tiles.firstChild) {
        tiles.removeChild(tiles.firstChild);
      }

      me.appendTab(0);
      me.appendTile('tile', randInt(0, 3));
      me.appendTab(2);
      tileDiv.appendChild(doc.createElement('br'));
      me.appendTile('tile', randInt(0, 3));
      me.appendTile('tile', randInt(0, 3));
      me.appendTile('tile', randInt(0, 3));
      tileDiv.appendChild(doc.createElement('br'));
      me.appendTab(0);
      me.appendTile('tile', randInt(0, 3));
      me.appendTab(2);
      tileDiv.appendChild(doc.createElement('br'));
      me.appendTab(0);
      me.appendTile('tile', randInt(0, 3));
      me.appendTab(2);
      tileDiv.appendChild(doc.createElement('br'));
      var tabBottom = doc.createElement('img');
      tabBottom.setAttribute('class','rot0');
      tabBottom.setAttribute('data-rot','0');
      tabBottom.setAttribute('data-type','tab');
      tabBottom.setAttribute('src','../images/tab_bottom.png');
      tileDiv.appendChild(tabBottom);
    }
  };

  /**
   * Applies detects the grid setting selected by the user
   * and applies it to the grid element.
   *
   * @param  {Number} gridType
   *     Grid setting selected. `0` is no grid, `1` is a
   *     square grid at 15px size, `2` is a square grid
   *     at 30px size, and `3` is a hex grid with roughly
   *     30px wide irregular hexagons.
   */
  mapper.applyGridOverlay = function (gridType) {
    var me = mapper,
        gridElement = document.getElementById('grid'),
        gridBackgrounds = {
          0: 'transparent',
          1: 'url(/grid_15.png)',
          2: 'url(/grid_30.png)',
          3: 'url(/images/hex.png)'
        };

    me.settings.gridType = parseInt(gridType, 10);
    gridElement.style.background = gridBackgrounds[me.settings.gridType] || 'transparent';

    ga('send', 'event', 'Grid', 'Type ' + gridType);
  };

  /**
   * Switches the grid overlay to the next style in the order displayed in the
   * applyGridOverlay method.
   */
  mapper.nextGrid = function () {
    mapper.applyGridOverlay((mapper.settings.gridType + 1) % 4);
  };
})(window.MAPPER = window.MAPPER || {});

(function(gui){
  gui.init = function () {
    gui.notificationHolder = $('#notification');
    gui.notificationTextHolder = gui.notificationHolder.find('span');
    gui.notificationHolder.on('click', '#clearNotificationButton', gui.hideNotification);

    gui.modalContainer = $('#popup');
    gui.modalContentContainer = gui.modalContainer.find('div');

    // Initialize click handler for overlay.
    gui.modalContainer.click(gui.hideModal);
  };

  gui.showNotification = function (notificationText) {
    gui.notificationTextHolder.text(notificationText);
    gui.notificationHolder.slideDown('fast');
  };

  gui.hideNotification = function () {
    gui.notificationHolder.slideUp('fast');
  };

  /**
   * Displays a modal with the provided content.
   *
   * @param  {string} overlayContent
   *     A string of HTML content.
   */
  gui.showModal = function (overlayContent) {
    gui.modalContentContainer.html(overlayContent);
    gui.modalContainer.fadeIn('fast');
  };

  /**
   * Returns whether or not the modal is visible.
   *
   * @return {Boolean}
   *     True when a modal is visible.
   */
  gui.modalVisible = function () {
    return gui.modalContainer.is(':visible');
  };

  /**
   * Displays a modal with the provided content.
   *
   * @param  {string} contentName
   *     Name of file from which to load external content.
   */
  gui.loadExternalModal = function (contentName) {
    gui.modalContentContainer.load('/content/' + contentName + '.html', function () {
      GUI.modalContainer.fadeIn('fast');
    });
  };

  /**
   * Hides an active modal.
   */
  gui.hideModal = function () {
    gui.modalContainer.fadeOut('fast');
  };
})(window.GUI = window.GUI || {});

var createCookie = function (name, value, days) {
    var date, expires;
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
      while (c.charAt(0) === ' ') { c = c.substring(1, c.length); }
      if (c.indexOf(nameEQ) === 0) { return c.substring(nameEQ.length, c.length); }
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
    DM_TileLibrary.tile.filter();
    DM_TileLibrary.edge.filter();
    DM_TileLibrary.corner.filter();
    if (MAPPER.settings.theme === 6) {
      DM_TileLibrary.top.filter();
      DM_TileLibrary.tco.filter();
      DM_TileLibrary.btm.filter();
      DM_TileLibrary.bco.filter();
    }
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
    var displayHTML = '',
        data = $.parseJSON(responseString),
        artistsPresent = data.length,
        newLineup = {};

    // The roster is the list of all artists available for the current map theme.
    MAPPER.settings.roster = data;

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
    MAPPER.settings.lineup = newLineup;

    DM_TileLibrary.loadTiles(MAPPER.settings.theme, selectTileSets);

    $('#artistsblock').html(displayHTML);
  },

  loadRoster = function () {
    $.post('scripts/load_authors.php', {
      'map_kind': MAPPER.settings.theme
    }, onRosterDataLoaded);
  },

  exportMap = function () {
    var imageHolder = new Image(),
        tilePosition,
        tileRotation,
        tileHeight,
        tileWidth,
        dataURL;

    GUI.hideNotification();

    if (MAPPER.settings.mode === 4) {
      // Disallow cube export.
      GUI.showNotification('Export for cubes is currently not working. Please try your ' +
        'browser\'s print option instead.');
      ga('send', 'event', 'Export', 'Failed-Cube');
    } else if (
      (MAPPER.settings.mode === 1) ||
      (MAPPER.settings.mode === 3) ||
      (MAPPER.settings.theme === 6)) {

      // Warn users if they're choosing to export a large map size.
      if ((MAPPER.settings.width * MAPPER.settings.height) > 36) {
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
      if (MAPPER.settings.mode === 4) {
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
        if (MAPPER.settings.theme === 6) {
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
      if ((MAPPER.settings.width * MAPPER.settings.height) > 64) {
        GUI.showNotification(
          'This map looks too big to export to PNG without causing an error. Sorry!'
        );
        ga('send', 'event', 'Export', 'Failed');
      } else {
        var fullMapURL, mapData;
        GUI.hideNotification();
        mapData = {'tiles': [], 'rotation': []};
        $('#tiles img').each(function (i) {
          mapData.tiles[i] = $(this).data('imgid');
          mapData.rotation[i] = $(this).data('rot');
        });
        fullMapURL = 'fullmap.php?mapData=' +
          base64_encode(JSON.stringify(mapData)) +
          '&w=' + MAPPER.settings.width +
          '&h=' + MAPPER.settings.height;
        if (MAPPER.settings.hasEndcaps) {
          fullMapURL += '&e=1';
        } else {
          fullMapURL += '&e=0';
        }
        if (MAPPER.settings.hasCorners) {
          fullMapURL += '&c=1';
        } else {
          fullMapURL += '&c=0';
        }
        fullMapURL += '&g=' + MAPPER.settings.gridType.toString();
        window.open(fullMapURL, 'MapWindow', 'width=800,height=600,scrollbars=yes');
      }
      ga('send', 'event', 'Export', 'PHP');
    }
  },

  replaceTile = function ($image, oldtile, type, hasExit) {
    var tileimg = DM_TileLibrary.draw(type);

    if (hasExit) {
      GUI.showNotification(
        'Exit tiles had to be temporarily disabled while optimizations were made ' +
        'to keep the site online. Sorry!'
      );
      return;
    }

    $image
      .attr('src', '../tiles/' + tileimg.image)
      .data('imgid', tileimg.id)
      .data('artist', tileimg.artist_id);

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
      replaceTile($target, $target.data('imgid'), 'tile', false);
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

      replaceTile($target, $target.data('imgid'), 'edge', false);
    }
  },

  onCornerDoubleClick = function (e) {
    if (e.metaKey) {
      var $target = $(this);

      replaceTile($target, $target.data('imgid'), 'corner', false);
    }
  },

  onTopDoubleClick = function (e) {
    var $target = $(this),
        oldRot,
        newRot;

    if (e.metaKey) {
      replaceTile($target, $target.data('imgid'), 'top', false);
    } else {
      oldRot = $(this).data('rot');
      newRot = (oldRot + 1) % 2;
      $(this).data('rot', newRot).removeClass('rot' + oldRot).addClass('rot' + newRot);
    }
  },

  onTopCornerDoubleClick = function (e) {
    if (e.metaKey) {
      var $target = $(this);

      replaceTile($target, $target.data('imgid'), 'tco', false);
    }
  },

  onBottomDoubleClick = function (e) {
    var $target = $(this),
        oldRot,
        newRot;

    if (e.metaKey) {
      replaceTile($target, $target.data('imgid'), 'btm', false);
    } else {
      oldRot = $(this).data('rot');
      newRot = (oldRot + 1) % 2;
      $(this).data('rot', newRot).removeClass('rot' + oldRot).addClass('rot' + newRot);
    }
  },

  onBottomCornerDoubleClick = function (e) {
    if (e.metaKey) {
      var $target = $(this);

      replaceTile($target, $target.data('imgid'), 'bco', false);
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
    $('#mapTypeSelector').on('click tap', 'input:radio[name=maptype]', function () {
      if ($mobilemode) { $(this).blur(); }
      MAPPER.settings.theme = parseInt($(this).val(), 10);
      loadRoster();
    });
    $('#mapViewControls')
      .on('click tap', '#nogrid', function () {
        MAPPER.applyGridOverlay(0);
      })
      .on('click tap', '#grid5', function () {
        MAPPER.applyGridOverlay(1);
      })
      .on('click tap', '#grid10', function () {
        MAPPER.applyGridOverlay(2);
      })
      .on('click tap', '#gridhex', function () {
        MAPPER.applyGridOverlay(3);
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
      replaceTile(
        MAPPER.selectedTile,
        MAPPER.selectedTile.data('imgid'),
        MAPPER.selectedTile.data('type'),
        false
      );
      return false;
    });

    $('#width').val(2);
    $('#height').val(2);
    MAPPER.settings.mode = parseInt($('input:radio[name=mode]:checked').val(), 10);
    MAPPER.settings.theme = parseInt($('input:radio[name=maptype]:checked').val(), 10);
    MAPPER.applyGridOverlay($('input:radio[name=grid]:checked').val());

    loadRoster();

    if (MAPPER.settings.theme === 6) {
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

    if ($appmode) {
      $('body').addClass('standalone-app');
      // @TODO Find a way to include this in the CSS or GUI module.
      $('#notification').css({'top': '64px;'});
      $('#newnav,#site-foot').hide();
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
      replaceTile(
        MAPPER.selectedTile,
        MAPPER.selectedTile.data('imgid'),
        MAPPER.selectedTile.data('type'),
        true
      );
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
