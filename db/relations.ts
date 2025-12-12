// schema.ts
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const parentTable = sqliteTable("parent_table", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
});

export const childTable = sqliteTable("child_table", {
    id: int().primaryKey({ autoIncrement: true }),
    parentId: int().notNull().references(() => parentTable.id),
    name: text().notNull(),
});

export const usageLogTable = sqliteTable("usage_log_table", {
    id: int().primaryKey({ autoIncrement: true }),
    childId: int().notNull().references(() => childTable.id),
    usage: text().notNull(),
});
