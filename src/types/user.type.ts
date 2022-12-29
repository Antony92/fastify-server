import { Prisma } from '@prisma/client'

export type UserJWT = {
	name: string,
	email: string,
	roles: string[],
}

export type UserBody = Omit<Prisma.UserCreateInput, 'id' | 'created' | 'updated'>

export type UserSearchQuery = {
	skip?: number
	limit?: number
	name?: string
	email?: string
	active?: boolean
}
