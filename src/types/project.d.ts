import type { OAuth2Namespace } from '@fastify/oauth2';
import type { AccessToken, RefreshToken } from './jwt.type.ts';
import type { Config } from '../config.ts';

declare module '@fastify/jwt' {
  interface FastifyJWT {
    namespaces: 'access' | 'refresh';
    user: AccessToken;
  }
}

declare module 'fastify' {
  interface FastifyInstance extends FastifyJwtNamespace<{ namespace: 'access' | 'refresh' }> {
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
