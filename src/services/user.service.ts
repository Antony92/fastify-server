import prisma from '../db/prisma.js'
import { UserCreate, UserSearchQuery, UserUpdate } from '../types/user.type.js'

export const getUser = async (email: string) => {
    const user = await prisma.user.findFirst({
        where: {
            email
        }
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
                blocked: query?.blocked
            }
        }),
        prisma.user.count()
    ])
    return { data: users, total }
}

export const createUser = async (user: UserCreate) => {
    const createdUser = await prisma.user.create({
        data: {
            name: user.name,
            email: user.email,
            blocked: user.blocked,
            roles: user.roles,
        }
    })
    return createdUser
}

export const updateUser = async (id: string, user: UserUpdate) => {
    const updatedUser = await prisma.user.update({
        data: {
            name: user.name,
            email: user.email,
            blocked: user.blocked,
            roles: user.roles,
            updated: new Date()
        },
        where: {
            id
        }
    })
    return updatedUser
}

export const deleteUser = async (id: string) => {
    const deletedUser = await prisma.user.delete({
        where: {
            id
        }
    })
    return deletedUser
}