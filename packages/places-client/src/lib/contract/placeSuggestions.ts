import { ContractBuilder } from '@parker/api-client-utils'
import { initContract } from '@ts-rest/core'
import { SearchPlaceSuggestionsRequestSchema, SearchPlaceSuggestionsResponseSchema } from '../model/PlaceSuggestions'

const c = initContract()

export const placeSuggestionsContract = c.router({
  search: {
    method: 'GET',
    path: '/placeSuggestions',
    query: SearchPlaceSuggestionsRequestSchema,
    responses: ContractBuilder.buildGetResponses(SearchPlaceSuggestionsResponseSchema),
    summary: 'Search for place suggestions',
  },
})
