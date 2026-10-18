import { Static } from 'typebox';
import { paginationQuerySchema } from '../../types/request.type.js';
import Type from 'typebox';

export const auditLogsSearchQueryShema = Type.Intersect([
  paginationQuerySchema,
  Type.Object({
    name: Type.Optional(Type.String()),
    username: Type.Optional(Type.String()),
    impersonated: Type.Optional(Type.String()),
    action: Type.Optional(Type.String()),
    target: Type.Optional(Type.String()),
    message: Type.Optional(Type.String()),
    startDate: Type.Optional(Type.String()),
    endDate: Type.Optional(Type.String()),
  }),
]);

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
