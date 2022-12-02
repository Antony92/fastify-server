import { Roles } from '../models/user.model.js'

export type User = {
	name: string
	email: string
	roles: Roles[]
}
