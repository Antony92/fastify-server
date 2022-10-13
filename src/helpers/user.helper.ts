import { User } from '../models/user.model'

export const hasRole = (user: User, roles: string[]) => {
	return user?.roles?.some((role) => roles?.includes(role)) ?? false
}
