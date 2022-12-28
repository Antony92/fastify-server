export const enum Roles {
	ADMIN = 'ADMIN',
	GUEST = 'GUEST'
}

export type User = {
	id: string
	name: string
	email: string,
	blocked: boolean,
	roles: Roles[]
}

export type UserCreateBody = {
	name: string
	email: string,
	roles?: Roles[]
}

export type UserUpdateBody = Partial<User>

export type UserSearchQuery = {
	skip?: number
	limit?: number
	search?: string
	blocked?: boolean
}