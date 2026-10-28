import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';

const db = drizzle({
  connection: {
    connectionString: process.env.DATABASE_URL,
    max: 1,
  },
});

try {
  const start = Date.now();
  await migrate(db, {
    migrationsFolder: './drizzle',
  });
  console.log(`Migrations applied successfully in ${Date.now() - start}ms`);
} catch (error) {
  console.error(error);
  process.exit(1);
} finally {
  await db.$client.end();
}
