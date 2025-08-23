import { PointSchema } from '@parker/api-client-utils'
import { z } from 'zod'

export const PlaceSuggestionSchema = z.object({
  placeId: z.string().uuid(),
  label: z.string(),
  subLabel: z.string(),
})

export const SearchPlaceSuggestionsRequestSchema = z.object({
  search: z.string(),
  location: PointSchema.optional(),
  language: z.string().optional(),
  useStrictBounds: z.boolean().optional(),
  radius: z.number().optional(),
  limit: z.number().optional(),
})

export const SearchPlaceSuggestionsResponseSchema = z.object({
  data: z.array(PlaceSuggestionSchema),
})
