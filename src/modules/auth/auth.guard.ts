import type { FastifyRequest } from 'fastify';
import { getUserById } from '../user/user.service.js';
import type { AccessToken, RefreshToken } from '../../types/jwt.type.js';
import { getApiKey } from '../api-key/api-key.service.js';

export const secured = (roles?: string[]) => {
  return async (request: FastifyRequest) => {
    await request.accessJwtVerify();
    const user = await getUserById(request.user.id);
    if (user.blocked) {
      throw {
        message: `User is blocked`,
        error: 'Access',
        statusCode: 403,
      };
    }
    if (roles && !user.roles.some((role) => roles.includes(role))) {
      throw {
        message: `Insufficient roles`,
        error: 'Access',
        statusCode: 403,
      };
    }
  };
};

export const trustedAccessTokens = async (request: FastifyRequest, decodedToken: unknown) => {
  const token = decodedToken as AccessToken;
  if (token.use === 'api') {
    const apiKey = await getApiKey(token.jti);
    return Boolean(apiKey);
  }
  return token.use === 'session';
};

export const trustedRefreshTokens = async (request: FastifyRequest, decodedToken: unknown) => {
  const token = decodedToken as RefreshToken;
  const session = request.server.authSession.getSession(token.jti);
  return Boolean(session);
};
