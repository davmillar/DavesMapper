-- phpMyAdmin SQL Dump
-- version 4.9.5
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: May 29, 2021 at 01:26 PM
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
-- Dumping data for table `tiles`
--

INSERT INTO `tiles` (`image`, `tile_type`, `map_type`, `artist_id`, `has_exit`, `approved`) VALUES
('byg/tile-corner-06.jpg', 3, 1, 25, 0, 1),
('mk/geomorph-94.jpg', 1, 2, 2, 0, 1),
('po/PublicOpinion_corner008.png', 3, 1, 27, 0, 1),
('nm/dungeon/1428282672dcorner4.png', 3, 1, 37, 0, 1),
('nm/cavern/1425840494cave8.png', 1, 2, 37, 0, 1),
('po/PublicOpinion_base30.png', 1, 2, 27, 0, 1),
('rd/Organic1.png', 1, 2, 23, 0, 1),
('dm/sideview/14290640932015_04_09_02_topleft.png', 1, 6, 17, 0, 1),
('dy/sides/005.png', 1, 6, 1, 0, 1),
('am/19.png', 1, 4, 4, 0, 1),
('byg/tile-base-19.jpg', 1, 1, 25, 0, 1),
('dmd/spaceship/1428685738SciFi_Pack2_-_5.jpg', 2, 7, 31, 0, 1),
('rd/rd_e011.png', 2, 7, 23, 0, 1),
('dy/sides/013.png', 1, 6, 1, 0, 1),
('frd/DG29.png', 1, 1, 20, 0, 1),
('sw/sideview/1397973183vertical-geomorph3-12.png', 1, 6, 3, 0, 1),
('dm/border/border-c-3.png', 2, 3, 17, 1, 1),
('i0/corner/dc_cornr2.png', 3, 3, 15, 0, 1),
('po/PublicOpinion_edge18.png', 2, 2, 27, 0, 1),
('uploads/1367399846CGP_23b.png', 1, 7, 11, 0, 1),
('uploads/1379393886dungeon_7_7.png', 1, 1, 33, 0, 1),
('uploads/1371754354tunnels_lrg.png', 1, 1, 23, 0, 1),
('sw/geomorph8.png', 1, 1, 3, 0, 1),
('nm/cavern/1425842690ccorner4.png', 3, 2, 37, 0, 1),
('frd/BPGE14.png', 2, 1, 20, 0, 1),
('mjo/dungeon/1421009706003-StdBase-1.png', 1, 1, 36, 0, 1),
('dy/geomorph-13-d.png', 1, 1, 1, 0, 1),
('ko/cavern/1457499565edge-geomorph-cavern-10.png', 2, 2, 42, 0, 1),
('uploads/1366327585Dungeon-Geomorphs-2013-04-16_23.png', 1, 1, 28, 0, 1),
('uploads/1379393854dungeon_7_1.png', 1, 1, 33, 0, 1),
('rt/cavern/1469254841SpiralThrone-geomorph300x.png', 1, 2, 40, 0, 1),
('wb/sideview/1428714183side008.png', 7, 6, 38, 0, 1),
('sw/sides/side_001.png', 1, 6, 3, 1, 1),
('dy/geomorph-3-d.png', 1, 1, 1, 0, 1),
('tb/015-crematorium.jpg', 1, 4, 11, 0, 1),
('dm/geo-a-11.png', 1, 1, 17, 0, 1),
('uploads/1366070858CGP_06.png', 2, 7, 11, 0, 1),
('uploads/1365994438cavern_2013_1.png', 1, 2, 17, 0, 1),
('ko/cavern/1457499404edge-geomorph-cavern-04.png', 2, 2, 42, 0, 1),
('bm/Geodice 09 - Sewer.png', 1, 3, 6, 0, 1),
('uploads/1366327721Dungeon-Geomorphs-2013-04-16_53.png', 2, 1, 28, 0, 1),
('dy/corner/corner2a.jpg', 3, 1, 1, 0, 1),
('frd/DG10.png', 1, 1, 20, 0, 1),
('bm/Geomorph 016.png', 1, 1, 6, 0, 1),
('nm/dungeon/1428417713dung10.png', 1, 1, 37, 0, 1),
('c20/dungeon/1575601348tile_geomorph_300x300_001.png', 1, 1, 49, 0, 1),
('frd/BPG13.png', 1, 1, 20, 0, 1),
('am/50.png', 1, 4, 4, 0, 1),
('uploads/1372125701bl_2013_01.png', 7, 6, 17, 0, 1),
('am/7.png', 1, 4, 4, 0, 1),
('mk/geomorph-42.jpg', 1, 3, 2, 0, 1),
('sidy/sideview/1570598846FullTiles4.png', 1, 6, 47, 0, 1),
('uploads/1366766924Geomorph-2013-04-23_07_19.png', 1, 1, 28, 0, 1),
('tl/dcmix/1474747884eb5geo.png', 2, 3, 5, 0, 1),
('pc/dungeon/14316541404.png', 1, 1, 39, 0, 1),
('mk/corner/corner-05.jpg', 3, 2, 2, 0, 1),
('dak/downdowndown1.png', 1, 2, 26, 0, 1),
('dy/geomorph-14-c.png', 1, 1, 1, 0, 1),
('dm/border/border-c-6.png', 2, 1, 17, 0, 1),
('mk/geomorph-39.jpg', 1, 1, 2, 0, 1),
('frd/BPG35.png', 1, 1, 20, 0, 1),
('djr/cavern/1525496980cavernsOfPirateIsland_bottomEdge04.png', 2, 2, 43, 0, 1),
('dm/corner/corner-c-15.png', 3, 1, 17, 0, 1),
('mjo/dungeon/1421010129005-StdEdge-4.png', 2, 1, 36, 0, 1),
('uploads/1366239642CGP_14.png', 1, 7, 11, 0, 1),
('ko/cavern/1457499474edge-geomorph-cavern-05.png', 2, 2, 42, 0, 1),
('dm/geo-b-4.png', 1, 2, 17, 0, 1),
('ko/cavern/1457499281base-geomorph-cavern-21.png', 1, 2, 42, 0, 1),
('ko/cavern/1469910318geomorph-set-01.jpg', 1, 2, 42, 0, 1),
('dm/cavern_2013_006.png', 1, 2, 17, 0, 1),
('ko/cavern/1457497648geomorph-06.png', 3, 2, 42, 0, 1),
('mjo/dungeon/1421009829004-StdBase-4.png', 1, 1, 36, 0, 1),
('dy/geomorph-7-e.png', 1, 1, 1, 0, 1),
('mk/geomorph-65.jpg', 1, 2, 2, 0, 1),
('frd/BPGE09.png', 2, 1, 20, 0, 1),
('uploads/1379392795cavern_1_5.png', 1, 2, 33, 0, 1),
('mjo/dungeon/1421010008005-StdCorner-2.png', 3, 1, 36, 0, 1),
('sw/geomorph1.png', 1, 1, 3, 0, 1),
('tb/scificity/1622312293mcm-006.jpg', 1, 9, 11, 0, 1),
('dm/scifi004.png', 1, 7, 17, 0, 1),
('frd/BPG28.png', 1, 1, 20, 0, 1),
('sk/sk_012_4.png', 1, 1, 10, 0, 1),
('po/PublicOpinion_edge007.png', 2, 2, 27, 0, 1),
('db/TotA Geomorph 24.jpg', 1, 1, 18, 0, 1),
('srn/village/1572412416corner-005.png', 3, 5, 48, 0, 1),
('sw/geomorph17-3.png', 1, 3, 3, 0, 1),
('frd/DG26.png', 1, 1, 20, 0, 1),
('tb/018-keep.jpg', 1, 4, 11, 0, 1),
('db/TotA Geomorph 14.jpg', 1, 1, 18, 0, 1),
('dy/geomorph-12-f.png', 1, 3, 1, 0, 1),
('djr/cavern/1525496879cavernsOfPirateIsland_centerTile08.png', 1, 2, 43, 0, 1),
('mk/geomorph-10.jpg', 1, 3, 2, 0, 1),
('uploads/1366482333edge-geomorphs0001.png', 2, 1, 27, 0, 1),
('sw/geomorph27-5.png', 1, 3, 3, 0, 1),
('dak/border9.png', 2, 2, 26, 0, 1),
('sk/dungeon_geomorph_004_6.png', 1, 1, 10, 0, 1),
('am/31.png', 1, 4, 4, 0, 1),
('am/9.png', 1, 4, 4, 0, 1),
('uploads/1366327830Dungeon-Geomorphs-2013-04-16_55.png', 3, 1, 28, 0, 1),
('mjo/dungeon/1421010294005-StdEdge-8.png', 2, 1, 36, 0, 1);

COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
