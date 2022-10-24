import { UserToken } from '../models/user.model'

export const hasRole = (user: UserToken, roles: string[]) => {
	return user?.roles?.some((role) => roles?.includes(role))
}
