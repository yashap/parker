import { ParkingSpotDto } from '@parker/core-client'
import { Record } from 'immutable'

export type ParkingSpotProps = ParkingSpotDto

export class ParkingSpot extends Record<ParkingSpotProps>({
  id: '',
  ownerUserId: '',
  location: { latitude: -1, longitude: -1 },
}) {
  constructor(props: ParkingSpotProps) {
    super(props)
  }
}
