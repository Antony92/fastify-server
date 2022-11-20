import { VerifyPayloadType, FastifyJwtVerifyOptions, VerifyOptions, SignPayloadType, FastifyJwtSignOptions, SignOptions } from '@fastify/jwt'
import { OAuth2Namespace } from '@fastify/oauth2'
import { RefreshToken } from '../types/jwt.type'
import { User } from './user.type'

declare module '@fastify/jwt' {
	interface FastifyJWT {
		user: User
	}
}

declare module 'fastify' {
	interface FastifyInstance {
		microsoftOAuth: OAuth2Namespace
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
