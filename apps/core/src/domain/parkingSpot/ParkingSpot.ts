import { Record } from 'immutable'

export interface ParkingSpotProps {
  id: string
  ownerUserId: string
}

export class ParkingSpot extends Record<ParkingSpotProps>({ id: '', ownerUserId: '' }) {
  constructor(props: ParkingSpotProps) {
    super(props)
  }
}
