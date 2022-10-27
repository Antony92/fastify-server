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
		accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET,
		refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET,
		accessTokenExpire: process.env.JWT_ACCESS_TOKEN_EXPIRE || '15m',
		refreshTokenExpire: process.env.JWT_REFRESH_TOKEN_EXPIRE || '1d',
	},
	cookies: {
		accessName: process.env.COOKIE_ACCESS_NAME || 'accessToken',
		refreshName: process.env.COOKIE_REFRESH_NAME || 'refreshToken',
		accessExpire: process.env.COOKIE_ACCESS_EXPIRE ? parseInt(process.env.COOKIE_ACCESS_EXPIRE) : 15 * 1000 * 60, // 15 minutes
		refreshExpire: process.env.COOKIE_REFRESH_EXPIRE ? parseInt(process.env.COOKIE_REFRESH_EXPIRE) : 24 * 60 * 1000 * 60 // 24 hours
	}
}

export default config
