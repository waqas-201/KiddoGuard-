CREATE TABLE `app_table` (
	`packageName` text PRIMARY KEY NOT NULL,
	`appName` text NOT NULL,
	`versionName` text,
	`icon` blob,
	`isKidSafe` integer DEFAULT 0 NOT NULL,
	`minAge` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `child_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`timeLimit` integer NOT NULL,
	`embedding` blob NOT NULL,
	`parentId` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `parent_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`embedding` blob NOT NULL
);
--> statement-breakpoint
CREATE TABLE `usage_log` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`startTime` integer NOT NULL,
	`endTime` integer,
	`childId` integer NOT NULL
);
