import { count, eq } from 'drizzle-orm';
import db from '../db/index.js';
import { serverEventsTable } from '../db/schema.js';
import type { CreateServerEvent, ServerEventClient, ServerEventType, SSEType, UpdateServerEvent } from '../types/server-event.type.js';

const clients: ServerEventClient[] = [];
const retry = 10000;

export const addServerEventClient = (client: ServerEventClient) => {
	clients.push(client);
};

export const removeServerEventClient = (clientId: string) => {
	clients.splice(
		clients.findIndex((client) => client.id === clientId),
		1,
	);
};

export const sendServerEventToAllClients = (sseType: SSEType, event: { type: ServerEventType; message: string }) => {
	clients.forEach((client) => {
		client.reply.sse.send({
			event: sseType,
			data: event,
			retry,
		});
	});
};

export const sendServerEventToClient = (clientId: string, sseType: SSEType, event: { type: ServerEventType; message: string }) => {
	clients
		.filter((client) => client.id === clientId)
		.forEach((client) => {
			client.reply.sse.send({
				event: sseType,
				data: event,
				retry,
			});
		});
};

export const getServerEvents = async (skip = 0, limit = 10) => {
	const [events, total] = await Promise.all([
		db.select().from(serverEventsTable).limit(limit).offset(skip),
		db.select({ value: count() }).from(serverEventsTable),
	]);
	return { events, total };
};

export const getLastServerEvent = async () => {
	const event = await db.query.serverEventsTable.findFirst({
		orderBy: { created: 'desc' },
	});
	return event;
};

export const createServerEvent = async (event: CreateServerEvent) => {
	const [createdEvent] = await db.insert(serverEventsTable).values(event).returning();
	return createdEvent;
};

export const updateServerEvent = async (event: UpdateServerEvent) => {
	const [updatedEvent] = await db.update(serverEventsTable).set(event).where(eq(serverEventsTable.id, event.id)).returning();
	return updatedEvent;
};

export const deleteServerEvent = async (id: string) => {
	const [deletedEvent] = await db.delete(serverEventsTable).where(eq(serverEventsTable.id, id)).returning();
	return deletedEvent;
};
