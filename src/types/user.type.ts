import { Prisma } from '@prisma/client'

export type UserJWT = {
	id: string
	name: string
	username: string
	roles: string[]
	impersonated?: string
}

export const Role = {
    GUEST: 'GUEST',
    ADMIN: 'ADMIN',
} as const

export type RoleType = typeof Role[keyof typeof Role]

export type UserCreateBody = Pick<Prisma.UserCreateInput, 'name' | 'username' | 'roles' | 'active' | 'blocked'>

export type UserUpdateBody = Pick<Prisma.UserUpdateInput, 'name' | 'username' | 'roles' | 'active' | 'blocked'>

export type UserCreateInput = Pick<Prisma.UserCreateInput, 'name' | 'username' | 'roles' | 'active' | 'blocked' | 'lastLogin' | 'internal'>

export type UserUpdateInput = { id: string } & Pick<Prisma.UserUpdateInput, 'name' | 'username' | 'roles' | 'active' | 'blocked'>

export type UserSearchQuery = {
	skip?: number
	limit?: number
	search?: string
	name?: string
	username?: string
	active?: boolean
	blocked?: boolean
	internal?: boolean
	roles?: string
	order?: string
	sort?: string
}