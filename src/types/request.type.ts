import { type Static } from 'typebox';
import { paginationQuerySchema, idParamSchema } from '../schemas/request.schema.js';

export type PaginationQuery = Static<typeof paginationQuerySchema>;

export type IdParam = Static<typeof idParamSchema>;

export type SearchParams = {
  [key: string]: string | number | boolean | undefined | null;
};
