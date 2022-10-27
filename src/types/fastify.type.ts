import { VerifyPayloadType, FastifyJwtVerifyOptions, VerifyOptions, SignPayloadType, FastifyJwtSignOptions, SignOptions } from '@fastify/jwt'
import { OAuth2Namespace } from '@fastify/oauth2'
import { AccessToken, RefreshToken } from 'src/models/jwt.model'

declare module '@fastify/jwt' {
	interface FastifyJWT {
		user: AccessToken
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
