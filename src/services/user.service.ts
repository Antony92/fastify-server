import prisma from '../db/prisma.js'

export const getUser = async (email: string) => {
    const user = await prisma.user.findFirst({
        where: {
            email
        }
    })
    return user
}
