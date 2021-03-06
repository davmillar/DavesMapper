document.addEventListener('keydown', function (keyEvent) {
  var keyName = keyEvent.key,
      getById = function (id) {
        return document.getElementById.call(document, id);
      };

  switch (keyName) {
    case 'c':
      getById('endBtn').checked = true;
      MAPPER.newMap();
      ga('send', 'event', 'Mode', 'Keyboard', 'FullMap');
      break;
    case 'g':
      MAPPER.nextGrid();
      ga('send', 'event', 'Grid Settings', 'Rotate via Keyboard');
      break;
    case 'N':
      getById('normal').checked = true;
      MAPPER.newMap();
      ga('send', 'event', 'Mode', 'Keyboard', 'Normal');
      break;
    case 'n':
      MAPPER.newMap();
      ga('send', 'event', 'Mode', 'Keyboard', 'NewMap');
      break;
    case 'S':
      getById('stagcap').checked = true;
      MAPPER.newMap();
      ga('send', 'event', 'Mode', 'Keyboard', 'StaggeredCapped');
      break;
    case 's':
      getById('stagger').checked = true;
      MAPPER.newMap();
      ga('send', 'event', 'Mode', 'Keyboard', 'Staggered');
      break;
    case 'Y':
      $('#grid').toggleClass('iconmode');
      break;
    case '?':
      if (GUI.modalVisible()) {
        GUI.hideModal();
      } else {
        GUI.loadExternalModal('keyboard');
      }
      ga('send', 'event', 'Mode', 'Keyboard', 'HelpModal');
      break;
    case 'Enter':
    case 'Escape':
      if (GUI.modalVisible()) {
        GUI.hideModal();
      }
      break;
  }
}, false);

