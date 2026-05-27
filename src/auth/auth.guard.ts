import type { FastifyRequest } from 'fastify';
import { getUserById } from '../services/user.service.js';
import type { AccessToken, RefreshToken } from '../types/jwt.type.js';

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
	return decodedToken;
	// const allowed = ['token1', 'token2'];
	// return allowed.includes(token.jti) ? decodedToken : false;
};

export const trustedRefreshTokens = async (request: FastifyRequest, decodedToken: unknown) => {
	const token = decodedToken as RefreshToken;
	return decodedToken;
	// const allowed = ['token1', 'token2'];
	// return allowed.includes(token.jti) ? decodedToken : false;
};
