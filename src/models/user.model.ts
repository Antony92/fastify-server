export interface User {
	name: string
	email: string
	roles: string[]
}

export enum Roles {
	ADMIN = 'admin'
}

declare module 'fastify-jwt' {
	interface FastifyJWT {
		payload: User
		user: User
	}
}