import { User } from '../types/user.type.js'

export const hasRole = (user: User, roles?: string[]) => {
	return user?.roles?.some((role) => roles?.includes(role))
}
