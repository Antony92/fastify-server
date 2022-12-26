import { AuditAction, AuditTarget } from '../types/audit.type.js'
import { User } from '../types/user.type.js'

export const audit = async (actor: User, action: AuditAction, target: AuditTarget, data: unknown, message?: string) => {
    //TODO save into db
}
