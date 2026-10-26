import type { OAuth2Namespace } from '@fastify/oauth2';
import type { RefreshToken } from './jwt.type.ts';
import type { UserJWT } from '../src/types/user.type.js';
import type { Config } from '../config.ts';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    user: UserJWT;
  }
}

declare module 'fastify' {
  interface FastifyInstance {
    microsoftOAuth2: OAuth2Namespace;
    config: Config;
  }

  interface FastifyRequest {
    accessJwtVerify: FastifyRequest['jwtVerify'];
    refreshJwtVerify: FastifyRequest['jwtVerify'];
    refreshToken: RefreshToken;
  }

  interface FastifyReply {
    accessJwtSign: FastifyReply['jwtSign'];
    refreshJwtSign: FastifyReply['jwtSign'];
  }
}
