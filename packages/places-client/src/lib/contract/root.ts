import { initContract } from '@ts-rest/core'
import { placeDetailsContract } from './placeDetails'
import { placeSuggestionsContract } from './placeSuggestions'

const c = initContract()

export const contract = c.router(
  {
    placeDetails: placeDetailsContract,
    placeSuggestions: placeSuggestionsContract,
  },
  {
    strictStatusCodes: true,
    pathPrefix: '/places',
  }
)
