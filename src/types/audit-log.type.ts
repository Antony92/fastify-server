export enum AuditLogAction {
	CREATE = 'CREATE',
	UPDATE = 'UPDATE',
	DELETE = 'DELETE',
}

export enum AuditLogTarget {
	USER = 'USER',
	SERVER_EVENT = 'SERVER_EVENT',
}

export type AuditActor = {
	username: string
	name: string
	impersonated?: string
}

export type AuditLogSearchQuery = {
	skip?: number
	limit?: number
	search?: string
	name?: string
	username?: string
	impersonated?: string
	action?: string
	target?: string
	message?: string
	startDate?: string
	endDate?: string
	sort?: string
	order?: string
}
