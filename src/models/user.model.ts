export interface User {
	name: string
	email: string
	roles: string[]
}

export enum Roles {
	ADMIN = 'admin'
}