import type { FastifySchema } from 'fastify';
import type { JSONSchema } from 'json-schema-to-ts';

export type ServerSchema = FastifySchema & { body?: JSONSchema; querystring?: JSONSchema; params?: JSONSchema };
