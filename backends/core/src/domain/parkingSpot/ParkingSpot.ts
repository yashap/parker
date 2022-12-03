import { Point } from '@parker/geography'
import { Record } from 'immutable'

export interface ParkingSpotProps {
  id: string
  ownerUserId: string
  location: Point
}

export class ParkingSpot extends Record<ParkingSpotProps>({
  id: '',
  ownerUserId: '',
  location: { latitude: -1, longitude: -1 },
}) {
  constructor(props: ParkingSpotProps) {
    super(props)
  }
}
