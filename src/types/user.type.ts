export enum Role {
	ADMIN = 'ADMIN',
	GUEST = 'GUEST'
}

export type User = {
	id: string
	name: string
	email: string,
	blocked?: boolean,
	roles: Role[]
}

export type UserCreate = Omit<User, 'id'>

export type UserUpdate = Partial<UserCreate>

export type UserSearchQuery = {
	skip?: number
	limit?: number
	name?: string
	email?: string
	blocked?: boolean
}