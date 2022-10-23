import { OAuth2Namespace } from '@fastify/oauth2'

export interface User {
	jti?: string
	name: string
	email: string
	roles: string[]
}

export enum Roles {
	ADMIN = 'admin'
}

declare module '@fastify/jwt' {
	interface FastifyJWT {
		user: User
	}
}

declare module 'fastify' {
  interface FastifyInstance {
    googleOAuth2: OAuth2Namespace;
  }
}