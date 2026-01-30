import { FastifySchema } from 'fastify'
import { JSONSchema } from 'json-schema-to-ts'

export type ServerSchema = FastifySchema & { body?: JSONSchema; querystring?: JSONSchema; params?: JSONSchema }
