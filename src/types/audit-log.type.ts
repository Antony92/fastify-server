export enum AuditLogAction {
    CREATE = 'CREATE',
    UPDATE = 'UPDATE',
    DELETE = 'DELETE'
}

export enum AuditLogTarget {
    USER = 'USER',
    SERVER_EVENT = 'SERVER_EVENT',
}

export type AuditLogSearchQuery = {
    skip?: number,
    limit?: number,
    name?: string,
    email?: string,
    action?: string,
    target?: string,
    message?: string,
    startDate?: string,
    endDate?: string
}