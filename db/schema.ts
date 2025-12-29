import { relations } from "drizzle-orm";
import { int, sqliteTable, text } from "drizzle-orm/sqlite-core";

// 1. Parent Table (Remains the same)
export const parentTable = sqliteTable("parent_table", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull(),
    embedding: text().notNull(),
    isParentProfileCompleted: int({ mode: "boolean" }).notNull().default(false),
});

// 2. Child Table (Added Daily Limit in Seconds)
export const childTable = sqliteTable("child_table", {
    id: int().primaryKey({ autoIncrement: true }),
    name: text().notNull().unique(),
    age: int().notNull(),
    dailyLimitSeconds: int().notNull(), // Master limit (e.g., 3600 for 1 hour)
    embedding: text().notNull(),
    parentId: int().notNull().references(() => parentTable.id, { onDelete: 'cascade' }),
    isKidProfileCompleted: int({ mode: 'boolean' }).default(false)
});

// 3. Usage Log Table (The Immutable History)
// Stores "Chunks" of time used.
export const usageLogTable = sqliteTable("usage_log", {
    id: int().primaryKey({ autoIncrement: true }),
    childId: int().notNull().references(() => childTable.id, { onDelete: 'cascade' }),
    startTime: int().notNull(), // Unix timestamp (Start of chunk)
    endTime: int().notNull(),   // Unix timestamp (End of chunk)
    duration: int().notNull(),  // Pre-calculated (endTime - startTime)
    date: text().notNull(),       // e.g., "2025-12-26" for easy grouping
});

// 4. Daily Balance Table (The Fast Cache)
// This is what the UI and Native side query for "Remaining Time"
export const dailyBalanceTable = sqliteTable("daily_balance", {
    id: int().primaryKey({ autoIncrement: true }),
    childId: int().notNull().references(() => childTable.id, { onDelete: 'cascade' }),
    date: text().notNull(),            // e.g., "2025-12-26"
    remainingSeconds: int().notNull(), // Updated every time a chunk ends
    lastSyncTimestamp: int().notNull(), // Helps with crash recovery
});


export const appTable = sqliteTable("app_table", {
    packageName: text().primaryKey(),
    appName: text().notNull(),
    icon: text().notNull(), // store icon as binary
    isKidSafe: int({ mode: 'boolean' }).notNull().default(false),  // 0 = false, 1 = true
    // minAge: int().notNull().default(0),     // minimum age to use this app  later after mvp 
});
// --- RELATIONS ---

export const parentRelations = relations(parentTable, ({ many }) => ({
    children: many(childTable),
}));

export const childRelations = relations(childTable, ({ one, many }) => ({
    parent: one(parentTable, {
        fields: [childTable.parentId],
        references: [parentTable.id],
    }),
    logs: many(usageLogTable),
    balances: many(dailyBalanceTable),
}));

export const usageLogRelations = relations(usageLogTable, ({ one }) => ({
    child: one(childTable, {
        fields: [usageLogTable.childId],
        references: [childTable.id],
    }),
}));

export const dailyBalanceRelations = relations(dailyBalanceTable, ({ one }) => ({
    child: one(childTable, {
        fields: [dailyBalanceTable.childId],
        references: [childTable.id],
    }),
}));