import { User } from '../models/user.model'

export const hasRole = (user: User, roles: string[]) => {
	return user?.roles?.some((role) => roles?.includes(role)) ?? false
}

export const parseJWT = (token: string) => {
	const base64Payload = token.split('.')[1]
	const payload = Buffer.from(base64Payload, 'base64')
	return JSON.parse(payload.toString())
}
