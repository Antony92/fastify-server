import type { FastifyRequest } from 'fastify';
import { auditLogs } from '../audit-logs/audit-logs.service.js';
import {
  createUser,
  deleteUser,
  getRoles,
  getUserById,
  getUserProfile,
  getUsers,
  updateUser,
} from './user.service.js';
import { AuditLogsAction, AuditLogsTarget } from '../audit-logs/audit-logs.type.js';
import type { IdParam } from '../../types/request.type.js';
import type { CreateUserBody, UpdateUserBody, UserSearchQuery } from './user.type.js';

export const getRolesHandler = async () => {
  const roles = getRoles();
  return { data: roles };
};

export const getUserHandler = async (request: FastifyRequest<{ Params: IdParam }>) => {
  const { id } = request.params;
  const user = await getUserById(id);
  return { data: user };
};

export const getUsersHandler = async (
  request: FastifyRequest<{ Querystring: UserSearchQuery }>,
) => {
  const { users, total } = await getUsers(request.query);
  return { data: users, total };
};

export const createUserHandler = async (request: FastifyRequest<{ Body: CreateUserBody }>) => {
  const body = request.body;
  const user = await createUser({ ...body, internal: true });
  await auditLogs(request.user, AuditLogsAction.CREATE, AuditLogsTarget.USER, user, 'create user');
  return { message: 'User created', data: user };
};

export const updateUserHandler = async (
  request: FastifyRequest<{ Params: IdParam; Body: UpdateUserBody }>,
) => {
  const { id } = request.params;
  const body = request.body;
  const user = await updateUser({ id, ...body });
  await auditLogs(request.user, AuditLogsAction.UPDATE, AuditLogsTarget.USER, user, 'update user');
  return { message: 'User updated', data: user };
};

export const deleteUserHandler = async (request: FastifyRequest<{ Params: IdParam }>) => {
  const { id } = request.params;
  const user = await deleteUser(id);
  await auditLogs(request.user, AuditLogsAction.DELETE, AuditLogsTarget.USER, user, 'delete user');
  return { message: 'User deleted', data: user };
};

export const getUserProfileHandler = async (request: FastifyRequest) => {
  const profile = await getUserProfile(request.user.id);
  return { data: profile };
};
