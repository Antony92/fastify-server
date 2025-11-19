import { PrismaClient } from '@prisma/client'
import { PrismaPg } from '@prisma/adapter-pg'

const adapter = new PrismaPg({
	connectionString: process.env.DATABASE_URL!,
})

const prisma = new PrismaClient({
	adapter,
})

export const isPrismaActive = async () => {
	try {
		await prisma.$queryRaw`SELECT now()`
		return true
	} catch (error) {
		console.log(error)
		return false
	}
}

export default prisma
