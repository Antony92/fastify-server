import dotenv from 'dotenv'

dotenv.config()

const config = {
	environment: process.env.ENVIRONMENT || 'development',
	server: {
		port: process.env.SERVER_PORT ? parseInt(process.env.SERVER_PORT) : 8080,
		rateLimit: process.env.SERVER_RATE_LIMIT ? parseInt(process.env.SERVER_RATE_LIMIT) : 10000,
		url: process.env.SERVER_URL || 'https://www.dns.com',
	},
	microsoft: {
		clientId: process.env.MICROSOFT_CLIENT_ID || '',
		tenantId: process.env.MICROSOFT_TENANT_ID || '',
		clientSecret: process.env.MICROSOFT_CLIENT_SECRET || '',
		resource: process.env.MICROSOFT_RESOURCE || '',
	},
	jwt: {
		issuer: process.env.JWT_ISSUER,
		audience: process.env.JWT_AUDIENCE,
		accessTokenSecret: process.env.JWT_ACCESS_TOKEN_SECRET || 'secret',
		refreshTokenSecret: process.env.JWT_REFRESH_TOKEN_SECRET || 'secret',
		accessTokenExpire: process.env.JWT_ACCESS_TOKEN_EXPIRE || '15m',
		refreshTokenExpire: process.env.JWT_REFRESH_TOKEN_EXPIRE || '1d',
	},
	cookies: {
		refreshCookieName: process.env.COOKIE_REFRESH_NAME || 'refreshToken',
		refreshCookieExpire: process.env.COOKIE_REFRESH_EXPIRE ? parseInt(process.env.COOKIE_REFRESH_EXPIRE) : 24 * 60 * 1000 * 60, // 24 hours
	},
	auth: {
		loginCallbackURL: process.env.LOGIN_CALLBACK_URL || 'http://localhost:8080/api/v1/auth/login/callback',
		loginPageURL: process.env.LOGIN_PAGE_URL || 'http://localhost:5173/login',
	},
}

export default config
