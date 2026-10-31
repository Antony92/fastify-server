import { DatabaseSync } from 'node:sqlite';
import type { FastifyPluginAsync } from 'fastify';

export type Session = {
  jti: string;
  username: string;
  created_at: number;
  expires_at: number;
};

export type AuthSessionOptions = {
  path?: string;
};

export type AuthSession = {
  createSession: (jti: string, username: string, expires_at: number) => Session;
  getSession: (jti: string) => Session | undefined;
  clearSession: (identifier: string) => void;
  clearExpiredSessions: () => void;
};

declare module 'fastify' {
  interface FastifyInstance {
    authSession: AuthSession;
  }
}

export const authSessionPlugin: FastifyPluginAsync<AuthSessionOptions> = async (
  server,
  options,
) => {
  const database = new DatabaseSync(options.path ?? ':memory:');
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

  const create = database.prepare(`
      INSERT INTO sessions (jti, username, created_at, expires_at)
      VALUES (?, ?, ?, ?)
      RETURNING jti, username, created_at, expires_at
    `);

  const get = database.prepare(`
      SELECT jti, username, created_at, expires_at
      FROM sessions
      WHERE jti = ? AND expires_at > ?
    `);

  const clear = database.prepare(`
      DELETE FROM sessions WHERE jti = :id OR username = :id
    `);

  const clearExpired = database.prepare(`
      DELETE FROM sessions WHERE expires_at <= ?
    `);

  const authSession: AuthSession = {
    createSession: (jti: string, username: string, expires_at: number) => {
      return create.get(jti, username, Date.now(), expires_at) as Session;
    },
    getSession: (jti: string) => {
      return get.get(jti, Date.now()) as Session | undefined;
    },
    clearSession: (identifier: string) => {
      clear.run({ id: identifier });
    },
    clearExpiredSessions: () => {
      clearExpired.run(Date.now());
    },
  };
  server.decorate('authSession', authSession);
  server.addHook('onClose', () => database.close());
};

export default authSessionPlugin;
