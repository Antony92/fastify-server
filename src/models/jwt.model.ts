import { User } from "./user.model"

export interface AccessToken extends User {
	jti: string
	api?: boolean
}

export interface RefreshToken {
	jti: string
	email: string
}
