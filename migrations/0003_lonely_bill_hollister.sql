CREATE TABLE `friend_requests` (
	`id` text PRIMARY KEY NOT NULL,
	`from_user_id` text NOT NULL,
	`to_user_id` text NOT NULL,
	`status` text DEFAULT 'pending' NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP,
	FOREIGN KEY (`from_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`to_user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `amenities` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `amenities_name_unique` ON `amenities` (`name`);--> statement-breakpoint
CREATE TABLE `opening_hours` (
	`id` text PRIMARY KEY NOT NULL,
	`place_id` text NOT NULL,
	`day` text NOT NULL,
	`hours` text NOT NULL,
	FOREIGN KEY (`place_id`) REFERENCES `places`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `place_amenities` (
	`place_id` text NOT NULL,
	`amenity_id` text NOT NULL,
	PRIMARY KEY(`place_id`, `amenity_id`),
	FOREIGN KEY (`place_id`) REFERENCES `places`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`amenity_id`) REFERENCES `amenities`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE TABLE `place_categories` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `place_categories_name_unique` ON `place_categories` (`name`);--> statement-breakpoint
CREATE TABLE `place_category_relations` (
	`place_id` text NOT NULL,
	`category_id` text NOT NULL,
	PRIMARY KEY(`place_id`, `category_id`),
	FOREIGN KEY (`place_id`) REFERENCES `places`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`category_id`) REFERENCES `place_categories`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_reviews` (
	`id` text PRIMARY KEY NOT NULL,
	`user_id` text NOT NULL,
	`place_id` text NOT NULL,
	`rating` integer NOT NULL,
	`comment` text,
	`created_at` text DEFAULT (current_timestamp) NOT NULL,
	`updated_at` text DEFAULT (current_timestamp) NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action,
	FOREIGN KEY (`place_id`) REFERENCES `places`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_reviews`("id", "user_id", "place_id", "rating", "comment", "created_at", "updated_at") SELECT "id", "user_id", "place_id", "rating", "comment", "created_at", "updated_at" FROM `reviews`;--> statement-breakpoint
DROP TABLE `reviews`;--> statement-breakpoint
ALTER TABLE `__new_reviews` RENAME TO `reviews`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_user_location` (
	`user_id` text PRIMARY KEY NOT NULL,
	`latitude` real NOT NULL,
	`longitude` real NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL,
	FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
INSERT INTO `__new_user_location`("user_id", "latitude", "longitude", "updated_at") SELECT "user_id", "latitude", "longitude", "updated_at" FROM `user_location`;--> statement-breakpoint
DROP TABLE `user_location`;--> statement-breakpoint
ALTER TABLE `__new_user_location` RENAME TO `user_location`;--> statement-breakpoint
DROP INDEX "categories_name_unique";--> statement-breakpoint
DROP INDEX "amenities_name_unique";--> statement-breakpoint
DROP INDEX "place_categories_name_unique";--> statement-breakpoint
DROP INDEX "authenticator_credentialID_unique";--> statement-breakpoint
DROP INDEX "user_email_unique";--> statement-breakpoint
ALTER TABLE `events` ALTER COLUMN "description" TO "description" text NOT NULL;--> statement-breakpoint
CREATE UNIQUE INDEX `categories_name_unique` ON `categories` (`name`);--> statement-breakpoint
CREATE UNIQUE INDEX `authenticator_credentialID_unique` ON `authenticator` (`credentialID`);--> statement-breakpoint
CREATE UNIQUE INDEX `user_email_unique` ON `user` (`email`);--> statement-breakpoint
ALTER TABLE `events` ALTER COLUMN "latitude" TO "latitude" real NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ALTER COLUMN "longitude" TO "longitude" real NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ALTER COLUMN "date" TO "date" integer NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `creator_id` text NOT NULL REFERENCES user(id);--> statement-breakpoint
ALTER TABLE `events` ADD `time` text NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `location_source` text DEFAULT 'custom' NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `place_id` text REFERENCES places(id);--> statement-breakpoint
ALTER TABLE `events` ADD `category` text NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `capacity` integer NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `is_private` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `events` ADD `image_url` text;--> statement-breakpoint
ALTER TABLE `events` ADD `created_at` integer DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `events` ADD `updated_at` integer DEFAULT CURRENT_TIMESTAMP;--> statement-breakpoint
ALTER TABLE `events` DROP COLUMN `owner_id`;--> statement-breakpoint
ALTER TABLE `places` ALTER COLUMN "address" TO "address" text NOT NULL;--> statement-breakpoint
ALTER TABLE `places` ADD `description` text;--> statement-breakpoint
ALTER TABLE `places` ADD `website` text;--> statement-breakpoint
ALTER TABLE `places` ADD `phone` text;--> statement-breakpoint
ALTER TABLE `places` ADD `created_at` text DEFAULT (current_timestamp) NOT NULL;--> statement-breakpoint
ALTER TABLE `places` ADD `updated_at` text DEFAULT (current_timestamp) NOT NULL;--> statement-breakpoint
ALTER TABLE `event_attendance` ADD `guests` integer DEFAULT 0 NOT NULL;--> statement-breakpoint
ALTER TABLE `event_attendance` ADD `note` text;--> statement-breakpoint
ALTER TABLE `user` ADD `username` text;--> statement-breakpoint
ALTER TABLE `user` ADD `imageUrl` text;--> statement-breakpoint
ALTER TABLE `user` ADD `location` text;--> statement-breakpoint
ALTER TABLE `user` ADD `isOnline` integer;--> statement-breakpoint
ALTER TABLE `user` ADD `lastActive` integer;--> statement-breakpoint
ALTER TABLE `user` ADD `isSharingLocation` integer DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `user` ADD `coordinates` text;