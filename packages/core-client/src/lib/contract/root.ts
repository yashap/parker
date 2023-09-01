import { initContract } from '@ts-rest/core'
import { parkingSpotContract } from './parkingSpot'
import { userContract } from './user'

const c = initContract()

export const contract = c.router({
  users: userContract,
  parkingSpots: parkingSpotContract,
})
