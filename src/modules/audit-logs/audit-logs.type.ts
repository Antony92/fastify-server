import { type Static } from 'typebox';
import { auditLogsSearchQueryShema } from './audit-logs.schema.js';

export const AuditLogsAction = {
  CREATE: 'create',
  UPDATE: 'update',
  DELETE: 'delete',
} as const;

export type AuditLogsActionType = (typeof AuditLogsAction)[keyof typeof AuditLogsAction];

export const AuditLogsTarget = {
  USER: 'user',
  SERVER_EVENT: 'server_event',
} as const;

export type AuditLogsTargetType = (typeof AuditLogsTarget)[keyof typeof AuditLogsTarget];

export type AuditActor = {
  username: string;
  name: string;
  impersonated?: string;
};

export type AuditLogsSearchQuery = Static<typeof auditLogsSearchQueryShema>;
