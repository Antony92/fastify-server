import { VerifyPayloadType, FastifyJwtVerifyOptions, VerifyOptions, SignPayloadType, FastifyJwtSignOptions, SignOptions } from '@fastify/jwt'
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
		accessJwtVerify<Decoded extends VerifyPayloadType>(options?: FastifyJwtVerifyOptions | Partial<VerifyOptions>): Promise<Decoded>
		refreshJwtVerify<Decoded extends VerifyPayloadType>(options?: FastifyJwtVerifyOptions | Partial<VerifyOptions>): Promise<Decoded>
		refreshToken: RefreshToken
	}

	interface FastifyReply {
		accessJwtSign(payload: SignPayloadType, options?: FastifyJwtSignOptions | Partial<SignOptions>): Promise<string>
		refreshJwtSign(payload: SignPayloadType, options?: FastifyJwtSignOptions | Partial<SignOptions>): Promise<string>
	}
}
