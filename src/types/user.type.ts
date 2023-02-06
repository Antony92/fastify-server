import { Prisma, Role } from '@prisma/client'

export type UserJWT = {
	id: string
	name: string
	username: string
	roles: Role[]
}

export type UserCreateBody = Omit<Prisma.UserCreateInput, 'id' | 'created' | 'updated' | 'lastLogin'>

export type UserUpdateBody = Omit<Prisma.UserUpdateInput, 'id' | 'created' | 'updated' | 'lastLogin'>

export type UserCreateInput = Omit<Prisma.UserCreateInput, 'id' | 'created' | 'updated'>

export type UserUpdateInput = { id: string } & Omit<Prisma.UserUpdateInput, 'id' | 'created' | 'updated'>

export type UserSearchQuery = {
	skip?: number
	limit?: number
	name?: string
	username?: string
	active?: boolean
	blocked?: boolean
	lastLoginStart?: string
	lastLoginEnd?: string
}
