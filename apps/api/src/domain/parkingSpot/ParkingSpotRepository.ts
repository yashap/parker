import { Injectable } from '@nestjs/common'
import { v4 as uuid } from 'uuid'
import { ParkingSpot } from './ParkingSpot'

type CreateParkingSpotInput = Omit<ParkingSpot, 'id'>

@Injectable()
export class ParkingSpotRepository {
  private store: Map<string, ParkingSpot> = new Map()

  public async create(payload: CreateParkingSpotInput): Promise<ParkingSpot> {
    const parkingSpot = new ParkingSpot(uuid(), payload.name)
    this.store.set(parkingSpot.id, parkingSpot)
    return parkingSpot
  }

  public async findAll(): Promise<ParkingSpot[]> {
    return Array.from(this.store.values())
  }

  public async findById(id: string): Promise<ParkingSpot | undefined> {
    return this.store.get(id)
  }

  public async replace(newParkingSpot: ParkingSpot): Promise<ParkingSpot> {
    this.store.set(newParkingSpot.id, newParkingSpot)
    return newParkingSpot
  }

  public async delete(id: string): Promise<void> {
    this.store.delete(id)
  }
}
