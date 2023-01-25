import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export const isPrismaActive = async () => {
    try {
        await prisma.$queryRaw`SELECT now()`
        return true
    } catch (error) {
        return false
    }
}

export const getPrismaMetrics = async () => {
    const metrics = await prisma.$metrics.json()
    return metrics
}

export default prisma