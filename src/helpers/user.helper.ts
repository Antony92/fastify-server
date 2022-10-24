import { User } from '../models/user.model'

export const hasRole = (user: User, roles: string[]) => {
	if (!user) return false
	return user.roles.some((role) => roles?.includes(role))
}
