import { Record } from 'immutable'

export interface ParkingSpotProps {
  id: string
  name: string
}

export class ParkingSpot extends Record<ParkingSpotProps>({ id: '', name: '' }) {
  constructor(props: ParkingSpotProps) {
    super(props)
  }
}
