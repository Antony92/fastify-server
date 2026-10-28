import { type Static, Type } from 'typebox';

export const configSchema = Type.Object({
  NODE_ENV: Type.Union(
    [Type.Literal('development'), Type.Literal('production'), Type.Literal('test')],
    { default: 'development' },
  ),

  SERVER_HOST: Type.Optional(Type.String()),
  SERVER_PORT: Type.Integer({ default: 8080 }),
  SERVER_RATE_LIMIT: Type.Integer({ default: 6000 }),
  SERVER_URL: Type.String({ default: 'https://www.dns.com' }),

  MICROSOFT_CLIENT_ID: Type.String({ default: '' }),
  MICROSOFT_TENANT_ID: Type.String({ default: '' }),
  MICROSOFT_CLIENT_SECRET: Type.String({ default: '' }),
  MICROSOFT_RESOURCE: Type.String({ default: '' }),

  JWT_ACCESS_TOKEN_SECRET: Type.String({ minLength: 8 }),
  JWT_REFRESH_TOKEN_SECRET: Type.String({ minLength: 8 }),
  JWT_ACCESS_TOKEN_EXPIRE: Type.String({ default: '15m' }),
  JWT_REFRESH_TOKEN_EXPIRE: Type.String({ default: '1d' }),
  JWT_ISSUER: Type.Optional(Type.String()),
  JWT_AUDIENCE: Type.Optional(Type.String()),

  COOKIE_REFRESH_NAME: Type.String({ default: 'refreshToken' }),
  COOKIE_REFRESH_EXPIRE: Type.Integer({ default: 24 * 60 * 1000 * 60 }), // 24 hours

  LOGIN_CALLBACK_URL: Type.String({ default: 'http://localhost:8080/api/v1/auth/login/callback' }),
  LOGIN_REDIRECT: Type.String({ default: 'http://localhost:5173' }),
});

export type Config = Static<typeof configSchema>;
