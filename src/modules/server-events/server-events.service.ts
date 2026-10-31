import { count, eq, desc, and, SQL } from 'drizzle-orm';
import db from '../../db/index.js';
import { serverEventsTable } from '../../db/schema.js';
import type {
  CreateServerEvent,
  ServerEventScope,
  UpdateServerEvent,
} from './server-events.type.js';

export const getServerEvents = async (scope?: ServerEventScope, skip = 0, limit = 10) => {
  const conditions: (SQL | undefined)[] = [];
  if (scope) conditions.push(eq(serverEventsTable.scope, scope));
  const where = and(...conditions);
  const [events, [results]] = await Promise.all([
    db
      .select()
      .from(serverEventsTable)
      .where(where)
      .limit(limit)
      .offset(skip)
      .orderBy(desc(serverEventsTable.created)),
    db.select({ total: count() }).from(serverEventsTable),
  ]);
  return { events, total: results.total };
};

export const createServerEvent = async (event: CreateServerEvent) => {
  const [createdEvent] = await db.insert(serverEventsTable).values(event).returning();
  return createdEvent;
};

export const updateServerEvent = async (event: UpdateServerEvent) => {
  const [updatedEvent] = await db
    .update(serverEventsTable)
    .set(event)
    .where(eq(serverEventsTable.id, event.id))
    .returning();
  return updatedEvent;
};

export const deleteServerEvent = async (id: string) => {
  const [deletedEvent] = await db
    .delete(serverEventsTable)
    .where(eq(serverEventsTable.id, id))
    .returning();
  return deletedEvent;
};
