import { Role } from '@prisma/client'
import prisma from '../db/prisma.js'
import { UserCreateInput, UserSearchQuery, UserUpdateInput } from '../types/user.type.js'

export const getRoles = () => {
	return Object.values(Role)
}

export const getUserByUsername = async (username: string) => {
	const user = await prisma.user.findUnique({
		where: {
			username,
		},
	})
	return user
}

export const getUserById = async (id: string) => {
	const user = await prisma.user.findUnique({
		where: {
			id,
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
				username: { startsWith: query?.username },
				active: query?.active,
				blocked: query?.blocked,
				lastLogin: {
					lte: query?.lastLoginEnd,
                    gte: query?.lastLoginStart,
				}
			},
		}),
		prisma.user.count(),
	])
	return { users, total }
}

export const createUser = async (user: UserCreateInput) => {
	const createdUser = await prisma.user.upsert({
		create: {
			...user
		},
		update: {
			...user,
		},
		where: {
			username: user.username,
		},
	})
	return createdUser
}

export const updateUser = async (user: UserUpdateInput) => {
	const updatedUser = await prisma.user.update({
		data: {
			...user
		},
		where: {
			id: user.id
		},
	})
	return updatedUser
}

export const deleteUser = async (id: string) => {
	const deletedUser = await prisma.user.delete({
		where: {
			id,
		},
	})
	return deletedUser
}