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