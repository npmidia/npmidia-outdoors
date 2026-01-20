-- NPMIDIA Outdoors Database Dump
-- Generated at: 2026-01-19T21:02:50.189Z
-- Database: cXhAG5EAB7dbX8eMQWgiMq

SET FOREIGN_KEY_CHECKS=0;

-- Table: __drizzle_migrations
DROP TABLE IF EXISTS `__drizzle_migrations`;
CREATE TABLE `__drizzle_migrations` (
  `id` bigint(20) unsigned NOT NULL AUTO_INCREMENT,
  `hash` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `created_at` bigint(20) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `id` (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1296538;

INSERT INTO `__drizzle_migrations` (`id`, `hash`, `created_at`) VALUES (1, '814a08e40d7fc2bcfd458759d18319198ca8ae394f2fa15617a78678e9c9c93b', 1768445861362);
INSERT INTO `__drizzle_migrations` (`id`, `hash`, `created_at`) VALUES (2, 'a4ff41e4e8dcd6b4c666af14c749ed51b7c0e7ad371b2c887ffd3457e68cfd9e', 1768446029518);
INSERT INTO `__drizzle_migrations` (`id`, `hash`, `created_at`) VALUES (3, 'c4831e974e21f6ab2dc38a224a891e3149a75f688785f54615b8ac194b154d38', 1768446986312);
INSERT INTO `__drizzle_migrations` (`id`, `hash`, `created_at`) VALUES (4, 'e395c4c00e615f87a89d34169c0279a1487c5f439f455f856a72ab29ed178cfd', 1768450661227);
INSERT INTO `__drizzle_migrations` (`id`, `hash`, `created_at`) VALUES (1266538, '546bc89bcfa92778ba402cc0c8841e7ca9c94dd4624a61873a01b5708e9e59a7', 1768517414942);

-- Table: biweeks
DROP TABLE IF EXISTS `biweeks`;
CREATE TABLE `biweeks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `year` int(11) NOT NULL,
  `biweekNumber` int(11) NOT NULL,
  `startDate` date NOT NULL,
  `endDate` date NOT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30001;

INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (1, 2026, 2, '2025-12-29 05:00:00', '2026-01-11 05:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (2, 2026, 4, '2026-01-12 05:00:00', '2026-01-25 05:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (3, 2026, 6, '2026-01-26 05:00:00', '2026-02-08 05:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (4, 2026, 8, '2026-02-09 05:00:00', '2026-02-22 05:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (5, 2026, 10, '2026-02-23 05:00:00', '2026-03-08 05:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (6, 2026, 12, '2026-03-09 04:00:00', '2026-03-22 04:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (7, 2026, 14, '2026-03-23 04:00:00', '2026-04-05 04:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (8, 2026, 16, '2026-04-06 04:00:00', '2026-04-19 04:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (9, 2026, 18, '2026-04-20 04:00:00', '2026-05-03 04:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (10, 2026, 20, '2026-05-04 04:00:00', '2026-05-17 04:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (11, 2026, 22, '2026-05-18 04:00:00', '2026-05-31 04:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (12, 2026, 24, '2026-06-01 04:00:00', '2026-06-14 04:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (13, 2026, 26, '2026-06-15 04:00:00', '2026-06-28 04:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (14, 2026, 28, '2026-06-29 04:00:00', '2026-07-12 04:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (15, 2026, 30, '2026-07-13 04:00:00', '2026-07-26 04:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (16, 2026, 32, '2026-07-27 04:00:00', '2026-08-09 04:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (17, 2026, 34, '2026-08-10 04:00:00', '2026-08-23 04:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (18, 2026, 36, '2026-08-24 04:00:00', '2026-09-06 04:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (19, 2026, 38, '2026-09-07 04:00:00', '2026-09-20 04:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (20, 2026, 40, '2026-09-21 04:00:00', '2026-10-04 04:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (21, 2026, 42, '2026-10-05 04:00:00', '2026-10-18 04:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (22, 2026, 44, '2026-10-19 04:00:00', '2026-11-01 04:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (23, 2026, 46, '2026-11-02 05:00:00', '2026-11-15 05:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (24, 2026, 48, '2026-11-16 05:00:00', '2026-11-29 05:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (25, 2026, 50, '2026-11-30 05:00:00', '2026-12-13 05:00:00');
INSERT INTO `biweeks` (`id`, `year`, `biweekNumber`, `startDate`, `endDate`) VALUES (26, 2026, 52, '2026-12-14 05:00:00', '2026-12-27 05:00:00');

-- Table: cart_items
DROP TABLE IF EXISTS `cart_items`;
CREATE TABLE `cart_items` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `outdoorId` int(11) NOT NULL,
  `biweekIds` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `includePaperGlue` tinyint(1) NOT NULL DEFAULT '0',
  `includeCanvasInstall` tinyint(1) NOT NULL DEFAULT '0',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=360001;

-- Table: favorites
DROP TABLE IF EXISTS `favorites`;
CREATE TABLE `favorites` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `outdoorId` int(11) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30001;

-- Table: outdoors
DROP TABLE IF EXISTS `outdoors`;
CREATE TABLE `outdoors` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `code` varchar(50) COLLATE utf8mb4_unicode_ci NOT NULL,
  `street` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `number` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `neighborhood` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `city` varchar(100) COLLATE utf8mb4_unicode_ci NOT NULL,
  `state` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `zipCode` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `latitude` decimal(10,8) DEFAULT NULL,
  `longitude` decimal(11,8) DEFAULT NULL,
  `width` decimal(5,2) DEFAULT NULL,
  `height` decimal(5,2) DEFAULT NULL,
  `pricePerBiweek` decimal(10,2) NOT NULL,
  `hasLighting` tinyint(1) NOT NULL DEFAULT '0',
  `activationDate` date DEFAULT NULL,
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `photoUrl` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photoUrl2` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `photoUrl3` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `outdoors_code_unique` (`code`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=60001;

INSERT INTO `outdoors` (`id`, `code`, `street`, `number`, `neighborhood`, `city`, `state`, `zipCode`, `latitude`, `longitude`, `width`, `height`, `pricePerBiweek`, `hasLighting`, `activationDate`, `isActive`, `photoUrl`, `photoUrl2`, `photoUrl3`, `createdAt`, `updatedAt`) VALUES (1, 'Portal do Lago - sentido lago', 'Portal do lago - Sentido Educandário', '', 'Vila Paulista', 'Bebedouro', 'SP', '', '-20.95746218', '-48.47722217', '9.00', '3.00', '900.00', 0, '2026-01-15 05:00:00', 1, 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294141618/cXhAG5EAB7dbX8eMQWgiMq/outdoors/7Po32pGid9xSXA4PR2Adc.png', NULL, NULL, '2026-01-15 08:51:36', '2026-01-15 20:06:52');
INSERT INTO `outdoors` (`id`, `code`, `street`, `number`, `neighborhood`, `city`, `state`, `zipCode`, `latitude`, `longitude`, `width`, `height`, `pricePerBiweek`, `hasLighting`, `activationDate`, `isActive`, `photoUrl`, `photoUrl2`, `photoUrl3`, `createdAt`, `updatedAt`) VALUES (30001, 'Portal do lago - Sentido Educandário', 'Av Donina Valadão Furquim', '', 'Vila Paulista', 'Bebedouro', 'SP', '', '-20.95759436', '-48.47714554', '9.00', '3.00', '900.00', 0, '2026-01-15 05:00:00', 1, 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294141618/cXhAG5EAB7dbX8eMQWgiMq/outdoors/YomgHv7LYVH6a0sqJpmtb.png', NULL, NULL, '2026-01-15 20:05:17', '2026-01-15 20:05:17');
INSERT INTO `outdoors` (`id`, `code`, `street`, `number`, `neighborhood`, `city`, `state`, `zipCode`, `latitude`, `longitude`, `width`, `height`, `pricePerBiweek`, `hasLighting`, `activationDate`, `isActive`, `photoUrl`, `photoUrl2`, `photoUrl3`, `createdAt`, `updatedAt`) VALUES (30002, 'Pontilhão Fepasa - Esquerdo', 'Av. Sérgio Sessa Stamato', '', 'Lago', 'Bebedouro', 'SP', '', '-20.95082173', '-48.47361370', '9.00', '3.00', '900.00', 0, '2026-01-15 05:00:00', 1, 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294141618/cXhAG5EAB7dbX8eMQWgiMq/outdoors/nz8zAziKkhbkdf9pMAu_N.png', NULL, NULL, '2026-01-15 20:09:10', '2026-01-15 20:09:10');
INSERT INTO `outdoors` (`id`, `code`, `street`, `number`, `neighborhood`, `city`, `state`, `zipCode`, `latitude`, `longitude`, `width`, `height`, `pricePerBiweek`, `hasLighting`, `activationDate`, `isActive`, `photoUrl`, `photoUrl2`, `photoUrl3`, `createdAt`, `updatedAt`) VALUES (30003, 'Pontilhão Fepasa - Direita', 'Av. Sérgio Sessa Stamato', '', 'Lago', 'Bebedouro', 'SP', '', '-20.95061618', '-48.47378117', '9.00', '3.00', '900.00', 0, '2026-01-15 05:00:00', 1, 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294141618/cXhAG5EAB7dbX8eMQWgiMq/outdoors/rfVAS_FQKPIHvHWuU-tGw.png', NULL, NULL, '2026-01-15 20:11:23', '2026-01-15 20:11:23');
INSERT INTO `outdoors` (`id`, `code`, `street`, `number`, `neighborhood`, `city`, `state`, `zipCode`, `latitude`, `longitude`, `width`, `height`, `pricePerBiweek`, `hasLighting`, `activationDate`, `isActive`, `photoUrl`, `photoUrl2`, `photoUrl3`, `createdAt`, `updatedAt`) VALUES (30004, 'Fepasa', 'Av Edne José Piffer', '', 'Hércules Pereira Hortal', 'Bebedouro', 'SP', '', '-20.94986550', '-48.47430748', '9.00', '3.00', '900.00', 0, '2026-01-15 05:00:00', 1, 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294141618/cXhAG5EAB7dbX8eMQWgiMq/outdoors/qyKr6NmycL8rz5TJckmRN.jpeg', NULL, NULL, '2026-01-15 20:13:16', '2026-01-15 20:13:16');
INSERT INTO `outdoors` (`id`, `code`, `street`, `number`, `neighborhood`, `city`, `state`, `zipCode`, `latitude`, `longitude`, `width`, `height`, `pricePerBiweek`, `hasLighting`, `activationDate`, `isActive`, `photoUrl`, `photoUrl2`, `photoUrl3`, `createdAt`, `updatedAt`) VALUES (30005, 'Entrada de Bebedouro - GACP', 'Av. Hameleto Stamato', '', 'Entrada da cidade', 'Bebedouro', 'SP', '', '-20.93774431', '-48.45885022', '9.00', '3.00', '900.00', 0, '2026-01-15 05:00:00', 1, 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294141618/cXhAG5EAB7dbX8eMQWgiMq/outdoors/lQjRsltSDpAKPDj4iI7yJ.png', NULL, NULL, '2026-01-15 20:15:14', '2026-01-15 20:15:14');
INSERT INTO `outdoors` (`id`, `code`, `street`, `number`, `neighborhood`, `city`, `state`, `zipCode`, `latitude`, `longitude`, `width`, `height`, `pricePerBiweek`, `hasLighting`, `activationDate`, `isActive`, `photoUrl`, `photoUrl2`, `photoUrl3`, `createdAt`, `updatedAt`) VALUES (30006, 'Totem Lago - 2 Faces', 'Av. Donina Valladão Furquim', '', 'Lago', 'Bebedouro', 'SP', '', '-20.95702994', '-48.47763254', '5.00', '3.05', '900.00', 0, NULL, 1, 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294141618/cXhAG5EAB7dbX8eMQWgiMq/outdoors/6MQO0qsiFMOu4pt2mUres.png', 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294141618/cXhAG5EAB7dbX8eMQWgiMq/outdoors/VlOJi-rODg4Ar9IAfgZRg.png', 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294141618/cXhAG5EAB7dbX8eMQWgiMq/outdoors/fBI7JxXz-nfm_RaGOsKXs.png', '2026-01-15 20:18:23', '2026-01-15 20:18:23');
INSERT INTO `outdoors` (`id`, `code`, `street`, `number`, `neighborhood`, `city`, `state`, `zipCode`, `latitude`, `longitude`, `width`, `height`, `pricePerBiweek`, `hasLighting`, `activationDate`, `isActive`, `photoUrl`, `photoUrl2`, `photoUrl3`, `createdAt`, `updatedAt`) VALUES (30007, 'Av. Centenário', 'Av. Edne José Piffer', '', 'Centeário', 'Bebedouro', 'SP', '', '-20.94674957', '-48.46964068', '9.00', '3.00', '900.00', 0, '2026-01-15 05:00:00', 1, 'https://d2xsxph8kpxj0f.cloudfront.net/310519663294141618/cXhAG5EAB7dbX8eMQWgiMq/outdoors/_YxpHW7D1M_8r7QkOfEP6.png', NULL, NULL, '2026-01-15 20:19:53', '2026-01-17 03:49:02');

-- Table: reservation_arts
DROP TABLE IF EXISTS `reservation_arts`;
CREATE TABLE `reservation_arts` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reservationId` int(11) NOT NULL,
  `fileUrl` text COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileKey` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileName` varchar(255) COLLATE utf8mb4_unicode_ci NOT NULL,
  `fileSize` int(11) DEFAULT NULL,
  `mimeType` varchar(100) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `uploadedBy` int(11) NOT NULL,
  `uploadedByRole` enum('client','admin') COLLATE utf8mb4_unicode_ci NOT NULL,
  `version` int(11) NOT NULL DEFAULT '1',
  `isActive` tinyint(1) NOT NULL DEFAULT '1',
  `notes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=30001;

-- Table: reservation_biweeks
DROP TABLE IF EXISTS `reservation_biweeks`;
CREATE TABLE `reservation_biweeks` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `reservationId` int(11) NOT NULL,
  `biweekId` int(11) NOT NULL,
  `outdoorId` int(11) NOT NULL,
  `status` enum('pending','blocked','available') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=360001;

INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210002, 210002, 1, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210003, 210002, 2, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210004, 210002, 3, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210005, 210002, 4, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210006, 210002, 5, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210007, 210002, 6, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210008, 210002, 7, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210009, 210002, 8, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210010, 210002, 16, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210011, 210002, 15, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210012, 210002, 14, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210013, 210002, 13, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210014, 210002, 12, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210015, 210002, 11, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210016, 210002, 10, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210017, 210002, 9, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210018, 210002, 17, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210019, 210002, 18, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210020, 210002, 19, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210021, 210002, 20, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210022, 210002, 21, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210023, 210002, 22, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210024, 210002, 23, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210025, 210002, 24, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210026, 210002, 26, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (210027, 210002, 25, 30006, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240001, 240001, 3, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240002, 240001, 4, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240003, 240001, 5, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240004, 240001, 6, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240005, 240001, 7, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240006, 240001, 8, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240007, 240001, 9, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240008, 240001, 10, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240009, 240001, 11, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240010, 240001, 12, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240011, 240001, 13, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240012, 240001, 14, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240013, 240001, 15, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240014, 240001, 16, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240015, 240001, 17, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240016, 240001, 18, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240017, 240001, 19, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240018, 240001, 20, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240019, 240001, 21, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240020, 240001, 22, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240021, 240001, 23, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240022, 240001, 24, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240023, 240001, 25, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240024, 240001, 26, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240025, 240002, 3, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240026, 240002, 4, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240027, 240002, 5, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240028, 240002, 6, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240029, 240002, 7, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240030, 240002, 8, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240031, 240002, 9, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240032, 240002, 10, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240033, 240002, 11, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240034, 240002, 12, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240035, 240002, 13, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240036, 240002, 14, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240037, 240002, 15, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240038, 240002, 16, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240039, 240002, 17, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240040, 240002, 18, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240041, 240002, 19, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240042, 240002, 20, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240043, 240002, 21, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240044, 240002, 22, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240045, 240002, 23, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240046, 240002, 24, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240047, 240002, 25, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240048, 240002, 26, 30004, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240049, 240003, 3, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240050, 240003, 4, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240051, 240003, 5, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240052, 240003, 6, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240053, 240003, 7, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240054, 240003, 8, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240055, 240003, 9, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240056, 240003, 10, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240057, 240003, 11, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240058, 240003, 12, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240059, 240003, 13, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240060, 240003, 14, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240061, 240003, 15, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240062, 240003, 16, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240063, 240003, 17, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240064, 240003, 18, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240065, 240003, 19, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240066, 240003, 20, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240067, 240003, 21, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240068, 240003, 22, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240069, 240003, 23, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240070, 240003, 24, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240071, 240003, 25, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (240072, 240003, 26, 30003, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (270001, 270001, 3, 1, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300001, 300001, 3, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300002, 300001, 4, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300003, 300001, 5, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300004, 300001, 6, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300005, 300001, 7, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300006, 300001, 9, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300007, 300001, 10, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300008, 300001, 8, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300009, 300001, 11, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300010, 300001, 12, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300011, 300001, 13, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300012, 300001, 14, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300013, 300001, 15, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300014, 300001, 16, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300015, 300001, 17, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300016, 300001, 18, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300017, 300001, 19, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300018, 300001, 20, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300019, 300001, 21, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300020, 300001, 22, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300021, 300001, 23, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300022, 300001, 24, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300023, 300001, 26, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (300024, 300001, 25, 30004, 'pending');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (330001, 330001, 3, 30007, 'blocked');
INSERT INTO `reservation_biweeks` (`id`, `reservationId`, `biweekId`, `outdoorId`, `status`) VALUES (330002, 330001, 4, 30007, 'blocked');

-- Table: reservations
DROP TABLE IF EXISTS `reservations`;
CREATE TABLE `reservations` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `userId` int(11) NOT NULL,
  `outdoorId` int(11) NOT NULL,
  `status` enum('pending','approved','denied','cancelled') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'pending',
  `includePaperGlue` tinyint(1) NOT NULL DEFAULT '0',
  `includeCanvasInstall` tinyint(1) NOT NULL DEFAULT '0',
  `totalValue` decimal(10,2) NOT NULL,
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `saleNumber` varchar(50) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `artStatus` enum('waiting','received','approved','in_production') COLLATE utf8mb4_unicode_ci DEFAULT 'waiting',
  `adminNotes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `clientNotes` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `scheduledInstallDate` date DEFAULT NULL,
  `approvedAt` timestamp NULL DEFAULT NULL,
  `approvedBy` int(11) DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=360001;

INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (1, 1, 1, 'denied', 1, 0, '2150.00', '2026-01-15 08:53:13', '2026-01-15 09:42:56', NULL, 'waiting', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (2, 1, 1, 'denied', 1, 0, '2150.00', '2026-01-15 08:59:39', '2026-01-15 09:28:31', NULL, 'waiting', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (3, 1, 1, 'denied', 0, 0, '900.00', '2026-01-15 09:27:58', '2026-01-15 09:42:55', NULL, 'waiting', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (30001, 155, 1, 'denied', 1, 0, '1250.00', '2026-01-15 10:26:17', '2026-01-16 06:26:15', NULL, 'waiting', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (60001, 90001, 1, 'denied', 1, 1, '2750.00', '2026-01-15 16:59:58', '2026-01-16 06:26:14', NULL, 'waiting', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (90001, 1, 1, 'denied', 0, 0, '900.00', '2026-01-15 19:39:01', '2026-01-16 06:26:13', NULL, 'waiting', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (90002, 155, 30007, 'denied', 1, 0, '1250.00', '2026-01-15 20:27:03', '2026-01-16 06:26:12', NULL, 'waiting', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (90003, 240052, 30003, 'denied', 1, 0, '1250.00', '2026-01-15 20:42:09', '2026-01-16 06:26:10', NULL, 'waiting', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (120001, 155, 30007, 'cancelled', 0, 0, '900.00', '2026-01-15 21:15:24', '2026-01-16 09:49:54', NULL, 'received', 'Teste', NULL, NULL, '2026-01-16 06:15:20', 155);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (120002, 270038, 30004, 'denied', 0, 0, '1800.00', '2026-01-15 22:12:19', '2026-01-16 06:26:06', NULL, 'waiting', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (150001, 155, 30004, 'denied', 0, 0, '21600.00', '2026-01-16 09:44:21', '2026-01-17 03:51:01', NULL, 'waiting', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (150002, 155, 30004, 'denied', 0, 0, '1800.00', '2026-01-16 09:44:52', '2026-01-17 03:51:00', NULL, 'waiting', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (150003, 155, 30004, 'denied', 0, 0, '1800.00', '2026-01-16 09:45:29', '2026-01-17 03:50:59', NULL, 'waiting', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (150004, 155, 30003, 'denied', 0, 0, '21600.00', '2026-01-16 09:46:32', '2026-01-17 03:50:57', NULL, 'waiting', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (150005, 155, 1, 'denied', 0, 0, '21600.00', '2026-01-16 09:47:49', '2026-01-17 03:50:56', NULL, 'waiting', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (180001, 930004, 30004, 'denied', 0, 0, '1800.00', '2026-01-16 17:30:32', '2026-01-17 03:50:54', NULL, 'waiting', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (180002, 930001, 30001, 'denied', 1, 1, '2750.00', '2026-01-16 17:37:38', '2026-01-17 03:50:53', NULL, 'waiting', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (180003, 930001, 1, 'denied', 0, 0, '900.00', '2026-01-16 17:38:06', '2026-01-17 03:50:51', NULL, 'waiting', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (210001, 1, 30007, 'denied', 0, 0, '900.00', '2026-01-17 02:38:07', '2026-01-17 03:50:47', NULL, 'waiting', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (210002, 1, 30006, 'approved', 0, 0, '23400.00', '2026-01-17 02:38:07', '2026-01-17 03:52:03', '0000', 'waiting', 'LOCADO PARA CALDEIRÃO FURADO - POR GISELE', NULL, NULL, '2026-01-17 02:39:31', 1);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (240001, 1, 30004, 'approved', 0, 0, '21600.00', '2026-01-17 03:54:36', '2026-01-17 03:55:41', '0000', 'waiting', 'OTICAS DINIZ - VENDEDOR NETO GAMITO', NULL, NULL, '2026-01-17 03:55:30', 1);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (240002, 1, 30004, 'approved', 0, 0, '21600.00', '2026-01-17 03:56:14', '2026-01-17 03:56:47', '10123', 'waiting', NULL, NULL, NULL, '2026-01-17 03:56:48', 1);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (240003, 1, 30003, 'approved', 0, 0, '21600.00', '2026-01-17 03:58:04', '2026-01-17 03:58:23', '00000', 'waiting', NULL, NULL, NULL, '2026-01-17 03:58:23', 1);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (270001, 1, 1, 'pending', 0, 0, '900.00', '2026-01-17 05:38:41', '2026-01-17 05:38:41', NULL, 'waiting', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (300001, 155, 30004, 'pending', 0, 0, '21600.00', '2026-01-18 22:34:53', '2026-01-18 22:34:53', NULL, 'waiting', NULL, NULL, NULL, NULL, NULL);
INSERT INTO `reservations` (`id`, `userId`, `outdoorId`, `status`, `includePaperGlue`, `includeCanvasInstall`, `totalValue`, `createdAt`, `updatedAt`, `saleNumber`, `artStatus`, `adminNotes`, `clientNotes`, `scheduledInstallDate`, `approvedAt`, `approvedBy`) VALUES (330001, 155, 30007, 'approved', 0, 0, '1800.00', '2026-01-19 19:21:01', '2026-01-19 19:21:34', '101010', 'waiting', NULL, NULL, NULL, '2026-01-19 19:21:35', 155);

-- Table: users
DROP TABLE IF EXISTS `users`;
CREATE TABLE `users` (
  `id` int(11) NOT NULL AUTO_INCREMENT,
  `openId` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `name` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `email` varchar(320) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `loginMethod` varchar(64) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `role` enum('user','admin') COLLATE utf8mb4_unicode_ci NOT NULL DEFAULT 'user',
  `createdAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `updatedAt` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  `lastSignedIn` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP,
  `phone` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `cpfCnpj` varchar(20) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `company` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `address` text COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  `passwordHash` varchar(255) COLLATE utf8mb4_unicode_ci DEFAULT NULL,
  PRIMARY KEY (`id`) /*T![clustered_index] CLUSTERED */,
  UNIQUE KEY `users_openId_unique` (`openId`),
  UNIQUE KEY `users_email_unique` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci AUTO_INCREMENT=1710001;

INSERT INTO `users` (`id`, `openId`, `name`, `email`, `loginMethod`, `role`, `createdAt`, `updatedAt`, `lastSignedIn`, `phone`, `cpfCnpj`, `company`, `address`, `passwordHash`) VALUES (1, 'iSDBGbCzXmXpmPH37HjzLb', 'NPMIDIA Vídeos', 'rtvnpmidia@gmail.com', 'google', 'admin', '2026-01-15 08:04:20', '2026-01-20 01:53:22', '2026-01-20 01:53:22', '', '20550368825', '', '', NULL);
INSERT INTO `users` (`id`, `openId`, `name`, `email`, `loginMethod`, `role`, `createdAt`, `updatedAt`, `lastSignedIn`, `phone`, `cpfCnpj`, `company`, `address`, `passwordHash`) VALUES (155, NULL, 'Neto Gamito', 'neto@npmidia.com', 'email', 'admin', '2026-01-15 09:26:51', '2026-01-20 01:52:40', '2026-01-20 01:52:41', '(17) 99145-0494', NULL, 'NPMIDIA', NULL, '$2b$10$TSwF5gD8Nic0M5RKs.jsLekC2o4UxxXRKpqUqg7RTIj6OMLXDsE7i');
INSERT INTO `users` (`id`, `openId`, `name`, `email`, `loginMethod`, `role`, `createdAt`, `updatedAt`, `lastSignedIn`, `phone`, `cpfCnpj`, `company`, `address`, `passwordHash`) VALUES (90001, NULL, 'Wilker ', 'djwilkers@hotmail.com', 'email', 'user', '2026-01-15 16:58:26', '2026-01-15 17:02:13', '2026-01-15 17:02:14', '(17) 99164-5691', NULL, 'Teste ', NULL, '$2b$10$dc9hx3qdrIJqA0aQPBVXBerG5zJHkQ2n0hqHFAYKoKE2j0wqdYMCG');
INSERT INTO `users` (`id`, `openId`, `name`, `email`, `loginMethod`, `role`, `createdAt`, `updatedAt`, `lastSignedIn`, `phone`, `cpfCnpj`, `company`, `address`, `passwordHash`) VALUES (240052, NULL, 'Heloisa P Gamito', 'heloisa-perez@hotmail.com', 'email', 'admin', '2026-01-15 20:40:49', '2026-01-16 02:29:06', '2026-01-16 02:29:06', '(17) 99123-0624', NULL, 'Npmidia', NULL, '$2b$10$eZSLgukwqWmrQuSgdQHJuOCWANntX1OR6Lyyw780JuFiE2nEYhQBa');
INSERT INTO `users` (`id`, `openId`, `name`, `email`, `loginMethod`, `role`, `createdAt`, `updatedAt`, `lastSignedIn`, `phone`, `cpfCnpj`, `company`, `address`, `passwordHash`) VALUES (270038, NULL, 'Graciana ', 'grabebedouro@gmail.com', 'email', 'user', '2026-01-15 22:10:14', '2026-01-15 22:12:36', '2026-01-15 22:12:36', '(17) 99736-0554', NULL, 'D’Thales veículos ', NULL, '$2b$10$..vmm.p2Y7it.C9Hd2G8GOH1U0rRZwECayZRBMzt02FVyOofB80vK');
INSERT INTO `users` (`id`, `openId`, `name`, `email`, `loginMethod`, `role`, `createdAt`, `updatedAt`, `lastSignedIn`, `phone`, `cpfCnpj`, `company`, `address`, `passwordHash`) VALUES (300014, NULL, 'RODRIGO PEREZ GAMITO', 'atendimento@npmidia.com', 'email', 'user', '2026-01-16 01:08:09', '2026-01-16 01:08:33', '2026-01-16 01:08:34', '(17) 99123-0845', NULL, 'NP Midia', NULL, '$2b$10$wVTdO3JzWP18/3vJ8kKqJ.REt68bVwZMAFUf1Rp80fQEfuqK6Sdbu');
INSERT INTO `users` (`id`, `openId`, `name`, `email`, `loginMethod`, `role`, `createdAt`, `updatedAt`, `lastSignedIn`, `phone`, `cpfCnpj`, `company`, `address`, `passwordHash`) VALUES (930001, NULL, 'Fabio Kosmala', 'fabiokosmala@gmail.com', 'email', 'user', '2026-01-16 17:23:38', '2026-01-18 00:37:24', '2026-01-18 00:37:24', '(41) 99121-4171', '', 'Astrosites', '', '$2b$10$5m/udnk2Fessbl3eeocACeA/mHBecTNqF.rdgSqkOBn4FWgZm3Ffi');
INSERT INTO `users` (`id`, `openId`, `name`, `email`, `loginMethod`, `role`, `createdAt`, `updatedAt`, `lastSignedIn`, `phone`, `cpfCnpj`, `company`, `address`, `passwordHash`) VALUES (930004, NULL, 'Antonio', 'antonio@gmail.com', 'email', 'user', '2026-01-16 17:28:32', '2026-01-16 17:31:21', '2026-01-16 17:31:22', '(19) 99287-4525', NULL, 'Teste', NULL, '$2b$10$X8qBKKAuMUqXrv4MVCe35OZsni60mO0gbWIZe6x8sfYvGb3XTQy7.');

SET FOREIGN_KEY_CHECKS=1;
