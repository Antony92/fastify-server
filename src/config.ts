import dotenv from 'dotenv'

dotenv.config()

const config = {
	environment: process.env.ENVIRONMENT || 'development',
	server: {
		port: process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 8080,
		rateLimit: process.env.SERVER_RATE_LIMIT ? parseInt(process.env.SERVER_RATE_LIMIT) : 1000,
	},
	jwt: {
		issuer: process.env.JWT_ISSUER,
		expire: process.env.JWT_EXPIRE ?? '1h',
		audience: process.env.JWT_AUDIENCE,
		secret: process.env.JWT_SECRET
	},
	cookie: {
		secret: process.env.COOKIE_SECRET,
		expire: process.env.COOKIE_EXPIRE ? parseInt(process.env.COOKIE_EXPIRE) : 10000
	}
}

export default config
