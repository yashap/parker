import { Record } from 'immutable'

export interface ParkingSpotProps {
  id: string
  landlordId: string
}

export class ParkingSpot extends Record<ParkingSpotProps>({ id: '', landlordId: '' }) {
  constructor(props: ParkingSpotProps) {
    super(props)
  }
}
