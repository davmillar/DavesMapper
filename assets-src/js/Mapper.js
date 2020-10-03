// exported MAPPER
(function(mapper){
  mapper.isRotating = false;
  mapper.isSwapping = false;
  mapper.selectedTile = undefined;
  mapper.staggeredCappedMode = undefined;
  mapper.settings = {
    structure: -1,
    theme: DM_THEMES.mixed,
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
    var me = mapper,
        tilePosition,
        newLeft,
        newTop;

    // Unselect old selection.
    if (me.selectedTile) {
      me.selectedTile.removeClass('selected-tile');
    }

    me.selectedTile = tile;

    if (me.selectedTile) {
      me.selectedTile.addClass('selected-tile');

      tilePosition = tile.position();

      newLeft = tilePosition.left - 5;
      newTop = tilePosition.top - 40;

      if (tile.hasClass('edge') && (tile.hasClass('rot1') || tile.hasClass('rot3'))) {
        newLeft -= 75;
      }

      if (newTop < 0) {
        newTop = tile.get(0).height + 22;
      }

      $('#selectionEdit').css({
        left: newLeft,
        top: newTop
      }).fadeIn();

      // Visually disable rotate tool for tile types that don't support it.
      // @TODO: Link appearance with enabled/disabled status.
      if (jQuery.inArray(MAPPER.selectedTile.data('type'), ['tile', 'top', 'btm']) > -1) {
        $('#rotateBtn').fadeTo('fast', 1);
      } else {
        $('#rotateBtn').fadeTo('fast', 0.5);
      }
    } else {
      $('#selectionEdit').hide();
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

    if (!newTile) {
      return;
    }

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
   * Checks that the string passed in is a valid theme to select, then switches to it,
   * pushes a new history state.
   *
   * @param  {String} newTheme
   *     Theme URL slug or empty string which equates to 'mixed'.
   * @param  {Boolean} pushState
   *     Whether or not to push a new history state.
   *
   * @return {Boolean|undefined}
   *     Returns true when successful at changing the theme.
   */
  mapper.changeTheme = function (newTheme, pushState) {
    var settings = mapper.settings,
        newThemeCode;

    if (newTheme === '') {
      newTheme = 'mixed';
    }

    if (DM_THEMES.hasOwnProperty(newTheme)) {
      var newThemeCode = DM_THEMES[newTheme];
      if (settings.theme !== newThemeCode) {
        settings.theme = newThemeCode;
        if (pushState) {
          history.pushState(
            {
              theme: newTheme,
              themeCode: newThemeCode
            },
            "Dave's Mapper | " + newTheme,
            newTheme
          );
        }
      }
      loadRoster();
      return true;
    } else {
      console.error('Unknown theme selected: ' + newTheme);
    }
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
      $('#mapSizeControls input').prop( "disabled", true );
    } else {
      height = parseInt($('#height').val(), 10);
      width = parseInt($('#width').val(), 10);
      $('#mapSizeControls input').prop( "disabled", false );
    }

    settings.width = width;
    settings.height = height;

    var isClosedStructure = (requestedStructure === 2);

    me.staggeredCappedMode = ((DM_TileLibrary.has('edge')) && (requestedStructure === 3));
    settings.hasEndcaps = ((DM_TileLibrary.has('edge')) && isClosedStructure);
    settings.hasCorners = ((DM_TileLibrary.has('corner')) && isClosedStructure);

    if (settings.theme === DM_THEMES.side) {
      // Side-view maps have additional requirements.
      tops = ((DM_TileLibrary.has('top')) && isClosedStructure);
      topCorners = ((DM_TileLibrary.has('tco')) && isClosedStructure);
      btms = ((DM_TileLibrary.has('btm')) && isClosedStructure);
      bottomCorners = ((DM_TileLibrary.has('bco')) && isClosedStructure);
      settings.hasSideCorners = topCorners && bottomCorners;
      $('#viewport').removeClass('nm').addClass('sv');
      GUI.hideNotification();
    } else {
      settings.hasSideCorners = false;
      // Top-down maps.
      $('#viewport').removeClass('sv').addClass('nm');
      if ((isClosedStructure || (requestedStructure === 3)) &&
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
      if (settings.theme !== DM_THEMES.side) {
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
        edgerotationa = (settings.theme === DM_THEMES.side) ? 0 : 3;

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
      if (settings.theme !== DM_THEMES.side) {
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
