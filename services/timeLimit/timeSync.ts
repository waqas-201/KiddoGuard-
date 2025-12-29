import TimelimitModule from '@/modules/expo-TimeLimit';
import { finalizeTimeUp, getSessionTime, updateBalanceAfterSession } from '../timeLimit/timelimit';
// A simple variable to remember the balance when the kid started
let sessionStartBalance = 0;

/**
 * START HANDSHAKE (Updated)
 */
export const startChildTimer = async (childId: number) => {
    const result = await getSessionTime(childId);
    if (result.success && result.data > 0) {
        // We SAVE the starting balance in memory
        sessionStartBalance = result.data;

        await TimelimitModule.startCountdown(result.data);
        return true;
    }
    return false;
};

/**
 * TASK 2: SAVE ON EXIT
 * This now uses your "Layer" to update the DB and create logs.
 */
export const stopAndSaveChildTimer = async (childId: number) => {
    // 1. Get what is left on the clock right now
    const remainingFromNative = await TimelimitModule.stopCountdown();

    console.log( 'remainign form native ' , remainingFromNative);
    

    // 2. Calculate seconds used: (Start Balance) - (Current Remaining)
    // Example: 8100 (start) - 8000 (now) = 100 seconds used
    const secondsUsed = Math.max(0, sessionStartBalance - remainingFromNative);

    console.log(`[TASK 2] Session ended. Used: ${secondsUsed}s. Sending to DB layer...`);

    if (secondsUsed > 0) {
        // 3. CALL YOUR DB LAYER FUNCTION
        // This handles the dailyBalanceTable AND the usageLogTable for you!
        await updateBalanceAfterSession(childId, secondsUsed);
    }

    // Reset the session variable
    sessionStartBalance = 0;
};


// Add this to your TimeSyncService object (Don't forget the comma!)
 export const handleTimeExpiration =  async (childId: number) => {
    console.log(`[Sync] TIME EXPIRED for Child ${childId}. Finalizing...`);

    // 1. Force stop the native service just in case
    await TimelimitModule.stopCountdown();

    // 2. Use your DB Layer to set balance to 0 and log the final session
    // We pass 'sessionStartBalance' to record the full duration used
    await finalizeTimeUp(childId, sessionStartBalance);

    // 3. Reset the memory variable
    sessionStartBalance = 0;
}