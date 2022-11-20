import { User } from './user.type'

export type AccessToken = {
	jti: string
	api: boolean
    user: User
}

export type RefreshToken = {
	jti: string
	email: string
}