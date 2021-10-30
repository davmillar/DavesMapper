-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 29, 2021 at 01:24 PM
-- Server version: 5.6.41-84.1
-- PHP Version: 7.3.28

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Dumping data for table `artists`
--

INSERT INTO `artists` (`id`, `name`, `url_slug`, `initials`, `icon`, `url`, `bio`, `email`, `password`) VALUES
(1, 'Dyson Logos', 'dyson-logos', 'DL', 'dy', 'http://rpgcharacters.wordpress.com/', 'Dyson\'s original geomorph project spawned this entire geomorphic mapping movement. With over 100 tiles (I still need to add more of them) and a ton of other amazing and beautiful maps, Dyson has created quite a following.', '', ''),
(2, 'Risus Monkey', 'risus-monkey', 'RM', 'mk', 'http://www.risusmonkey.com/', 'Risus Monkey\'s geomorphs look a little different than the pen and paper ones, but they add a lot of interesting features', '', ''),
(3, 'Stonewerks', 'stonewerks', 'SW', 'sw', 'http://stonewerks.wordpress.com/', 'Stonewerks may have gone with a style similar to Dyson\'s originals, but looking beyond the surface similarities you\'ll find a wealth of details in his tiles that you\'d be hard-pressed to find elsewhere.', '', ''),
(4, 'Amanda Michaels', 'amanda-michaels', 'AM', 'am', '', 'Amanda may not have built dungeon tiles, but if ever in need of a post-apocalyptic city to tear through, she\'s your gal.', '', ''),
(5, 'Talysman', 'talysman', 'Tal', 'tl', 'http://9and30kingdoms.blogspot.com/', 'Talysman is a maker of specialty geomorphic tiles. With a generous sprinkling of his tiles in your map, you\'ll have some big features to craft stories around.', '', ''),
(6, 'Brutus Motor', 'brutus-motor', 'BM', 'bm', 'http://thisisdicecountry.blogspot.com/', 'Brutus Motor has just started blogging at \"This is Dice Country\" but has already jumped right into the geomorph mapping movement and created some great tiles.', '', ''),
(7, 'Paul Gorman', 'paul-gorman', 'PG', 'pg', 'http://quicklyquietlycarefully.blogspot.com/', 'Paul Gorman makes geomorphs too &#8212; with a neat curly scribble fill style. He releases them under the <a href=\"http://creativecommons.org/licenses/by-nc/3.0/\">Creative Commons attribution non-commercial license</a>.', '', ''),
(8, 'Fighting Fantasist', 'fighting-fantasist', 'FF', 'ff', 'http://fightingfantasist.blogspot.com/', 'Fighting Fantasist is \"just a 30-something gamer from the old Brit days of Fighting Fantasy, Lone Wolf and Warhammer with a renewed enthusiasm for it after discovering online that other people were going back to the older stuff as well.\"', '', ''),
(9, 'Stuart Robertson', 'stuart-robertson', 'SR', 'sr', 'http://strangemagic.robertsongames.com/', 'Stuart Robertson was inspired by the 1 hour maps and geomorphs of others, and has leapt into the geomorph fray.', '', ''),
(10, 'Shane Knysh', 'shane-knysh', 'SK', 'sk', 'http://fictitiousentry.com/', 'Software tester, designer and developer, UX geek, online and table top game player, father, nerd and husband. His tiles are released under the <a href=\"http://creativecommons.org/licenses/by-nc/2.5/ca/\">Creative Commons Attribution-NonCommercial 2.5 Canada License</a>.', '', ''),
(11, 'Tony Brotherton', 'tony-brotherton', 'TB', 'tb', 'http://roleplay-geek.blogspot.com/', 'Tony\'s city tiles are the best way to put together a sprawling metropolis in no time.', '', ''),
(12, 'M.S. Jackson', 'ms-jackson', 'MSJ', 'msj', 'http://snikle.wordpress.com/', 'Currently stationed in Iraq and making a set of geomorphs on his trusty iPad. He releases the content from his blog under the <a href=\"http://creativecommons.org/licenses/by-nc-sa/3.0/\">Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License</a>.', '', ''),
(13, 'Glenn Jupp', 'glenn-jupp', 'GJ', 'gj', 'http://seekingwing.blogspot.com/', 'Geomorph artist that loves adding DungeonWords to his signature tiles to spark ideas for GMs. (Our copies have them removed so you can start fresh.)', '', ''),
(14, 'Rorschachhamster', 'rorschachhamster', 'RH', 'rh', 'http://rorschachhamster.wordpress.com/', 'Rorschachhamster ist ein Rollenspieler, Punkmusiker, Vater, Buchh&auml;ndler und Pseudointellektueller, der langsam auf die 40 zu geht.', '', ''),
(15, '1nfinite zer0', '1nfinite-zer0', '&#8734;0', 'i0', 'http://shashnia.blogspot.com/', '1nfinite zer0 is a landscape ecologist and hobby game designer who has also jumped on the geomorph bandwagon.', '', ''),
(16, 'Bryan Meadows', 'bryan-meadows', 'BMe', 'bme', 'http://bearmeadows.com/', 'Bryan Meadows creates his geomorphs in Adobe Illustrator using a Wacom tablet.', '', ''),
(17, 'David Millar', 'david-millar', 'DM', 'dm', 'http://davegoesthedistance.com', 'Prior to making this web app, I had never role-played before. Weird, right? I\'m a web and graphic designer and also a puzzle author, and I have a blog where I share some (a ton) of my puzzles for free.', '', ''),
(18, 'David Brawley', 'david-brawley', 'DB', 'db', 'http://towerofthearchmage.blogspot.com/', '\"I\'ve loved dungeons ever since my mum read me the story of the minotaur and the labyrinth. That love resulted in reams of paper being covered in mazes. This lead quite naturally to Dungeons and Dragons. I\'ve gone from the Rules Cyclopedia to 2nd Edition, 3.0, 3.5, 4e, and finally back to the Rules Cyclopedia. I now post my various monsters, magic items, and maps at <a href=\"http://towerofthearchmage.blogspot.com\">Tower of the Archmage</a> My geomorphs are released under the Creative Commons license.\"', '', ''),
(19, 'Mark L. Chance', 'mark-l-chance', 'MC', 'mc', 'http://spesmagna.com/', 'Mark, a long time RPGer, runs Spes Magna Games, a small but\r\nmighty publisher of RPG PDFs. Mark releases his geomorphs under the\r\nCreative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported\r\nLicense.', '', ''),
(20, 'FrDave', 'frdave', 'FrD', 'frd', 'http://bloodofprokopius.blogspot.com/', 'FrDave got into this hobby decades ago when his mom came home with the Holmes Basic Edition. He has recently returned to that edition and found it necessary to create geomorphs with the ability to create rooms larger than 100 x 100. Compatible with other geomorphs, these can be pieced together so that rooms that go all the way to the edge of the geomorphs come together to make rooms as large as needed.', '', ''),
(22, 'Billdakat', 'billdakat', 'BDK', 'bdk', 'http://www.freepiratesforhire.com', 'Billdakat is a long time RPer, occasional GM, and would be writer and card game maker. He saw a need for city tiles and because he enjoys drawing maps made some edge tiles and more.', '', ''),
(23, 'Dominic Toghill', 'dominic-toghill', 'RD', 'rd', 'http://sites.google.com/site/earthbindersroleplayingstuff/', 'A Welshman, A Biomedical Scientist with a Masters Degrees in Haematology, A husband, sounds like a joke well actually its a confessed RPG/LRP addict for over twenty years.', '', ''),
(24, 'EricMTGCast', '/ericmtgcast', 'emc', 'emc', 'http://www.twitter.com/EricMTGCast', 'Eric is just a guy who gamed in his youth through college and is now picking it up with his kids. He can be found podcasting about Magic the Gathering on the MTGCast network.', '', ''),
(25, 'bygrinstow', 'bygrinstow', 'byg', 'byg', 'http://appendixm.blogspot.com/', ' 30+ year pen-and-paper gamer, husband, father, son, brother, friend, baker, entrepreneur (but can\'t pronounce it), doodler, reader, scribbler, crafter, dreamer and napper. Find his monster blog at <a href=\"http://appendixm.blogspot.com/\">http://appendixm.blogspot.com/</a>.', '', ''),
(26, 'Dakin &amp; Lorna Burdick', 'dakin-lorna-burdick', 'DLB', 'dakin', 'http://lostdelights.wordpress.com/', 'I\'m an Instructional Consultant. I\'ve been playing rpgs since 1978.', '', ''),
(27, 'PublicOpinion', 'publicopinion', 'PO', 'po', 'http://publop.tumblr.com/', 'PublicOpinion is a grad student who uses his geomorphs for running games online, and has released his tiles under the CreativeCommons Attribution-NonCommerical-ShareAlike license.', '', ''),
(28, 'Marc Majcher', 'marc-majcher', 'MM', 'mm', 'http://gizmet.com/', 'Marc is a game developer and improviser living in Austin, TX. In addition to self-publishing board, card, and role-playing games, he likes to draw stuff when he\'s not able to squeeze actual gaming into his ridiculous schedule.', '', ''),
(29, 'Sean Smith', 'sean-smith', 'SS', 'ss', 'http://archaism.co.uk', 'Sean Smith usually runs slightly anarchic campaigns, but between then writes at <a href=\"http://archaism.co.uk\">archaism.co.uk</a> &#8212; mostly about spec. fic.', '', ''),
(31, 'Danilo Montauriol', 'danilo-montauriol', 'DMD', 'dmd', 'http://leningrado8.wix.com/danilo', 'I\'m an Architect, Guitarist, RPG player and PC games player. I play RPG since 1998, and have been developing my own system (and a card game), which I hope to publish some day.', '', ''),
(32, 'Jelle \'Yazza\' Meersman', 'jelle-yazza-meersman', 'JM', 'jm', '', 'Creative jack of all trades with too many projects and too little time. Got strong links to the water and likes using it in his wargames and roleplay. Working in a model kit and wargame store in Antwerp, Belgium, inspiration always strikes!\r\nFrom building complete wargame tables, busy gameclub live to making props, painting/converting miniature. All around geekery always has a spot in his schedule.', '', ''),
(33, 'zombotron', 'zombotron', 'zt', 'zt', '', ' I\'ve been playing RPGs off-and-on for literally half my life. I\'ve played probably equal parts D&D, Palladium, and my friends unpublished homebrew system.', '', ''),
(34, 'morgajel', 'morgajel', 'mgj', 'mgj', 'http://citygenerator.morgajel.net/', 'Morgajel is a Linux Systems administrator who enjoys automation and random generation. He\'s been playing tabletop RPGs since 1988 and is the developer behind the CityGenerator suite of tools.', '', ''),
(35, 'FiTH HaZard', 'hazard', 'HZD', 'hzd', 'http://www.tantrumtech.info', 'HaZard is a screen printer and textiles worker from Adelaide. He is currently operating a vector design and vinyl cutting business called Tantrum Tech and is spreading out into indie game design.', '', ''),
(36, 'Matt Joyce', 'matt-joyce', 'MJ', 'mjo', 'https://plus.google.com/+MattJoyce01', 'Hobbyist in Australia. Licenses his tiles under Creative Commons license Attribution-ShareAlike 4.0 International(CC BY-SA 4.0).', '', ''),
(37, 'Nate McD', 'nate-mcd', 'NM', 'nm', 'http://gameofthought.blogspot.com/', 'Nate was an avid reader of fantasy and science fiction from a very young age, and an avid artist and cartographer, inspired by the stories, maps and illustrations from his father\'s early fantasy novel collection. He took up RPGs in the fourth grade which quickly absorbed his spare time and further fueled his imagination. He has gone on to be an artist, drafter, designer, and engineer, but is now focusing on game development, cartography, and illustration.\r\n\r\nIf you have a problem, if no one else can help, and if you can find him, maybe you can get Nate McD to help.', '', ''),
(38, 'WarrenAbox', 'warrenabox', 'WB', 'wb', 'http://warinabox.blogspot.com/', 'A thirty year gamer looking to give a little something back to the on-line community from which I\'ve taken so much. Tiles licensed under Creative Commons Attribution 4.0 International.', '', ''),
(39, 'PinkClouds', 'pink-clouds', 'PC', 'pc', '', 'Just another new GM trying to hash out some ideas for interesting dungeons. PinkClouds\' tiles are released under the Creative Coimmons Attribution-ShareAlike 4.0 International license.', '', ''),
(40, 'Rodger Thorm', 'rodger-thorm', 'RT', 'rt', 'https://rthorm.wordpress.com/', 'His tiles are released under CC BY-NC 4.0.', '', ''),
(41, 'Benjamin Wenham', 'benjamin-wenham', 'BW', 'bwen', 'http://savevscosmichorror.blogspot.com/', 'Ben is a occasional freelance writer; who seems to have become obsessed with drawing maps and specifically geomorphs. He warns that it may be contagious. His contributions to Dave\'s Mapper are released under a <a href=\"http://creativecommons.org/licenses/by-nc-sa/3.0/\">Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License</a>.', '', ''),
(42, 'Kosmic', 'kosmic', 'Ko', 'ko', 'http://kosmicdungeon.com/', 'Kosmic is a passionate RPG mapper and map blogger.', '', ''),
(43, 'David J Rust', 'david-j-rust', 'DJR', 'djr', 'https://twitter.com/sylvan_wolf', 'A gamer for decades, having started with AD&D back in late \'79. David began refereeing on January 1st, 1980 after having gotten all the AD&D books as a Christmas present. He loved the old, \"random dungeon generation\" tables and spent weeks just doodling dungeons.', '', ''),
(44, 'Flemtop', 'flemtop', 'flem', 'flem', '', 'A casual gamer, dipping their toes into the world of pen and paper RPGs. Main interest is in â€˜Paranoiaâ€™. In my spare time Iâ€™m trying to build additional content for DMs to help populate the infamous â€˜Alpha Complexâ€™.', '', ''),
(45, 'Draconian Rogue', 'draconian-rogue', 'DR', 'drac', '', 'A gamer for 40+ years, into maps even before that. Maps, floorplans, and mazes make\'s Draconian Rogue\'s head spin!', '', ''),
(46, 'Skia10', 'skia10', 'SK10', 'skia', '', 'I love art, and i also love RPG and roleplay. I found out about this site and loved it so much i was determined to contribute, wall, that was last year. I did it though, hoping to help out more.', '', ''),
(47, 'sidy111', 'sidy111', 'JB', 'sidy', '', 'sidy111 is an aspiring artist and programmer.', '', ''),
(48, 'SÃ¸ren Nissen', 'soren-nissen', 'SRN', 'srn', '', 'SÃ¸ren needed tiles for his own campaign, and decided he might as well share with others DMs.', '', ''),
(49, 'Culture20', 'culture20', 'C20', 'c20', '', 'I was short until high school.', '', '');

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
