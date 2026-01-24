import { Prisma, Role } from '../db/prisma/client.js'
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

export const getUsers = async (query: UserSearchQuery = {}) => {
	const roles = query.roles?.split(',') || getRoles()

	const { skip = 0, limit = 10, sort = 'created', order = 'desc', search, ...filters } = query

	const where: Prisma.UserWhereInput = {
		name: { startsWith: filters?.name, mode: 'insensitive' },
		username: { startsWith: filters?.username, mode: 'insensitive' },
		active: filters?.active,
		blocked: filters?.blocked,
		internal: filters?.internal,
		roles: {
			hasSome: roles as Role[],
		},
	}

	if (search) {
		where.OR = [{ name: { contains: query?.search, mode: 'insensitive' } }, { username: { contains: query?.search, mode: 'insensitive' } }]
	}

	const [users, total] = await prisma.$transaction([
		prisma.user.findMany({
			where,
			skip,
			take: limit,
			orderBy: { [sort]: order },
		}),
		prisma.user.count({ where }),
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
