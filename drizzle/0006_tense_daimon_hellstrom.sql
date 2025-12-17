PRAGMA foreign_keys=OFF;--> statement-breakpoint
CREATE TABLE `__new_child_table` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`age` integer NOT NULL,
	`timeLimit` integer NOT NULL,
	`embedding` text NOT NULL,
	`parentId` integer NOT NULL,
	`isKidProfileCompleted` integer DEFAULT false
);
--> statement-breakpoint
INSERT INTO `__new_child_table`("id", "name", "age", "timeLimit", "embedding", "parentId", "isKidProfileCompleted") SELECT "id", "name", "age", "timeLimit", "embedding", "parentId", "isKidProfileCompleted" FROM `child_table`;--> statement-breakpoint
DROP TABLE `child_table`;--> statement-breakpoint
ALTER TABLE `__new_child_table` RENAME TO `child_table`;--> statement-breakpoint
PRAGMA foreign_keys=ON;