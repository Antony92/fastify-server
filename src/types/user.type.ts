export enum Role {
	ADMIN = 'ADMIN',
	GUEST = 'GUEST'
}

export type User = {
	id: string
	name: string
	email: string,
	blocked: boolean,
	roles: Role[]
}

export type UserCreateBody = {
	name: string
	email: string,
	roles?: Role[]
}

export type UserUpdateBody = Partial<User>

export type UserSearchQuery = {
	skip?: number
	limit?: number
	name?: string
	email?: string
	blocked?: boolean
}