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

export type UserCreateBody = Omit<User, 'id'>

export type UserUpdateBody = Partial<UserCreateBody>

export type UserSearchQuery = {
	skip?: number
	limit?: number
	name?: string
	email?: string
	blocked?: boolean
}