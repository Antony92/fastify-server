import Type from 'typebox';

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
