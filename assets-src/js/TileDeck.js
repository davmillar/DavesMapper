// exported DM_TileDeck

var DM_TileDeck = function () {
  'use strict';
  this.deck = [];
  this.dataSource = [];
  this.cursor = 0;
  this.lastLineup = undefined;
};

/**
 * Shuffles the deck of tiles using Durstenfeld shuffle, as suggested on StackOverflow:
 * http://stackoverflow.com/questions/2450954/how-to-randomize-shuffle-a-javascript-array
 */
DM_TileDeck.prototype.shuffle = function () {
  'use strict';
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

DM_TileDeck.prototype.filter = function (lineupData) {
  'use strict';

  if (lineupData) {
    // If new lineup is present, cache it.
    this.lastLineup = lineupData;
  } else {
    // Otherwise use the cached lineup.
    lineupData = this.lastLineup;
  }

  if (lineupData) {
    this.deck = this.dataSource.filter(function (tile) {
      return lineupData[tile.artist_id];
    });
  }

  this.shuffle();
};

DM_TileDeck.prototype.draw = function () {
  var cardDrawn = this.deck[this.cursor];

  this.cursor += 1;
  if ((this.cursor % this.deck.length) === 0) {
    this.shuffle();
  }

  return cardDrawn;
};

/**
 * Stocks the TileDeck with a new dataset, clears the lineup data,
 * and reruns filter() to repopulate the active deck.
 *
 * @param  {Object[]} stockpile
 *     An array of tile data objects.
 */
DM_TileDeck.prototype.stock = function (stockpile) {
  this.dataSource = stockpile || [];
  this.lastLineup = null;
  this.filter();
};
