// exported DM_TileDeck

var DM_TileDeck = function () {
  'use strict';
  this.deck = [];
  this.dataSource = [];
  this.cursor = 0;
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

DM_TileDeck.prototype.filter = function () {
  'use strict';
  this.deck = this.dataSource.filter(function (tile) {
    return MAPPER.settings.lineup[tile.artist_id];
  });
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

DM_TileDeck.prototype.stock = function (stockpile) {
  this.dataSource = stockpile || [];
  this.filter();
};
