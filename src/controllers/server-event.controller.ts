import type { FastifyReply, FastifyRequest } from 'fastify';
import sanitizeHtml from 'sanitize-html';
import { auditLog } from '../services/audit-log.service.js';
import {
	addServerEventClient,
	createServerEvent,
	deleteServerEvent,
	getLastServerEvent,
	getServerEvents,
	removeServerEventClient,
	sendServerEventToAllClients,
	sendServerEventToClient,
	updateServerEvent,
} from '../services/server-event.service.js';
import { AuditLogAction, AuditLogTarget } from '../types/audit-log.type.js';
import type { IdParam, PaginationQuery } from '../types/request.type.js';
import { type CreateServerEventBody, SSE, type UpdateServerEventBody } from '../types/server-event.type.js';

export const subscribeServerEventsHandler = async (request: FastifyRequest, reply: FastifyReply) => {
	const id = request.ip;
	addServerEventClient({ id, reply });

	const event = await getLastServerEvent();
	if (event) {
		sendServerEventToClient(id, SSE.GLOBAL, event);
	} else {
		await reply.sse.send({ data: 'connected' });
	}

	reply.sse.onClose(() => {
		removeServerEventClient(id);
	});
};

export const getServerEventsHandler = async (request: FastifyRequest<{ Querystring: PaginationQuery }>) => {
	const { skip, limit } = request.query;
	const { events, total } = await getServerEvents(skip, limit);
	return { data: events, total };
};

export const createServerEventHandler = async (request: FastifyRequest<{ Body: CreateServerEventBody }>) => {
	const body = request.body;
	body.message = sanitizeHtml(body.message, {
		allowedTags: ['a'],
		allowedAttributes: {
			a: ['href', 'target'],
		},
	});
	const event = await createServerEvent(body);
	sendServerEventToAllClients(SSE.GLOBAL, event);
	await auditLog(request.user, AuditLogAction.CREATE, AuditLogTarget.SERVER_EVENT, { body, event }, 'server event created');
	return { data: event, message: 'Server event created' };
};

export const updateServerEventHandler = async (request: FastifyRequest<{ Params: IdParam; Body: UpdateServerEventBody }>) => {
	const { id } = request.params;
	const body = request.body;
	body.message = sanitizeHtml(body.message as string, {
		allowedTags: ['a'],
		allowedAttributes: {
			a: ['href', 'target'],
		},
	});
	const event = await updateServerEvent({ id, ...body });
	sendServerEventToAllClients(SSE.GLOBAL, { type: event.type, message: event.message });
	await auditLog(request.user, AuditLogAction.UPDATE, AuditLogTarget.SERVER_EVENT, { id, body, event }, 'server event updated');
	return { data: event, message: 'Server event updated' };
};

export const deleteServerEventHandler = async (request: FastifyRequest<{ Params: IdParam }>) => {
	const { id } = request.params;
	const event = await deleteServerEvent(id);
	const lastEvent = await getLastServerEvent();
	if (lastEvent) {
		sendServerEventToAllClients(SSE.GLOBAL, { type: lastEvent.type, message: lastEvent.message });
	}
	await auditLog(request.user, AuditLogAction.DELETE, AuditLogTarget.SERVER_EVENT, event, 'server event deleted');
	return { data: event, message: 'Server event deleted' };
};
