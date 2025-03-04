const DM_THEMES={dungeon:1,cavern:2,mixed:3,city:4,village:5,side:6,"scifi-ship":7,boardwalk:8,"scifi-city":9};var DM_TileDeck=function(){this.deck=[];this.dataSource=[];this.cursor=0;this.lastLineup=undefined};DM_TileDeck.prototype.shuffle=function(){var b=this.deck,a,d,c;this.cursor=0;for(d=b.length-1;d>0;d--){c=Math.floor(Math.random()*(d+1));a=b[d];b[d]=b[c];b[c]=a}this.deck=b};DM_TileDeck.prototype.filter=function(a){if(a){this.lastLineup=a}else{a=this.lastLineup}if(a){this.deck=this.dataSource.filter(function(b){return a[b.artist_id]})}this.shuffle()};DM_TileDeck.prototype.draw=function(){var a=this.deck[this.cursor];this.cursor+=1;if((this.cursor%this.deck.length)===0){this.shuffle()}return a};DM_TileDeck.prototype.stock=function(a){this.dataSource=a||[];this.lastLineup=null;this.filter()};(function(a){a.bco=new DM_TileDeck();a.btm=new DM_TileDeck();a.corner=new DM_TileDeck();a.edge=new DM_TileDeck();a.tco=new DM_TileDeck();a.tile=new DM_TileDeck();a.top=new DM_TileDeck();a.loadTiles=function(c,b){$.post("scripts/load_morphs.php",{map_kind:c},function(e){var d=Array.isArray(e)?e:JSON.parse(e);a.tile.stock(d[1]);a.edge.stock(d[2]);a.corner.stock(d[3]);if(c===6){a.top.stock(d[4]);a.tco.stock(d[5]);a.btm.stock(d[6]);a.bco.stock(d[7])}if(b){b()}})};a.setFilter=function(c,b){a.tile.filter(b);a.edge.filter(b);a.corner.filter(b);if(c===6){a.top.filter(b);a.tco.filter(b);a.btm.filter(b);a.bco.filter(b)}};a.getDeck=function(b){var c=a[b];if(!c||!(c instanceof DM_TileDeck)){throw"DM_TileLibrary.draw(): Requested deckName does not exist."}return c};a.draw=function(b){return a.getDeck(b).draw()};a.has=function(b){return(a.getDeck(b).deck.length>0)}})(window.DM_TileLibrary=window.DM_TileLibrary||{});(function(a){a.isRotating=false;a.isSwapping=false;a.selectedTile=undefined;a.staggeredCappedMode=undefined;a.settings={structure:-1,theme:DM_THEMES.mixed,height:2,width:2,hasEndcaps:false,hasCorners:false,gridType:0,lineup:{},roster:[]};a.selectTile=function(f){var e=a,b,d,c;if(e.selectedTile){e.selectedTile.removeClass("selected-tile")}e.selectedTile=f;if(e.selectedTile){e.selectedTile.addClass("selected-tile");b=f.position();d=b.left-5;c=b.top-40;if(f.hasClass("edge")&&(f.hasClass("rot1")||f.hasClass("rot3"))){d-=75}if(c<0){c=f.get(0).height+22}$("#selectionEdit").css({left:d,top:c}).fadeIn();if(jQuery.inArray(MAPPER.selectedTile.data("type"),["tile","top","btm"])>-1){$("#rotateBtn").fadeTo("fast",1)}else{$("#rotateBtn").fadeTo("fast",0.5)}}else{$("#selectionEdit").hide()}};a.performSwap=function(f){var e=this.selectedTile,c=f,d,b;if(e.data("type")!==c.data("type")){return false}d={image:e.attr("src"),id:e.data("imgid"),artist:e.data("artist"),rotation:e.data("rot")};b={image:c.attr("src"),id:c.data("imgid"),artist:c.data("artist"),rotation:c.data("rot")};e.attr("src",b.image).data("imgid",b.id).data("artist",b.artist).removeClass("swapfirst");c.attr("src",d.image).data("imgid",d.id).data("artist",d.artist);if(c.data("type")==="tile"){e.data("rot",b.rotation).removeClass("rot"+d.rotation).addClass("rot"+b.rotation);c.data("rot",d.rotation).removeClass("rot"+b.rotation).addClass("rot"+d.rotation)}this.isSwapping=false;$("#swapTileBtn").removeClass("down")};a.detectStructure=function(){var b=a;b.settings.structure=parseInt($("input:radio[name=mode]:checked").val(),10);return b.settings.structure};a.appendTab=function(c){var d=document.createElement("img"),b=document.getElementById("tiles");d.classList.add("tab");d.classList.add("rot"+c);d.setAttribute("data-rot",c);d.setAttribute("data-type","tab");d.setAttribute("src","../images/tab.png");b.appendChild(d)};a.appendTile=function(e,d){var c=DM_TileLibrary.draw(e),f=document.createElement("img"),b=document.getElementById("tiles");if(!c){return}f.classList.add(e);f.classList.add("rot"+d);f.setAttribute("data-rot",d);f.setAttribute("data-type",e);f.setAttribute("data-imgid",c.id);f.setAttribute("data-artist",c.artist_id);f.setAttribute("src","../tiles/"+c.image);f.setAttribute("draggable","true");b.appendChild(f)};a.changeTheme=function(e,d){var c=a.settings,b;if(e===""){e="mixed"}if(DM_THEMES.hasOwnProperty(e)){var b=DM_THEMES[e];if(c.theme!==b){c.theme=b;if(d){history.pushState({theme:e,themeCode:b},"Dave's Mapper | "+e,e)}}loadRoster();return true}else{console.error("Unknown theme selected: "+e)}};a.newMap=function(){var s=a,u=document,r=u.getElementById("tiles"),b=s.detectStructure(),o=s.settings,f=0,l,v,c,h,k,e,g,n,m,p;s.selectTile();s.isSwapping=false;if(b===4){h=4;k=3;$("#mapSizeControls input").prop("disabled",true)}else{h=parseInt($("#height").val(),10);k=parseInt($("#width").val(),10);$("#mapSizeControls input").prop("disabled",false)}o.width=k;o.height=h;var t=(b===2);s.staggeredCappedMode=((DM_TileLibrary.has("edge"))&&(b===3));o.hasEndcaps=((DM_TileLibrary.has("edge"))&&t);o.hasCorners=((DM_TileLibrary.has("corner"))&&t);if(o.theme===DM_THEMES.side){e=((DM_TileLibrary.has("top"))&&t);v=((DM_TileLibrary.has("tco"))&&t);g=((DM_TileLibrary.has("btm"))&&t);l=((DM_TileLibrary.has("bco"))&&t);o.hasSideCorners=v&&l;$("#viewport").removeClass("nm").addClass("sv");GUI.hideNotification()}else{o.hasSideCorners=false;$("#viewport").removeClass("sv").addClass("nm");if((t||(b===3))&&((!DM_TileLibrary.has("edge"))||(!DM_TileLibrary.has("corner")))){GUI.showNotification("The tile sets you selected do not contain the right tile mix for your selected map structure. Falling back to the closest possible map structure.")}else{GUI.hideNotification()}}if(b!==4){c=300*k+2;if(o.hasEndcaps){c+=300}$("#map, #tiles").width(c+"px");while(r.firstChild){r.removeChild(r.firstChild)}if(o.theme!==DM_THEMES.side){if(o.hasEndcaps){if(o.hasCorners){s.appendTile("corner",0)}for(m=0;m<k-f;m+=1){s.appendTile("edge",0)}if(o.hasCorners){s.appendTile("corner",1)}r.appendChild(u.createElement("br"))}}else{if(e){if(v){s.appendTile("tco",0)}for(m=0;m<k-f;m+=1){s.appendTile("top",0)}if(v){s.appendTile("tco",1)}r.appendChild(u.createElement("br"))}}for(n=0;n<h;n+=1){p=(o.theme===DM_THEMES.side)?0:3;if(o.hasEndcaps||(s.staggeredCappedMode&&(f===1))){s.appendTile("edge",p)}for(m=0;m<k-f;m+=1){s.appendTile("tile",randInt(0,3))}if(o.hasEndcaps||(s.staggeredCappedMode&&(f===1))){s.appendTile("edge",1)}if((b===1)||(b===3)){f=1-f}r.appendChild(u.createElement("br"))}if(o.theme!==DM_THEMES.side){if(o.hasEndcaps){if(o.hasCorners){s.appendTile("corner",3)}for(m=0;m<k-f;m+=1){s.appendTile("edge",2)}if(o.hasCorners){s.appendTile("corner",2)}r.appendChild(u.createElement("br"))}}else{if(g){if(l){s.appendTile("bco",0)}for(m=0;m<k-f;m+=1){s.appendTile("btm",0)}if(l){s.appendTile("bco",1)}r.appendChild(u.createElement("br"))}}}else{$("#map, #tiles").width("902px");var q=u.getElementById("tiles");while(q.firstChild){q.removeChild(q.firstChild)}s.appendTab(0);s.appendTile("tile",randInt(0,3));s.appendTab(2);r.appendChild(u.createElement("br"));s.appendTile("tile",randInt(0,3));s.appendTile("tile",randInt(0,3));s.appendTile("tile",randInt(0,3));r.appendChild(u.createElement("br"));s.appendTab(0);s.appendTile("tile",randInt(0,3));s.appendTab(2);r.appendChild(u.createElement("br"));s.appendTab(0);s.appendTile("tile",randInt(0,3));s.appendTab(2);r.appendChild(u.createElement("br"));var d=u.createElement("img");d.setAttribute("class","rot0");d.setAttribute("data-rot","0");d.setAttribute("data-type","tab");d.setAttribute("src","../images/tab_bottom.png");r.appendChild(d)}};a.applyGridOverlay=function(c){var d=a,e=document.getElementById("grid"),b={0:"transparent",1:"url(/grid_15.png)",2:"url(/grid_30.png)",3:"url(/images/hex.png)"};d.settings.gridType=parseInt(c,10);e.style.background=b[d.settings.gridType]||"transparent";ga("send","event","Grid","Type "+c)};a.nextGrid=function(){a.applyGridOverlay((a.settings.gridType+1)%4)}})(window.MAPPER=window.MAPPER||{});(function(a){a.init=function(){a.notificationHolder=$("#notification");a.notificationTextHolder=a.notificationHolder.find("span");a.notificationHolder.on("click","#clearNotificationButton",a.hideNotification);a.modalContainer=$("#popup");a.modalContentContainer=a.modalContainer.find("div");a.modalContainer.click(a.hideModal)};a.showNotification=function(b){a.notificationTextHolder.text(b);a.notificationHolder.slideDown("fast")};a.hideNotification=function(){a.notificationHolder.slideUp("fast")};a.showModal=function(b){a.modalContentContainer.html(b);a.modalContainer.fadeIn("fast")};a.modalVisible=function(){return a.modalContainer.is(":visible")};a.loadExternalModal=function(b){a.modalContentContainer.load("/content/"+b+".html",function(){GUI.modalContainer.fadeIn("fast")})};a.hideModal=function(){a.modalContainer.fadeOut("fast")}})(window.GUI=window.GUI||{});var createCookie=function(c,d,e){var b,a;if(e){b=new Date();b.setTime(b.getTime()+(e*24*60*60*1000));a="; expires="+b.toGMTString()}else{a=""}document.cookie=c+"="+d+a+"; path=/"},readCookie=function(b){var e=b+"=",a=document.cookie.split(";"),d,f;for(d=0;d<a.length;d+=1){f=a[d];while(f.charAt(0)===" "){f=f.substring(1,f.length)}if(f.indexOf(e)===0){return f.substring(e.length,f.length)}}return null},toggleMobileMenu=function(){$("#sideBar").toggleClass("shown")},selectTileSets=function(){var a={};$("#artistsblock input").filter(":checked").each(function(){a[$(this).val()]=true});MAPPER.settings.lineup=a;DM_TileLibrary.setFilter(MAPPER.settings.theme,MAPPER.settings.lineup);MAPPER.newMap()},onRosterDataLoaded=function(c){var b=MAPPER.settings,g="",a={};var d=Array.isArray(c)?c:JSON.parse(c);var f=d.length;b.roster=d;for(var e=0;e<f;e++){a[d[e].artist_id]=true;g+='<input type="checkbox" name="tileset" class="panelChk"  id="chk'+d[e].artist_id+'" value="'+d[e].artist_id+'" checked /><label for="chk'+d[e].artist_id+'" data-artist="'+d[e].artist_id+'"><img src="../m_icons/'+d[e].icon+'.png" /><span class="name"><span class="nick">'+d[e].initials+'</span><span class="full">'+d[e].name+"</span></span></label>"}b.lineup=a;DM_TileLibrary.loadTiles(b.theme,selectTileSets);$("#artistsblock").html(g)},loadRoster=function(){$.post("scripts/load_authors.php",{map_kind:MAPPER.settings.theme},onRosterDataLoaded)},exportMap=function(){var e=MAPPER.settings,f=new Image(),h,b,j,l,c;GUI.hideNotification();if(e.mode===4){GUI.showNotification("Export for cubes is currently not working. Please try your browser's print option instead.");ga("send","event","Export","Failed-Cube")}else{if((e.mode===1)||(e.mode===3)){GUI.showNotification("Export for this mode is currently not working. Please try your browser's print option instead.");return false}else{if((e.width*e.height)>64){GUI.showNotification("This map looks too big to export to PNG without causing an error. Sorry!");ga("send","event","Export","Failed")}else{var g="",i,a,k,d;GUI.hideNotification();$("#tiles img").each(function(){k=$(this);i=(k.data("imgid")*4)+k.data("rot");a=i.toString(36);while(a.length<4){a="0"+a}g+=a});d="/export/"+g+"?w="+e.width+"&h="+e.height;d+="&e="+(e.hasEndcaps?"1":"0");d+="&c="+(e.hasCorners||e.hasSideCorners?"1":"0");d+="&g="+e.gridType.toString();if(e.theme===DM_THEMES.side){d+="&side=1"}window.open(d,"MapWindow","width=800,height=600,scrollbars=yes")}ga("send","event","Export","PHP")}}},replaceTile=function(d,c){var b=d.data("type"),a=DM_TileLibrary.draw(b);if(c){GUI.showNotification("Exit tiles had to be temporarily disabled while optimizations were made to keep the site online. Sorry!");return}d.attr("src","../tiles/"+a.image).data("imgid",a.id).data("artist",a.artist_id);ga("send","event","Replace Tile",b)},onImageDragStart=function(a){a=a.originalEvent;if(MAPPER.isSwapping||!a){return}MAPPER.selectTile($(this));a.dataTransfer.effectAllowed="move";a.dataTransfer.setData("text/html","Swap");ga("send","event","Swap","Drag Start")},onImageDragDrop=function(a){a=a.originalEvent;a.preventDefault();if(a.dataTransfer.getData("text/html")==="Swap"){MAPPER.performSwap($(this));ga("send","event","Swap","Drop")}},onImageClick=function(){if($(this).data("type")==="tab"){return}if(MAPPER.isSwapping){MAPPER.performSwap($(this));ga("send","event","Swap","Tool Complete")}else{MAPPER.selectTile($(this))}},onTileDoubleClick=function(d){var a=$(this),b,c;if(d.metaKey){replaceTile(a);ga("send","event","Replace","Ctrl+DblClick")}else{b=$(this).data("rot");c=(b+1)%4;$(this).data("rot",c).removeClass("rot"+b).addClass("rot"+c);ga("send","event","Rotate","DblClick")}},onEdgeDoubleClick=function(b){if(b.metaKey){var a=$(this);replaceTile(a)}},onCornerDoubleClick=function(b){if(b.metaKey){var a=$(this);replaceTile(a)}},onTopDoubleClick=function(d){var a=$(this),b,c;if(d.metaKey){replaceTile(a)}else{b=$(this).data("rot");c=(b+1)%2;$(this).data("rot",c).removeClass("rot"+b).addClass("rot"+c)}},onTopCornerDoubleClick=function(b){if(b.metaKey){var a=$(this);replaceTile(a)}},onBottomDoubleClick=function(d){var a=$(this),b,c;if(d.metaKey){replaceTile(a)}else{b=$(this).data("rot");c=(b+1)%2;$(this).data("rot",c).removeClass("rot"+b).addClass("rot"+c)}},onBottomCornerDoubleClick=function(b){if(b.metaKey){var a=$(this);replaceTile(a)}},onTileBoardClick=function(b){if($(this).hasClass("iconmode")){var d=$(this).offset(),c=b.clientX-d.left-15,a=b.clientY-d.top-15;$("<img />").attr("src","../images/fab.png").css({top:a+"px",left:c+"px",width:"30px"}).appendTo($(this))}},initApp=function(){var c=window.navigator.userAgent,b=((/Safari/i).test(window.navigator.appVersion));GUI.init();$("#mapTypeMenuBtn").click(toggleMobileMenu);$("#sideBar").on("click tap",function(d){if(d.target.tagName==="SECTION"){$("#sideBar").removeClass("shown")}});$("#artistsblock").on("change","input",function(d){if(d.metaKey){$(this).prop("checked",true).siblings("input").prop("checked",false)}selectTileSets()}).on("dblclick","label",function(){var d=$(this).attr("for");$("#"+d).prop("checked",true).siblings("input").prop("checked",false);selectTileSets()});if(readCookie("popup")!=="overlay"){GUI.showModal(["<h2>New to the Mapper?</h2>","<ul>","<li><strong>Make maps for tabletop RPGs</strong> including caverns, dungeons, ","vertical dungeons, towns, and spaceships.</li>","<li><strong>Configure your map</strong> using the toolbar above. Choose size, ","type, layout, and more.</li>","<li><strong>Click tiles</strong> and use the handy selection menu to fine-tune ","your generated map.</li>","<li><strong>Choose your map artist(s)</strong> by toggling them on the left-hand ","panel. Double-click an artist or hit the heart button with a tile selected to ","switch to a single artist.</li>","<li><strong>On multitouch devices</strong> use two-finger twist to rotate tiles.","</li>","</ul>","<p><em>Click anywhere to close.</em></p>"].join(""));createCookie("popup","overlay",90);ga("send","event","New User Overlay")}$("#newWindowB").click(exportMap);$("#newBtn").click(MAPPER.newMap);$("#mapViewControls").on("click tap","input",function(){MAPPER.applyGridOverlay($(this).val())});$("#rotateTile").click(function(){if(jQuery.inArray(MAPPER.selectedTile.data("type"),["tile","top","btm"])<0){return false}var d=MAPPER.selectedTile.data("rot"),e=(d+1)%4;MAPPER.selectedTile.data("rot",e).removeClass("rot"+d).addClass("rot"+e);ga("send","event","Rotate","Click");return false});$("#removeTile").click(function(){replaceTile(MAPPER.selectedTile);return false});$("#width").val(2);$("#height").val(2);MAPPER.settings.mode=parseInt($("input:radio[name=mode]:checked").val(),10);MAPPER.applyGridOverlay($("input:radio[name=grid]:checked").val());if(MAPPER.settings.theme===DM_THEMES.side){$("#viewport").addClass("sv").removeClass("nm")}else{$("#viewport").addClass("nm").removeClass("sv")}if(($mobilemode)&&(c.indexOf("Android")>=0)){var a=parseFloat(c.slice(c.indexOf("Android")+8));if(a<3){$("body").addClass("faildroid")}}if($("canvas#grid").length>0){$("#grid").remove();$('<div id="grid"></div>').appendTo("#map")}$("#tiles").on("dragstart","img",onImageDragStart).on("dragover","img",function(d){d.originalEvent.preventDefault()}).on("drop","img",onImageDragDrop).on("click tap","img",onImageClick).on("dblclick","img.tile",onTileDoubleClick).on("dblclick","img.edge",onEdgeDoubleClick).on("dblclick","img.corner",onCornerDoubleClick).on("dblclick","img.top",onTopDoubleClick).on("dblclick","img.tco",onTopCornerDoubleClick).on("dblclick","img.btm",onBottomDoubleClick).on("dblclick","img.bco",onBottomCornerDoubleClick).on("click",onTileBoardClick);$("#removeTileExit").on("click tap",function(){replaceTile(MAPPER.selectedTile);ga("send","event","Remove Tile","Exit");return false});$("#swapTileBtn").on("click tap",function(){if(MAPPER.selectedTile.data("type")==="tab"){return}MAPPER.selectedTile.addClass("swapfirst");MAPPER.isSwapping=true;$("#swapTileBtn").addClass("down");ga("send","event","Swap","Tool Click");return false});$("#mancrush").on("click tap",function(){var d=MAPPER.selectedTile.data("artist");$("#chk"+d).prop("checked",true).siblings("input").prop("checked",false);ga("send","event","Heart","Click");selectTileSets()});$("#width, #height").on("change",MAPPER.newMap);$("input:radio[name=mode]").on("click tap change",function(){MAPPER.settings.mode=parseInt($(this).val(),10);MAPPER.newMap();ga("send","event","Mode","Change")});if("standalone" in window.navigator&&!window.navigator.standalone&&$mobilemode&&b){$('<link rel="stylesheet" href="/style/add2home.css" />').appendTo("body");$('<script src="/scripts/add2home.js"><\/script>').appendTo("body")}detectTheme();$("#mapTypeSelector").on("click tap","a",function(f){var d=this.href.replace(/.*\//g,"");f.preventDefault();if(MAPPER.changeTheme(d,true)){$(this).addClass("selected").siblings().removeClass("selected")}});window.onpopstate=detectTheme},detectTheme=function(b){var a=location.pathname;var c=a.replace("/","");if(MAPPER.changeTheme(c)){if(c===""){a="/mixed"}$("#mapTypeSelector a").filter(function(d,e){return e.href.indexOf(a)>-1}).addClass("selected").siblings().removeClass("selected")}else{location.replace("/")}},onHammerRotateDetected=function(d){if(MAPPER.selectedTile.data("type")==="tile"){var a=MAPPER.selectedTile.data("rot"),b=Math.round(d.gesture.rotation),e=((a*90)+b+360)%360,c="rotateZ("+e+"deg)";MAPPER.isRotating=true;MAPPER.selectedTile.removeClass("rot"+a).css({"-webkit-transform":c,"-moz-transform":c,"-ms-transform":c,"-o-transform":c,transform:c,"-webkit-transition":"none","-moz-transition":"none","-ms-transition":"none","-o-transition":"none",transition:"none",zoom:1});d.gesture.preventDefault();ga("send","event","Rotate","Start Touch")}},onHammerReleaseDetected=function(c){if(MAPPER.isRotating){MAPPER.isRotating=false;var e=MAPPER.selectedTile,a=e.data("rot"),b=Math.round(c.gesture.rotation),d=((a*90)+b+360)%360,f=Math.round(d/90)%4;e.data("rot",f).removeClass("rot"+a).addClass("rot"+f).css({"-webkit-transform":"","-moz-transform":"","-ms-transform":"","-o-transform":"",transform:"","-webkit-transition":"","-moz-transition":"","-ms-transition":"","-o-transition":"",transition:"",zoom:1});ga("send","event","Rotate","Release Touch")}};$(document).ready(initApp).hammer().on("rotate",onHammerRotateDetected).on("release",onHammerReleaseDetected);