import { ServerSchema } from 'fastify'
import { JSONSchema } from 'json-schema-to-ts';

export type ServerSchema = ServerSchema & { body?: JSONSchema; querystring?: JSONSchema, params?: JSONSchema }
