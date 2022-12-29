import { Role } from '@prisma/client'

export type UserJWT = {
	name: string,
	email: string,
	roles: string[],
}

export type UserBody = {
	name: string
	email: string
	active?: boolean
	roles?: Role[]
}

export type UserSearchQuery = {
	skip?: number
	limit?: number
	name?: string
	email?: string
	active?: boolean
}
