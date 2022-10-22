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