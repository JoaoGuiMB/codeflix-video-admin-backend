PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_categories` (
	`category_id` text PRIMARY KEY NOT NULL,
	`name` text(256) NOT NULL,
	`description` text(256),
	`is_active` integer NOT NULL,
	`created_at` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_categories`("category_id", "name", "description", "is_active", "created_at") SELECT "category_id", "name", "description", "is_active", "created_at" FROM `categories`;--> statement-breakpoint
DROP TABLE `categories`;--> statement-breakpoint
ALTER TABLE `__new_categories` RENAME TO `categories`;--> statement-breakpoint
PRAGMA foreign_keys=ON;