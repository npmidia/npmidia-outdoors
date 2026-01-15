CREATE TABLE `biweeks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`year` int NOT NULL,
	`biweekNumber` int NOT NULL,
	`startDate` date NOT NULL,
	`endDate` date NOT NULL,
	CONSTRAINT `biweeks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `cart_items` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`outdoorId` int NOT NULL,
	`biweekIds` text NOT NULL,
	`includePaperGlue` boolean NOT NULL DEFAULT false,
	`includeCanvasInstall` boolean NOT NULL DEFAULT false,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `cart_items_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `favorites` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`outdoorId` int NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `favorites_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `outdoors` (
	`id` int AUTO_INCREMENT NOT NULL,
	`code` varchar(50) NOT NULL,
	`street` varchar(255),
	`number` varchar(20),
	`neighborhood` varchar(100),
	`city` varchar(100) NOT NULL,
	`state` varchar(50),
	`zipCode` varchar(20),
	`latitude` decimal(10,8),
	`longitude` decimal(11,8),
	`width` decimal(5,2),
	`height` decimal(5,2),
	`pricePerBiweek` decimal(10,2) NOT NULL,
	`hasLighting` boolean NOT NULL DEFAULT false,
	`activationDate` date,
	`isActive` boolean NOT NULL DEFAULT true,
	`photoUrl` text,
	`photoUrl2` text,
	`photoUrl3` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `outdoors_id` PRIMARY KEY(`id`),
	CONSTRAINT `outdoors_code_unique` UNIQUE(`code`)
);
--> statement-breakpoint
CREATE TABLE `reservation_biweeks` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reservationId` int NOT NULL,
	`biweekId` int NOT NULL,
	`outdoorId` int NOT NULL,
	`status` enum('pending','blocked','available') NOT NULL DEFAULT 'pending',
	CONSTRAINT `reservation_biweeks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `reservations` (
	`id` int AUTO_INCREMENT NOT NULL,
	`userId` int NOT NULL,
	`outdoorId` int NOT NULL,
	`status` enum('pending','approved','denied','cancelled') NOT NULL DEFAULT 'pending',
	`includePaperGlue` boolean NOT NULL DEFAULT false,
	`includeCanvasInstall` boolean NOT NULL DEFAULT false,
	`totalValue` decimal(10,2) NOT NULL,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	`updatedAt` timestamp NOT NULL DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `reservations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `phone` varchar(20);--> statement-breakpoint
ALTER TABLE `users` ADD `cpfCnpj` varchar(20);