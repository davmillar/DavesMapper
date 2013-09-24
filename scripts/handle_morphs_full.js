var artBoard, artMode, imgBoard, mypos, myrot, mywid, myhei, mapWidth, mapHeight, endcaps, corners, endstag, map_kind,
	$tp, $curves, $tbars, $twide, $owide,
	imgho = new Image(), scaled = false, swap = false, inrotate = false,
	currentmode = 0, gridsize = 0, buggedyet = 0, maptype = 1, stagcount = 0, tilecount = 0, normalTileCount = 0, edgeTileCount = 0, detectedrotate = 0,
	tileSetOptions = "", imag = "",
	iMenuTarget = null,
	roomContents = ["Empty", "Monster(s) and Treasure", "Monster(s) and Treasure", "Empty, Hidden Treasure", "Trap, Treasure", "Trap", "Monster(s)", "Monster(s)", "Monster(s)", "Monster(s)"],
	specialContents = ["Hindrance", "Danger", "Advantage", "Mystery", "Special Creature", "Odor", "Power"],
	$appmode = window.navigator.standalone,
	$mobilemode = ((/iphone|ipod|ipad|android/gi).test(navigator.platform)),
	$issafari = ((/Safari/i).test(navigator.appVersion)),
	ua = navigator.userAgent,
	TileDeck = function () {
		this.deck = [];
		this.cursor = 0;
		this.shuffle = function () {
			this.deck.sort(function () {
				return Math.round(Math.random()) - 0.5;
			});
		};
		this.draw = function () {
			var cardDrawn = this.deck[this.cursor];
			this.cursor += 1;
			if ((this.cursor % this.deck.length) === 0) { this.cursor = 0; this.shuffle(); }
			return cardDrawn;
		};
		this.stock = function (stockpile) {
			this.deck = [];
			this.deck = stockpile;
			this.cursor = 0;
			this.shuffle();
		};
	},
	mainTiles = new TileDeck(),
	edgeTiles = new TileDeck(),
	cornerTiles = new TileDeck(),
	topTiles = new TileDeck(),
	tcoTiles = new TileDeck(),
	btmTiles = new TileDeck(),
	bcoTiles = new TileDeck(),
	createCookie = function (name, value, days) {
		"use strict";
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
		"use strict";
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
		"use strict";
		createCookie(name, "", -1);
	},
	appendTab = function (rotation) {
		"use strict";
		$("#tiles").append("<img class='tab rot" + rotation + "' data-rot='" + rotation + "' data-type='tab' src='../images/tab.png'/>");
	},
	appendTile = function (type, rotation) {
		"use strict";
		var tileimg;
		switch (type) {
		case "corner":
			tileimg = cornerTiles.draw();
			break;
		case "edge":
			tileimg = edgeTiles.draw();
			break;
		case "top":
			tileimg = topTiles.draw();
			break;
		case "tco":
			tileimg = tcoTiles.draw();
			break;
		case "btm":
			tileimg = btmTiles.draw();
			break;
		case "bco":
			tileimg = bcoTiles.draw();
			break;
		default:
			tileimg = mainTiles.draw();
			break;
		}
		$("#tiles").append("<img draggable='true' class='" + type + " rot" + rotation + "' data-rot='" + rotation + "' data-type='" + type + "' data-imgid='" + tileimg.id + "' data-artist='" + tileimg.artist_id + "' src='../tiles/" + tileimg.image + "'/>");
	},
	composeMap = function (mapWidth, mapHeight) {
		"use strict";
		var tops, btms,
			tcorners, bcorners,
			fullWidth,
			i,
			j,
			edgerotationa;
		endstag = ((edgeTiles.deck.length > 0) && (currentmode === 3));
		endcaps = ((edgeTiles.deck.length > 0) && (currentmode === 2));
		corners = ((cornerTiles.deck.length > 0) && (currentmode === 2));
		if (maptype === 6) {
			tops = ((topTiles.deck.length > 0) && (currentmode === 2));
			tcorners = ((tcoTiles.deck.length > 0) && (currentmode === 2));
			btms = ((btmTiles.deck.length > 0) && (currentmode === 2));
			bcorners = ((bcoTiles.deck.length > 0) && (currentmode === 2));
			$("#viewport").removeClass("nm").addClass("sv");
			$("#notification").slideUp("fast");
		} else {
			$("#viewport").removeClass("sv").addClass("nm");
			if (((currentmode === 2) || (currentmode === 3)) && ((edgeTiles.deck.length === 0) || (cornerTiles.deck.length === 0))) {
				$("#notification span").text("The tile sets you selected do not contain the right tile mix for your selected map mode. Falling back to the closest possible map mode.");
				$("#notification").slideDown("fast");
			} else {
				$("#notification").slideUp("fast");
			}
		}
		// Prepare Drawing Area
		if (currentmode !== 4) {
			fullWidth = 300 * mapWidth + 2;
			if (endcaps) { fullWidth += 300; }
			$("#map, #tiles").width(fullWidth + "px");
			$("#tiles").empty();
			if (maptype !== 6) {
				if (endcaps) {
					if (corners) { appendTile("corner", 0); }
					for (j = 0; j < mapWidth - stagcount; j += 1) { appendTile("edge", 0); }
					if (corners) { appendTile("corner", 1); }
					$("#tiles").append('<br/>');
				}
			} else {
				if (tops) {
					if (tcorners) { appendTile("tco", 0); }
					for (j = 0; j < mapWidth - stagcount; j += 1) { appendTile("top", 0); }
					if (tcorners) { appendTile("tco", 1); }
					$("#tiles").append('<br/>');
				}
			}
			for (i = 0; i < mapHeight; i += 1) {
				edgerotationa = (maptype === 6) ? 0 : 3;
				if (endcaps || (endstag && (stagcount === 1))) { appendTile("edge", edgerotationa); }
				for (j = 0; j < mapWidth - stagcount; j += 1) { appendTile("tile", randInt(0, 3)); }
				if (endcaps || (endstag && (stagcount === 1))) { appendTile("edge", 1); }
				if ((currentmode === 1) || (currentmode === 3)) { stagcount = 1 - stagcount; }
				$("#tiles").append('<br/>');
			}
			if (maptype !== 6) {
				if (endcaps) {
					if (corners) { appendTile("corner", 3); }
					for (j = 0; j < mapWidth - stagcount; j += 1) { appendTile("edge", 2); }
					if (corners) { appendTile("corner", 2); }
					$("#tiles").append('<br/>');
				}
			} else {
				if (btms) {
					if (bcorners) { appendTile("bco", 0); }
					for (j = 0; j < mapWidth - stagcount; j += 1) { appendTile("btm", 0); }
					if (bcorners) { appendTile("bco", 1); }
					$("#tiles").append('<br/>');
				}
			}
		} else {
			$("#map, #tiles").width("902px");
			$("#tiles").empty();
			appendTab(0);
			appendTile("tile", randInt(0, 3));
			appendTab(2);
			$("#tiles").append('<br/>');
			appendTile("tile", randInt(0, 3));
			appendTile("tile", randInt(0, 3));
			appendTile("tile", randInt(0, 3));
			$("#tiles").append('<br/>');
			appendTab(0);
			appendTile("tile", randInt(0, 3));
			appendTab(2);
			$("#tiles").append('<br/>');
			appendTab(0);
			appendTile("tile", randInt(0, 3));
			appendTab(2);
			$("#tiles").append('<br/>');
			$("#tiles").append("<img class='rot0' data-rot='0' data-type='tab' src='../images/tab_bottom.png'/>");
		}
		tilecount = $("#tiles img").length;
	},
	drawMap = function () {
		"use strict";
		iMenuTarget = null;
		swap = false;
		currentmode = parseInt($('input:radio[name=mode]:checked').val(), 10);
		imag = '';
		stagcount = 0;
		if (currentmode !== 4) {
			mapHeight = parseInt($("#height").val(), 10);
			mapWidth = parseInt($("#width").val(), 10);
		} else {
			mapHeight = 4;
			mapWidth = 3;
		}
		if (maptype !== 6) {
			normalTileCount = mapHeight * mapWidth;
			edgeTileCount = 2 * (mapHeight + mapWidth);
			$.post("scripts/load_morphs.php", { "amount": normalTileCount, "tile_kind": 1, "map_kind": maptype, "artists": tileSetOptions }, function (data) {
				mainTiles.stock($.parseJSON(data));
				$.post("scripts/load_morphs.php", { "amount": edgeTileCount, "tile_kind": 2, "map_kind": maptype, "artists": tileSetOptions }, function (data) {
					edgeTiles.stock($.parseJSON(data));
					$.post("scripts/load_morphs.php", { "amount": 4, "tile_kind": 3, "map_kind": maptype, "artists": tileSetOptions }, function (data) {
						cornerTiles.stock($.parseJSON(data));
						composeMap(mapWidth, mapHeight);
					});
				});
			});
		} else {
			normalTileCount = mapHeight * mapWidth;
			edgeTileCount = 2 * mapHeight;
			$.post("scripts/load_morphs.php", { "amount": normalTileCount, "tile_kind": 1, "map_kind": 6, "artists": tileSetOptions }, function (data) {
				mainTiles.stock($.parseJSON(data));
				$.post("scripts/load_morphs.php", { "amount": edgeTileCount, "tile_kind": 2, "map_kind": 6, "artists": tileSetOptions }, function (data) {
					edgeTiles.stock($.parseJSON(data));
					$.post("scripts/load_morphs.php", { "amount": 4, "tile_kind": 3, "map_kind": 6, "artists": tileSetOptions }, function (data) {
						cornerTiles.stock($.parseJSON(data));
						$.post("scripts/load_morphs.php", { "amount": mapWidth, "tile_kind": 4, "map_kind": 6, "artists": tileSetOptions }, function (data) {
							topTiles.stock($.parseJSON(data));
							$.post("scripts/load_morphs.php", { "amount": 2, "tile_kind": 5, "map_kind": 6, "artists": tileSetOptions }, function (data) {
								tcoTiles.stock($.parseJSON(data));
								$.post("scripts/load_morphs.php", { "amount": mapWidth, "tile_kind": 6, "map_kind": 6, "artists": tileSetOptions }, function (data) {
									btmTiles.stock($.parseJSON(data));
									$.post("scripts/load_morphs.php", { "amount": 2, "tile_kind": 7, "map_kind": 6, "artists": tileSetOptions }, function (data) {
										bcoTiles.stock($.parseJSON(data));
										composeMap(mapWidth, mapHeight);
									});
								});
							});
						});
					});
				});
			});
		}
	},
	selectTileSets = function () {
		"use strict";
		tileSetOptions = "";
		$("#artistsblock input").filter(":checked").each(function () { tileSetOptions += $(this).val() + ","; });
		tileSetOptions = tileSetOptions.substr(0, tileSetOptions.length - 1);
		drawMap();
	},
	courtney = function () {
		"use strict";
		var dataURL;
		$("#notification").slideUp("fast");
		if ((mapWidth * mapHeight) > 36) {
			if (!confirm("Whoa there! Your browser might choke on saving a map of this size and crash the tab and/or window. Are you sure you want to let it run?")) { return false; }
		}
		//artMode.clearRect(0,0,artBoard.width,artBoard.height);
		artBoard.width = imgBoard.width() - 2;
		artBoard.height = imgBoard.height();
		if (currentmode === 4) {
			artBoard.width = "900px";
			artBoard.height = "1235px";
		}
		$("#tiles").find("img").each(function () {
			artMode.save();
			mypos = $(this).position();
			myrot = $(this).data("rot");
			mywid = $(this).width();
			myhei = $(this).height();
			imgho.src = $(this).attr("src");
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
			artMode.drawImage(imgho, -(mywid / 2), -(myhei / 2), mywid, myhei);
			artMode.restore();
		});
		$("#grid").find("img").each(function () {
			artMode.save();
			mypos = $(this).position();
			mywid = $(this).width();
			myhei = $(this).height();
			imgho.src = $(this).attr("src");
			artMode.translate(mypos.left + (mywid / 2), mypos.top + (myhei / 2));
			artMode.drawImage(imgho, -(mywid / 2), -(myhei / 2), mywid, myhei);
			artMode.restore();
		});
		dataURL = artBoard.toDataURL('image/png');
		window.open(dataURL, 'MapWindow', 'width=800,height=600,scrollbars=yes');
		artBoard.width = artBoard.width * 2 / 2;
		if (buggedyet !== 1) {
			if (confirm("Dave here. I worked really hard on this new feature and am currently broke as all get-up, and kinda hungry. I hate to ask, but would you be interested in taking me on a virtual Taco Bell run?")) {
				window.open("https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=GVMXRJ6VVXLMY", 'DonateWindow');
			}
			buggedyet = 1;
			createCookie("buggedyet", 1, 365);
		}
	},
	replaceTile = function ($image, oldtile, type, hasexit) {
		"use strict";
		$.post("scripts/load_morphs.php",
			{ "amount": 1, "tile_kind": type, "map_kind": maptype, "artists": tileSetOptions, "exit": hasexit, "old_tile": oldtile },
			function (data) {
				var newData = $.parseJSON(data);
				if (newData.length > 0) {
					$image.attr("src", "../tiles/" + newData[0].image).data("imgid", newData[0].id).data("artist", newData[0].artist_id);
				} else {
					$("#notification span").text("The tile sets you selected do not contain any of tiles of this kind with stairs or entrances.");
					$("#notification").slideDown("fast");
				}
			});
	},
	nextGrid = function () {
		"use strict";
		switch (parseInt(gridsize, 10) + 1) {
		case 1:
			$("#grid5").click();
			break;
		case 2:
			$("#grid10").click();
			break;
		case 3:
			$("#gridhex").click();
			break;
		case 4:
			$("#nogrid").click();
			break;
		}
	},
	roomStock = function () {
		"use strict";
		var clear, a, b, c, i;
		do {
			$("#roomcont").empty();
			clear = 0;
			for (i = 0; i < 5; i += 1) {
				a = randInt(0, 11);
				clear += a;
				if (a < 10) {
					c = "<li>" + roomContents[a] + "</li>";
				} else {
					b = randInt(0, specialContents.length - 1);
					c = "<li>Special: " + specialContents[b] + "</li>";
				}
				$("#roomcont").append(c);
			}
		} while (clear === 0);
		_gaq.push(['_trackEvent', 'Room Stocker', 'Stock']);
	},
	sidebarResize = function () {
		"use strict";
		createCookie("panelWidth", $twide, 365);
		$owide = $twide;
		$curves.css({'margin-left': $twide + 'px'});
		$tbars.css({'left': $twide + 'px'});
		if ($twide <= 125) {
			$tp.addClass("mini").removeClass("wide");
		} else if ($twide <= 300) {
			$tp.removeClass("mini").removeClass("wide");
		} else {
			$tp.addClass("wide").removeClass("mini");
		}
	},
	jsonStringMap = function () {
		"use strict";
		var fullMapURL, mapData;
		if ((currentmode === 1) || (currentmode === 3) || (currentmode === 4) || (maptype === 6)) {
			$("#notification span").text("Export to PNG via PHP does not support this map mode yet. Try Export via HTML5 Canvas instead!");
			$("#notification").slideDown("fast");
		} else {
			if ((mapWidth * mapHeight) > 64) {
				$("#notification span").text("This map looks too big to export to PNG without causing an error. Sorry!");
				$("#notification").slideDown("fast");
			} else {
				$("#notification").slideUp("fast");
				mapData = {'tiles': [], 'rotation': []};
				$("#tiles img").each(function (i) {
					mapData.tiles[i] = $(this).data("imgid");
					mapData.rotation[i] = $(this).data("rot");
				});
				fullMapURL = 'fullmap.php?mapData=' + base64_encode(JSON.stringify(mapData)) + '&w=' + mapWidth + '&h=' + mapHeight;
				if (endcaps) { fullMapURL += '&e=1'; } else { fullMapURL += '&e=0'; }
				if (corners) { fullMapURL += '&c=1'; } else { fullMapURL += '&c=0'; }
				fullMapURL += '&g=' + ((gridsize === 0) ? '0' : gridsize);
				window.open(fullMapURL, 'MapWindow', 'width=800,height=600,scrollbars=yes');
			}
		}
	},
	$setWidth = readCookie("panelWidth");
