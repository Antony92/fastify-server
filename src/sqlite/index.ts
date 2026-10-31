import { DatabaseSync } from 'node:sqlite';

const database = new DatabaseSync(':memory:');

export const initializeSQLite = () => {
  database.exec(`
    CREATE TABLE IF NOT EXISTS sessions (
      jti TEXT PRIMARY KEY,
      username TEXT NOT NULL,
      created_at INTEGER NOT NULL,
      expires_at INTEGER NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_sessions_username ON sessions (username);
    CREATE INDEX IF NOT EXISTS idx_sessions_expires_at ON sessions (expires_at);
  `);
};

export const clearExpiredSessions = () => {
  return database
    .prepare(`
      DELETE FROM sessions WHERE expires_at <= ?
    `)
    .run(Date.now());
};

export const getSession = (jti: string) => {
  return database
    .prepare(`
      SELECT jti, username, created_at, expires_at
      FROM sessions
      WHERE jti = ? AND expires_at > ?
    `)
    .get(jti, Date.now());
};

export const createSession = (jti: string, username: string, expires_at: number) => {
  clearExpiredSessions();
  return database
    .prepare(`
      INSERT INTO sessions (jti, username, created_at, expires_at)
      VALUES (?, ?, ?, ?)
      RETURNING jti, username, created_at, expires_at
    `)
    .get(jti, username, Date.now(), expires_at);
};

export const clearSession = (identifier: string) => {
  return database
    .prepare(`
      DELETE FROM sessions WHERE jti = :id OR username = :id
    `)
    .run({ id: identifier });
};

export default database;
