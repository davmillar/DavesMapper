Dave's Mapper
=============

This is the code behind [Dave's Mapper](https://davesmapper.com). It's based on the Morph Mapper by Rob Lang, but vastly larger in scope and ambition.

Prerequisites
-------------
Hopefully this will be condensed shortly, but right now to rebuild the assets, one needs:

- Vagrant
- Your Hypervisor of choice (I already had virtualbox installed)
- npm
- java
- yuicompressor.jar
- command line Inkscape
- less

JS Overview
-----------

### mapping.js
This was the original everything-script that once had all the code in it. Now it handles basic page setup stuff and most of the touch event and UI event handling.

### Constants.js
This file contains constants used in the app code. It's a work in progress and only has a couple things right now.

### GUI.js (window.GUI)
This class handles showing and hiding of notification bars and modals for the rest of the app.

One goal in mind is to convert many of the ancillary content pages on the site into modals that can be launched within the app itself, and with better UI to do so, especially considering a lot of the UI is hidden on small devices.

### TileDeck.js (DM_TileDeck objects)
This class handles the data objects representing tiles and provides helper methods for shuffling and 'dealing' tiles. Its main purpose is to prevent tiles from being repeated within a mapping session while others remain unused.

### TileLibrary.js (DM_TileLibrary)
This class receives the filtering data from the app and uses it to load the decks of tile data from the server and handle filtering on the client side. It has some helper functions as well for determining if it's even possible to make a map with the selected authors and styles.

Another planned use of this class is to provide a GUI for paging through the tiles available and offering the user a way to manually select tiles to place on the map rather than drawing at random.

### Mapper.js (window.Mapper)
Provides most of the functionality for generating and manipulating the maps in the app. Stores some settings and provides utility functions that can be used by the UI.

### keyboard.js
Provides keyboard shortcut listeners for the rest of the app.

License
-------

    Dave's Mapper
    Copyright © 2010-2019  David Millar

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see http://www.gnu.org/licenses/.

Contact
-------

I can be reached at dave@davegoesthedistance.com
