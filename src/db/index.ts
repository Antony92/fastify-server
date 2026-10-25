import { sql } from 'drizzle-orm';
import { drizzle } from 'drizzle-orm/node-postgres';
import { relations } from './schema.js';

const db = drizzle(process.env.DATABASE_URL || '', { relations });

export const isDatabaseActive = async () => {
  try {
    await db.execute(sql`SELECT now()`);
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export default db;
