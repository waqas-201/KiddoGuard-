CREATE TABLE `app_table` (
	`packageName` text PRIMARY KEY NOT NULL,
	`appName` text NOT NULL,
	`icon` text NOT NULL,
	`isKidSafe` integer DEFAULT false NOT NULL
);
