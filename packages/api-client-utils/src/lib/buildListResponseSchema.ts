import { ZodTypeAny, z } from 'zod'
import { PaginationSchema } from './Pagination'

export const buildListResponseSchema = <T extends ZodTypeAny>(itemSchema: T) =>
  z.object({
    data: z.array(itemSchema),
    pagination: PaginationSchema.optional(),
  })
