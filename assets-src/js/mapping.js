var TileDeck,
    artBoard,
    artMode,
    imgBoard,
    mypos,
    myrot,
    mywid,
    myhei,
    mapSettings = {
      mode: -1,
      height: 2,
      width: 2,
      hasEndcaps: false,
      gridType: 0,
      lineup: {},
      roster: []
    },
    corners,
    endstag,
    map_kind,
    scaled = false,
    maptype = 1,
    stagcount = 0,
    tilecount = 0,
    normalTileCount = 0,
    edgeTileCount = 0,
    detectedrotate = 0,
    imag = "",
    roomContents = [
      "Empty",
      "Monster(s) and Treasure",
      "Monster(s) and Treasure",
      "Empty, Hidden Treasure",
      "Trap, Treasure",
      "Trap",
      "Monster(s)",
      "Monster(s)",
      "Monster(s)",
      "Monster(s)"
    ],
    specialContents = [
      "Hindrance",
      "Danger",
      "Advantage",
      "Mystery",
      "Special Creature",
      "Odor",
      "Power"
    ],
    $issafari = ((/Safari/i).test(window.navigator.appVersion)),
    ua = window.navigator.userAgent,
    tileLibrary = {},
    MAPPER;

(function(mapper){
  mapper.isRotating = false;
  mapper.isSwapping = false;
  mapper.selectedTile = undefined;

  mapper.selectTile = function (tile) {
    var me = this;

    // Unselect old selection.
    if (me.selectedTile) {
      me.selectedTile.removeClass("selected-tile");
    }

    me.selectedTile = tile;

    if (me.selectedTile) {
      me.selectedTile.addClass("selected-tile");

      // Visually disable rotate tool for tile types that don't support it.
      // @TODO: Link appearance with enabled/disabled status.
      if (jQuery.inArray(MAPPER.selectedTile.data("type"), ["tile","top","btm"]) > -1) {
        $("#rotateBtn").fadeTo("fast", 1);
      } else {
        $("#rotateBtn").fadeTo("fast", 0.5);
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
    if (tileA.data("type") !== tileB.data("type")) {
      return false;
    }

    tileAData = {
      image: tileA.attr("src"),
      id: tileA.data("imgid"),
      artist: tileA.data("artist"),
      rotation: tileA.data("rot")
    };

    tileBData = {
      image: tileB.attr("src"),
      id: tileB.data("imgid"),
      artist: tileB.data("artist"),
      rotation: tileB.data("rot")
    };

    tileA
      .attr("src", tileBData.image)
      .data("imgid", tileBData.id)
      .data("artist", tileBData.artist)
      .removeClass("swapfirst");

    tileB
      .attr("src", tileAData.image)
      .data("imgid", tileAData.id)
      .data("artist", tileAData.artist);

    if (tileB.data("type") === "tile") {
      tileA
        .data("rot", tileBData.rotation)
        .removeClass("rot"+tileAData.rotation)
        .addClass("rot"+tileBData.rotation);

      tileB
        .data("rot", tileAData.rotation)
        .removeClass("rot"+tileBData.rotation)
        .addClass("rot"+tileAData.rotation);
    }

    this.isSwapping = false;

    $("#swapTileBtn").removeClass("down");
  };
})(window.MAPPER = window.MAPPER || {});

MAPPER = window.MAPPER;

TileDeck = function () {
  "use strict";
  this.deck = [];
  this.dataSource = [];
  this.cursor = 0;
};

/**
 * Shuffles the deck of tiles using Durstenfeld shuffle, as suggested on StackOverflow:
 * http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
TileDeck.prototype.shuffle = function () {
  "use strict";
  var deck = this.deck,
      temp,
      i,
      j;

  this.cursor = 0;

  for (i = deck.length - 1; i > 0; i--) {
      j = Math.floor(Math.random() * (i + 1));
      temp = deck[i];
      deck[i] = deck[j];
      deck[j] = temp;
  }

  this.deck = deck;
};

TileDeck.prototype.filter = function () {
  "use strict";
  this.deck = this.dataSource.filter(function (tile) {
    return mapSettings.lineup[tile.artist_id];
  });
  this.shuffle();
};

TileDeck.prototype.draw = function () {
  var cardDrawn = this.deck[this.cursor];

  this.cursor += 1;
  if ((this.cursor % this.deck.length) === 0) {
    this.shuffle();
  }

  return cardDrawn;
};

TileDeck.prototype.stock = function (stockpile) {
  this.dataSource = stockpile || [];
  this.filter();
};

tileLibrary = {
  tile: new TileDeck(),
  edge: new TileDeck(),
  corner: new TileDeck(),
  top: new TileDeck(),
  tco: new TileDeck(),
  btm: new TileDeck(),
  bco: new TileDeck()
};

var createCookie = function (name, value, days) {
    var date, expires;
    if (days) {
      date = new Date();
      date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
      expires = "; expires=" + date.toGMTString();
    } else {
      expires = "";
    }
    document.cookie = name + "=" + value + expires + "; path=/";
  },
  readCookie = function (name) {
    var nameEQ = name + "=",
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
  eraseCookie = function (name) {
    createCookie(name, "", -1);
  },
  appendTab = function (rotation) {
    var newTab = document.createElement('img'),
        tilesElement = document.getElementById('tiles');

    newTab.classList.add('tab');
    newTab.classList.add('rot' + rotation);
    newTab.setAttribute('data-rot', rotation);
    newTab.setAttribute('data-type', 'tab');
    newTab.setAttribute('src', '../images/tab.png');
    tilesElement.appendChild(newTab);
  },
  appendTile = function (type, rotation) {
    var newTile = tileLibrary[type].draw(),
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
  },
  applyGridOverlay = function (gridType) {
    console.debug('applyGridOverlay', gridType);
    var gridElement = document.getElementById('grid');

    mapSettings.gridType = parseInt(gridType, 10);
    switch (mapSettings.gridType) {
      case 1:
        gridElement.style.background = "url(/grid_15.png)";
        break;
      case 2:
        gridElement.style.background = "url(/grid_30.png)";
        break;
      case 3:
        gridElement.style.background = "url(/images/hex.png)";
        break;
      default:
        gridElement.style.background = "transparent";
        break;
    }
    ga('send', 'event', 'Grid', 'Type ' + gridType);
  },
  composeMap = function () {
    var width = mapSettings.width,
        height = mapSettings.height,
        tops,
        btms,
        tcorners,
        bcorners,
        fullWidth,
        i,
        j,
        edgerotationa;

    endstag = ((tileLibrary['edge'].deck.length > 0) && (mapSettings.mode === 3));
    mapSettings.hasEndcaps = ((tileLibrary['edge'].deck.length > 0) && (mapSettings.mode === 2));
    corners = ((tileLibrary['corner'].deck.length > 0) && (mapSettings.mode === 2));
    if (maptype === 6) {
      tops = ((tileLibrary['top'].deck.length > 0) && (mapSettings.mode === 2));
      tcorners = ((tileLibrary['tco'].deck.length > 0) && (mapSettings.mode === 2));
      btms = ((tileLibrary['btm'].deck.length > 0) && (mapSettings.mode === 2));
      bcorners = ((tileLibrary['bco'].deck.length > 0) && (mapSettings.mode === 2));
      $("#viewport").removeClass("nm").addClass("sv");
      $("#notification").slideUp("fast");
    } else {
      $("#viewport").removeClass("sv").addClass("nm");
      if (((mapSettings.mode === 2) || (mapSettings.mode === 3)) && ((tileLibrary['edge'].deck.length === 0) || (tileLibrary['corner'].deck.length === 0))) {
        $("#notification span").text("The tile sets you selected do not contain the right tile mix for your selected map mode. Falling back to the closest possible map mode.");
        $("#notification").slideDown("fast");
      } else {
        $("#notification").slideUp("fast");
      }
    }
    // Prepare Drawing Area
    var tileDiv = document.getElementById("tiles");
    if (mapSettings.mode !== 4) {
      fullWidth = 300 * width + 2;
      if (mapSettings.hasEndcaps) { fullWidth += 300; }
      $("#map, #tiles").width(fullWidth + "px");
      $("#tiles").empty();
      if (maptype !== 6) {
        if (mapSettings.hasEndcaps) {
          if (corners) { appendTile("corner", 0); }
          for (j = 0; j < width - stagcount; j += 1) { appendTile("edge", 0); }
          if (corners) { appendTile("corner", 1); }
          tileDiv.appendChild(document.createElement('br'));
        }
      } else {
        if (tops) {
          if (tcorners) { appendTile("tco", 0); }
          for (j = 0; j < width - stagcount; j += 1) { appendTile("top", 0); }
          if (tcorners) { appendTile("tco", 1); }
          tileDiv.appendChild(document.createElement('br'));
        }
      }
      for (i = 0; i < height; i += 1) {
        edgerotationa = (maptype === 6) ? 0 : 3;
        if (mapSettings.hasEndcaps || (endstag && (stagcount === 1))) { appendTile("edge", edgerotationa); }
        for (j = 0; j < width - stagcount; j += 1) { appendTile("tile", randInt(0, 3)); }
        if (mapSettings.hasEndcaps || (endstag && (stagcount === 1))) { appendTile("edge", 1); }
        if ((mapSettings.mode === 1) || (mapSettings.mode === 3)) { stagcount = 1 - stagcount; }
        tileDiv.appendChild(document.createElement('br'));
      }
      if (maptype !== 6) {
        if (mapSettings.hasEndcaps) {
          if (corners) { appendTile("corner", 3); }
          for (j = 0; j < width - stagcount; j += 1) { appendTile("edge", 2); }
          if (corners) { appendTile("corner", 2); }
          tileDiv.appendChild(document.createElement('br'));
        }
      } else {
        if (btms) {
          if (bcorners) { appendTile("bco", 0); }
          for (j = 0; j < width - stagcount; j += 1) { appendTile("btm", 0); }
          if (bcorners) { appendTile("bco", 1); }
          tileDiv.appendChild(document.createElement('br'));
        }
      }
    } else {
      $("#map, #tiles").width("902px");
      $("#tiles").empty();
      appendTab(0);
      appendTile("tile", randInt(0, 3));
      appendTab(2);
      tileDiv.appendChild(document.createElement('br'));
      appendTile("tile", randInt(0, 3));
      appendTile("tile", randInt(0, 3));
      appendTile("tile", randInt(0, 3));
      tileDiv.appendChild(document.createElement('br'));
      appendTab(0);
      appendTile("tile", randInt(0, 3));
      appendTab(2);
      tileDiv.appendChild(document.createElement('br'));
      appendTab(0);
      appendTile("tile", randInt(0, 3));
      appendTab(2);
      tileDiv.appendChild(document.createElement('br'));
      var tab_bottom = document.createElement('img');
      tab_bottom.setAttribute('class','rot0');
      tab_bottom.setAttribute('data-rot','0');
      tab_bottom.setAttribute('data-type','tab');
      tab_bottom.setAttribute('src','../images/tab_bottom.png');
      tileDiv.appendChild(tab_bottom);
    }
    tilecount = $("#tiles img").length;
  },

  loadRoster = function () {
    $.post("scripts/load_authors.php", {
      "map_kind": maptype
    }, onRosterDataLoaded);
  },

  onRosterDataLoaded = function (responseString) {
    var displayHTML = '',
        data = $.parseJSON(responseString),
        artistsPresent = data.length,
        newLineup = {};

    mapSettings.roster = data;

    for (var p = 0; p < artistsPresent; p++) {
      newLineup[data[p].artist_id] = true;
      displayHTML += "<input type='checkbox' name='tileset' class='panelChk' " +
                      " id='chk" + data[p].artist_id + "' value='" + data[p].artist_id + "' checked />" +
                      "<label for='chk" + data[p].artist_id + "' data-artist='" + data[p].artist_id + "'>" +
                        "<img src='../m_icons/" + data[p].icon + ".png' />" +
                        "<span class='name'>" +
                          "<span class='nick'>" + data[p].initials + "</span>" +
                          "<span class='full'>" + data[p].name + "</span>" +
                        "</span>" +
                      "</label>";
    }

    mapSettings.lineup = newLineup;

    downloadTileData(selectTileSets);

    $("#artistsblock").html(displayHTML);
  },
  downloadTileData = function (callback) {
    $.post("scripts/load_morphs.php", { "map_kind": maptype }, function (data) {
      var fulldata = $.parseJSON(data);
      tileLibrary['tile'].stock(fulldata[1]);
      tileLibrary['edge'].stock(fulldata[2]);
      tileLibrary['corner'].stock(fulldata[3]);
      if (maptype === 6) {
        tileLibrary['top'].stock(fulldata[4]);
        tileLibrary['tco'].stock(fulldata[5]);
        tileLibrary['btm'].stock(fulldata[6]);
        tileLibrary['bco'].stock(fulldata[7]);
      }
      if (callback) {
        callback();
      }
    });
  },
  generateMap = function () {
    mapSettings.mode = parseInt($('input:radio[name=mode]:checked').val(), 10);
    MAPPER.selectTile();
    MAPPER.isSwapping = false;
    imag = '';
    stagcount = 0;
    if (mapSettings.mode !== 4) {
      mapSettings.height = parseInt($("#height").val(), 10);
      mapSettings.width = parseInt($("#width").val(), 10);
    } else {
      mapSettings.height = 4;
      mapSettings.width = 3;
    }
    normalTileCount = mapSettings.height * mapSettings.width;
    if (maptype !== 6) {
      edgeTileCount = 2 * (mapSettings.height + mapSettings.width);
    } else {
      edgeTileCount = 2 * mapSettings.height;
    }
    composeMap();
  },
  selectTileSets = function () {
    var newLineup = {};
    $("#artistsblock input").filter(":checked").each(function () {
      newLineup[$(this).val()] = true;
    });
    mapSettings.lineup = newLineup;
    tileLibrary['tile'].filter();
    tileLibrary['edge'].filter();
    tileLibrary['corner'].filter();
    if (maptype === 6) {
      tileLibrary['top'].filter();
      tileLibrary['tco'].filter();
      tileLibrary['btm'].filter();
      tileLibrary['bco'].filter();
    }
    generateMap();
  },
  exportMap = function () {
    var imageHolder = new Image();
    if (mapSettings.mode === 4) {
      $("#notification span").text("Export for cubes is currently not working. Please try your browser's print option instead.");
      $("#notification").slideDown("fast");
      ga('send', 'event', 'Export', 'Failed-Cube');
    } else if ((mapSettings.mode === 1) || (mapSettings.mode === 3) || (mapSettings.mode === 4) || (maptype === 6)) {
      var dataURL;
      $("#notification").slideUp("fast");
      if ((mapSettings.width * mapSettings.height) > 36) {
        if (!confirm("Whoa there! Your browser might choke on saving a map of this size and crash the tab and/or window. Are you sure you want to let it run?")) { return false; }
      }
      //artMode.clearRect(0,0,artBoard.width,artBoard.height);
      artBoard.width = imgBoard.width() - 2;
      artBoard.height = imgBoard.height();
      if (mapSettings.mode === 4) {
        artBoard.width = "900px";
        artBoard.height = "1235px";
      }
      $("#tiles").find("img").each(function () {
        artMode.save();
        mypos = $(this).position();
        myrot = $(this).data("rot");
        mywid = $(this).width();
        myhei = $(this).height();
        imageHolder.src = $(this).attr("src");
        mypos.left -= 22;
        mypos.top -= 22;
        if (maptype === 6) {
          artMode.translate(mypos.left + (mywid / 2), mypos.top + (myhei / 2));
          if ((myrot % 2) === 1) {
            artMode.scale(-1, 1);
          }
        } else {
          if ((myrot % 2) === 1 && mywid > 150 && myhei < 300) {
            mypos.left -= 150;
            mypos.top += 75;
          }
          artMode.translate(mypos.left + (mywid / 2), mypos.top + (myhei / 2));
          artMode.rotate(myrot * Math.PI / 2);
        }
        artMode.drawImage(imageHolder, -(mywid / 2), -(myhei / 2), mywid, myhei);
        artMode.restore();
      });
      $("#grid").find("img").each(function () {
        artMode.save();
        mypos = $(this).position();
        mywid = $(this).width();
        myhei = $(this).height();
        imageHolder.src = $(this).attr("src");
        artMode.translate(mypos.left + (mywid / 2), mypos.top + (myhei / 2));
        artMode.drawImage(imageHolder, -(mywid / 2), -(myhei / 2), mywid, myhei);
        artMode.restore();
      });
      dataURL = artBoard.toDataURL();
      window.open(dataURL, 'MapWindow', 'width=800,height=600,scrollbars=yes');
      artBoard.width = artBoard.width * 2 / 2;
      ga('send', 'event', 'Export', 'Canvas');
    } else {
      if ((mapSettings.width * mapSettings.height) > 64) {
        $("#notification span").text("This map looks too big to export to PNG without causing an error. Sorry!");
        $("#notification").slideDown("fast");
        ga('send', 'event', 'Export', 'Failed');
      } else {
        var fullMapURL, mapData;
        $("#notification").slideUp("fast");
        mapData = {'tiles': [], 'rotation': []};
        $("#tiles img").each(function (i) {
          mapData.tiles[i] = $(this).data("imgid");
          mapData.rotation[i] = $(this).data("rot");
        });
        fullMapURL = 'fullmap.php?mapData=' +
          base64_encode(JSON.stringify(mapData)) +
          '&w=' + mapSettings.width +
          '&h=' + mapSettings.height;
        if (mapSettings.hasEndcaps) {
          fullMapURL += '&e=1';
        } else {
          fullMapURL += '&e=0';
        }
        if (corners) {
          fullMapURL += '&c=1';
        } else {
          fullMapURL += '&c=0';
        }
        fullMapURL += '&g=' + mapSettings.gridType.toString();
        window.open(fullMapURL, 'MapWindow', 'width=800,height=600,scrollbars=yes');
      }
      ga('send', 'event', 'Export', 'PHP');
    }
  },
  replaceTile = function ($image, oldtile, type, hasexit) {
    var tileimg = tileLibrary[type].draw();

    // if (hasexit) {
    //   $("#notification span").text("Exit tiles had to be temporarily disabled while optimizations were made to keep the site online. Sorry!");
    //   $("#notification").slideDown("fast");
    // }
    $image.attr("src", "../tiles/" + tileimg.image).data("imgid", tileimg.id).data("artist", tileimg.artist_id);
    ga('send', 'event', 'Replace Tile', type);
  },
  nextGrid = function () {
    applyGridOverlay((mapSettings.gridType + 1) % 4);
    ga('send', 'event', 'Grid Settings', 'Rotate via Keyboard');
  },

  /**
   * Displays a popup with the provided content.
   * 
   * @param  {string} overlayContent
   *     A string of HTML content.
   */
  showOverlay = function (overlayContent) {
      var overlayContainer = $("#popup"),
          overlayContentBox = overlayContainer.find('div');

      overlayContentBox.html(overlayContent);
      overlayContainer.show();
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
    if (event.dataTransfer.getData("text/html") == "Swap") {
      MAPPER.performSwap($(this));
      ga('send', 'event', 'Swap', 'Drop');
    }
  },

  /**
   * Handler for clicking an image on the map.
   */
  onImageClick = function () {
    // Ignore tabs from cube mode.
    if ($(this).data("type") === "tab") {
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
      replaceTile($target, $target.data("imgid"), "tile", false);
      ga('send', 'event', 'Replace', 'Ctrl+DblClick');
    } else {
      oldRot = $(this).data("rot");
      newRot = (oldRot + 1) % 4;
      $(this).data("rot", newRot).removeClass("rot" + oldRot).addClass("rot" + newRot);
      ga('send', 'event', 'Rotate', 'DblClick');
    }
  },

  onEdgeDoubleClick = function (e) {
    if (e.metaKey) {
      var $target = $(this);

      replaceTile($target, $target.data("imgid"), "edge", false);
    }
  },

  onCornerDoubleClick = function (e) {
    if (e.metaKey) {
      var $target = $(this);

      replaceTile($target, $target.data("imgid"), "corner", false);
    }
  },

  onTopDoubleClick = function (e) {
    var $target = $(this),
        oldRot,
        newRot;

    if (e.metaKey) {
      replaceTile($target, $target.data("imgid"), "top", false);
    } else {
      oldRot = $(this).data("rot");
      newRot = (oldRot + 1) % 2;
      $(this).data("rot", newRot).removeClass("rot" + oldRot).addClass("rot" + newRot);
    }
  },

  onTopCornerDoubleClick = function (e) {
    if (e.metaKey) {
      var $target = $(this);

      replaceTile($target, $target.data("imgid"), "tco", false);
    }
  },

  onBottomDoubleClick = function (e) {
    var $target = $(this),
        oldRot,
        newRot;

    if (e.metaKey) {
      replaceTile($target, $target.data("imgid"), "btm", false);
    } else {
      oldRot = $(this).data("rot");
      newRot = (oldRot + 1) % 2;
      $(this).data("rot", newRot).removeClass("rot" + oldRot).addClass("rot" + newRot);
    }
  },

  onBottomCornerDoubleClick = function (e) {
    if (e.metaKey) {
      var $target = $(this);

      replaceTile($target, $target.data("imgid"), "bco", false);
    }
  },

  onTileBoardClick = function (e) {
    if ($(this).hasClass("iconmode")) {
      var offset = $(this).offset(),
          theX = e.clientX - offset.left - 15,
          theY = e.clientY - offset.top - 15,
          garyOak = $("<img />").attr("src","../images/fab.png").css({
            'top': theY + 'px',
            'left': theX + 'px',
            'width': '30px'
          }).appendTo($(this));
    }
  },

  /**
   * Setup for the app that is performed when the document is ready.
   */
  initApp = function () {
    // Initialize click handler for overlay.
    $("#popup").click(function () {
      $(this).fadeOut("fast");
    });

    // Initialize click handler for mobile button.
    $("#mapTypeMenuBtn").click(toggleMobileMenu);

    // Close side panel when clicking off of the main content area.
    $("#sideBar").on('click tap', function (e) {
      if (e.target.tagName === 'SECTION') {
        $("#sideBar").removeClass('shown');
      }
    });

    // Add listeners to the artist seletion list.
    $("#artistsblock")
      .on('change', 'input', function (e) {
        if (e.metaKey) { $(this).prop("checked", true).siblings("input").prop("checked", false); }
        selectTileSets();
      })
      .on('dblclick', 'label', function () {
        var $target = $(this).attr("for");
        $("#" + $target).prop("checked", true).siblings("input").prop("checked", false);
        selectTileSets();
      });

    // Check if user has seen onboarding popup recently and display it if not.
    if (readCookie("popup") !== "overlay") {
      showOverlay([
        '<h2>New to the Mapper?</h2>',
        '<ul>',
        '<li><strong>Make maps for tabletop RPGs</strong> including caverns, dungeons, vertical dungeons, towns, and spaceships.</li>',
        '<li><strong>Configure your map</strong> using the toolbar above. Choose size, type, layout, and more.</li>',
        '<li><strong>Click tiles</strong> and use the handy selection menu to fine-tune your generated map.</li>',
        '<li><strong>Choose your map artist(s)</strong> by toggling them on the left-hand panel. Double-click an artist or hit the heart button with a tile selected to switch to a single artist.</li>',
        '<li><strong>On multitouch devices</strong> use two-finger twist to rotate tiles.</li>',
        '</ul>',
        '<p><em>Click anywhere to close.</em></p>'
      ].join(''));
      createCookie("popup", "overlay", 90);
      ga('send', 'event', 'New User Overlay');
    }

    $('#newWindowB').click(exportMap);
    artBoard = document.getElementById("drawingboard");
    artMode = artBoard.getContext("2d");
    $("#newBtn").click(generateMap);
    $("input.mtBtn").click(function () {
      map_kind = parseInt($(this).val(), 10);
    });
    $('#mapTypeSelector').on('click tap', 'input:radio[name=maptype]', function () {
      if ($mobilemode) { $(this).blur(); }
      maptype = parseInt($(this).val(), 10);
      loadRoster();
    });
    $("#mapViewControls")
      .on("click tap", "#nogrid", function () {
        applyGridOverlay(0);
      })
      .on("click tap", "#grid5", function () {
        applyGridOverlay(1);
      })
      .on("click tap", "#grid10", function () {
        applyGridOverlay(2);
      })
      .on("click tap", "#gridhex", function () {
        applyGridOverlay(3);
      });
    $("#rotateTile").click(function () {
      if (jQuery.inArray(MAPPER.selectedTile.data("type"), ["tile","top","btm"]) < 0) { return false; }
      var oldRot = MAPPER.selectedTile.data("rot"),
        newRot = (oldRot + 1) % 4;
      MAPPER.selectedTile.data("rot", newRot).removeClass("rot" + oldRot).addClass("rot" + newRot);
      ga('send', 'event', 'Rotate', 'Click');
      return false;
    });
    $("#removeTile").click(function () {
      replaceTile(MAPPER.selectedTile, MAPPER.selectedTile.data("imgid"), MAPPER.selectedTile.data("type"), false);
      return false;
    });

    $("#width").val(2);
    $("#height").val(2);
    mapSettings.mode = parseInt($('input:radio[name=mode]:checked').val(), 10);
    applyGridOverlay($('input:radio[name=grid]:checked').val());
    maptype = parseInt($('input:radio[name=maptype]:checked').val(), 10);

    loadRoster();

    if (maptype === 6) {
      $("#viewport").addClass("sv").removeClass("nm");
    } else {
      $("#viewport").addClass("nm").removeClass("sv");
    }
    if ($("#fitwidth").is(":checked")) { scaled = true; }
    if (($mobilemode) && (ua.indexOf("Android") >= 0)) {
      var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8));
      if (androidversion < 3) {
        $("body").addClass("faildroid");
      }
    }

    if ($appmode) {
      $("body").addClass('standalone-app');
      $("#notification").css({"top": "64px;"});
      $("#newnav,#site-foot").hide();
    }

    if ($("canvas#grid").length > 0) {
      $("#grid").remove();
      $("<div id='grid'></div>").appendTo("#map");
    }

    // Add listeners to the tiles holder.
    imgBoard = $('#tiles');
    imgBoard
      // Handle dragging a tile
      .on('dragstart', 'img', onImageDragStart)
      // Handle dropping a tile
      .on("dragover", "img", function (event) {
        event.originalEvent.preventDefault();
      })
      .on("drop", "img", onImageDragDrop)
      // Handle clicking on a tile
      .on("click tap", "img", onImageClick)
      // Handle double-clicks, including modified double-clicks
      .on("dblclick", "img.tile", onTileDoubleClick)
      .on("dblclick", "img.edge", onEdgeDoubleClick)
      .on("dblclick", "img.corner", onCornerDoubleClick)
      .on("dblclick", "img.top", onTopDoubleClick)
      .on("dblclick", "img.tco", onTopCornerDoubleClick)
      .on("dblclick", "img.btm", onBottomDoubleClick)
      .on("dblclick", "img.bco", onBottomCornerDoubleClick)
      .on("click", onTileBoardClick);

    // Handle the remove/replace with exit button
    $("#removeTileExit").on("click tap", function () {
      replaceTile(MAPPER.selectedTile, MAPPER.selectedTile.data("imgid"), MAPPER.selectedTile.data("type"), true);
      ga('send', 'event', 'Remove Tile', 'Exit');
      return false;
    });
    // Handle swapping button
    $("#swapTileBtn").on("click tap", function () {
      if (MAPPER.selectedTile.data("type") === "tab") { return; }
      MAPPER.selectedTile.addClass("swapfirst");
      MAPPER.isSwapping = true;
      $("#swapTileBtn").addClass("down");
      ga('send', 'event', 'Swap', 'Tool Click');
      return false;
    });
    // Handle mancrush button
    $("#mancrush").on("click tap", function () {
      var $target = MAPPER.selectedTile.data("artist");

      $("#chk" + $target).prop("checked", true).siblings("input").prop("checked", false);
      ga('send', 'event', 'Heart', 'Click');
      selectTileSets();
    });
    // Redraw the map when width or height are changed
    $("#width, #height").on("change", generateMap);
    // Change mode based on radio button value changing
    $('input:radio[name=mode]').on("click tap change", function () {
      mapSettings.mode = parseInt($(this).val(), 10);
      generateMap();
      ga('send', 'event', 'Mode', 'Change');
    });

    // Add "Add to Home" hint in appropriate browser settings.
    if ('standalone' in window.navigator && !window.navigator.standalone && $mobilemode && $issafari) {
      $('<link rel="stylesheet" href="/style/add2home.css" />').appendTo("body");
      $('<script src="/scripts/add2home.js"><\/s' + 'cript>').appendTo("body");
    }
  },

  /**
   * Handler for when a detected multitouch performs rotation.
   * @param  {Object} event The event object
   */
  onHammerRotateDetected = function (event) {
    if (MAPPER.selectedTile.data("type") == 'tile') {
      var oldRot = MAPPER.selectedTile.data("rot");
      MAPPER.isRotating = true;
      detectedrotate = ((oldRot * 90) + Math.round(event.gesture.rotation) + 360) % 360;
      MAPPER.selectedTile.removeClass("rot" + oldRot).css({
        '-webkit-transform' : 'rotateZ(' + detectedrotate + 'deg)',
        '-moz-transform' : 'rotateZ(' + detectedrotate + 'deg)',
        '-ms-transform' : 'rotateZ(' + detectedrotate + 'deg)',
        '-o-transform' : 'rotateZ(' + detectedrotate + 'deg)',
        'transform' : 'rotateZ(' + detectedrotate + 'deg)',
        '-webkit-transition' : 'none',
        '-moz-transition' : 'none',
        '-ms-transition' : 'none',
        '-o-transition' : 'none',
        'transition' : 'none',
        'zoom' : 1
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
      var oldRot = MAPPER.selectedTile.data("rot"),
          newRot = Math.round(detectedrotate / 90) % 4;
      MAPPER.selectedTile.data("rot", newRot).removeClass("rot" + oldRot).addClass("rot" + newRot).css({
        '-webkit-transform' : '',
        '-moz-transform' : '',
        '-ms-transform' : '',
        '-o-transform' : '',
        'transform' : '',
        '-webkit-transition' : '',
        '-moz-transition' : '',
        '-ms-transition' : '',
        '-o-transition' : '',
        'transition' : '',
        'zoom' : 1
      });
      detectedrotate = 0;
      ga('send', 'event', 'Rotate', 'Release Touch');
    }
  },

  // Key Event Handler named functions
  // per https://github.com/davmillar/DavesMapper/issues/40
  cappedEndsMode = function () {
    $("#endBtn").click();
    ga('send', 'event', 'Mode', 'Keyboard', 'FullMap');
    generateMap();
  },

  fitWidth = function () {
    $("#fitwidth").click();
  },

  normalMode = function () {
    $("#normal").click();
    ga('send', 'event', 'Mode', 'Keyboard', 'Normal');
    generateMap();
  },

  toggleIconMode = function () {
    $("#grid").toggleClass("iconmode");
  },

  staggeredMode = function () {
    $("#stagger").click();
    ga('send', 'event', 'Mode', 'Keyboard', 'Staggered');
    generateMap();
  },

  staggeredCappedMode = function () {
    $("#stagcap").click();
    ga('send', 'event', 'Mode', 'Keyboard', 'StaggeredCapped');
    generateMap();
  },

  toggleMobileMenu = function () {
    $('#sideBar').toggleClass('shown');
  };

$(document)
  // Initialization
  .ready(initApp)
  // Multitouch goodness
  .hammer()
  // Generic whole-document listeners
  .on("rotate", onHammerRotateDetected)
  .on("release", onHammerReleaseDetected)
  // Bind the keydown events for shortcuts
  .bind("keydown", "c", cappedEndsMode)
  .bind("keydown", "f", fitWidth)
  .bind("keydown", "g", nextGrid)
  .bind("keydown", "n", generateMap)
  .bind("keydown", "shift+n", normalMode)
  .bind("keydown", "shift+y", toggleIconMode)
  .bind("keydown", "s", staggeredMode)
  .bind("keydown", "shift+s", staggeredCappedMode);
