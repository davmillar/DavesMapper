// exported GUI

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
