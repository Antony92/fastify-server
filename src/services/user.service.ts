import { Prisma, Role } from '@prisma/client'
import prisma from '../db/prisma.js'
import { UserSearchQuery } from '../types/user.type.js'

export const getUserRoles = () => {
	return Object.values(Role)
}

export const hasUserRole = async (email: string, roles: Role[]) => {
	const user = await prisma.user.findFirst({ where: { email } })
    return user && user.roles.some(role => roles.includes(role))
}

export const getUser = async (email: string) => {
	const user = await prisma.user.findFirst({
		where: {
			email,
		},
	})
	return user
}

export const getUsers = async (query?: UserSearchQuery) => {
	const [users, total] = await prisma.$transaction([
		prisma.user.findMany({
			skip: query?.skip || 0,
			take: query?.limit || 10,
			where: {
				name: { startsWith: query?.name },
				email: { startsWith: query?.email },
				active: query?.active,
			},
		}),
		prisma.user.count(),
	])
	return { data: users, total }
}

export const createUser = async (user: Prisma.UserCreateInput) => {
	const createdUser = await prisma.user.upsert({
		create: {
			name: user.name,
			email: user.email,
			active: user.active,
			roles: user.roles,
		},
		update: {
			name: user.name,
			email: user.email,
			active: user.active,
			roles: user.roles,
			updated: new Date(),
		},
		where: {
			email: user.email,
		},
	})
	return createdUser
}

export const updateUser = async (email: string, user: Prisma.UserUpdateInput) => {
	const updatedUser = await prisma.user.update({
		data: {
			name: user.name,
			email: user.email,
			active: user.active,
			roles: user.roles,
			updated: new Date(),
		},
		where: {
			email
		},
	})
	return updatedUser
}

export const deleteUser = async (email: string) => {
	const deletedUser = await prisma.user.delete({
		where: {
			email,
		},
	})
	return deletedUser
}
