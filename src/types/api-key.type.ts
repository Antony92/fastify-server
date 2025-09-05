import { Prisma } from '@prisma/client'

export type ApiKeyCreateInput = { userId: string } & Pick<Prisma.ApiKeyCreateInput, 'jwt' | 'jti'>
