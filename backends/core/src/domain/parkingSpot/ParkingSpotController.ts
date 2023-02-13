import { Body, Controller, Delete, Get, Param, Patch, Post, Query } from '@nestjs/common'
import { CreateParkingSpotRequestDto, UpdateParkingSpotRequestDto, ParkingSpotDto } from '@parker/core-client'
import { BaseController } from '../../http/BaseController'
import { ParkingSpotRepository } from './ParkingSpotRepository'

@Controller('parkingSpots')
export class ParkingSpotController extends BaseController {
  constructor(private readonly parkingSpotRepository: ParkingSpotRepository) {
    super('ParkingSpot')
  }

  @Post()
  public async create(@Body() createParkingSpotDto: CreateParkingSpotRequestDto): Promise<ParkingSpotDto> {
    return this.parkingSpotRepository.create({ ...createParkingSpotDto })
  }

  @Get(':id')
  public async getById(@Param('id') id: string): Promise<ParkingSpotDto> {
    return this.getEntityOrNotFound(await this.parkingSpotRepository.getById(id))
  }

  @Get('closestToPoint')
  public async listClosestToPoint(
    @Query('longitude') longitude: number,
    @Query('latitude') latitude: number,
    @Query('limit') limit: number
  ): Promise<{ data: ParkingSpotDto[] }> {
    const parkingSpots = await this.parkingSpotRepository.listParkingSpotsClosestToLocation(
      { longitude, latitude },
      limit
    )
    // TODO: proper pagination
    return { data: parkingSpots }
  }

  @Patch(':id')
  public async update(
    @Param('id') id: string,
    @Body() updateParkingSpotDto: UpdateParkingSpotRequestDto
  ): Promise<ParkingSpotDto> {
    return await this.parkingSpotRepository.update(id, { ...updateParkingSpotDto })
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.parkingSpotRepository.delete(id)
  }
}
