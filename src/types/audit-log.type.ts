export enum AuditLogAction {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE'
}

export enum AuditLogTarget {
    USER = 'USER',
    USER_API_KEY = 'USER:API_KEY',
    SERVER_EVENT = 'SERVER_EVENT',
}

export type AuditLogSearchQuery = {
    skip?: number,
    limit?: number,
    name?: string,
    username?: string,
    action?: string,
    target?: string,
    message?: string,
    startDate?: string,
    endDate?: string
}