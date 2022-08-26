import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  ParseUUIDPipe,
  Patch,
  Post,
} from '@nestjs/common'
import { ParkingSpot } from './ParkingSpot'
import { CreateParkingSpotDto, ParkingSpotDto, UpdateParkingSpotDto } from './ParkingSpotDto'
import { ParkingSpotRepository } from './ParkingSpotRepository'

@Controller('parkingSpots')
export class ParkingSpotController {
  constructor(private readonly parkingSpotRepository: ParkingSpotRepository) {}

  @Post()
  public async create(@Body() createParkingSpotDto: CreateParkingSpotDto): Promise<ParkingSpotDto> {
    const parkingSpot = await this.parkingSpotRepository.create(createParkingSpotDto)
    return ParkingSpotDto.buildFromDomain(parkingSpot)
  }

  @Get()
  public async findAll(): Promise<ParkingSpotDto[]> {
    const parkingSpots = await this.parkingSpotRepository.findAll()
    return parkingSpots.map(ParkingSpotDto.buildFromDomain)
  }

  @Get(':id')
  public async findOne(@Param('id', ParseUUIDPipe) id: string): Promise<ParkingSpotDto> {
    const parkingSpot = await this.parkingSpotRepository.findById(id)
    if (!parkingSpot) {
      // TODO: centralize errors
      throw new HttpException(
        {
          error: 'ParkingSpot not found',
        },
        HttpStatus.NOT_FOUND
      )
    }
    return ParkingSpotDto.buildFromDomain(parkingSpot)
  }

  @Patch(':id')
  public async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateParkingSpotDto: UpdateParkingSpotDto
  ): Promise<ParkingSpotDto> {
    // TODO: in a transaction
    const currentParkingSpot = await this.findById(id)
    const parkingSpot = {
      ...currentParkingSpot,
      ...updateParkingSpotDto,
    }
    const updatedParkingSpot = await this.parkingSpotRepository.replace(parkingSpot)
    return ParkingSpotDto.buildFromDomain(updatedParkingSpot)
  }

  @Delete(':id')
  public async delete(@Param('id') id: string): Promise<void> {
    await this.parkingSpotRepository.delete(id)
  }

  private async findById(id: string): Promise<ParkingSpot> {
    const parkingSpot = await this.parkingSpotRepository.findById(id)
    if (!parkingSpot) {
      // TODO: centralize errors
      throw new HttpException(
        {
          error: 'ParkingSpot not found',
        },
        HttpStatus.NOT_FOUND
      )
    }
    return parkingSpot
  }
}
