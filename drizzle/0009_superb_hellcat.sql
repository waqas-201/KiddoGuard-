CREATE TABLE `daily_balance` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`childId` integer NOT NULL,
	`date` text NOT NULL,
	`remainingSeconds` integer NOT NULL,
	`lastSyncTimestamp` integer NOT NULL,
	FOREIGN KEY (`childId`) REFERENCES `child_table`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
DROP TABLE `app_table`;--> statement-breakpoint
PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_usage_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`childId` integer NOT NULL,
	`startTime` integer NOT NULL,
	`endTime` integer NOT NULL,
	`duration` integer NOT NULL,
	`date` text NOT NULL,
	FOREIGN KEY (`childId`) REFERENCES `child_table`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_usage_log`("id", "childId", "startTime", "endTime", "duration", "date") SELECT "id", "childId", "startTime", "endTime", "duration", "date" FROM `usage_log`;--> statement-breakpoint
DROP TABLE `usage_log`;--> statement-breakpoint
ALTER TABLE `__new_usage_log` RENAME TO `usage_log`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_child_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`dailyLimitSeconds` integer NOT NULL,
	`embedding` text NOT NULL,
	`parentId` integer NOT NULL,
	`isKidProfileCompleted` integer DEFAULT false,
	FOREIGN KEY (`parentId`) REFERENCES `parent_table`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
INSERT INTO `__new_child_table`("id", "name", "age", "dailyLimitSeconds", "embedding", "parentId", "isKidProfileCompleted") SELECT "id", "name", "age", "dailyLimitSeconds", "embedding", "parentId", "isKidProfileCompleted" FROM `child_table`;--> statement-breakpoint
DROP TABLE `child_table`;--> statement-breakpoint
ALTER TABLE `__new_child_table` RENAME TO `child_table`;--> statement-breakpoint
CREATE UNIQUE INDEX `child_table_name_unique` ON `child_table` (`name`);