$(document)
	.ready(function () {
		"use strict";
		$tp = $("#tilepanel");
		$owide = parseInt($tp.width(), 10);
		if ($setWidth) { $tp.width($setWidth + "px"); }
		$curves = $("body");
		imgBoard = $("#tiles");
		$tbars = $("footer, #site-head, #notification, #popup");
		if ((/iphone|ipod|ipad/gi).test(navigator.platform)) {
			$("#tilepanel,#site-head").addClass("mobile");
		}
		window.setInterval(function () {
			$twide = parseInt($tp.width(), 10);
			if ($twide !== $owide) { sidebarResize(); }
		}, 200);
		$('#newWindowB').click(jsonStringMap);
		$('#newWindowC').click(courtney);
		artBoard = document.getElementById("drawingboard");
		artMode = artBoard.getContext("2d");
		$("#newBtn").click(drawMap);
		$("input.mtBtn").click(function () {
			map_kind = parseInt($(this).val(), 10);
		});
		$('input:radio[name=maptype]').click(function () {
			if ($mobilemode) { $(this).blur(); }
			maptype = parseInt($(this).val(), 10);
			$("#artistsblock").load("scripts/load_authors.php", { "map_kind": maptype }, selectTileSets);
		});
		$("#site-head")
			.on("click tap", "#nogrid", function () {
				$("#grid").css("background","transparent");
				gridsize = 0;
			})
			.on("click tap", "#grid5", function () {
				$("#grid").css("background","url(../grid_15.png)");
				gridsize = 1;
			})
			.on("click tap", "#grid10", function () {
				$("#grid").css("background","url(../grid_30.png)");
				gridsize = 2;
			})
			.on("click tap", "#gridhex", function () {
				$("#grid").css("background","url(../images/hex.png)");
				gridsize = 3;
			});
		$("#rotateTile").click(function () {
			if (!jQuery.inArray(iMenuTarget.data("type"), ["tile","top","btm"]) < 0) { return false; }
			var oldRot = iMenuTarget.data("rot"),
				newRot = (oldRot + 1) % 4;
			iMenuTarget.data("rot", newRot).removeClass("rot" + oldRot).addClass("rot" + newRot);
			return false;
		});
		$("#removeTile").click(function () {
			var tileType;
			switch (iMenuTarget.data("type")) {
			case "tab":
				return;
			case "bco":
				tileType = 7;
				break;
			case "btm":
				tileType = 6;
				break;
			case "tco":
				tileType = 5;
				break;
			case "top":
				tileType = 4;
				break;
			case "corner":
				tileType = 3;
				break;
			case "edge":
				tileType = 2;
				break;
			default:
				tileType = 1;
				break;
			}
			replaceTile(iMenuTarget, iMenuTarget.data("imgid"), tileType, false);
			return false;
		});

		if (readCookie("popup") !== "original") {
			$("#popup").show().click(function () {
				$(this).fadeOut("fast");
				createCookie("popup", "original", 90);
			});
		}
		buggedyet = readCookie("buggedyet");
		$("#tilepanel").find(".collapsed").hide();
		$("#width").val(2);
		$("#height").val(2);
		currentmode = parseInt($('input:radio[name=mode]:checked').val(), 10);
		gridsize = parseInt($('input:radio[name=grid]:checked').val(), 10);
		maptype = parseInt($('input:radio[name=maptype]:checked').val(), 10);
		$("#artistsblock").load("scripts/load_authors.php", { map_kind: maptype }, selectTileSets);
		if (maptype === 6) {
			$("#viewport").addClass("sv").removeClass("nm");
		} else {
			$("#viewport").addClass("nm").removeClass("sv");
		}
		if (gridsize === 1) { $("#grid").addClass("g15"); }
		if (gridsize === 2) { $("#grid").addClass("g30"); }
		if (gridsize === 3) { $("#grid").addClass("gh"); }
		if ($("#fitwidth").is(":checked")) { scaled = true; }
		if (($mobilemode) && (ua.indexOf("Android") >= 0)) {
			var androidversion = parseFloat(ua.slice(ua.indexOf("Android")+8)); 
			if (androidversion < 3) {
				$("body").addClass("faildroid");
			}
		}
		if ($appmode) {
			$("body").css({"margin-bottom": "0"});
			$("#map").css({"margin-top": "34px"});
			$("#tilepanel,#site-head").css({"top": "0"});
			$("#notification,#popup").css({"top": "62px;"});
			$("#newnav,#site-foot").hide();
		}
		if ($("canvas#grid").length > 0) {
			$("#grid").remove();
			$("<div id='grid'></div>").appendTo("#map");
		}
	})
	// Multitouch goodness
	.hammer()
	.on("swipeleft", function (event) {
		"use strict";
		if ($mobilemode) {
			$twide = parseInt($tp.width(), 10);
			$tp.width(Math.max(($twide) - 100, 0));
			sidebarResize();
			event.gesture.preventDefault();
		}
	})
	.on("swiperight", function (event) {
		"use strict";
		if ($mobilemode) {
			$twide = parseInt($tp.width(), 10);
			$tp.width(Math.min(($twide) + 100, 500));
			sidebarResize();
			event.gesture.preventDefault();
		}
	})
	.on("rotate", function (event) {
		"use strict";
		var oldRot = iMenuTarget.data("rot");
		inrotate = true;
		detectedrotate = ((oldRot * 90) + Math.round(event.gesture.rotation) + 360) % 360;
		iMenuTarget.removeClass("rot" + oldRot).css({
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
	})
	.on("release", function (event) {
		"use strict";
		if (inrotate) {
			inrotate = false;
			var oldRot = iMenuTarget.data("rot"),
				newRot = Math.round(detectedrotate / 90) % 4;
			iMenuTarget.data("rot", newRot).removeClass("rot" + oldRot).addClass("rot" + newRot).css({
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
		}
	})
	// Change artists used
	.on("change", "#artistsblock input", function (e) {
		"use strict";
		if (e.metaKey) { $(this).prop("checked", true).siblings("input").prop("checked", false); alert("Test"); }
		selectTileSets();
	})
	.on("dblclick", "#artistsblock label", function () {
		"use strict";
		var $target = $(this).attr("for");
		$("#" + $target).prop("checked", true).siblings("input").prop("checked", false);
		selectTileSets();
	})
	// Handle the remove/replace with exit button
	.on("click tap", "#removeTileExit", function () {
		"use strict";
		var tileType;
		switch (iMenuTarget.data("type")) {
		case "tab":
			return;
		case "tco":
			tileType = 5;
			break;
		case "top":
			tileType = 4;
			break;
		case "corner":
			tileType = 3;
			break;
		case "edge":
			tileType = 2;
			break;
		default:
			tileType = 1;
			break;
		}
		replaceTile(iMenuTarget, iMenuTarget.data("imgid"), tileType, true);
		return false;
	})
	// Handle swapping button
	.on("click tap", "#swapTile", function () {
		"use strict";
		if (iMenuTarget.data("type") === "tab") { return; }
		iMenuTarget.addClass("swapfirst");
		swap = true;
		$("#swapTile").addClass("down");
		return false;
	})
	// Handle mancrush button
	.on("click tap", "#mancrush", function () {
		"use strict";
		var $target = iMenuTarget.data("artist");
		$("#chk" + $target).prop("checked", true).siblings("input").prop("checked", false);
		selectTileSets();
	})
	// Handle dragging a tile
	.on("dragstart", "#tiles img", function (event) {
		"use strict";
		var e = event.originalEvent;
		if (swap) { return; }
		iMenuTarget = $(this);
		$(".selTile").removeClass("selTile");
		iMenuTarget.addClass("selTile");
		e.dataTransfer.effectAllowed = "move";
		e.dataTransfer.setData("text/html","Swap");
	})
	// Handle dropping a tile
	.on("dragover", "#tiles img", function (event) {
		var e = event.originalEvent;
		e.preventDefault();
	})
	.on("drop", "#tiles img", function (event) {
		"use strict";
		var e = event.originalEvent,
			firstTile,
			secondTile;
		e.preventDefault();
		if (e.dataTransfer.getData("text/html") == "Swap") {
			if (iMenuTarget.data("type") !== $(this).data("type")) { return false; }
			firstTile = {"image": iMenuTarget.attr("src"), "id": iMenuTarget.data("imgid"), "artist": iMenuTarget.data("artist"), "rotation": iMenuTarget.data("rot") };
			secondTile = {"image": $(this).attr("src"), "id": $(this).data("imgid"), "artist": $(this).data("artist"), "rotation": $(this).data("rot") };
			iMenuTarget.attr("src", secondTile.image).data("imgid", secondTile.id).data("artist", secondTile.artist).removeClass("swapfirst");
			$(this).attr("src", firstTile.image).data("imgid", firstTile.id).data("artist", firstTile.artist);
			if ($(this).data("type") == "tile") {
				iMenuTarget.data("rot", secondTile.rotation).removeClass("rot"+firstTile.rotation).addClass("rot"+secondTile.rotation);
				$(this).data("rot", firstTile.rotation).removeClass("rot"+secondTile.rotation).addClass("rot"+firstTile.rotation);
			}
			iMenuTarget = $(this);
			$(".selTile").removeClass("selTile");
			iMenuTarget.addClass("selTile");
		}
	})
	// Handle clicking on a tile
	.on("click tap", "#tiles img", function () {
		"use strict";
		var firstTile,
			secondTile,
			topadj = 10,
			leftadj = 10;
		if ($(this).data("type") === "tab") { return; }
		if (swap) {
			if (iMenuTarget.data("type") !== $(this).data("type")) { return false; }
			firstTile = {"image": iMenuTarget.attr("src"), "id": iMenuTarget.data("imgid"), "artist": iMenuTarget.data("artist"), "rotation": iMenuTarget.data("rot") };
			secondTile = {"image": $(this).attr("src"), "id": $(this).data("imgid"), "artist": $(this).data("artist"), "rotation": $(this).data("rot") };
			iMenuTarget.attr("src", secondTile.image).data("imgid", secondTile.id).data("artist", secondTile.artist).removeClass("swapfirst");
			$(this).attr("src", firstTile.image).data("imgid", firstTile.id).data("artist", firstTile.artist);
			if ($(this).data("type") == "tile") {
				iMenuTarget.data("rot", secondTile.rotation).removeClass("rot"+firstTile.rotation).addClass("rot"+secondTile.rotation);
				$(this).data("rot", firstTile.rotation).removeClass("rot"+secondTile.rotation).addClass("rot"+firstTile.rotation);
			}
			swap = false;
			$("#swapTile").removeClass("down");
		}
		iMenuTarget = $(this);
		$(".selTile").removeClass("selTile");
		iMenuTarget.addClass("selTile");
		if (jQuery.inArray(iMenuTarget.data("type"), ["tile","top","btm"]) > -1) {
			$("#rotateBtn").fadeTo("fast", 1);
		} else {
			$("#rotateBtn").fadeTo("fast", 0.5);
		}
		if ($(this).hasClass("edge") && ($(this).hasClass("rot1") || $(this).hasClass("rot3"))) {
			leftadj -= 75;
			if (navigator.userAgent.toLowerCase().indexOf('webkit') > -1) {
				topadj += 75;
				leftadj -= 75;
			}
			if (navigator.userAgent.toLowerCase().indexOf('opera') > -1) {
				topadj += 75;
				leftadj -= 75;
			}
		}
	})
	// Redraw the map when width or height are changed
	.on("change", "#width, #height", drawMap)
	// Stock the room when the room stocker button is clicked
	.on("click tap", "#roomBtn", roomStock)
	// Change mode based on radio button value changing
	.on("click tap change", 'input:radio[name=mode]', function () {
		"use strict";
		currentmode = parseInt($(this).val(), 10);
		drawMap();
	})
	// Handle double-clicks, including modified double-clicks
	.on("dblclick", "#tiles img.tile", function (e) {
		"use strict";
		var $target = $(this),
			oldRot,
			newRot;
		if (e.metaKey) {
			replaceTile($target, $target.data("imgid"), 1, false);
		} else {
			oldRot = $(this).data("rot");
			newRot = (oldRot + 1) % 4;
			$(this).data("rot", newRot).removeClass("rot" + oldRot).addClass("rot" + newRot);
		}
	})
	.on("dblclick", "#tiles img.edge", function (e) {
		"use strict";
		if (e.metaKey) {
			var $target = $(this);
			replaceTile($target, $target.data("imgid"), 2, false);
		}
	})
	.on("dblclick", "#tiles img.corner", function (e) {
		"use strict";
		if (e.metaKey) {
			var $target = $(this);
			replaceTile($target, $target.data("imgid"), 3, false);
		}
	})
	.on("dblclick", "#tiles img.top", function (e) {
		"use strict";
		var $target = $(this),
			oldRot,
			newRot;
		if (e.metaKey) {
			replaceTile($target, $target.data("imgid"), 4, false);
		} else {
			oldRot = $(this).data("rot");
			newRot = (oldRot + 1) % 2;
			$(this).data("rot", newRot).removeClass("rot" + oldRot).addClass("rot" + newRot);
		}
	})
	.on("dblclick", "#tiles img.tco", function (e) {
		"use strict";
		if (e.metaKey) {
			var $target = $(this);
			replaceTile($target, $target.data("imgid"), 5, false);
		}
	})
	.on("dblclick", "#tiles img.btm", function (e) {
		"use strict";
		var $target = $(this),
			oldRot,
			newRot;
		if (e.metaKey) {
			replaceTile($target, $target.data("imgid"), 6, false);
		} else {
			oldRot = $(this).data("rot");
			newRot = (oldRot + 1) % 2;
			$(this).data("rot", newRot).removeClass("rot" + oldRot).addClass("rot" + newRot);
		}
	})
	.on("dblclick", "#tiles img.bco", function (e) {
		"use strict";
		if (e.metaKey) {
			var $target = $(this);
			replaceTile($target, $target.data("imgid"), 7, false);
		}
	})
	.on("click", "#grid", function (e) {
		"use strict";
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
	})
	// Bind the keydown events for shortcuts
	.bind("keydown", "c", function () {
		"use strict";
		$("#endBtn").click();
		drawMap();
	})
	.bind("keydown", "f", function () {
		"use strict";
		$("#fitwidth").click();
	})
	.bind("keydown", "g", nextGrid)
	.bind("keydown", "n", drawMap)
	.bind("keydown", "shift+n", function () {
		"use strict";
		$("#normal").click();
		drawMap();
	})
	.bind("keydown", "shift+y", function () {
		"use strict";
		$("#grid").toggleClass("iconmode");
	})
	.bind("keydown", "s", function () {
		"use strict";
		$("#stagger").click();
		drawMap();
	})
	.bind("keydown", "shift+s", function () {
		"use strict";
		$("#stagcap").click();
		drawMap();
	})
	.bind("keydown", "shift+c", function () {
		"use strict";
		$("span.amt, span.special").slideToggle("slow");
	});

if ('standalone' in navigator && !navigator.standalone && $mobilemode && $issafari) {
	$('<link rel="stylesheet" href="/style/add2home.css" />').appendTo("body");
	$('<script src="/scripts/add2home.js"><\/s' + 'cript>').appendTo("body");
}