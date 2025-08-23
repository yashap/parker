import { PointSchema } from '@parker/api-client-utils'
import { z } from 'zod'

export const AddressComponentsSchema = z.object({
  number: z.string().optional(),
  street: z.string().optional(),
  sublocality: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  postal: z.string().optional(),
})

export const PlaceDetailsSchema = z.object({
  id: z.string().uuid(),
  name: z.string().optional(),
  location: PointSchema.optional(),
  address: z.string().optional(),
  addressComponents: z.array(AddressComponentsSchema).optional(),
})
