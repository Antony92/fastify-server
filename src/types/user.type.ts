export const enum Roles {
	ADMIN = 'admin'
}

export type User = {
	name: string
	email: string
	roles: Roles[]
}
