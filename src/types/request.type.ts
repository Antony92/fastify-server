import { type Static, Type } from 'typebox';

export const paginationQuerySchema = Type.Object({
  skip: Type.Optional(Type.Number({ minimum: 0 })),
  limit: Type.Optional(Type.Number({ default: 10, maximum: 100 })),
  search: Type.Optional(Type.String({ maxLength: 100 })),
  order: Type.Optional(Type.String({ enum: ['desc', 'asc'] })),
  sort: Type.Optional(Type.String({ maxLength: 100 })),
});

export const idParamSchema = Type.Object({
  id: Type.String({ maxLength: 100 }),
});

export type PaginationQuery = Static<typeof paginationQuerySchema>;

export type IdParam = Static<typeof idParamSchema>;

export type SearchParams = {
  [key: string]: string | number | boolean | undefined | null;
};
