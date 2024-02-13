import { OAuth2Namespace } from '@fastify/oauth2'
import { RefreshToken } from '../src/types/jwt.type.js'
import { UserJWT } from '../src/types/user.type.js'

declare module '@fastify/jwt' {
	interface FastifyJWT {
		user: UserJWT
	}
}

declare module 'fastify' {
	interface FastifyInstance {
		microsoftOAuth2: OAuth2Namespace
	}

	interface FastifyRequest {
		accessJwtVerify: FastifyRequest['jwtVerify']
		refreshJwtVerify: FastifyRequest['jwtVerify']
		refreshToken: RefreshToken
	}

	interface FastifyReply {
		accessJwtSign: FastifyReply['jwtSign']
		refreshJwtSign: FastifyReply['jwtSign']
	}
}
