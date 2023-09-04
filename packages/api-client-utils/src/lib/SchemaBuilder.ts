import { z, ZodTypeAny } from 'zod'
import { PaginationSchema } from './Pagination'

export class SchemaBuilder {
  public static buildListResponse<T extends ZodTypeAny>(itemSchema: T) {
    return z.object({
      data: z.array(itemSchema),
      pagination: PaginationSchema.optional(),
    })
  }
}
