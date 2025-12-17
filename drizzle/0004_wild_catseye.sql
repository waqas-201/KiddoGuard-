PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_app_table` (
	`packageName` text PRIMARY KEY NOT NULL,
	`appName` text NOT NULL,
	`versionName` text,
	`icon` text NOT NULL,
	`isKidSafe` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_app_table`("packageName", "appName", "versionName", "icon", "isKidSafe") SELECT "packageName", "appName", "versionName", "icon", "isKidSafe" FROM `app_table`;--> statement-breakpoint
DROP TABLE `app_table`;--> statement-breakpoint
ALTER TABLE `__new_app_table` RENAME TO `app_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;