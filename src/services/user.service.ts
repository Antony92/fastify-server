import { Role } from '@prisma/client'
import prisma from '../db/prisma.js'
import { UserCreateInput, UserSearchQuery, UserUpdateInput } from '../types/user.type.js'

export const getRoles = () => {
	return Object.values(Role)
}

export const getUserByUsername = async (username: string) => {
	const user = await prisma.user.findUniqueOrThrow({
		where: {
			username,
		},
	})
	return user
}

export const getUserById = async (id: string) => {
	const user = await prisma.user.findUniqueOrThrow({
		where: {
			id,
		},
	})
	return user
}

export const getUsers = async (query?: UserSearchQuery) => {
	const roles = query?.roles?.split(',') || getRoles()
	const searchFilter = {}
	if (query?.search) {
		Object.assign(searchFilter, {
			OR: [{ name: { contains: query?.search, mode: 'insensitive' } }, { username: { contains: query?.search, mode: 'insensitive' } }],
		})
	}
	const [users, total] = await prisma.$transaction([
		prisma.user.findMany({
			skip: query?.skip || 0,
			take: query?.limit || 10,
			where: {
				name: { startsWith: query?.name, mode: 'insensitive' },
				username: { startsWith: query?.username, mode: 'insensitive' },
				active: query?.active,
				blocked: query?.blocked,
				internal: query?.internal,
				roles: {
					hasSome: roles as Role[],
				},
				...searchFilter,
			},
			orderBy: {
				[query?.sort || 'name']: query?.order || 'asc',
			},
			include: {
				apiKey: true,
			},
		}),
		prisma.user.count({
			where: {
				name: { startsWith: query?.name, mode: 'insensitive' },
				username: { startsWith: query?.username, mode: 'insensitive' },
				active: query?.active,
				blocked: query?.blocked,
				internal: query?.internal,
				roles: {
					hasSome: roles as Role[],
				},
				...searchFilter,
			},
		}),
	])
	return { users, total }
}

export const createUser = async (user: UserCreateInput) => {
	const createdUser = await prisma.user.upsert({
		create: {
			...user,
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
			...user,
		},
		where: {
			id: user.id,
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

export const getUserProfile = async (id: string) => {
	const profile = await prisma.user.findFirstOrThrow({
		where: {
			id,
		},
		include: {
			apiKey: true,
		},
	})
	return profile
}
