import { Roles } from '../models/user.model'

export type User = {
	name: string
	email: string
	roles: Roles[]
}
