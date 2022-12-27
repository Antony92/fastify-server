import prisma from '../db/prisma.js'

export const getUser = async (search: string) => {
    const user = await prisma.user.findFirst({
        where: {
            OR: [
                { id: search },
                { email: search },
                { name: search },
            ]
        }
    })
    return user
}
