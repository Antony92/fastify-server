import { UserJWT } from './user.type.js'

export type AccessToken = {
	jti: string
	api: boolean
	user: UserJWT
}

export type RefreshToken = {
	jti: string
	username: string
}
