import { PaginationQuery } from './request.type.js'

export const AuditLogAction = {
	CREATE: 'CREATE',
	UPDATE: 'UPDATE',
	DELETE: 'DELETE',
} as const

export type AuditLogActionType = (typeof AuditLogAction)[keyof typeof AuditLogAction]

export const AuditLogTarget = {
	USER: 'USER',
	SERVER_EVENT: 'SERVER_EVENT',
} as const

export type AuditLogTargetType = (typeof AuditLogTarget)[keyof typeof AuditLogTarget]

export type AuditActor = {
	username: string
	name: string
	impersonated?: string
}

export type AuditLogSearchQuery = PaginationQuery & {
	name?: string
	username?: string
	impersonated?: string
	action?: string
	target?: string
	message?: string
	startDate?: string
	endDate?: string
}
