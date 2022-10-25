import { User } from "./user.model"

export interface UserToken extends User {
	jti: string
	api?: boolean
}

export interface RefreshToken {
	jti: string
	email: string
}
