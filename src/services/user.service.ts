import { Role } from '@prisma/client'
import prisma from '../db/prisma.js'
import { UserBody, UserSearchQuery } from '../types/user.type.js'

export const getRoles = () => {
    return Object.values(Role)
}

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
                active: query?.active
            }
        }),
        prisma.user.count()
    ])
    return { data: users, total }
}

export const createUser = async (user: UserBody) => {
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
            email: user.email
        }
    })
    return createdUser
}

export const updateUser = async (id: string, user: Partial<UserBody>) => {
    const updatedUser = await prisma.user.update({
        data: {
            name: user.name,
            email: user.email,
            active: user.active,
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