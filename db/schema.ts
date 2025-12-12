import { blob, int, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const parentTable = sqliteTable("parent_table", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    embedding: blob("embedding", { mode: "buffer" }).notNull(),
});

export const childTable = sqliteTable("child_table", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    age: int().notNull(),
    timeLimit: int().notNull(),
    embedding: blob("embedding", { mode: "buffer" }).notNull(),
    parentId: int().notNull(), // link to parent

});

export const usageLogTable = sqliteTable("usage_log", {
    id: int().primaryKey({ autoIncrement: true }),
    startTime: int().notNull(), // Unix timestamp
    endTime: int(),             // Unix timestamp (nullable if ongoing)
    childId: int().notNull(), // link to child
});


export const appTable = sqliteTable("app_table", {
    packageName: text().primaryKey(),
    appName: text().notNull(),
    versionName: text(),
    icon: blob("icon", { mode: "buffer" }), // store icon as binary
    isKidSafe: int().notNull().default(0),  // 0 = false, 1 = true
    minAge: int().notNull().default(0),     // minimum age to use this app
});
