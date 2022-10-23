import { Token } from '@fastify/oauth2'

export type RefreshTokenRequest = {
	Body: {
		refreshToken: Token
	}
}
