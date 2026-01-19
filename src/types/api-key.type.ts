import { Prisma } from '../db/prisma/client.js'

export type ApiKeyCreateInput = { userId: string } & Pick<Prisma.ApiKeyCreateInput, 'jwt' | 'jti'>
