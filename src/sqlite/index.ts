import { DatabaseSync } from 'node:sqlite';

// :memory: for in memory or ${import.meta.dirname}/sqlite.db for persistent storage
const database = new DatabaseSync(`:memory:`);

export const initializeSQLite = () => {
  database.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      jti TEXT NOT NULL UNIQUE,
      username TEXT NOT NULL UNIQUE,
      created_at INTEGER NOT NULL
    );
  `);
};

export const getUserByUsername = (username: string) => {
  return database
    .prepare(`
    SELECT * FROM users WHERE username = ?
  `)
    .get(username);
};

export const getUserByJTI = (jti: string) => {
  return database
    .prepare(`
    SELECT * FROM users WHERE jti = ?
  `)
    .get(jti);
};

export const createUser = (jti: string, username: string, created_at: number) => {
  return database
    .prepare(`
    INSERT INTO users (jti, username, created_at)
    VALUES (?, ?, ?)
    RETURNING id, jti, username, created_at
  `)
    .get(jti, username, created_at);
};

export const deleteUser = (jti: string) => {
  return database
    .prepare(`
    DELETE FROM users WHERE jti = ?
  `)
    .run(jti);
};

export default database;
