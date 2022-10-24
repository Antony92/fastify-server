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
		audience: process.env.JWT_AUDIENCE,
		accessTokenExpire: process.env.JWT_ACCESS_EXPIRE || '15m',
		refreshTokenExpire: process.env.JWT_REFRESH_EXPIRE || '1d',
		secret: process.env.JWT_SECRET
	},
	cookie: {
		name: process.env.COOKIE_NAME || 'jwt',
		secret: process.env.COOKIE_SECRET,
		expire: process.env.COOKIE_EXPIRE ? parseInt(process.env.COOKIE_EXPIRE) : 24 * 60 * 1000 * 60 // 24 hours
	}
}

export default config
