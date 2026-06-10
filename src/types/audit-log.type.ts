import type { PaginationQuery } from './request.type.js';

export const AuditLogAction = {
	CREATE: 'create',
	UPDATE: 'update',
	DELETE: 'delete',
} as const;

export type AuditLogActionType = (typeof AuditLogAction)[keyof typeof AuditLogAction];

export const AuditLogTarget = {
	USER: 'user',
	SERVER_EVENT: 'server_event',
} as const;

export type AuditLogTargetType = (typeof AuditLogTarget)[keyof typeof AuditLogTarget];

export type AuditActor = {
	username: string;
	name: string;
	impersonated?: string;
};

export type AuditLogSearchQuery = PaginationQuery & {
	name?: string;
	username?: string;
	impersonated?: string;
	action?: string;
	target?: string;
	message?: string;
	startDate?: string;
	endDate?: string;
};
