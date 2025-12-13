PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_child_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`timeLimit` integer NOT NULL,
	`embedding` text NOT NULL,
	`parentId` integer NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_child_table`("id", "name", "age", "timeLimit", "embedding", "parentId") SELECT "id", "name", "age", "timeLimit", "embedding", "parentId" FROM `child_table`;--> statement-breakpoint
DROP TABLE `child_table`;--> statement-breakpoint
ALTER TABLE `__new_child_table` RENAME TO `child_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;--> statement-breakpoint
CREATE TABLE `__new_parent_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`embedding` text NOT NULL,
	`isParentProfileCompleted` integer DEFAULT false NOT NULL
);
--> statement-breakpoint
INSERT INTO `__new_parent_table`("id", "name", "embedding", "isParentProfileCompleted") SELECT "id", "name", "embedding", "isParentProfileCompleted" FROM `parent_table`;--> statement-breakpoint
DROP TABLE `parent_table`;--> statement-breakpoint
ALTER TABLE `__new_parent_table` RENAME TO `parent_table`;