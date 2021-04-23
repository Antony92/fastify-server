import dotenv from 'dotenv'

dotenv.config({ path: `${__dirname}/.env` })

const config = {
	environment: process.env.ENVIRONMENT || 'development',
	server: {
		port: process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 8080,
		rateLimit: process.env.SERVER_RATE_LIMIT ? parseInt(process.env.SERVER_RATE_LIMIT) : 1000,
	},
	jwt: {
		issuer: process.env.JWT_ISSUER || 'default',
		expire: process.env.JWT_EXPIRE ? parseInt(process.env.JWT_EXPIRE) : 3600,
		audience: process.env.JWT_AUDIENCE || 'default',
	},
}

export default config
