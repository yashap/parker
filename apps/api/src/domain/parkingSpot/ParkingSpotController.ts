import { Controller, Get, Param, Post } from '@nestjs/common'

interface ParkingSpot {
  id: string
  name: string
}

@Controller('parkingSpot')
export class ParkingSpotController {
  @Post()
  public async create(): Promise<ParkingSpot> {
    return { id: '1', name: 'hello' }
  }

  @Get()
  public async findAll(): Promise<ParkingSpot[]> {
    return [{ id: '1', name: 'hello' }]
  }

  @Get(':id')
  public async findOne(@Param('id') id: string): Promise<ParkingSpot[]> {
    return [{ id, name: 'hello' }]
  }
}
