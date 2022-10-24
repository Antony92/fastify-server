import { OAuth2Namespace } from '@fastify/oauth2'

export interface User {
	name: string
	email: string
	roles: string[]
}

export interface UserToken extends User {
	jti: string
	api?: boolean
}

export enum Roles {
	ADMIN = 'admin'
}

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