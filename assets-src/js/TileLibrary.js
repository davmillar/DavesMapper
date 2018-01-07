// exported DM_TileLibrary

/**
 * @class  DM_TileLibrary
 *
 * Library of tile decks containing the tile data for the mapper and
 * convenience methods for accessing it.
 */
(function(library){
  library.bco = new DM_TileDeck();
  library.btm = new DM_TileDeck();
  library.corner = new DM_TileDeck();
  library.edge = new DM_TileDeck();
  library.tco = new DM_TileDeck();
  library.tile = new DM_TileDeck();
  library.top = new DM_TileDeck();

  /**
   * Requests the tile data for the app and stocks the tile library classes
   * with it. Also calls a callback if one is provided.
   *
   * @param  {Function} [callback]
   *     Optional callback.
   */
  library.loadTiles = function (themeCode, callback) {
    $.post('scripts/load_morphs.php', {
      'map_kind': themeCode
    }, function (data) {
      var fulldata = $.parseJSON(data);
      library.tile.stock(fulldata[1]);
      library.edge.stock(fulldata[2]);
      library.corner.stock(fulldata[3]);
      // Side-view extra types.
      if (themeCode === 6) {
        library.top.stock(fulldata[4]);
        library.tco.stock(fulldata[5]);
        library.btm.stock(fulldata[6]);
        library.bco.stock(fulldata[7]);
      }
      if (callback) {
        callback();
      }
    });
  };

  /**
   * Checks that a deck exists and returns it.
   *
   * @param  {String} deckName
   *     Name of the deck requested.
   *
   * @return {DM_TileDeck}
   *     Requested instance of DM_TileDeck.
   */
  library.getDeck = function (deckName) {
    var deck = library[deckName];

    if (!deck || !(deck instanceof DM_TileDeck)) {
      throw 'DM_TileLibrary.draw(): Requested deckName does not exist.';
    }

    return deck;
  };

  /**
   * Convenience method for drawing a tile from a deck.
   *
   * @param  {String} deckName
   *     Name of the deck from which a tile is requested.
   *
   * @return {Object}
   *     Tile data object.
   */
  library.draw = function (deckName) {
    return library.getDeck(deckName).draw();
  };

  /**
   * Convenience method for checking that a deck contains tiles.
   *
   * @param  {String} deckName
   *     Name of the deck from which a tile is requested.
   *
   * @return {Boolean}
   *     True if at least one tile is present.
   */
  library.has = function (deckName) {
    return (library.getDeck(deckName).deck.length > 0);
  };

})(window.DM_TileLibrary = window.DM_TileLibrary || {});
