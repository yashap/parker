import { initContract } from '@ts-rest/core'
import { parkingSpotsContract } from './parkingSpot'
import { usersContract } from './users'

const c = initContract()

export const contract = c.router({
  users: usersContract,
  parkingSpots: parkingSpotsContract,
})
