import { OAuth2Namespace } from '@fastify/oauth2'
import { UserToken } from './user.model'

declare module '@fastify/jwt' {
	interface FastifyJWT {
		user: UserToken
	}
}

declare module 'fastify' {
	interface FastifyInstance {
		microsoftOAuth: OAuth2Namespace
	}
}
