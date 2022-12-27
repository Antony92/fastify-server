export const enum Roles {
	ADMIN = 'ADMIN',
	GUEST = 'GUEST'
}

export type User = {
	id: string
	name: string
	email: string
	roles: Roles[]
}
