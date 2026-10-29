import type { OAuth2Namespace } from '@fastify/oauth2';
import type { AccessToken } from './jwt.type.ts';
import type { Config } from '../config.ts';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: AccessToken;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    microsoftOAuth2: OAuth2Namespace;
    config: Config;
  }
}
