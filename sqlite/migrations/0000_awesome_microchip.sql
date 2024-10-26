CREATE TABLE `categories` (
	`category_id` text PRIMARY KEY NOT NULL,
	`name` text(256) NOT NULL,
	`description` text(256) NOT NULL,
	`is_active` integer NOT NULL,
	`created_at` integer NOT NULL
);
