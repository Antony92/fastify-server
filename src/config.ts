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
		expire: process.env.JWT_EXPIRE ?? '15m',
		audience: process.env.JWT_AUDIENCE,
		secret: process.env.JWT_SECRET
	},
	cookie: {
		name: process.env.COOKIE_NAME || 'jwt',
		secret: process.env.COOKIE_SECRET,
		expire: process.env.COOKIE_EXPIRE ? parseInt(process.env.COOKIE_EXPIRE) : 15 * 1000 * 60 // 15 min
	},
	google: {
		redirect: process.env.GOOGLE_REDIRECT,
		clientId: process.env.GOOGLE_CLIENT_ID,
		clientSecret: process.env.GOOGLE_CLIENT_SECRET,
	}
}

export default config
