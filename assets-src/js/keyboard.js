document.addEventListener('keydown', function (keyEvent) {
  var keyName = keyEvent.key;

  switch (keyName) {
    case 'c':
      cappedEndsMode();
      ga('send', 'event', 'Mode', 'Keyboard', 'FullMap');
      break;
    case 'g':
      MAPPER.nextGrid();
      ga('send', 'event', 'Grid Settings', 'Rotate via Keyboard');
      break;
    case 'N':
      normalMode();
      ga('send', 'event', 'Mode', 'Keyboard', 'Normal');
      break;
    case 'n':
      MAPPER.newMap();
      ga('send', 'event', 'Mode', 'Keyboard', 'NewMap');
      break;
    case 'S':
      staggeredCappedMode();
      ga('send', 'event', 'Mode', 'Keyboard', 'StaggeredCapped');
      break;
    case 's':
      staggeredMode();
      ga('send', 'event', 'Mode', 'Keyboard', 'Staggered');
      break;
    case 'Y':
      toggleIconMode();
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

