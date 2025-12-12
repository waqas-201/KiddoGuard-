
import { open } from '@op-engineering/op-sqlite';
import { drizzle } from 'drizzle-orm/op-sqlite';
import { useMigrations } from 'drizzle-orm/op-sqlite/migrator'; // RN-safe
import migrations from '../drizzle/migrations'; // this file does not exist yet

// Open database
export const opsqliteDb = open({
    name: 'db',
});

// Connect Drizzle ORM
export const db = drizzle(opsqliteDb);

// Hook to apply migrations at runtime in RN
export function useDatabaseReady() {
    const { success, error } = useMigrations(db, migrations);
    return {  success, error };
}
