
import { and, eq, sql } from "drizzle-orm";
import { db } from "../../db/db";
import { childTable, dailyBalanceTable, usageLogTable } from "../../db/schema";


// Standardized response type for UI and Native Bridge communication
export type DbResult<T> =
    | { success: true; data: T }
    | { success: false; error: string };

/**
 * 1. GET SESSION TIME
 * Checks the "Wallet" for today. If it doesn't exist, it creates it using the Master Limit.
 * Returns the number of seconds the child is allowed to use.
 */
export const getSessionTime = async (childId: number): Promise<DbResult<number>> => {
    try {
        const today = new Date().toISOString().split('T')[0];

        // Step 1: Check for existing balance
        const [balance] = await db
            .select()
            .from(dailyBalanceTable)
            .where(
                and(
                    eq(dailyBalanceTable.childId, childId),
                    eq(dailyBalanceTable.date, today)
                )
            )
            .limit(1);

        if (balance) {
            console.log(`[VERIFIED] Existing Balance Found: ${balance.remainingSeconds}s`);
            return { success: true, data: balance.remainingSeconds };
        }

        // Step 2: If no balance, Initialize New Day (Atomic Transaction)
        return await db.transaction(async (tx) => {
            const [child] = await tx
                .select()
                .from(childTable)
                .where(eq(childTable.id, childId))
                .limit(1);

            if (!child) {
                throw new Error("CHILD_NOT_FOUND");
            }

            // Create the record
            await tx.insert(dailyBalanceTable).values({
                childId: childId,
                date: today,
                remainingSeconds: child.dailyLimitSeconds,
                lastSyncTimestamp: Math.floor(Date.now() / 1000)
            });

            // Re-fetch to guarantee data exists on disk
            const [newBalance] = await tx
                .select()
                .from(dailyBalanceTable)
                .where(
                    and(
                        eq(dailyBalanceTable.childId, childId),
                        eq(dailyBalanceTable.date, today)
                    )
                )
                .limit(1);

            console.log(`[VERIFIED] New Day Created: ${newBalance.remainingSeconds}s`);
            return { success: true, data: newBalance.remainingSeconds };
        });

    } catch (error: any) {
        console.error("[DB ERROR] getSessionTime:", error);
        return {
            success: false,
            error: error.message || "Failed to initialize or fetch session time"
        };
    }
};

/**
 * 2. UPDATE BALANCE AFTER SESSION
 * Deducts time used and records a history log.
 */
export const updateBalanceAfterSession = async (
    childId: number,
    secondsUsed: number
): Promise<DbResult<void>> => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const now = Math.floor(Date.now() / 1000);

        await db.transaction(async (tx) => {
            // Use SQL-level subtraction to prevent race conditions
            await tx.update(dailyBalanceTable)
                .set({
                    remainingSeconds: sql`${dailyBalanceTable.remainingSeconds} - ${secondsUsed}`,
                    lastSyncTimestamp: now
                })
                .where(
                    and(
                        eq(dailyBalanceTable.childId, childId),
                        eq(dailyBalanceTable.date, today)
                    )
                );

            // Log the usage history
            await tx.insert(usageLogTable).values({
                childId,
                startTime: now - secondsUsed,
                endTime: now,
                duration: secondsUsed,
                date: today
            });
        });

        return { success: true, data: undefined };
    } catch (error: any) {
        console.error("[DB ERROR] updateBalanceAfterSession:", error);
        return { success: false, error: error.message };
    }
};

/**
 * 3. FINALIZE TIME UP
 * Hard-resets the balance to zero when the timer expires.
 */
export const finalizeTimeUp = async (
    childId: number,
    totalSecondsSinceLastSync: number
): Promise<DbResult<void>> => {
    try {
        const today = new Date().toISOString().split('T')[0];
        const now = Math.floor(Date.now() / 1000);

        await db.transaction(async (tx) => {
            await tx.update(dailyBalanceTable)
                .set({
                    remainingSeconds: 0,
                    lastSyncTimestamp: now
                })
                .where(
                    and(
                        eq(dailyBalanceTable.childId, childId),
                        eq(dailyBalanceTable.date, today)
                    )
                );

            await tx.insert(usageLogTable).values({
                childId,
                startTime: now - totalSecondsSinceLastSync,
                endTime: now,
                duration: totalSecondsSinceLastSync,
                date: today
            });
        });

        return { success: true, data: undefined };
    } catch (error: any) {
        console.error("[DB ERROR] finalizeTimeUp:", error);
        return { success: false, error: error.message };
    }
};