CREATE TABLE `reservation_arts` (
	`id` int AUTO_INCREMENT NOT NULL,
	`reservationId` int NOT NULL,
	`fileUrl` text NOT NULL,
	`fileKey` varchar(255) NOT NULL,
	`fileName` varchar(255) NOT NULL,
	`fileSize` int,
	`mimeType` varchar(100),
	`uploadedBy` int NOT NULL,
	`uploadedByRole` enum('client','admin') NOT NULL,
	`version` int NOT NULL DEFAULT 1,
	`isActive` boolean NOT NULL DEFAULT true,
	`notes` text,
	`createdAt` timestamp NOT NULL DEFAULT (now()),
	CONSTRAINT `reservation_arts_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `reservations` ADD `saleNumber` varchar(50);--> statement-breakpoint
ALTER TABLE `reservations` ADD `artStatus` enum('waiting','received','approved','in_production') DEFAULT 'waiting';--> statement-breakpoint
ALTER TABLE `reservations` ADD `adminNotes` text;--> statement-breakpoint
ALTER TABLE `reservations` ADD `clientNotes` text;--> statement-breakpoint
ALTER TABLE `reservations` ADD `scheduledInstallDate` date;--> statement-breakpoint
ALTER TABLE `reservations` ADD `approvedAt` timestamp;--> statement-breakpoint
ALTER TABLE `reservations` ADD `approvedBy` int;