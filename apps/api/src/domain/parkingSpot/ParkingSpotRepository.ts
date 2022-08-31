import { Injectable, NotFoundException } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { ParkingSpot, ParkingSpotProps } from './ParkingSpot'

type CreateParkingSpotInput = Omit<ParkingSpotProps, 'id'>
type UpdateParkingSpotInput = Partial<CreateParkingSpotInput>

@Injectable()
export class ParkingSpotRepository {
  private store: Map<string, ParkingSpot> = new Map()

  public async create(payload: CreateParkingSpotInput): Promise<ParkingSpot> {
    const parkingSpot = new ParkingSpot({ ...payload, id: uuid() })
    this.store.set(parkingSpot.id, parkingSpot)
    return parkingSpot
  }

  public async findAll(): Promise<ParkingSpot[]> {
    return Array.from(this.store.values())
  }

  public async findById(id: string): Promise<ParkingSpot | undefined> {
    return this.store.get(id)
  }

  public async update(id: string, updates: UpdateParkingSpotInput): Promise<ParkingSpot> {
    const currentParkingSpot = await this.findById(id)
    if (!currentParkingSpot) {
      throw new NotFoundException({ message: 'ParkingSpot not found, could not update' })
    }
    const parkingSpotWithUpdates = new ParkingSpot({
      ...currentParkingSpot,
      ...updates,
    })
    this.store.set(id, parkingSpotWithUpdates)
    return parkingSpotWithUpdates
  }

  public async delete(id: string): Promise<void> {
    this.store.delete(id)
  }
}
